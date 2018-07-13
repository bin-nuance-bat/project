import React, {Component} from 'react';
import WebcamCapture from '../WebcamCapture/container';

class SnackChat extends Component {
	handleImg = img => {};

	render() {
		return (
			<div>
				<header>Smile, you are own snackcaht</header>
				<WebcamCapture onImgLoad={this.handleImg} interval={1000} />
			</div>
		);
	}
}

export default SnackChat;
