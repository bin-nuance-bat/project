import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ControllerDataset} from '../Admin/ControllerDataset';
import Model from './../../utils/model';
import WebcamCapture from '../WebcamCapture/WebcamCapture';
import './ItemRecognition.css';
import BackButton from '../BackButton/BackButton';
import MobileNet from '../Admin/Trainer/MobileNet';
import './ItemRecognition.css';

const TIMEOUT_IN_SECONDS = 10;
const ML_THRESHOLD = 0.35;
const SHOW_RETRY_FOR = 5;

class ItemRecognition extends Component {
  model = new Model();
  webcam = React.createRef();
  mobileNet = new MobileNet();
  state = {
    status: 'Scan item'
  };

  state = {
    showRetryMessage: false
  };

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
    this.model.predict(img).then(async items => {
      const item = items[0];
      this.setState({
        status: items
          .sort((a, b) => a.id.localeCompare(b.id))
          .map(
            i =>
              `${this.props.storeList[i.id].name} ${(i.value * 100).toFixed(
                0
              )}% `
          )
      });
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
        if (
          !this.state.showRetryMessage &&
          (Date.now() - this.scanningStartTime) / 1000 >
            TIMEOUT_IN_SECONDS - SHOW_RETRY_FOR
        )
          this.setState({showRetryMessage: true});
        if (this.webcam.current)
          this.webcam.current.requestScreenshot().then(this.handleImg);
      }
    });
  };

  render() {
    return (
      <div className="page">
        <BackButton history={this.props.history} />
        <header>
          {this.state.showRetryMessage ? (
            <div>
              <div className="item-recognition item-recognition--instructions">
                We can&#39;t recognise the snack
              </div>
              <div className="item-recognition--instructions-small">
                Try turning the snack so the logo is seen by the camera
              </div>
            </div>
          ) : (
            <div className="item-recognition item-recognition--instructions">
              Scan item using the front facing camera
            </div>
          )}
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
