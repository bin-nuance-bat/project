import React, {Component} from 'react';
import WebcamCapture from '../WebcamCapture/WebcamCapture';
import PropTypes from 'prop-types';
import * as posenet from '@tensorflow-models/posenet';
import Logo from '../Logo/Logo';
import can from '../../assets/coca-cola-can.svg';
import './SnackChat.css';

const FEED_SIZE = 480;
const CAPTURE_SIZE = 200;

function clipEllipse(ctx, centerX, centerY, width, height) {
	ctx.beginPath();
	ctx.moveTo(centerX, centerY - height / 2);
	ctx.bezierCurveTo(
		centerX + width / 2,
		centerY - height / 2,
		centerX + width / 2,
		centerY + height / 2,
		centerX,
		centerY + height / 2
	);
	ctx.bezierCurveTo(
		centerX - width / 2,
		centerY + height / 2,
		centerX - width / 2,
		centerY - height / 2,
		centerX,
		centerY - height / 2
	);
	ctx.clip();
}

function normalise({x, y}) {
	x *= FEED_SIZE / CAPTURE_SIZE;
	y *= FEED_SIZE / CAPTURE_SIZE;
	return {x, y};
}

function calcAngles(bodyPart) {
	bodyPart.left = normalise(bodyPart.left);
	bodyPart.right = normalise(bodyPart.right);
	bodyPart.width = bodyPart.left.x - bodyPart.right.x;
	bodyPart.height = bodyPart.right.y - bodyPart.left.y;
	bodyPart.span = Math.sqrt(bodyPart.width ** 2 + bodyPart.height ** 2);
	bodyPart.angle = Math.atan(bodyPart.width / bodyPart.height);
	bodyPart.angle += ((bodyPart.height > 0 ? -1 : 1) * Math.PI) / 2;
	return bodyPart;
}

class SnackChat extends Component {
	webcam = React.createRef();
	canvas = React.createRef();

	state = {
		counter: 5,
		captured: false
	};

	componentDidMount() {
		posenet.load(0.5).then(net => (this.net = net));
		this.ctx = this.canvas.current.getContext('2d');
		this.ctx.lineWidth = 5;
		this.ctx.strokeStyle = 'red';
		requestAnimationFrame(this.update);
		this.filter = new Image();
		this.filter.src = can;
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
		let frame;

		try {
			frame = await this.webcam.current.requestScreenshot();
		} catch (e) {
			requestAnimationFrame(this.update);
			return;
		}

		const pose = await this.net.estimateSinglePose(frame, 0.5, true, 8);

		const body = {
			ears: calcAngles({
				left: pose.keypoints[3].position,
				right: pose.keypoints[4].position
			}),
			shoulders: calcAngles({
				left: pose.keypoints[5].position,
				right: pose.keypoints[6].position
			})
		};

		// Video background
		this.ctx.save();
		this.ctx.scale(-1, 1);
		this.ctx.drawImage(
			video,
			(video.videoWidth - this.canvas.current.width) / 2 -
				video.videoWidth,
			-(video.videoHeight - this.canvas.current.height) / 2
		);
		this.ctx.restore();

		// Filter
		this.ctx.save();
		this.ctx.rotate(body.shoulders.angle);
		this.ctx.drawImage(
			this.filter,
			body.shoulders.right.x -
				body.shoulders.span * 1.5 +
				body.shoulders.span * body.shoulders.angle,
			body.shoulders.right.y - body.shoulders.span * 1.5,
			body.shoulders.span * 4,
			body.shoulders.span * 4
		);
		this.ctx.restore();

		// Clip face
		this.ctx.save();
		this.ctx.translate(
			body.ears.right.x + body.ears.width / 2,
			body.ears.right.y + body.ears.height * body.ears.angle
		);
		this.ctx.rotate(body.ears.angle);
		clipEllipse(this.ctx, 0, 0, body.ears.span * 1.5, body.ears.span * 1.5);
		this.ctx.resetTransform();

		// Re-draw face
		this.ctx.scale(-1, 1);
		this.ctx.drawImage(
			video,
			(video.videoWidth - this.canvas.current.width) / 2 -
				video.videoWidth,
			-(video.videoHeight - this.canvas.current.height) / 2
		);
		this.ctx.restore();

		requestAnimationFrame(this.update);
	};

	onConnect = () => {
		this.timer = setInterval(
			() => this.setState({counter: this.state.counter - 1}),
			1000
		);
	};

	render() {
		return (
			<div>
				<header>
					<Logo />
					Smile, you are on snackchat:
					{this.state.counter}
				</header>
				<div className="snackchat-body">
					<canvas
						ref={this.canvas}
						width={FEED_SIZE}
						height={FEED_SIZE}
					/>
				</div>
				<div style={{display: 'none'}}>
					<WebcamCapture
						ref={this.webcam}
						imgSize={CAPTURE_SIZE}
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
