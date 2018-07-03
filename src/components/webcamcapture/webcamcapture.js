import React, { Component } from 'react';
import './webcamcapture.css';
import Webcam from 'react-webcam';

class WebcamCapture extends Component {

    render() {
        return <Webcam className="videoStream"/>
    }
}

export default WebcamCapture