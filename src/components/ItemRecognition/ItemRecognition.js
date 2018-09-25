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
    this.props.setPrediction(null, null);
    this.predictionQueue = [];
    this.initialiseModel();
  }

  async initialiseModel() {
    try {
      this.model = new Model();
      await this.model.load();
      this.setState({modelLoaded: true});
    } catch (e) {
      this.props.history.replace('/error');
    }
  }

  onConnect = () => {
    this.scanningStartTime = Date.now();
    this.schedulePredict();
  };

  onFail = async () => {
    await this.props.setPrediction('', '');
    this.props.history.replace('/editsnack');
  };

  schedulePredict = () => {
    return requestAnimationFrame(this.predict);
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

  isItemRecognised = item => {
    return item.id !== 'unknown' && item.value > ML_THRESHOLD;
  };

  isUnassigned(prediction) {
    return (
      prediction != null || (prediction.id === null && prediction.img === null)
    );
  }

  predict = async () => {
    if (this.backClicked) return this.props.history.replace('/disclaimer');

    const camera = this.webcam.current;
    if (!camera) return this.schedulePredict();

    const canvas = camera.getCanvas();
    if (!canvas) return this.schedulePredict();

    const items = await this.model.predict(canvas);

    const item = items[0];

    const hasResult =
      this.isItemRecognised(item) && this.isUnassigned(this.props.prediction);

    const hasTimedOut = this.hasBeen(TIMEOUT_IN_SECONDS);

    const updateInstructions =
      !this.state.subText && this.hasBeen(TIMEOUT_IN_SECONDS - SHOW_RETRY_FOR);

    const imgSrc = canvas.toDataURL('image/jpeg');
    if (hasResult) {
      this.setSuggestions(items, 1);
      this.props.setPrediction(item.id, imgSrc);

      camera.success(() => {
        this.setState({text: 'Snack recognised!', subText: null});
        setTimeout(() => {
          this.props.history.replace('/confirmitem');
        }, 500);
      });
      return;
    } else if (hasTimedOut) {
      this.setSuggestions(items, 0);
      this.props.setPrediction('', imgSrc);
      this.props.history.replace('/editsnack');
      return;
    } else if (updateInstructions) {
      this.setState({
        text: "We can't recognise the snack",
        subText: 'Try turning the snack so the logo is seen by the camera'
      });
    }

    // Get the next frame
    this.schedulePredict();
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
