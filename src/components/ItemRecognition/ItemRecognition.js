import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Model from './../../utils/model';
import WebcamCapture from '../WebcamCapture/WebcamCapture';
import Logo from '../Logo/Logo';
import './ItemRecognition.css';
import {ControllerDataset} from '../Admin/Trainer/ControllerDataset';
import MobileNet from '../Admin/Trainer/MobileNet';

const ML_THRESHOLD = 0.06;
const TIMEOUT_IN_SECONDS = 10;

class ItemRecognition extends Component {
  model = new Model();
  webcam = React.createRef();
  mobileNet = new MobileNet();

  componentDidMount() {
    this.props.setPrediction(null, null);
    this.model.load();
    this.controllerDataset = new ControllerDataset();
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

  handleImg = img => {
    this.model.predict(img).then(async item => {
      if (
        (item.value > ML_THRESHOLD &&
          item.id !== 'unknown' &&
          !this.props.prediction) ||
        (Date.now() - this.scanningStartTime) / 1000 > TIMEOUT_IN_SECONDS
      ) {
        await this.addTrainingImage(img.src, item.id);
        this.props.setPrediction(item.id, img.src);
        this.props.history.replace(
          item.id === 'unknown' ? '/editsnack' : '/confirmitem'
        );
      } else {
        if (this.webcam.current)
          this.webcam.current.requestScreenshot().then(this.handleImg);
      }
    });
  };

  render() {
    return (
      <div className="page">
        <header>
          <Logo />
          <div className="item-recognition item-recognition--instructions">
            Scan item using the front facing camera
          </div>
        </header>
        <WebcamCapture
          className="item-recognition item-recognition--display"
          ref={this.webcam}
          onConnect={this.onConnect}
          imgSize={224}
        />
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
  history: PropTypes.object.isRequired
};

export default ItemRecognition;
