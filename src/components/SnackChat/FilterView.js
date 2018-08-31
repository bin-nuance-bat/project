import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Container, Sprite} from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

const PIVOT = new PIXI.Point(50, 50);
const POSE_BUFFER_LEN = 10;

class FilterView extends Component {
  state = {
    mask: null,
    ...getBlankPose()
  };

  filter = new PIXI.Texture.fromImage(this.props.image);
  graphics = new PIXI.Graphics();
  poseBuffer = [];
  poseBufferIndex = 0;

  componentDidMount() {
    this.updatePose();
    for (let i = 0; i < POSE_BUFFER_LEN; i++) {
      this.poseBuffer.push({
        filterSize: 0,
        filterX: 0,
        filterY: 0,
        faceSpan: 0,
        faceX: 0,
        faceY: 0,
        rotation: 0
      });
    }
  }

  getAveragePose = pose => {
    const filterSize = pose.shoulders.span * 3;

    const filterX =
      pose.shoulders.leftX +
      Math.abs((pose.shoulders.leftX - pose.shoulders.rightX) / 2);
    const filterY =
      pose.shoulders.leftY +
      Math.abs((pose.shoulders.leftY - pose.shoulders.rightY) / 2);

    const faceX =
      pose.ears.leftX + Math.abs((pose.ears.leftX - pose.ears.rightX) / 2);
    const faceY =
      pose.ears.leftY + Math.abs((pose.ears.leftY - pose.ears.rightY) / 2);
    const faceSpan = pose.ears.span * 0.75;

    const rotation = pose.shoulders.angle;

    const newPose = {
      filterSize,
      filterX,
      filterY,
      faceX,
      faceY,
      faceSpan,
      rotation
    };
    this.poseBuffer[this.poseBufferIndex++] = newPose;

    const avgPose = getBlankPose();

    for (const key in Object.keys(newPose)) {
      for (let i = 0; i < POSE_BUFFER_LEN; i++) {
        avgPose[key] *= i;
        avgPose[key] += this.poseBuffer[i];
        avgPose[key] /= i + 1;
      }
    }

    return avgPose;
  };

  updatePose = () => {
    this.props.getPose().then(pose => {
      if (!pose) return requestAnimationFrame(this.updatePose);

      const {width, height} = this.props.app.screen;
      const {
        filterSize,
        filterX,
        filterY,
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

      console.log(pose.ears, pose.shoulders);

      requestAnimationFrame(this.updatePose);
    });
  };

  render() {
    return (
      <Container>
        {this.state.pose && (
          // <Graphics
          //   draw={g => {
          //     g.clear().lineStyle(3, 0xff0000, 1);
          //     g.moveTo(this.state.pose.ears.leftX, this.state.pose.ears.leftY);
          //     g.lineTo(
          //       this.state.pose.ears.rightX,
          //       this.state.pose.ears.rightY
          //     );
          //     g.moveTo(
          //       this.state.pose.shoulders.leftX,
          //       this.state.pose.shoulders.leftY
          //     );
          //     g.lineTo(
          //       this.state.pose.shoulders.rightX,
          //       this.state.pose.shoulders.rightY
          //     );
          //   }}
          // />
          <Sprite
            texture={this.filter}
            x={this.state.filterX}
            y={this.state.filterY}
            width={this.state.filterSize}
            height={this.state.filterSize}
            rotation={this.state.rotation}
            pivot={PIVOT}
            mask={this.state.mask}
          />
        )}
      </Container>
    );
  }
}

function getBlankPose() {
  return {
    filterSize: 0,
    filterX: 0,
    filterY: 0,
    rotation: 0,
    faceX: 0,
    faceY: 0,
    faceSpan: 0
  };
}

FilterView.propTypes = {
  app: PropTypes.object.isRequired,
  getPose: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired
};

export default FilterView;
