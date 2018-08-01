import React, {Component} from 'react';
import Webcam from 'react-webcam';
import Notification from './../Notification/Notification';
import PropTypes from 'prop-types';
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
    cameraConnected: false
  };

  webcam = React.createRef();

  requestFakeScreenshot = () =>
    new Promise((resolve, reject) => {
      const input = this.fileInput;
      if (input.files == null || input.files[0] == null) {
        return reject(new Error('No files present'));
      }
      const reader = new FileReader();
      reader.onload = ({target: {result}}) => {
        resolve(result);
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
      return this.state.fakeWebcam ? (
        <input
          type="file"
          accept="image/*"
          ref={fileInput => (this.fileInput = fileInput)}
        />
      ) : (
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
