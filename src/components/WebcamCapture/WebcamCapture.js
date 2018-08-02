import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Webcam from 'react-webcam';
import Notification from '../Notification/Notification';
import ViewFinder from './ViewFinder';

import './WebcamCapture.css';

class WebcamCapture extends Component {
  state = {
    isDetecting: true,
    cameraConnected: false,
    animation: 0
  };

  webcam = React.createRef();

  requestScreenshot = () => {
    if (!this.webcam.current) return Promise.reject('Failed to load webcam.');
    const screenshot = this.webcam.current.getScreenshot();
    if (screenshot === null) return Promise.reject('Failed to load webcam.');

    return this.urlToImg(screenshot).then(img =>
      this.urlToImg(this.cropImage(img))
    );
  };

  setupWebcam() {
    navigator.mediaDevices
      .getUserMedia({video: true})
      .then(() => {
        this.setState({
          cameraConnected: true,
          isDetecting: false
        });
        if (this.props.onConnect) this.props.onConnect();
      })
      .catch(() => {
        this.setState({cameraConnected: false, isDetecting: false});
      });
  }

  async urlToImg(url) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = url;
    });
  }

  cropImage(img) {
    this.ctx.drawImage(
      img,
      -(img.width - this.props.imgSize) / 2,
      -(img.height - this.props.imgSize) / 2
    );
    return this.canvas.toDataURL();
  }

  success = callback => {
    if (typeof callback === 'function') this.callback = callback;
    if (this.state.animation >= 1) return this.callback();
    this.setState(prevState => {
      return {animation: prevState.animation + 0.05};
    });
    requestAnimationFrame(this.success);
  };

  componentDidMount() {
    if (!navigator.mediaDevices) return;
    this.setupWebcam();
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.props.imgSize;
    this.canvas.height = this.props.imgSize;
    this.ctx = this.canvas.getContext('2d');
  }

  componentWillUnmount() {
    clearInterval(this.ticker);
  }

  render() {
    if (this.state.isDetecting) {
      return null;
    }

    if (this.state.cameraConnected) {
      return (
        <div className="webcam-container">
          <Webcam
            audio={false}
            width="100%"
            height="100%"
            ref={this.webcam}
            screenshotFormat="image/jpeg"
            className="webcam-capture--video"
            screenshotWidth={this.props.imgSize * (4 / 3)}
          />
          <ViewFinder animation={this.state.animation} />
        </div>
      );
    }
    return <Notification message="failed to load video feed" isError={true} />;
  }
}

WebcamCapture.propTypes = {
  imgSize: PropTypes.number.isRequired,
  onConnect: PropTypes.func
};

export default WebcamCapture;
