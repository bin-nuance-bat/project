import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Container, Sprite} from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import _ from 'lodash';

// Centre point of SVGs - they're all 500x500 px
const PIVOT = new PIXI.Point(250, 250);

// Increase this if enabling live preview for a smoother animation
const POSE_BUFFER_LEN = 1;

const FACE_SIZE_MULTIPLIER = 1;
const SNACK_SIZE_MULTIPLIER = 1;

class FilterView extends Component {
  getBlankPose = () => ({
    filterSize: this.props.app.screen.width / 2,
    filterX: this.props.app.screen.width / 2,
    filterY: this.props.app.screen.height / 2,
    rotation: 0,
    faceX: this.props.app.screen.width / 2,
    faceY: this.props.app.screen.height / 2,
    faceSpan: 0
  });

  state = {
    mask: null,
    capture: false,
    ...this.getBlankPose()
  };

  static LIVE_PREVIEW = false;

  filter = new PIXI.Texture.fromImage(this.props.image);
  graphics = new PIXI.Graphics();
  poseBuffer = [];
  poseBufferIndex = 0;

  componentDidMount() {
    this._isMounted = true;
    for (let i = 0; i < POSE_BUFFER_LEN; i++) {
      this.poseBuffer.push(this.getBlankPose());
    }
    if (FilterView.LIVE_PREVIEW) this.updatePose();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getAveragePose = predictedPose => {
    // Centre of shoulders
    const filterX =
      predictedPose.shoulders.leftX +
      Math.abs(
        (predictedPose.shoulders.leftX - predictedPose.shoulders.rightX) / 2
      );
    const filterY =
      predictedPose.shoulders.leftY +
      Math.abs(
        (predictedPose.shoulders.leftY - predictedPose.shoulders.rightY) / 2
      );
    const filterSize =
      predictedPose.shoulders.span * 2.5 * SNACK_SIZE_MULTIPLIER;

    // Centre of face
    const faceX =
      predictedPose.ears.leftX +
      Math.abs((predictedPose.ears.leftX - predictedPose.ears.rightX) / 2);
    const faceY =
      predictedPose.ears.leftY +
      Math.abs((predictedPose.ears.leftY - predictedPose.ears.rightY) / 2);
    const faceSpan = predictedPose.ears.span * 0.5 * FACE_SIZE_MULTIPLIER;

    const rotation = predictedPose.shoulders.angle;

    const newPose = {
      filterX,
      filterY,
      filterSize,
      faceX,
      faceY,
      faceSpan,
      rotation
    };

    this.poseBuffer[this.poseBufferIndex++] = newPose;
    this.poseBufferIndex %= POSE_BUFFER_LEN;

    const avgPose = Object.keys(newPose).reduce((poseAverages, poseKey) => {
      const poseKeyAvg = _.meanBy(this.poseBuffer, pose => pose[poseKey]);
      return {
        ...poseAverages,
        [poseKey]: poseKeyAvg
      };
    }, {});

    return avgPose;
  };

  updatePose = () => {
    return this.props.getPose().then(pose => {
      if (!pose) return requestAnimationFrame(this.updatePose);
      if (!this._isMounted) return;

      const {width, height} = this.props.app.screen;
      const {
        filterX,
        filterY,
        filterSize,
        faceX,
        faceY,
        faceSpan,
        rotation
      } = this.getAveragePose(pose);

      const mask = new PIXI.Graphics()
        .beginFill(0, 0.5)
        .moveTo(0, 0)
        .lineTo(0, height)
        .lineTo(width, height)
        .lineTo(width, 0)
        .lineTo(0, 0)
        .lineTo(faceX, faceY - faceSpan)
        .bezierCurveTo(
          faceX + faceSpan / 2,
          faceY - faceSpan,
          faceX + faceSpan,
          faceY - faceSpan / 2,
          faceX + faceSpan,
          faceY
        )
        .bezierCurveTo(
          faceX + faceSpan,
          faceY + faceSpan / 2,
          faceX + faceSpan / 2,
          faceY + faceSpan,
          faceX,
          faceY + faceSpan
        )
        .bezierCurveTo(
          faceX - faceSpan / 2,
          faceY + faceSpan,
          faceX - faceSpan,
          faceY + faceSpan / 2,
          faceX - faceSpan,
          faceY
        )
        .bezierCurveTo(
          faceX - faceSpan,
          faceY - faceSpan / 2,
          faceX - faceSpan / 2,
          faceY - faceSpan,
          faceX,
          faceY - faceSpan
        )
        .lineTo(0, 0);

      if (this.state.mask) this.state.mask.destroy();

      this.setState({
        filterSize,
        filterX,
        filterY,
        mask,
        rotation
      });

      if (FilterView.LIVE_PREVIEW) requestAnimationFrame(this.updatePose);
    });
  };

  toImage = async () => {
    await this.updatePose();
    return this.props.app.renderer.extract.canvas(this.props.app.stage);
  };

  render() {
    const {filterSize, filterX, filterY, rotation, mask} = this.state;
    return (
      <Container>
        <Sprite
          texture={this.filter}
          x={filterX}
          y={filterY}
          width={filterSize}
          height={filterSize}
          rotation={rotation}
          pivot={PIVOT}
          mask={mask}
        />
      </Container>
    );
  }
}

FilterView.propTypes = {
  app: PropTypes.object.isRequired,
  getPose: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired
};

export default FilterView;
