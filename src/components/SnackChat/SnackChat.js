import React from 'react';
import Webcam from 'react-webcam';

class SnackChat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {videoSrc: null};
		window.setTimeout(this.takePhoto, 5000);
	}

	componentDidMount() {
		if (navigator.getUserMedia) {
			navigator.getUserMedia(
				{video: true},
				v => this.handleVideo(v),
				function() {}
			);
		}
	}

	takePhoto() {
		this.getCanvas();
	}

	handleVideo(stream) {
		this.setState({videoSrc: window.URL.createObjectURL(stream)});
	}

	render() {
		return (
			<div>
				<video src={this.state.videoSrc} autoPlay="true" />
			</div>
		);
	}
}

export default SnackChat;
