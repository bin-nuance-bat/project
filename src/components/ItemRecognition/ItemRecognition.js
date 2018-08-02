import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {ControllerDataset} from '../Admin/ControllerDataset';
import Model from './../../utils/model';

import WebcamCapture from '../WebcamCapture/WebcamCapture';
import BackButton from '../BackButton/BackButton';
import MobileNet from '../Admin/Trainer/MobileNet';

import './ItemRecognition.css';

const TIMEOUT_IN_SECONDS = 10;
const ML_THRESHOLD = 0.35;

class ItemRecognition extends Component {
  constructor(props) {
    super(props);

    if (navigator.onLine) {
      this.model = new Model();
      this.model.load();
      this.webcam = React.createRef();
      this.mobileNet = new MobileNet();
      this.controllerDataset = new ControllerDataset();
    }
  }

  state = {
    status: 'Scan item using the front facing camera'
  };

  componentDidMount() {
    this.props.setPrediction(null, null);
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
    if (this.success) return;
    this.model.predict(img).then(async items => {
      const item = items[0];
      if (
        (item.value > ML_THRESHOLD &&
          item.id !== 'unknown' &&
          !this.props.prediction) ||
        (Date.now() - this.scanningStartTime) / 1000 > TIMEOUT_IN_SECONDS
      ) {
        this.success = true;
        this.addTrainingImage(img.src, item.id);
        await this.props.setPrediction(item.id, img.src);
        this.webcam.current.success(() => {
          this.setState({status: 'Snack recognised!'});
          setTimeout(() => {
            this.props.history.replace(
              item.id === 'unknown' ? '/editsnack' : '/confirmitem'
            );
          }, 500);
        });
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
          <BackButton history={this.props.history} />
          <div className="item-recognition item-recognition--instructions">
            {this.state.status}
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
  history: PropTypes.object.isRequired,
  storeList: PropTypes.object.isRequired
};

export default ItemRecognition;
