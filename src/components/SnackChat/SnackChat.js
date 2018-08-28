import React, {Component} from 'react';
import WebcamCapture from '../WebcamCapture/WebcamCapture';
import HandsSlot from './../../utils/assets/hands/HandsSlot.svg';
import HandsRight from './../../utils/assets/hands/HandsRight.svg';
import HandsCenter from './../../utils/assets/hands/HandsCenter.svg';
import HandsLeft from './../../utils/assets/hands/HandsLeft.svg';
import HandsCamera from './../../utils/assets/hands/HandsCamera.svg';
import PropTypes from 'prop-types';
import * as posenet from '@tensorflow-models/posenet';
import './SnackChat.css';
import BackButton from '../BackButton/BackButton';

const FEED_SIZE = 768;
const CAPTURE_SIZE = 200;
const LOADING_ANIMATION_TIME = 3;
const COUNTDOWN_TIME = 3;
const PHOTO_ANIMATION_TIME = 1.5;
const POSITION_BUFFER_SIZE = 10;
const FALLING_SNACK_SIZE = 0.2;
const CANVAS_SCALE = 1.6;

function clipEllipse(ctx, centerX, centerY, width, height) {
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - height / 2);
  ctx.bezierCurveTo(
    centerX + width / 2,
    centerY - height / 2,
    centerX + width / 2,
    centerY + height / 2,
    centerX,
    centerY + height / 2
  );
  ctx.bezierCurveTo(
    centerX - width / 2,
    centerY + height / 2,
    centerX - width / 2,
    centerY - height / 2,
    centerX,
    centerY - height / 2
  );
  ctx.clip();
}

function normalise(n) {
  return (n *= FEED_SIZE / CAPTURE_SIZE);
}

function calcAngles(bodyPart) {
  bodyPart.width = bodyPart.leftX - bodyPart.rightX;
  bodyPart.height = bodyPart.rightY - bodyPart.leftY;
  bodyPart.span = Math.sqrt(bodyPart.width ** 2 + bodyPart.height ** 2);
  bodyPart.angle = Math.atan(bodyPart.width / bodyPart.height);
  bodyPart.angle += ((bodyPart.height > 0 ? -1 : 1) * Math.PI) / 2;
  return bodyPart;
}

class SnackChat extends Component {
  webcam = React.createRef();
  canvas = React.createRef();

  state = {
    gettingInPosition: true,
    counter: COUNTDOWN_TIME + LOADING_ANIMATION_TIME + PHOTO_ANIMATION_TIME,
    captured: false
  };

