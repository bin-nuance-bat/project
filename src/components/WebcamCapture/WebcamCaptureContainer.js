import React, {Component} from 'react';
import './WebcamCapture.css';
import WebcamCapture from './WebcamCapture';

class WebcamCaptureContainer extends Component {
	state = {
		cameraConnected: false
	};

	constructor(props) {
		super(props);
		this.webcam = React.createRef();
		this.capture = this.capture.bind(this);
	}

	capture() {
		return this.webcam.current.getScreenshot();
	}

	componentDidMount() {
		navigator.mediaDevices
			.getUserMedia({video: true})
			.then(connected => this.setState({cameraConnected: true}))
			.catch(err => this.setState({cameraConnected: false}));
	}

	render() {
		return (
			<WebcamCapture
				cameraConnected={this.state.cameraConnected}
				cameraRef={this.webcam}
			/>
		);
	}
}

export default WebcamCaptureContainer;
