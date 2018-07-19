import React, {Component} from 'react';
import WebcamCapture from '../WebcamCapture/WebcamCapture';
import PropTypes from 'prop-types';
import * as posenet from '@tensorflow-models/posenet';
import Logo from '../Logo/Logo';
import can from '../../assets/coca-cola-can.svg';

function drawEllipse(ctx, centerX, centerY, width, height) {
	
	ctx.beginPath();
	
	ctx.moveTo(centerX, centerY - height/2); // A1
	
	ctx.bezierCurveTo(
	  centerX + width/2, centerY - height/2, // C1
	  centerX + width/2, centerY + height/2, // C2
	  centerX, centerY + height/2); // A2
  
	ctx.bezierCurveTo(
	  centerX - width/2, centerY + height/2, // C3
	  centerX - width/2, centerY - height/2, // C4
	  centerX, centerY - height/2); // A1
   
	ctx.clip();
  }

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
		this.filter = new Image()
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
	
		const pose = await this.net.estimateSinglePose(
			this.webcam.current.webcam.current.video,
			0.5,
			true,
			16
		);

		const normalise = ({x, y}) => {
			x -= video.width / 2;
			x *= (video.videoWidth / video.width);
			x += video.width / 2;
			return {x, y};
		}

		const body = {
			ears: {
				left: normalise(pose.keypoints[3].position),
				right: normalise(pose.keypoints[4].position)
			},
			shoulders: {
				left: normalise(pose.keypoints[5].position),
				right: normalise(pose.keypoints[6].position)
			}
		}

		// Video background
		this.ctx.save();
		this.ctx.scale(-1, 1);
		this.ctx.drawImage(video, (video.videoWidth - video.width) / 2 - video.videoWidth, -(video.videoHeight - video.height) / 2);
		this.ctx.restore();
		// Filter
		const shoulderX = body.shoulders.left.x - body.shoulders.right.x;
		const shoulderY = body.shoulders.right.y - body.shoulders.left.y;
		const shoulderGap = Math.sqrt(shoulderX**2 + shoulderY**2);
		let shoulderAngle = Math.atan(shoulderX / shoulderY);

		shoulderAngle += ((shoulderY > 0) ? -1 : 1) * Math.PI / 2;

		this.ctx.save();

		this.ctx.rotate(shoulderAngle);
		
		this.ctx.drawImage(
			this.filter,
			body.shoulders.right.x - shoulderGap * 1.5 + (shoulderGap * shoulderAngle),
			body.shoulders.right.y - shoulderGap * 1.5,
			shoulderGap * 4,
			shoulderGap * 4
		);

		this.ctx.restore();

		// Face calculations
		const earX = body.ears.left.x - body.ears.right.x;
		const earY = body.ears.right.y - body.ears.left.y;

		const earGap = Math.sqrt(earX**2 + earY**2);
		let headAngle = Math.atan(earX / earY);

		headAngle = (earY < 0)
			? (headAngle + Math.PI / 2)
			: (headAngle - Math.PI / 2);
		
		// Face clip
		this.ctx.save();
		this.ctx.translate(body.ears.right.x + earX / 2, body.ears.right.y + earY * headAngle);
		this.ctx.rotate(headAngle);
		drawEllipse(this.ctx, 0, 0, earGap * 1.3, earGap * 1.3);
		this.ctx.resetTransform();

		// Re-draw face
		this.ctx.scale(-1, 1);
		this.ctx.drawImage(video, (video.videoWidth - video.width) / 2 - video.videoWidth, -(video.videoHeight - video.height) / 2);
		this.ctx.restore();

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
