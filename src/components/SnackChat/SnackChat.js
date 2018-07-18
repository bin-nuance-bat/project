import React, {Component} from 'react';
import WebcamCapture from '../WebcamCapture/WebcamCaptureContainer';
import PropTypes from 'prop-types';
import * as posenet from '@tensorflow-models/posenet';
import './SnackChat.css';
import Logo from '../Logo/Logo';
import html2canvas from 'html2canvas';

class SnackChat extends Component {
	initialTime = new Date();
	svgHeight = 100; // TODO make webcam width and selected item props + retrieve h + w from svg for given item
	svgWidth = 50;
	feedWidth = 300;
	feedRef = React.createRef();

	constructor(props) {
		super(props);

		this.state = {
			counter: 5,
			overlayX: undefined,
			overlayY: undefined,
			overlayScale: 1,
			overlayRotation: 0
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
			await html2canvas(this.feedRef.current).then(canvas => {
				let snackchatSrc = canvas.toDataURL('image/png');
				this.props.setSnackChat(snackchatSrc);
			});

			this.props.history.push('/slackName');
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
		}
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
				<div ref={this.feedRef} className="feed">
					{showOverlay && (
						<div
							className="overlay"
							style={{
								left: this.state.overlayX,
								top: this.state.overlayY,
								transform: `rotate(${
									this.state.overlayRotation
								}deg) scale(${this.state.overlayScale})`
							}}>
							<svg width={this.svgWidth} height={this.svgHeight}>
								<rect
									width={this.svgWidth}
									height={this.svgHeight}
									fill="yellow"
								/>
							</svg>
						</div>
					)}
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
