import React, {Component} from 'react';
import './WebcamCapture.css';
import Webcam from 'react-webcam';
import Notification from './../Notification/Notification';
import PropTypes from 'prop-types';

const height = 300;
const width = 400;

class WebcamCapture extends Component {
	state = {
		isDetecting: true,
		cameraConnected: false
	};

	webcam = React.createRef();

	isConnected = () => {
		return this.state.cameraConnected;
	}

	requestScreenshot = () => {
		return new Promise(resolve => {
			const img = new Image(224, 224);
			img.onload = () => {
				resolve(img);
			}
			img.src = this.webcam.current.getScreenshot();
		});
	}

	setupWebcam() {
		navigator.mediaDevices
			.getUserMedia({video: true})
			.then(() => {
				this.setState({
					cameraConnected: true,
					isDetecting: false
				});
				if (this.props.onConnect) this.props.onConnect();
				console.log('Connected');
			})
			.catch((e) => {
				console.log(e);
				this.setState({cameraConnected: false, isDetecting: false})
			});
	}

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

		if (this.state.cameraConnected) {
			return (
				<Webcam
					audio={false}
					height={height}
					ref={this.webcam}
					screenshotFormat="image/jpeg"
					width={width}
					className="videoStream"
					screenshotWidth={300}
				/>
			);
		}
		return (
			<Notification message="failed to load video feed" isError={true} />
		);
	}
}

export default WebcamCapture;
