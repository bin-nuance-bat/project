import React, { Component } from 'react';
import './WebcamCapture.css';
import Webcam from 'react-webcam';

const WebcamCapture = () => {

	const videoConstraints = {
		width: 400,
		height: 400,
		facingMode: 'user',
	  };

    return(
		<Webcam className="videoStream" audio={false} height={400} width={400} videoConstraints={videoConstraints} />
	) ;
}

export default WebcamCapture
