import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Stage, Provider} from '@inlet/react-pixi';

import FilterView from './FilterView';
import WebcamCapture from '../WebcamCapture/WebcamCapture';
import BackButton from '../BackButton/BackButton';

import * as posenet from '@tensorflow-models/posenet';
import './SnackChat.css';

const FEED_SIZE = 768;
const CAPTURE_SIZE = 200;

function calcAngles(bodyPart) {
  bodyPart.width = bodyPart.leftX - bodyPart.rightX;
  bodyPart.height = bodyPart.rightY - bodyPart.leftY;
  bodyPart.span = Math.sqrt(bodyPart.width ** 2 + bodyPart.height ** 2);
  bodyPart.angle = Math.atan(bodyPart.width / bodyPart.height);
  bodyPart.angle += ((bodyPart.height > 0 ? -1 : 1) * Math.PI) / 2 + Math.PI;
  return bodyPart;
}

function normalise(n) {
  return (n *= FEED_SIZE / CAPTURE_SIZE);
}

class SnackChat extends Component {
  state = {
    loading: true,
    rotation: 0
  };

  webcamCap = React.createRef();

  componentDidMount() {
    posenet.load(0.5).then(net => (this.net = net));
    this.props.loadStoreList().then(() => {
      this.setState({loading: false});
    });
    window.scaleFactor = 0.3;
  }

  getPose = async () => {
    if (!this.net) return null;

    let frame;

    try {
      frame = await this.webcamCap.current.requestScreenshot();
    } catch (e) {
      //console.error(e);
      return null;
    }

    const pose = await this.net.estimateSinglePose(
      frame,
      window.scaleFactor,
      true,
      16
    );

    const body = {
      ears: calcAngles({
        leftX: normalise(pose.keypoints[4].position.x),
        leftY: normalise(pose.keypoints[4].position.y),
        rightX: normalise(pose.keypoints[3].position.x),
        rightY: normalise(pose.keypoints[3].position.y)
      }),
      shoulders: calcAngles({
        leftX: normalise(pose.keypoints[6].position.x),
        leftY: normalise(pose.keypoints[6].position.y),
        rightX: normalise(pose.keypoints[5].position.x),
        rightY: normalise(pose.keypoints[5].position.y)
      })
    };

    return body;
  };

  render() {
    return (
      <div className="page">
        <header className="header">
          <BackButton handleClick={() => {}} />
          <div className="header-text">SnackChat</div>
        </header>
        <div>
          <WebcamCapture
            imgSize={CAPTURE_SIZE}
            onFail={() => {}}
            ref={this.webcamCap}
          />
          {!this.state.loading && (
            <Stage
              width={FEED_SIZE}
              height={FEED_SIZE}
              options={{transparent: true}}
              className="snackchat-stage">
              <Provider>
                {app => (
                  <FilterView
                    image={
                      this.props.storeList[
                        '606e12d4-6367-4fc3-aa7a-92ee17ccac2c'
                      ].image
                    }
                    app={app}
                    getPose={this.getPose}
                    video={this.webcamCap.current.webcam.current.video}
                  />
                )}
              </Provider>
            </Stage>
          )}
        </div>
      </div>
    );
  }
}

SnackChat.propTypes = {
  setSnackChat: PropTypes.func.isRequired,
  setSendWithPhoto: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  storeList: PropTypes.object.isRequired,
  // actualItem: PropTypes.string.isRequired,
  predictionID: PropTypes.string
};

export default SnackChat;
