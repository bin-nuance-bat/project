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
  bodyPart.width = Math.abs(bodyPart.rightX - bodyPart.leftX);
  bodyPart.height = bodyPart.rightY - bodyPart.leftY;
  bodyPart.span = Math.sqrt(bodyPart.width ** 2 + bodyPart.height ** 2);
  bodyPart.angle = Math.atan(bodyPart.height / bodyPart.width);
  return bodyPart;
}

function normalise(n) {
  return (n *= FEED_SIZE / CAPTURE_SIZE);
}

class SnackChat extends Component {
  state = {
    loading: true
  };

  webcamCap = React.createRef();
  filter = React.createRef();

  componentDidMount() {
    posenet.load(0.5).then(net => {
      this.net = net;
      this.setState({loading: false, countdown: 5});
      this.ticker = setInterval(() => {
        this.setState(prevState => {
          if (prevState.countdown === 0) {
            this.captureSnackChat();
            clearInterval(this.ticker);
            return null;
          }
          return {countdown: prevState.countdown - 1};
        });
      }, 1000);
    });
  }

  componentWillUnmount() {
    clearInterval(this.ticker);
  }

  getPose = async () => {
    if (!this.net) return null;

    let frame;

    try {
      frame = await this.webcamCap.current.requestScreenshot();
    } catch (e) {
      return null;
    }

    const pose = await this.net.estimateSinglePose(frame, 0.3, true, 16);

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

  onFail = () => {
    this.props.setSendWithPhoto(false);
    this.props.history.replace('/slackname');
  };

  onBack = () => {
    this.backClicked = true;
    clearInterval(this.timer);
    this.props.history.replace(
      this.props.actualItem === this.props.predictionID
        ? '/confirmitem'
        : '/editsnack'
    );
  };

  captureSnackChat = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = CAPTURE_SIZE;
    canvas.height = CAPTURE_SIZE;
    const ctx = canvas.getContext('2d');
    const img = await this.webcamCap.current.requestScreenshot();
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, -CAPTURE_SIZE, CAPTURE_SIZE);
    ctx.scale(-1, 1);
    const filter = this.filter.current.toImage();
    filter.onload = () => {
      ctx.drawImage(filter, 0, 0, CAPTURE_SIZE, CAPTURE_SIZE);
      this.props.setSnackChat(canvas.toDataURL());
      this.props.history.replace('/slackname');
    };
  };

  render() {
    return (
      <div className="page">
        <header className="header">
          <BackButton handleClick={this.onBack} />
          <div className="header-text">
            Smile! Taking your SnackChat in...
            <br />
            {this.state.countdown}
          </div>
        </header>
        <div>
          <WebcamCapture
            imgSize={CAPTURE_SIZE}
            onFail={this.onFail}
            ref={this.webcamCap}
          />
          {!this.state.loading &&
            this.webcamCap.current.webcam.current && (
              <Stage
                width={FEED_SIZE}
                height={FEED_SIZE}
                options={{transparent: true}}
                className="snackchat-stage">
                <Provider>
                  {app => (
                    <FilterView
                      image={this.props.storeList[this.props.actualItem].image}
                      app={app}
                      getPose={this.getPose}
                      video={this.webcamCap.current.webcam.current.video}
                      ref={this.filter}
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
  actualItem: PropTypes.string.isRequired,
  predictionID: PropTypes.string
};

export default SnackChat;
