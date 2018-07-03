import React, {Component} from 'react';
import './WebcamCapture.css';
import Webcam from 'react-webcam';

class WebcamCapture extends React.Component {
	constructor(props) {
		super(props);
		this.webcam = React.createRef();
		this.capture = this.capture.bind(this);
	}

	capture() {
		const imageSrc = this.webcam.current.getScreenshot();
	}

	render() {
		const height = 400;
		const width = 400;

		const videoConstraints = {
			width,
			height,
			facingMode: 'user'
		};

		if (!this.webcam.current) return <div>Cannot access camera</div>;

		return (
			<div>
				<Webcam
					audio={false}
					height={height}
					ref={this.webcam}
					screenshotFormat="image/jpeg"
					width={width}
					videoConstraints={videoConstraints}
					className="videoStream"
					screenshotWidth={224}
				/>
			</div>
		);
	}
}

export default WebcamCapture;
