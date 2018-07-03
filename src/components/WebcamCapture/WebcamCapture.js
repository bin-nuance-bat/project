import React, {Component} from 'react';
import './WebcamCapture.css';
import Webcam from 'react-webcam';

class WebcamCapture extends Component {
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
		if (this.state.cameraConnected) {
			const height = 400;
			const width = 400;

			const videoConstraints = {
				width,
				height,
				facingMode: 'user'
			};

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
		} else return <div>Cannot access camera</div>;
	}
}

export default WebcamCapture;
