import React, {Component} from 'react';
import './WebcamCapture.css';
import Webcam from 'react-webcam';

const WebcamCapture = props => {
	const height = 400;
	const width = 400;

	const videoConstraints = {
		width,
		height,
		facingMode: 'user'
	};

	if (props.cameraConnected) {
		return (
			<div>
				<Webcam
					audio={false}
					height={height}
					ref={props.ref}
					screenshotFormat="image/jpeg"
					width={width}
					videoConstraints={videoConstraints}
					className="videoStream"
					screenshotWidth={224}
				/>
			</div>
		);
	}
	return <div>Cannot access camera</div>;
};

export default WebcamCapture;
