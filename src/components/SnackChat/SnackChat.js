import React, {Component} from 'react';
import WebcamCapture from '../WebcamCapture/WebcamCapture';
import PropTypes from 'prop-types';
import * as posenet from '@tensorflow-models/posenet';
import './SnackChat.css';

const FEED_SIZE = 480;
const CAPTURE_SIZE = 200;
const POSITION_BUFFER_SIZE = 10;

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
    counter: 5,
    captured: false
  };

  componentDidMount() {
    posenet.load(0.5).then(net => (this.net = net));
    this.ctx = this.canvas.current.getContext('2d');
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'red';
    requestAnimationFrame(this.update);
    this.filter = new Image();
    this.filter.src = this.props.storeList[this.props.prediction.id].image;
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  positionBuffer = new Array(POSITION_BUFFER_SIZE);
  averageBodyPosition;
  i = -1;
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
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(
      video,
      (video.videoWidth - this.canvas.current.width) / 2 - video.videoWidth,
      -(video.videoHeight - this.canvas.current.height) / 2
    );
    this.ctx.restore();

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
    this.timer = setInterval(
      () => this.setState({counter: this.state.counter - 1}),
      1000
    );
  };

  render() {
    return (
      <div className="page">
        <header>
          Smile, you are on snackchat:
          {this.state.counter}
        </header>
        <div className="snackchat-body">
          <canvas ref={this.canvas} width={FEED_SIZE} height={FEED_SIZE} />
        </div>
        <div style={{display: 'none'}}>
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
  prediction: PropTypes.object
};

export default SnackChat;
