import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Webcam from 'react-webcam';
import Notification from '../Notification/Notification';
import ViewFinder from './ViewFinder';

import './WebcamCapture.css';

class WebcamCapture extends Component {
  constructor() {
    super();
    global.injectWebcam = ({isDetecting, cameraConnected}) => {
      this.setState({
        fakeWebcam: true,
        isDetecting,
        cameraConnected
      });
      if (this.props.onConnect) this.props.onConnect();
    };
  }

  state = {
    fakeWebcam: false,
    isDetecting: true,
    cameraConnected: false,
    animation: 0
  };

  webcam = React.createRef();
  viewFinder = React.createRef();
  fileInput = React.createRef();

  requestFakeScreenshot = () =>
    new Promise((resolve, reject) => {
      const input = this.fileInput.current;
      if (input.files == null || input.files[0] == null) {
        return reject(new Error('No files present'));
      }
      const reader = new FileReader();
      reader.onload = event => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(input.files[0]);
    });

  requestWebcamScreenshot = async () => {
    if (!this.webcam.current) {
      throw new Error('Failed to load webcam.');
    }
    const screenshot = await this.webcam.current.getScreenshot();
    if (screenshot === null) {
      throw new Error('Failed to load webcam.');
    }
    return screenshot;
  };

  requestScreenshot = async () => {
    const screenshot = this.state.fakeWebcam
      ? this.requestFakeScreenshot()
      : this.requestWebcamScreenshot();
    const image = await this.urlToImg(await screenshot);
    return await this.urlToImg(this.cropImage(image));
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

  success = callback => this.viewFinder.current.success(callback);

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
          {this.state.fakeWebcam ? (
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              ref={this.fileInput}
            />
          ) : (
            <Webcam
              audio={false}
              width="100%"
              height="100%"
              ref={this.webcam}
              screenshotFormat="image/jpeg"
              className="webcam-capture--video"
              screenshotWidth={this.props.imgSize * (4 / 3)}
            />
          )}
          <ViewFinder ref={this.viewFinder} />
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
