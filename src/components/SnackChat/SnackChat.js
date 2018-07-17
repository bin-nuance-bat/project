import React, {Component} from 'react';
import WebcamCapture from '../WebcamCapture/WebcamCaptureContainer';
import PropTypes from 'prop-types';
import * as posenet from '@tensorflow-models/posenet';
import './SnackChat.css';
import Logo from '../Logo/Logo';

class SnackChat extends Component {
	initialTime = new Date();

	constructor(props) {
		super(props);
		this.state = {counter: 5};
	}

	loadPosenet = async () => {
		this.net = await posenet.load(0.5);
	};

	componentDidMount() {
		// this.timer = setInterval(this.tick, 1000);
		this.loadPosenet();
	}

	tick = () => {
		if (this.state.counter > 0)
			this.setState(prevState => ({counter: prevState.counter - 1}));
		else clearInterval(this.timer);
	};

	handleImg = async img => {
		if (this.state.counter === 0) {
			// TODO combine overlay into final image to upload + save in store for later upload
			this.props.setSnackChat(img.src);
			this.props.history.push('/slackName');
		} else {
			const pose = await this.net.estimateSinglePose(img, 0.5, true, 16);
			// TODO calculate overlay position + display
		}
	};

	render() {
		return (
			<div>
				<header>
					<Logo />
					Smile, you are on snackchat:
					{this.state.counter}
				</header>
				<div className="feed">
					<div className="overlay">overlay svg goes here</div>
					<WebcamCapture onImgLoad={this.handleImg} interval={333} />
				</div>
			</div>
		);
	}
}

SnackChat.propTypes = {
	setSnackChat: PropTypes.func.isRequired
};

export default SnackChat;
