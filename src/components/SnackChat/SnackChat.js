import React, {Component} from 'react';
import WebcamCapture from '../WebcamCapture/WebcamCapture';
import PropTypes from 'prop-types';
import * as posenet from '@tensorflow-models/posenet';
import './SnackChat.css';
import Logo from '../Logo/Logo';

class SnackChat extends Component {
	initialTime = new Date();
	svgHeight = 100; // TODO make webcam width and selected item props + retrieve h + w from svg for given item
	svgWidth = 50;
	feedWidth = 400;
	feedRef = React.createRef();
	canvas = React.createRef();

	state = {
		counter: 5,
		overlayX: undefined,
		overlayY: undefined,
		overlayScale: 1,
		overlayRotation: 0
	};

	loadPosenet = async () => {
		this.net = await posenet.load(0.5);
	};

	componentDidMount() {
		this.timer = setInterval(this.tick, 1000);
		this.loadPosenet();
	}

	tick = () => {
		if (this.state.counter > -1)
			this.setState(prevState => ({counter: prevState.counter - 1}));
		else clearInterval(this.timer);
	};

	handleImg = async img => {
		const ctx = this.canvas.current.getContext('2d');
		ctx.drawImage(img, 0, 0);

		const pose = await this.net.estimateSinglePose(
			img,
			0.5,
			false,
			16
		);

		let leftShoulderPosition = pose.keypoints[5].position;
		let rightShoulderPosition = pose.keypoints[6].position;

		ctx.beginPath();
		ctx.moveTo(leftShoulderPosition.x, leftShoulderPosition.y);
		ctx.lineTo(rightShoulderPosition.x, rightShoulderPosition.y);
		ctx.strokeStyle = 'red';
		ctx.stroke();

		/* 		if (this.state.counter === 0) {
			const canvas = document.createElement('canvas');
			canvas.width = this.feedWidth;
			canvas.height = this.feedWidth;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0);
			console.log(this.feedRef.current);
			window.test = this.feedRef.current;
			
			const overlay = new Image();
			overlay.onload = () => {
				console.log(overlay)
				ctx.drawImage(overlay, 0, 0);
				document.body.appendChild(canvas);
			}
			overlay.src = 'data:image/svg+xml;utf8,' + this.feedRef.current.outerHTML;
			console.log('data:image/svg+xml;utf8,' + this.feedRef.current.outerHTML);
		} else {
			const pose = await this.net.estimateSinglePose(
				img,
				0.5,
				true,
				16,
				5,
				0.7
			);
			let leftShoulderPosition = pose.keypoints[5].position;
			let rightShoulderPosition = pose.keypoints[6].position;

			this.setState({
				overlayX:
					this.feedWidth -
					(rightShoulderPosition.x + leftShoulderPosition.x) / 2 -
					this.svgWidth / 2,
				overlayY:
					(leftShoulderPosition.y + rightShoulderPosition.y) / 2 -
					this.svgHeight / 2,
				overlayScale:
					((leftShoulderPosition.x - rightShoulderPosition.x) /
						this.feedWidth) *
					4, // there must be a better way of calculating this
				overlayRotation:
					(-360 / 2) *
					Math.PI *
					Math.atan(
						(leftShoulderPosition.y - rightShoulderPosition.y) /
							(rightShoulderPosition.x + leftShoulderPosition.x)
					)
			});
		} */
	};

	render() {
		let showOverlay =
			this.state.overlayX !== undefined &&
			this.state.overlayY !== undefined;

		return (
			<div>
				<header>
					<Logo />
					Smile, you are on snackchat:
					{this.state.counter}
				</header>
				<div className="feed">
					<canvas
						width={this.feedWidth}
						height={this.feedWidth}
						ref={this.canvas}
					/>
					<WebcamCapture
						style={{display: 'none'}}
						imgSize={400}
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
