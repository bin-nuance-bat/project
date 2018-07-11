import React from 'react';
import Webcam from 'react-webcam';
import Notification from './../Notification/Notification';
import PropTypes from 'prop-types';
import './WebcamCapture.css';

const WebcamCapture = props => {
	const height = 640;
	const width = 480;

	const videoConstraints = {
		audio: false
	};

	if (props.cameraConnected) {
		return (
			<div className="container">
				<Webcam
					audio={false}
					ref={props.cameraRef}
					screenshotFormat="image/jpeg"
					//videoConstraints={videoConstraints}
					className="videoStream"
					screenshotWidth={300}
				/>
			</div>
		);
	}
	return <Notification message="failed to load video feed" isError={true} />;
};

WebcamCapture.propTypes = {
	cameraConnected: PropTypes.bool.isRequired,
	cameraRef: PropTypes.object.isRequired
};

export default WebcamCapture;
