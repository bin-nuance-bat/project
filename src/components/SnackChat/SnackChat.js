import React from 'react';
import Webcam from 'react-webcam';
import Notification from '../Notification/Notification';

const height = 400;
const width = 400;

class SnackChat extends React.Component {
	state = {
		isDetecting: true,
		cameraConnected: false
	};

	webcam = React.createRef();

	setupScreenshotInterval() {
		this.ticker = setInterval(() => {
			const img = new Image(224, 224);
			img.src = this.webcam.current.getScreenshot();

			img.onload = () => {
				console.log(img);
			};
		}, 500);
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
					<header>Smile for SnackChat</header>
					<Webcam
						audio={false}
						height={height}
						ref={this.webcam}
						screenshotFormat="image/jpeg"
						width={width}
						className="videoStream"
						screenshotWidth={224}
					/>
				</div>
			);
		}
		return (
			<Notification message="failed to load video feed" isError={true} />
		);
	}
}

export default SnackChat;
