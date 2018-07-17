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
		this.state = {
			counter: 5,
			overlay: (
				<svg width="100" height="100">
					<circle cx="10" cy="10" r="10" fill="yellow" />
				</svg>
			), // TODO make this a prop which is svg matching the chosen item
			overlayX: 0,
			overlayY: 0
		};
	}

	loadPosenet = async () => {
		this.net = await posenet.load(0.5);
	};

	componentDidMount() {
		this.timer = setInterval(this.tick, 1000);
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
			console.log(pose.keypoints[0].score);
			this.setState({
				overlayX: 300 - pose.keypoints[0].position.x,
				overlayY: pose.keypoints[0].position.y
			});
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
					<div
						className="overlay"
						style={{
							left: `${this.state.overlayX}px`,
							top: `${this.state.overlayY}px`
						}}>
						{this.state.overlay}
					</div>
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
