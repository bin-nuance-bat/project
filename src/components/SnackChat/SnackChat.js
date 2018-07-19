import React, {Component} from 'react';
import WebcamCapture from '../WebcamCapture/WebcamCapture';
import PropTypes from 'prop-types';
import * as posenet from '@tensorflow-models/posenet';
import './SnackChat.css';
import Logo from '../Logo/Logo';

class SnackChat extends Component {
	feedWidth = 400;
	webcam = React.createRef();
	canvas = React.createRef();

	state = {
		counter: 5,
		captured: false
	};

	componentDidMount() {
		posenet.load(0.5).then(net => this.net = net);
		this.ctx = this.canvas.current.getContext('2d');
		this.ctx.lineWidth = 5;
		this.ctx.strokeStyle = 'red';
		requestAnimationFrame(this.update);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	update = async () => {
		if (!this.webcam.current.webcam.current || !this.net) {
			requestAnimationFrame(this.update);
			return;
		}

		if (this.state.counter === 0 && !this.state.captured) {
			clearInterval(this.timer);
			this.setState({captured: true});
			this.props.setSnackChat(this.canvas.current.toDataURL());
			this.props.history.push('/slackname');
			return;
		}
		
		const video = this.webcam.current.webcam.current.video;

		this.ctx.save();
		this.ctx.scale(-1, 1);
		this.ctx.drawImage(video, (video.videoWidth - video.width) / 2 - video.videoWidth, -(video.videoHeight - video.height) / 2);
		this.ctx.restore();
	
		const pose = await this.net.estimateSinglePose(
			this.webcam.current.webcam.current.video,
			0.5,
			true,
			16
		);

		let leftShoulderPosition = pose.keypoints[5].position;
		let rightShoulderPosition = pose.keypoints[6].position;

		this.ctx.beginPath();
		this.ctx.moveTo(leftShoulderPosition.x, leftShoulderPosition.y);
		this.ctx.lineTo(rightShoulderPosition.x, rightShoulderPosition.y);
		this.ctx.stroke();

		requestAnimationFrame(this.update);
	};

	onConnect = () => {
		this.timer = setInterval(() => this.setState({counter: this.state.counter - 1}), 1000);
	}

	render() {
		return (
			<div>
				<header>
					<Logo />
					Smile, you are on snackchat:
					{this.state.counter}
				</header>
				<canvas
					width={this.feedWidth}
					height={this.feedWidth}
					ref={this.canvas}
				/>
				<div style={{display: 'none'}}>
					<WebcamCapture
						ref={this.webcam}
						imgSize={400}
						onConnect={this.onConnect}
					/>
				</div>
			</div>
		);
	}
}

SnackChat.propTypes = {
	setSnackChat: PropTypes.func.isRequired
};

export default SnackChat;
