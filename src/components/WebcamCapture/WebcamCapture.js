import React, {Component} from 'react';
import './WebcamCapture.css';
import Webcam from 'react-webcam';
import Notification from './../Notification/Notification';
import PropTypes from 'prop-types';
import Model from './../../utils/model';

const ML_THRESHOLD = 0.06;
const height = 400;
const width = 400;

class WebcamCapture extends Component {
	state = {
		isDetecting: true,
		cameraConnected: false
	};

	webcam = React.createRef();
	model = new Model();

	setupScreenshotInterval() {
		this.ticker = setInterval(() => {
			const img = new Image(224, 224);
			img.src = this.webcam.current.getScreenshot();

			img.onload = () => {
				this.model.predict(img).then(item => {
					if (
						item.value > ML_THRESHOLD &&
						item.id !== '' &&
						!this.props.prediction
					) {
						this.props.setPrediction(item.id, img.src);
					}
				});
			};
		}, 1000);
	}

	setupWebcam() {
		navigator.mediaDevices
			.getUserMedia({video: true})
			.then(() => {
				this.setState({
					cameraConnected: true,
					isDetecting: false
				});
				this.setupScreenshotInterval();
			})
			.catch(() =>
				this.setState({cameraConnected: false, isDetecting: false})
			);
	}

	componentDidMount() {
		this.model.load();

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
				<div>
					<Webcam
						audio={false}
						height={height}
						ref={this.webcam}
						screenshotFormat="image/jpeg"
						width={width}
						className="videoStream"
						screenshotWidth={300}
					/>
				</div>
			);
		}
		return (
			<Notification message="failed to load video feed" isError={true} />
		);
	}
}

WebcamCapture.propTypes = {
	setPrediction: PropTypes.func.isRequired,
	prediction: PropTypes.object
};

export default WebcamCapture;
