import React, {Component} from 'react';
import PropTypes from 'prop-types';

import WebcamCapture from '../WebcamCapture/WebcamCapture';
import BackButton from '../BackButton/BackButton';

import Model from '../../utils/model';

const TIMEOUT_IN_SECONDS = 10;
const ML_THRESHOLD = 0.8;
const SHOW_RETRY_FOR = 5;

class ItemRecognition extends Component {
  webcam = React.createRef();

  state = {
    text: 'Scan item using the front facing camera',
    modelLoaded: false
  };
  model = null;

  predictionQueue = [];

  componentDidMount() {
    this.model = new Model();
    this.model.load().then(() => this.setState({modelLoaded: true}));
    this.props.setPrediction(null, null);
    this.predictionQueue = [];
  }

  onConnect = () => {
    this.scanningStartTime = Date.now();
    requestAnimationFrame(this.predict);
  };

  onFail = async () => {
    await this.props.setPrediction('', '');
    this.props.history.replace('/editsnack');
  };

  setSuggestions = (items, index) => {
    const suggestions = items
      .slice(index)
      .filter(item => item.id !== 'unknown')
      .slice(0, 3)
      .map(item => item.id);
    this.props.setSuggestions(suggestions);
  };

  hasBeen(seconds) {
    const time = (Date.now() - this.scanningStartTime) / 1000;
    return time > seconds;
  }

  isItemRecognised = items => {
    return items[0].value > ML_THRESHOLD;
  };

  isUnassigned(prediction) {
    return !prediction || (prediction.id === null && prediction.img === null);
  }

  predict = () => {
    if (this.backClicked) return this.props.history.replace('/disclaimer');
    if (this.success) return;

    if (!this.webcam.current) return requestAnimationFrame(this.predict);

    const canvas = this.webcam.current.getCanvas();
    if (!canvas) return requestAnimationFrame(this.predict);

    this.model.predict(canvas).then(async items => {
      const item = items[0];
      const imgSrc = canvas.toDataURL('image/jpeg');

      const recognised = this.isItemRecognised(items);
      const known = item.id !== 'unknown';
      const unassigned = this.isUnassigned(this.props.prediction);

      const isItemRecognised = recognised && known && unassigned;

      const hasTimedOut = this.hasBeen(TIMEOUT_IN_SECONDS);

      const showRotationMessage =
        !this.state.subText &&
        this.hasBeen(TIMEOUT_IN_SECONDS - SHOW_RETRY_FOR);

      if (isItemRecognised) {
        this.success = true;
        this.setSuggestions(items, 1);
        await this.props.setPrediction(item.id, imgSrc);

        this.webcam.current.success(() => {
          this.setState({text: 'Snack recognised!', subText: null});
          setTimeout(() => {
            this.props.history.replace('/confirmitem');
          }, 500);
        });
      } else if (hasTimedOut) {
        this.setSuggestions(items, 0);
        this.props.setPrediction('', imgSrc);
        this.props.history.replace('/editsnack');
        return;
      } else if (showRotationMessage) {
        this.setState({
          text: "We can't recognise the snack",
          subText: 'Try turning the snack so the logo is seen by the camera'
        });
      }

      // Get the next frame
      if (this.webcam.current) requestAnimationFrame(this.predict);
    });
  };

  clickBack = () => {
    this.backClicked = true;
  };

  componentWillUnmount() {
    this.model.dispose();
  }

  render() {
    return (
      <div className="page">
        <header className="header">
          <BackButton handleClick={this.clickBack} />
          <div>
            <div className="header-text">{this.state.text}</div>
            {this.state.subText && (
              <div className="header-subtext">{this.state.subText}</div>
            )}
          </div>
        </header>
        {this.state.modelLoaded && (
          <WebcamCapture
            className="item-recognition item-recognition--display"
            ref={this.webcam}
            onConnect={this.onConnect}
            imgSize={160}
            onFail={this.onFail}
          />
        )}
      </div>
    );
  }
}

ItemRecognition.propTypes = {
  setPrediction: PropTypes.func.isRequired,
  prediction: PropTypes.shape({
    name: PropTypes.string,
    img: PropTypes.string
  }),
  history: PropTypes.object.isRequired,
  storeList: PropTypes.object.isRequired,
  setSuggestions: PropTypes.func.isRequired
};

export default ItemRecognition;
