import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {ControllerDataset} from '../Admin/ControllerDataset';
import Model from './../../utils/model';

import WebcamCapture from '../WebcamCapture/WebcamCapture';
import MobileNet from '../Admin/Trainer/MobileNet';

import Logo from '../Logo/Logo';
import './ItemRecognition.css';

const ML_THRESHOLD = 0.35;

class ItemRecognition extends Component {
  model = new Model();
  webcam = React.createRef();
  mobileNet = new MobileNet();
  state = {
    status: 'Scan item'
  };

  componentDidMount() {
    this.props.setPrediction(null, null);
    this.model.load();
    this.controllerDataset = new ControllerDataset();
  }

  onConnect = () => {
    this.webcam.current
      .requestScreenshot()
      .then(this.handleImg)
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
    this.model.predict(img).then(async items => {
      this.setState({
        status: items.map(
          item =>
            `${this.props.storeList[item.id].name} ${(item.value * 100).toFixed(
              0
            )}%<br />`
        )
      });
      const item = items[0];
      if (
        item.value > ML_THRESHOLD &&
        item.id !== 'unknown' &&
        !this.props.prediction
      ) {
        await this.addTrainingImage(img.src, item.id);
        this.props.setPrediction(item.id, img.src);
        this.props.history.replace('/confirmitem');
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
  storeList: PropTypes.array.isRequired
};

export default ItemRecognition;
