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
    this.ctx.drawImage(
      video,
      Math.abs(video.videoWidth - this.canvas.current.width) / 2 -
        video.videoWidth,
      0
    );
    this.ctx.restore();
  };

  generateSnackchat = async () => {
    const video = this.webcam.current.webcam.current.video;

    this.ctx.save();
    this.drawBackground(video);

    const filter = new Image();
    filter.src = this.filter;

    const shoulders = this.state.averageBodyPosition.shoulders;
    this.ctx.save();
    this.ctx.drawImage(
      filter,
      shoulders.rightX -
        shoulders.span * 1.5 +
        shoulders.span * shoulders.angle,
      shoulders.rightY - shoulders.span * 1.5,
      shoulders.span * 4,
      shoulders.span * 4
    );
    this.ctx.restore();

    const ears = this.state.averageBodyPosition.ears;
    this.ctx.save();
    this.ctx.translate(
      ears.rightX + ears.width / 2,
      ears.rightY + ears.height * ears.angle
    );
    this.ctx.rotate(ears.angle);
    this.clipEllipse(this.ctx, 0, 0, ears.span * 1.5, ears.span * 1.5);
    this.ctx.resetTransform();

    this.drawBackground(video);
  };

  positionBuffer = new Array(POSITION_BUFFER_SIZE);
  i = -1;
  redirected = false;
  update = async () => {
    if (this.redirected || !this.webcam.current.webcam.current || !this.net) {
      requestAnimationFrame(this.update);
      return;
    }

    if (this.state.counter <= PHOTO_ANIMATION_TIME && !this.state.captured) {
      // async so that the filter doesn't stop moving
      this.setState(
        {captured: true},
        async () => {
          setTimeout(() => {
            clearInterval(this.timer);
            document.getElementById('fade-overlay').className = 'fade-in';
            this.generateSnackchat();
            this.props.setSnackChat(this.canvas.current.toDataURL());
            setTimeout(() => {
              this.redirected = true;
              this.props.history.replace('/slackname');
            }, 1000);
          });
        },
        (PHOTO_ANIMATION_TIME + 1) * 1000
      );
      return;
    }

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

    let averageBodyPosition = this.state.averageBodyPosition;
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

  onConnect = () => {
    this.ctx = this.canvas.current.getContext('2d');
    this.filter = this.props.storeList[this.props.actualItem].image;
    this.countdown();
    this.playGettingInPositionAnimation();
  };

  render() {
    const shoulders = this.state.averageBodyPosition.shoulders;
    const ears = this.state.averageBodyPosition.ears;
    return (
      <div className="page">
        <canvas
          ref={this.canvas}
          width={FEED_SIZE}
          height={FEED_SIZE}
          style={{position: 'absolute', zIndex: '-2'}}
        />
        <div id="fade-overlay" className="fade-hidden" />
        <header>
          <BackButton />
          {!this.state.gettingInPosition ? (
            <div>
              <div className="snackchat--header-text snackchat--header-text-left">
                {this.state.counter >= PHOTO_ANIMATION_TIME &&
                  'Taking photo in'}
              </div>
              <div className="snackchat--hands">
                <img className="snackchat--hands-slot" src={HandsSlot} alt="" />
                <img
                  className="snackchat--hands-right"
                  src={HandsRight}
                  alt=""
                />
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
            </div>
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
          />
          {this.state.gettingInPosition && (
            <div>
              <div className="snackchat-overlay" />
              {this.state.itemPositions.map((item, index) => (
                <div key={index}>
                  <img
                    src={this.filter}
                    alt=""
                    className="snackchat-falling-snack"
                    style={{
                      height: `${FEED_SIZE * FALLING_SNACK_SIZE}px`,
                      width: `${FEED_SIZE * FALLING_SNACK_SIZE}px`,
                      top: `${item.y}px`,
                      right: `${item.x - FEED_SIZE * 0.1}px`,
                      transform: `rotate(${item.rotation}rad)`
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          <div>
            {!this.state.gettingInPosition &&
              shoulders !== undefined && (
                <div>
                  <img
                    src={this.filter}
                    className="snackchat-filter"
                    alt=""
                    style={{
                      left: `${shoulders.rightX -
                        shoulders.span * 1.5 +
                        shoulders.span * shoulders.angle}px`,
                      top: `${shoulders.rightY - shoulders.span * 1.5}px`,
                      height: `${shoulders.span * 4}px`,
                      width: `${shoulders.span * 4}px`,
                      clipPath: 'url(#face-clip)'
                    }}
                  />
                  <svg width="0" height="0" style={{position: 'absolute'}}>
                    <defs>
                      <clipPath id="face-clip">
                        <polygon
                          points={
                            // outer rectangle
                            `${shoulders.span * 2} 0, ${shoulders.span *
                              4} 0, ${shoulders.span * 4} ${shoulders.span *
                              4}, 0 ${shoulders.span *
                              4}, 0 0, ${shoulders.span * 2} 0` +
                            // face ellipse
                            `${(() => {
                              const numberOfPoints = 40;
                              let ellipseCoords = '';
                              for (let i = 0; i <= numberOfPoints; ++i) {
                                ellipseCoords += `,${shoulders.span * 2 +
                                  ears.span *
                                    0.6 *
                                    Math.sin(
                                      (i / numberOfPoints) * 2 * Math.PI
                                    )} ${0.9 * shoulders.span +
                                  ears.span *
                                    0.75 *
                                    Math.cos(
                                      (i / numberOfPoints) * 2 * Math.PI
                                    )}`;
                              }
                              return ellipseCoords;
                            })()}`
                          }
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              )}
          </div>
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
