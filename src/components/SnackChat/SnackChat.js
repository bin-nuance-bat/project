// const getBBox = (svg) =>
//   [...svg.querySelectorAll('*')]
//     .map(element => element.getBBox())
//     .map(({ x, y, width, height }) => ({
//       left: x,
//       top: y,
//       bottom: y + height,
//       right: x + width
//     }))
//     .reduce(
//       (union, element) => ({
//         left: Math.min(element.left, union.left),
//         top: Math.min(element.top, union.top),
//         right: Math.max(element.right, union.right),
//         bottom: Math.max(element.right, union.right)
//       })
//     );

// const bboxes = [...document.body.querySelectorAll('svg')]
//   .map(getBBox)
//   .map(bbox => {
//     const width = bbox.right - bbox.left;
//     const height = bbox.bottom - bbox.top;
//     const aspectRatio = width / height;
//     return { ...bbox, width, height, aspectRatio };
//   });

// console.log(bboxes)

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
import getSnackTransform from '../../utils/snackTransform';

const FEED_SIZE = 768;
const CAPTURE_SIZE = 200;
const LOADING_ANIMATION_TIME = 3;
const COUNTDOWN_TIME = 3;
const PHOTO_ANIMATION_TIME = 1.5;
const POSITION_BUFFER_SIZE = 3;
const FALLING_SNACK_SIZE = 0.2;
const CANVAS_SCALE = 1.6;

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
    calculatingBoundingBox: true,
    gettingInPosition: true,
    itemPositions: [],
    averageBodyPosition: {},
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

  playGettingInPositionAnimation = () => {
    const itemPositions = [];
    const numberOfFallingSnacks = 3;
    for (let i = 1; i <= numberOfFallingSnacks; i++) {
      itemPositions.push({
        x: (FEED_SIZE * i) / (numberOfFallingSnacks + 1),
        y:
          Math.random() * (1 + 2 * FALLING_SNACK_SIZE) * FEED_SIZE -
          FALLING_SNACK_SIZE * FEED_SIZE,
        rotation: Math.random() * 2 * Math.PI
      });
    }

    const drawFallingSnacks = () => {
      if (this.state.backClicked) return;

      if (this.state.counter <= COUNTDOWN_TIME + PHOTO_ANIMATION_TIME) {
        this.setState({gettingInPosition: false});
        requestAnimationFrame(this.update);
        return;
      } else {
        this.setState({itemPositions});
      }

      // update positions
      itemPositions.forEach(item => {
        item.y =
          ((FALLING_SNACK_SIZE * FEED_SIZE + item.y + 3) %
            ((1 + 2 * FALLING_SNACK_SIZE) * FEED_SIZE)) -
          FALLING_SNACK_SIZE * FEED_SIZE;
        item.rotation = (item.rotation + 0.03) % (Math.PI * 2);
      });
      requestAnimationFrame(drawFallingSnacks);
    };
    requestAnimationFrame(drawFallingSnacks);
  };

  clipEllipse(ctx, centerX, centerY, width, height) {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - height / 2);
    // bezier curves produce the ellipse shape, each is a "(" shape.
    // start point is the position of the current path
    // first four params are the coordinates of the two control points, 5th and 6th params are the coordinates of the end point
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

  drawBackground = video => {
    this.ctx.scale(-CANVAS_SCALE, CANVAS_SCALE);
    // account for difference in width of video feed and canvas so background image is horizontally centred
    const x =
      Math.abs(video.videoWidth - this.canvas.current.width) / 2 -
      video.videoWidth;
    this.ctx.drawImage(video, x, 0);
    this.ctx.restore();
  };

  generateSnackchat = () => {
    const {video} = this.webcam.current.webcam.current;

    this.ctx.save();
    this.drawBackground(video);

    const filter = new Image();
    filter.src = this.filter;

    const {shoulders} = this.state.averageBodyPosition;
    const rotate = this.transform[0] === 0;
    const sideLength = shoulders.span * (rotate ? 3 : 2);

    this.ctx.save();
    if (rotate) this.ctx.rotate(Math.PI / 2);
    const x = shoulders.rightX - (rotate ? sideLength / 3 : sideLength / 4);
    const y = shoulders.rightY - shoulders.span;
    console.log('x', x);
    console.log('y', y);
    console.log('filter', filter);
    console.log('sideLength', sideLength);
    this.ctx.drawImage(filter, x, y, sideLength, sideLength);
    this.ctx.restore();

    // this.ctx.save();
    // this.ctx.translate(
    //   rotate ? (shoulders.rightX + shoulders.leftX) / 1.75 : x + sideLength / 2,
    //   rotate ? (shoulders.rightY + shoulders.leftY) / 2 : y + sideLength / 4.75
    // );
    // this.clipEllipse(
    //   this.ctx,
    //   0,
    //   0,
    //   shoulders.span * (rotate ? 0.4 : 0.3),
    //   shoulders.span * (rotate ? 0.25 : 0.4)
    // );
    // this.ctx.resetTransform();

    // this.drawBackground(video);
  };

  takeSnackchat = () => {
    this.snackchatTimeout = setTimeout(() => {
      clearInterval(this.timer);
      document.getElementById('fade-overlay').className = 'fade-in';
      this.generateSnackchat();
      this.props.setSnackChat(this.canvas.current.toDataURL());
      this.redirectTimeout = setTimeout(() => {
        this.redirected = true;
        this.props.history.replace('/slackname');
      }, 1000);
    }, PHOTO_ANIMATION_TIME * 1000);
  };

  positionBuffer = new Array(POSITION_BUFFER_SIZE);
  i = -1;
  redirected = false;
  update = async () => {
    if (
      !this ||
      this.backClicked ||
      !this.webcam.current.webcam.current ||
      !this.net
    ) {
      requestAnimationFrame(this.update);
      return;
    }

    if (this.state.counter <= PHOTO_ANIMATION_TIME) {
      this.setState(
        prevState =>
          prevState.captured ? null : (this.takeSnackchat(), {captured: true})
      );
      return;
    }

    let frame;
    try {
      frame = await this.webcam.current.requestScreenshot();
    } catch (e) {
      this.snackChatAnimationFrameID = requestAnimationFrame(this.update);
      return;
    }

    const pose = await this.net.estimateSinglePose(frame, 0.25, true, 16);

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

    let {averageBodyPosition} = this.state;
    // position buffer will contain undefined during first iteration
    if (this.positionBuffer.includes(undefined)) {
      // on first frame set the average value
      if (!this.i) {
        averageBodyPosition = body;
      } else {
        // as the buffer fills up update the average
        forEachAttribute((bodyPart, attribute) => {
          averageBodyPosition[bodyPart][attribute] =
            (averageBodyPosition[bodyPart][attribute] * this.i +
              body[bodyPart][attribute]) /
            (this.i + 1);
        });
      }
    } else {
      // when the array is full replace the oldest value w/ the newest and recompute the average
      const oldestPosition = this.positionBuffer[this.i];
      forEachAttribute(
        (bodyPart, attribute) =>
          (averageBodyPosition[bodyPart][attribute] =
            (averageBodyPosition[bodyPart][attribute] * POSITION_BUFFER_SIZE -
              oldestPosition[bodyPart][attribute] +
              body[bodyPart][attribute]) /
            POSITION_BUFFER_SIZE)
      );
    }
    this.positionBuffer[this.i] = body;
    this.setState({
      averageBodyPosition
    });

    requestAnimationFrame(this.update);
  };

  setTransformation = () => {
    const transform = getSnackTransform(this.filter);

    // remove translation used to position item in hand
    transform[4] = 0;
    transform[5] = 0;
    this.transform = transform;
  };

  onConnect = () => {
    this.ctx = this.canvas.current.getContext('2d');
    this.filter = this.props.storeList[this.props.actualItem].image;
    this.setTransformation();
    this.countdown();
    this.playGettingInPositionAnimation();
  };

  onFail = () => {
    this.props.setSendWithPhoto(false);
    this.props.history.replace('/slackname');
  };

  onBack = () => {
    this.backClicked = true;
    clearInterval(this.timer);
    clearTimeout(this.snackchatTimeout);
    clearTimeout(this.redirectTimeout);
    this.props.history.replace(
      this.props.actualItem === this.props.predictionID
        ? '/confirmitem'
        : '/editsnack'
    );
  };

  renderHandsHeader = () => (
    <div>
      <div className="snackchat--header-text snackchat--header-text-left">
        {this.state.counter >= PHOTO_ANIMATION_TIME && `Taking photo in`}
      </div>
      <div className="snackchat--hands">
        <img className="snackchat--hands-slot" src={HandsSlot} alt="" />
        <img className="snackchat--hands-right" src={HandsRight} alt="" />
        <img className="snackchat--hands-center" src={HandsCenter} alt="" />
        <img className="snackchat--hands-camera" src={HandsCamera} alt="" />
        <img className="snackchat--hands-left" src={HandsLeft} alt="" />
      </div>
      <div className="snackchat--header-counter">
        {this.state.counter >= PHOTO_ANIMATION_TIME &&
          this.state.counter - PHOTO_ANIMATION_TIME}
      </div>
    </div>
  );

  renderFallingItems = () => (
    <div>
      <div className="snackchat-overlay webcam-container" />
      {this.state.itemPositions.map((item, index) => {
        return (
          <div key={index}>
            <img
              src={this.filter}
              alt=""
              className="snackchat-falling-snack"
              style={{
                height: FEED_SIZE * FALLING_SNACK_SIZE,
                width: FEED_SIZE * FALLING_SNACK_SIZE,
                top: item.y + 120,
                right: item.x - FEED_SIZE * 0.1,
                transform: `rotate(${item.rotation}rad)`
              }}
            />
          </div>
        );
      })}
    </div>
  );

  generateEllipseCoords = (centerX, centerY, rotate) => {
    const {shoulders} = this.state.averageBodyPosition;
    const numberOfPoints = 40;
    const horizontalScale = shoulders.span * (rotate ? 0.4 : 0.3);
    const verticalScale = shoulders.span * (rotate ? 0.25 : 0.4);

    return Array.from({length: numberOfPoints + 1})
      .map((_, index) => {
        const angle = (index / numberOfPoints) * 2 * Math.PI;
        const x = centerX + horizontalScale * Math.sin(angle);
        const y = centerY + verticalScale * Math.cos(angle);

        return `${x} ${y}`;
      })
      .join(',');
  };

  renderFilter = shoulders => {
    const rotate = this.transform[0] === 0;
    const sideLength = shoulders.span * (rotate ? 3 : 2);
    const left = shoulders.rightX - (rotate ? sideLength / 3 : sideLength / 4);
    const top = shoulders.rightY - shoulders.span;
    console.log('x', left);
    console.log('y', top);
    console.log('filter', this.filter);
    console.log('sideLength', sideLength);
    return (
      <div>
        <img
          src={this.filter}
          className="snackchat-filter"
          alt=""
          style={{
            left,
            top,
            width: sideLength,
            transform: `rotate(${rotate ? Math.PI / 2 : 0}rad)`,
            clipPath: 'url(#face-clip)'
          }}
        />
        <svg width={0} height={0} style={{position: 'absolute'}}>
          <defs>
            <clipPath id="face-clip">
              <polygon
                points={
                  `${sideLength /
                    2} 0, ${sideLength} 0, ${sideLength} ${sideLength}, 0 ${sideLength}, 0 0, ${sideLength /
                    2} 0,` +
                  this.generateEllipseCoords(
                    rotate
                      ? (shoulders.rightX + shoulders.leftX) / 1.75
                      : left + sideLength / 2,
                    rotate
                      ? (shoulders.rightY + shoulders.leftY) / 2
                      : top + sideLength / 4.75,
                    rotate
                  )
                }
              />
            </clipPath>
          </defs>
        </svg>
      </div>
    );
  };

  render() {
    const {shoulders} = this.state.averageBodyPosition;
    // if(this.state.calculatingBoundingBox) return <div>{this.filter}</div>;
    return (
      <div className="page">
        <canvas
          ref={this.canvas}
          width={FEED_SIZE}
          height={FEED_SIZE}
          style={{position: 'absolute', zIndex: -2}}
        />
        <div id="fade-overlay" className="fade-hidden" />
        <header className="header">
          <BackButton handleClick={this.onBack} />
          {!this.state.gettingInPosition ? (
            this.renderHandsHeader()
          ) : (
            <div className="snackchat--header-text snackchat--header-text-center">
              Get ready!
            </div>
          )}
        </header>
        <div className="snackchat-body">
          <WebcamCapture
            ref={this.webcam}
            imgSize={CAPTURE_SIZE}
            onConnect={this.onConnect}
            onFail={this.onFail}
          />
          {this.state.gettingInPosition && this.renderFallingItems()}
          {!this.state.gettingInPosition &&
            shoulders !== undefined &&
            this.renderFilter(shoulders)}
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
