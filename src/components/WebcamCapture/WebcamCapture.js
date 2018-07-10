import React from 'react';
import './WebcamCapture.css';
import Webcam from 'react-webcam';
import {Notification} from './../Notification/Notification';
import PropTypes from 'prop-types';

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
					ref={props.cameraRef}
					screenshotFormat="image/jpeg"
					width={width}
					videoConstraints={videoConstraints}
					className="videoStream"
					screenshotWidth={224}
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
