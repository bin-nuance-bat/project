import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from '../Webcam/Webcam';
import ViewFinder from './ViewFinder';

import './WebcamCapture.css';

class WebcamCapture extends Component {
  constructor() {
    super();
    global.injectWebcam = ({isDetecting}) => {
      this.setState({
        fakeWebcam: true,
        isDetecting
      });
      if (this.props.onConnect) this.props.onConnect();
    };
  }

  state = {
    fakeWebcam: false,
    isDetecting: true,
    animation: 0
  };

  webcam = React.createRef();
  viewFinder = React.createRef();
  fileInput = React.createRef();

  getCanvas = () => {
    return this.webcam.current.getCanvas();
  };

  secondAttempt = false;
  setupWebcam() {
    navigator.mediaDevices
      .getUserMedia({video: true})
      .then(() => {
        this.setState({
          isDetecting: false
        });
        if (this.props.onConnect) this.props.onConnect();
      })
      .catch(() => {
        if (!this.secondAttempt) {
          this.secondAttempt = true;
          this.setupWebcam();
        } else {
          this.props.onFail();
        }
      });
  }

  success = callback => this.viewFinder.current.success(callback);

  componentDidMount() {
    if (!navigator.mediaDevices) return;
    this.setupWebcam();
  }

  componentWillUnmount() {
    clearInterval(this.ticker);
  }

  render() {
    if (this.state.isDetecting) {
      return null;
    }

    return (
      <div className="webcam-container">
        {!this.state.fakeWebcam && (
          <Webcam
            audio={false}
            width="100%"
            height="100%"
            ref={this.webcam}
            screenshotFormat="image/jpeg"
            className="webcam-capture--video"
            screenshotWidth={this.props.imgSize}
          />
        )}
        <ViewFinder ref={this.viewFinder} />
        {this.state.fakeWebcam && (
          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            ref={this.fileInput}
          />
        )}
      </div>
    );
  }
}

WebcamCapture.propTypes = {
  imgSize: PropTypes.number.isRequired,
  onConnect: PropTypes.func,
  onFail: PropTypes.func.isRequired
};

export default WebcamCapture;
