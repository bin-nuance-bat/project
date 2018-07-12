import React from 'react';

class SnackChat extends React.Component {
	state = {videoSrc: null};

	componentDidMount() {
		if (navigator.getUserMedia) {
			navigator.getUserMedia(
				{video: true},
				v => this.handleVideo(v),
				function() {}
			);
		}
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
