import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Stage, Provider} from '@inlet/react-pixi';

import FilterView from './FilterView';
import WebcamCapture from '../WebcamCapture/WebcamCapture';
import BackButton from '../BackButton/BackButton';
import GetBBox from '../GetBBox/GetBBox';

import * as posenet from '@tensorflow-models/posenet';
import './SnackChat.css';

const FEED_SIZE = 768;
const CAPTURE_SIZE = 200;

function normalise(n) {
  return (n *= FEED_SIZE / CAPTURE_SIZE);
}

class SnackChat extends Component {
  state = {
    loading: true,
    horizontalItem: false
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

    const pose = await this.net.estimateSinglePose(frame, 0.75, true, 16);

    const body = {
      ears: this.calcAngles({
        leftX: normalise(pose.keypoints[4].position.x),
        leftY: normalise(pose.keypoints[4].position.y),
        rightX: normalise(pose.keypoints[3].position.x),
        rightY: normalise(pose.keypoints[3].position.y)
      }),
      shoulders: this.calcAngles({
        leftX: normalise(pose.keypoints[6].position.x),
        leftY: normalise(pose.keypoints[6].position.y),
        rightX: normalise(pose.keypoints[5].position.x),
        rightY: normalise(pose.keypoints[5].position.y)
      })
    };

    return body;
  };

  calcAngles = bodyPart => {
    bodyPart.width = Math.abs(bodyPart.rightX - bodyPart.leftX);
    bodyPart.height = bodyPart.rightY - bodyPart.leftY;
    bodyPart.span = Math.sqrt(bodyPart.width ** 2 + bodyPart.height ** 2);
    bodyPart.angle = Math.atan(bodyPart.height / bodyPart.width);
    bodyPart.angle += this.state.horizontalItem ? Math.PI / 2 : 0;
    return bodyPart;
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

  setHorizontalFlag = bboxes => {
    if (bboxes[0].height < bboxes[0].width) {
      this.setState({horizontalItem: true});
    }
  };

  captureSnackChat = async () => {
    const [img, filter] = await Promise.all([
      this.webcamCap.current.requestScreenshot(),
      this.filter.current.toImage()
    ]);

    const canvas = document.createElement('canvas');
    canvas.width = CAPTURE_SIZE;
    canvas.height = CAPTURE_SIZE;
    const ctx = canvas.getContext('2d');

    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, -CAPTURE_SIZE, CAPTURE_SIZE);
    ctx.scale(-1, 1);

    filter.onload = () => {
      ctx.drawImage(filter, 0, 0, CAPTURE_SIZE, CAPTURE_SIZE);
      this.props.setSnackChat(canvas.toDataURL());
      this.props.history.replace('/slackname');
    };

    if (filter.complete) filter.onload();
  };

  render() {
    return (
      <div className="page">
        <header className="header">
          <BackButton handleClick={this.onBack} />
          <div className="header-text">
            You're on SnackChat!
            <br />
            Get into position in {this.state.countdown}
            ...
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
                className="snackchat-stage"
                style={{
                  visibility: FilterView.LIVE_PREVIEW ? 'visible' : 'hidden'
                }}>
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
        <GetBBox
          svg={this.props.storeList[this.props.actualItem].image}
          callback={this.setHorizontalFlag}
        />
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
