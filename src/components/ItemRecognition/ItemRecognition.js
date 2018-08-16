import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ControllerDataset} from '../Admin/ControllerDataset';
import Model from './../../utils/model';

import WebcamCapture from '../WebcamCapture/WebcamCapture';
import BackButton from '../BackButton/BackButton';
import MobileNet from '../Admin/Trainer/MobileNet';

const TIMEOUT_IN_SECONDS = 10;
const MIN_CONSECUTIVE_PREDICTIONS = 3;
const PREDICTION_RATIO_THRESHOLD = 1.2;
const SHOW_RETRY_FOR = 5;

class ItemRecognition extends Component {
  constructor(props) {
    super(props);

    if (navigator.onLine) {
      this.model = new Model();
      this.model.load().then(() => this.setState({modelLoaded: true}));
      this.webcam = React.createRef();
      this.mobileNet = new MobileNet();
      this.controllerDataset = new ControllerDataset();
    }
  }

  state = {
    text: 'Scan item using the front facing camera',
    modelLoaded: false
  };

  predictionQueue = [];

  componentDidMount() {
    this.props.setPrediction(null, null);
    this.predictionQueue = [];
  }

  onConnect = () => {
    this.webcam.current
      .requestScreenshot()
      .then(img => {
        this.scanningStartTime = Date.now();
        this.handleImg(img);
      })
      .catch(() => {
        setTimeout(this.onConnect, 100);
      });
  };

  onFail = () => {
    this.props.history.replace('/editsnack');
  };

  addTrainingImage = (img, label) => {
    this.mobileNet.init().then(() =>
      this.mobileNet.getActivation(img).then(activation =>
        this.controllerDataset.addImage(
          {
            img,
            label,
            activation
          },
          false
        )
      )
    );
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
    return (Date.now() - this.scanningStartTime) / 1000 > seconds;
  }

  isItemRecognised = items => {
    this.predictionQueue.push(items.slice(0, MIN_CONSECUTIVE_PREDICTIONS));
    if (this.predictionQueue.length < MIN_CONSECUTIVE_PREDICTIONS) {
      return false;
    }

    const predictions = this.predictionQueue.slice(
      -MIN_CONSECUTIVE_PREDICTIONS
    );
    const {id} = predictions[0][0];

    const areAllBestPredictionsTheSame = predictions
      .slice(1)
      .every(([bestPrediction]) => bestPrediction.id === id);

    const areAllBestPredictionsCertainEnough = predictions.every(
      ([bestPrediction, secondBestPrediction]) =>
        bestPrediction.value / secondBestPrediction.value >
        PREDICTION_RATIO_THRESHOLD
    );

    return areAllBestPredictionsTheSame && areAllBestPredictionsCertainEnough;
  };

  handleImg = img => {
    if (this.success) return;

    this.model.predict(img).then(async items => {
      const item = items[0];
      const isItemRecognised =
        this.isItemRecognised(items) &&
        item.id !== 'unknown' &&
        !this.props.prediction;

      const hasTimedOut = this.hasBeen(TIMEOUT_IN_SECONDS);

      const showRotationMessage =
        !this.state.subText &&
        this.hasBeen(TIMEOUT_IN_SECONDS - SHOW_RETRY_FOR);

      if (isItemRecognised) {
        this.success = true;
        this.addTrainingImage(img.src, item.id);
        this.setSuggestions(items, 1);
        await this.props.setPrediction(item.id, img.src);

        this.webcam.current.success(() => {
          this.setState({text: 'Snack recognised!', subText: null});
          setTimeout(() => {
            this.props.history.replace('/confirmitem');
          }, 500);
        });
      } else if (hasTimedOut) {
        this.setSuggestions(items, 0);
        this.props.history.replace('/editsnack');
      } else if (showRotationMessage) {
        this.setState({
          text: "We can't recognise the snack",
          subText: 'Try turning the snack so the logo is seen by the camera'
        });
      }

      // Get the next frame
      if (this.webcam.current)
        this.webcam.current.requestScreenshot().then(this.handleImg);
    });
  };
  componentWillUnmount() {
    this.model.dispose();
  }

  render() {
    return (
      <div className="page">
        <header className="header">
          <BackButton history={this.props.history} />
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
            imgSize={224}
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
    img: PropTypes.string.isRequired
  }),
  history: PropTypes.object.isRequired,
  storeList: PropTypes.object.isRequired,
  setSuggestions: PropTypes.func.isRequired
};

export default ItemRecognition;
