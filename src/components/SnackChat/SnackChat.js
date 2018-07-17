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
				<svg width="2" height="500">
					<rect width="2" height="500" fill="yellow" />
				</svg>
			), // TODO make this a prop which is svg matching the chosen item
			overlayX: 0,
			overlayY: 0,
			overlayRotation: 0
		};
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
			let leftShoulderPosition = pose.keypoints[5].position;
			let rightShoulderPosition = pose.keypoints[6].position;

			this.setState({
				overlayX:
					300 -
					(rightShoulderPosition.x + leftShoulderPosition.x) / 2,
				overlayY:
					(leftShoulderPosition.y + rightShoulderPosition.y) / 2,
				overlayRotation:
					(-360 / 2) *
					Math.PI *
					Math.atan(
						(leftShoulderPosition.y - rightShoulderPosition.y) /
							(rightShoulderPosition.x + leftShoulderPosition.x)
					)
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
							top: `${this.state.overlayY}px`,
							transform: `rotate(${
								this.state.overlayRotation
							}deg)`
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
