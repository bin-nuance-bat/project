import React, {Component} from 'react';
import WebcamCapture from '../WebcamCapture/WebcamCapture';
import PropTypes from 'prop-types';
import * as posenet from '@tensorflow-models/posenet';
import './SnackChat.css';

const FEED_SIZE = 480;
const CAPTURE_SIZE = 200;
const COUNTDOWN_TIME = 3;
const LOADING_ANIMATION_TIME = 3;

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

function normalise({x, y}) {
  x *= FEED_SIZE / CAPTURE_SIZE;
  y *= FEED_SIZE / CAPTURE_SIZE;
  return {x, y};
}

function calcAngles(bodyPart) {
  bodyPart.left = normalise(bodyPart.left);
  bodyPart.right = normalise(bodyPart.right);
  bodyPart.width = bodyPart.left.x - bodyPart.right.x;
  bodyPart.height = bodyPart.right.y - bodyPart.left.y;
  bodyPart.span = Math.sqrt(bodyPart.width ** 2 + bodyPart.height ** 2);
  bodyPart.angle = Math.atan(bodyPart.width / bodyPart.height);
  bodyPart.angle += ((bodyPart.height > 0 ? -1 : 1) * Math.PI) / 2;
  return bodyPart;
}

class SnackChat extends Component {
  webcam = React.createRef();
  canvas = React.createRef();

  state = {
    loading: true,
    counter: COUNTDOWN_TIME + LOADING_ANIMATION_TIME,
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

  playLoadingAnimation = () => {
    const numberOfFallingSnacks = 3;
    const itemPositions = [];
    for (let i = 1; i <= numberOfFallingSnacks; i++) {
      itemPositions.push({
        x: (this.canvas.current.width * i) / (numberOfFallingSnacks + 1),
        y:
          Math.random() * 1.4 * this.canvas.current.height -
          0.2 * this.canvas.current.height,
        rotation: Math.random() * 2 * Math.PI
      });
    }

    const loadingAnimation = () => {
      if (this.state.counter < COUNTDOWN_TIME) return;

      // Video background
      const video = this.webcam.current.webcam.current.video;
      this.ctx.save();
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(
        video,
        (video.videoWidth - this.canvas.current.width) / 2 - video.videoWidth,
        -(video.videoHeight - this.canvas.current.height) / 2
      );
      this.ctx.restore();

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
          0.2 * this.canvas.current.width,
          0.2 * this.canvas.current.height
        );
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      });
      this.ctx.restore();

      // update positions
      itemPositions.forEach(item => {
        item.y =
          ((0.2 * this.canvas.current.height + item.y + 3) %
            (1.4 * this.canvas.current.height)) -
          0.2 * this.canvas.current.height;
        item.rotation = (item.rotation + 0.03) % (Math.PI * 2);
      });

      requestAnimationFrame(loadingAnimation);
      this.setState({loading: false});
    };

    requestAnimationFrame(loadingAnimation);
    this.ctx.clearRect(
      0,
      0,
      this.canvas.current.width,
      this.canvas.current.height
    );
  };

  update = async () => {
    if (!this.webcam.current.webcam.current || !this.net) {
      requestAnimationFrame(this.update);
      return;
    }

    if (this.state.counter === 0 && !this.state.captured) {
      clearInterval(this.timer);
      this.setState({captured: true});
      this.props.setSnackChat(this.canvas.current.toDataURL());
      this.props.history.replace('/slackname');
      return;
    }

    const video = this.webcam.current.webcam.current.video;
    let frame;

    try {
      frame = await this.webcam.current.requestScreenshot();
    } catch (e) {
      requestAnimationFrame(this.update);
      return;
    }

    const pose = await this.net.estimateSinglePose(frame, 0.5, true, 8);

    const body = {
      ears: calcAngles({
        left: pose.keypoints[3].position,
        right: pose.keypoints[4].position
      }),
      shoulders: calcAngles({
        left: pose.keypoints[5].position,
        right: pose.keypoints[6].position
      })
    };

    // Video background
    this.ctx.save();
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(
      video,
      (video.videoWidth - this.canvas.current.width) / 2 - video.videoWidth,
      -(video.videoHeight - this.canvas.current.height) / 2
    );
    this.ctx.restore();

    // Filter
    this.ctx.save();
    this.ctx.rotate(body.shoulders.angle);
    this.ctx.drawImage(
      this.filter,
      body.shoulders.right.x -
        body.shoulders.span * 1.5 +
        body.shoulders.span * body.shoulders.angle,
      body.shoulders.right.y - body.shoulders.span * 1.5,
      body.shoulders.span * 4,
      body.shoulders.span * 4
    );
    this.ctx.restore();

    // Clip face
    this.ctx.save();
    this.ctx.translate(
      body.ears.right.x + body.ears.width / 2,
      body.ears.right.y + body.ears.height * body.ears.angle
    );
    this.ctx.rotate(body.ears.angle);
    clipEllipse(this.ctx, 0, 0, body.ears.span * 1.5, body.ears.span * 1.5);
    this.ctx.resetTransform();

    // Re-draw face
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(
      video,
      (video.videoWidth - this.canvas.current.width) / 2 - video.videoWidth,
      -(video.videoHeight - this.canvas.current.height) / 2
    );
    this.ctx.restore();

    requestAnimationFrame(this.update);
  };

  onConnect = () => {
    this.ctx = this.canvas.current.getContext('2d');
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'red';
    this.filter = new Image();
    this.filter.src = this.props.storeList[this.props.actualItem].image;
    this.countdown();
    this.playLoadingAnimation();
    requestAnimationFrame(this.update);
  };

  render() {
    return (
      <div className="page">
        {!this.state.loading ? (
          <header className="snackchat--header">
            Taking photo in
            {this.state.counter}
          </header>
        ) : (
          <header className="snackchat--header">Get ready!</header>
        )}
        <div className="snackchat-body">
          <canvas ref={this.canvas} width={FEED_SIZE} height={FEED_SIZE} />
        </div>
        <div
          style={{
            display: 'none'
          }}>
          <WebcamCapture
            ref={this.webcam}
            imgSize={CAPTURE_SIZE}
            onConnect={this.onConnect}
          />
        </div>
      </div>
    );
  }
}

SnackChat.propTypes = {
  setSnackChat: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  storeList: PropTypes.object.isRequired,
  actualItem: PropTypes.string.isRequired
};

export default SnackChat;