  componentDidMount() {
    posenet.load(0.5).then(net => (this.net = net));
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  countdown = async () => {
    this.timer = setInterval(
      () => this.setState(prevState => ({counter: prevState.counter - 1})),
      1500
    );
  };

  drawBackground = video => {
    if (this.backClicked) {
      return;
    }
    this.ctx.scale(-CANVAS_SCALE, CANVAS_SCALE);
    this.ctx.drawImage(
      video,
      Math.abs(video.videoWidth - this.canvas.current.width) / 2 -
        video.videoWidth,
      0
    );
    this.ctx.restore();
  };

  playGettingInPositionAnimation = () => {
    const numberOfFallingSnacks = 3;
    const itemPositions = [];
    for (let i = 1; i <= numberOfFallingSnacks; i++) {
      itemPositions.push({
        x: (this.canvas.current.width * i) / (numberOfFallingSnacks + 1),
        y:
          Math.random() *
            (1 + 2 * FALLING_SNACK_SIZE) *
            this.canvas.current.height -
          FALLING_SNACK_SIZE * this.canvas.current.height,
        rotation: Math.random() * 2 * Math.PI
      });
    }

    const drawFallingSnacks = () => {
      if (this.state.backClicked) return;

      if (this.state.counter <= COUNTDOWN_TIME + PHOTO_ANIMATION_TIME) {
        this.setState({gettingInPosition: false});
        return;
      }

      // Video background
      const video = this.webcam.current.webcam.current.video;
      this.ctx.save();
      this.drawBackground(video, 0);

      this.ctx.fillStyle = 'rgba(0.6, 0.6, 0.6, 0.6)';
      this.ctx.fillRect(
        0,
        0,
        this.canvas.current.width,
        this.canvas.current.height
      );
      // draw items
      this.ctx.save();
      itemPositions.forEach(item => {
        this.ctx.translate(item.x, item.y);
        this.ctx.rotate(item.rotation);
        this.ctx.drawImage(
          this.filter,
          -0.1 * this.canvas.current.width,
          -0.1 * this.canvas.current.width,
          FALLING_SNACK_SIZE * this.canvas.current.width,
          FALLING_SNACK_SIZE * this.canvas.current.height
        );
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      });
      this.ctx.restore();

      // update positions
      itemPositions.forEach(item => {
        item.y =
          ((FALLING_SNACK_SIZE * this.canvas.current.height + item.y + 3) %
            ((1 + 2 * FALLING_SNACK_SIZE) * this.canvas.current.height)) -
          FALLING_SNACK_SIZE * this.canvas.current.height;
        item.rotation = (item.rotation + 0.03) % (Math.PI * 2);
      });

      this.fallingSnacksAnimationFrameID = requestAnimationFrame(
        drawFallingSnacks
      );
    };

    this.fallingSnacksAnimationFrameID = requestAnimationFrame(
      drawFallingSnacks
    );
    this.ctx.clearRect(
      0,
      0,
      this.canvas.current.width,
      this.canvas.current.height
    );
  };

  positionBuffer = new Array(POSITION_BUFFER_SIZE);
  averageBodyPosition;
  i = -1;
  update = async () => {
    if (this.backClicked) {
      return;
    }

    if (!this.webcam.current.webcam.current || !this.net) {
      this.snackChatAnimationFrameID = requestAnimationFrame(this.update);
      return;
    }

    if (this.state.counter <= PHOTO_ANIMATION_TIME && !this.state.captured) {
      setTimeout(() => {
        this.setState({captured: true});
        this.props.setSnackChat(this.canvas.current.toDataURL());
        document.getElementById('fade-overlay').className = 'fade-in';
        setTimeout(() => {
          clearInterval(this.timer);
          this.props.history.replace('/slackname');
        }, 1000);
      }, (PHOTO_ANIMATION_TIME + 1) * 1000);
      return;
    }

    const video = this.webcam.current.webcam.current.video;
    let frame;

    try {
      frame = await this.webcam.current.requestScreenshot();
    } catch (e) {
      this.snackChatAnimationFrameID = requestAnimationFrame(this.update);
      return;
    }

    const pose = await this.net.estimateSinglePose(frame, 0.5, true, 8);

    const body = {
      ears: calcAngles({
        leftX: normalise(pose.keypoints[3].position.x),
        leftY: normalise(pose.keypoints[3].position.y),
        rightX: normalise(pose.keypoints[4].position.x),
        rightY: normalise(pose.keypoints[4].position.y)
      }),
      shoulders: calcAngles({
        leftX: normalise(pose.keypoints[5].position.x),
        leftY: normalise(pose.keypoints[5].position.y),
        rightX: normalise(pose.keypoints[6].position.x),
        rightY: normalise(pose.keypoints[6].position.y)
      })
    };

    this.i = ++this.i % POSITION_BUFFER_SIZE;
    const forEachAttribute = callback =>
      ['ears', 'shoulders'].forEach(bodyPart =>
        [
          'leftX',
          'rightX',
          'leftY',
          'rightY',
          'width',
          'height',
          'span',
          'angle'
        ].forEach(attribute => callback(bodyPart, attribute))
      );

    // position buffer will contain undefined during first iteration
    if (this.positionBuffer.includes(undefined)) {
      // on first frame set the average value
      if (!this.i) {
        this.averageBodyPosition = body;
      } else {
        // as the buffer fills up update the average
        forEachAttribute((bodyPart, attribute) => {
          this.averageBodyPosition[bodyPart][attribute] =
            (this.averageBodyPosition[bodyPart][attribute] * this.i +
              body[bodyPart][attribute]) /
            (this.i + 1);
        });
      }
    } else {
      // when the array is full replace the oldest value w/ the newest and recompute the average
      const oldestPosition = this.positionBuffer[this.i];
      forEachAttribute(
        (bodyPart, attribute) =>
          (this.averageBodyPosition[bodyPart][attribute] =
            (this.averageBodyPosition[bodyPart][attribute] *
              POSITION_BUFFER_SIZE -
              oldestPosition[bodyPart][attribute] +
              body[bodyPart][attribute]) /
            POSITION_BUFFER_SIZE)
      );
    }
    this.positionBuffer[this.i] = body;

    // Video background
    this.ctx.save();
    this.drawBackground(video);

    // Filter
    const shoulders = this.averageBodyPosition.shoulders;
    this.ctx.save();
    this.ctx.rotate(shoulders.angle);
    this.ctx.drawImage(
      this.filter,
      shoulders.rightX -
        shoulders.span * 1.5 +
        shoulders.span * shoulders.angle,
      shoulders.rightY - shoulders.span * 1.5,
      shoulders.span * 4,
      shoulders.span * 4
    );
    this.ctx.restore();

    // Clip face
    const ears = this.averageBodyPosition.ears;
    this.ctx.save();
    this.ctx.translate(
      ears.rightX + ears.width / 2,
      ears.rightY + ears.height * ears.angle
    );
    this.ctx.rotate(ears.angle);
    clipEllipse(this.ctx, 0, 0, ears.span * 1.5, ears.span * 1.5);
    this.ctx.resetTransform();

    // Re-draw face
    this.drawBackground(video);

    this.snackChatAnimationFrameID = requestAnimationFrame(this.update);
  };

  onConnect = () => {
    this.ctx = this.canvas.current.getContext('2d');
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'red';
    this.filter = new Image();
    this.filter.src = this.props.storeList[this.props.actualItem].image;
    this.countdown();
    this.playGettingInPositionAnimation();
    this.snackChatAnimationFrameID = requestAnimationFrame(this.update);
  };

  onFail = () => {
    this.props.setSendWithPhoto(false);
    this.props.history.replace('/slackname');
  };

  onBack = () => {
    this.backClicked = true;
    clearInterval(this.timer);
    this.props.history.replace(
      this.props.actualItem === this.props.prediction.id
        ? '/confirmitem'
        : '/editsnack'
    );
  };

  render() {
    return (
      <div className="page">
        <div id="fade-overlay" className="fade-hidden" />
        {!this.state.gettingInPosition ? (
          <header>
            <BackButton handleClick={this.onBack} />
            <div className="snackchat--header-text snackchat--header-text-left">
              {this.state.counter >= PHOTO_ANIMATION_TIME && 'Taking photo in'}
            </div>
            <div className="snackchat--hands">
              <img className="snackchat--hands-slot" src={HandsSlot} alt="" />
              <img className="snackchat--hands-right" src={HandsRight} alt="" />
              <img
                className="snackchat--hands-center"
                src={HandsCenter}
                alt=""
              />
              <img
                className="snackchat--hands-camera"
                src={HandsCamera}
                alt=""
              />
              <img className="snackchat--hands-left" src={HandsLeft} alt="" />
            </div>
            <div className="snackchat--header-counter">
              {this.state.counter >= PHOTO_ANIMATION_TIME &&
                this.state.counter - PHOTO_ANIMATION_TIME}
            </div>
          </header>
        ) : (
          <header className="snackchat--header">
            <div className="snackchat--header-text snackchat--header-text-center">
              Get ready!
            </div>
          </header>
        )}
        <div className="snackchat-body">
          <canvas ref={this.canvas} width={FEED_SIZE} height={FEED_SIZE} />
        </div>
        <div style={{display: 'none'}}>
          <WebcamCapture
            ref={this.webcam}
            imgSize={CAPTURE_SIZE}
            onConnect={this.onConnect}
            onFail={this.onFail}
          />
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
  prediction: PropTypes.object.isRequired
};

export default SnackChat;
