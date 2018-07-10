import React, {Component} from 'react';
import './WebcamCapture.css';
import Webcam from 'react-webcam';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import PropTypes from 'prop-types';
import getStore from './../../utils/honestyStore';
import Model from './../../utils/model';

const ML_THRESHOLD = 0.06;
const height = 400;
const width = 400;

const videoConstraints = {
	width,
	height,
	facingMode: 'user'
};

class WebcamCapture extends Component {
	state = {
		isDetecting: true,
		cameraConnected: false
	};

	constructor(props) {
		super(props);
		this.webcam = React.createRef();
		getStore().then(res => (this.store = res));
		this.model = new Model();
		this.model.load();
	}

	componentDidMount() {
		if (navigator.mediaDevices) {
			navigator.mediaDevices
				.getUserMedia({video: true})
				.then(() => {
					this.setState({
						cameraConnected: true,
						isDetecting: false
					});

					this.ticker = setInterval(() => {
						const img = new Image(224, 224);
						img.src = this.webcam.current.getScreenshot();

						img.onload = () => {
							this.model.predict(img).then(item => {
								if (
									item.value > ML_THRESHOLD &&
									item.id !== '' &&
									!this.props.prediction
								) {
									this.props.setPrediction(item.id, img.src);
								}
							});
						};
					}, 1000);
				})
				.catch(() =>
					this.setState({cameraConnected: false, isDetecting: false})
				);
		}
	}

	componentWillUnmount() {
		clearInterval(this.ticker);
	}

	render() {
		if (this.state.isDetecting) {
			return null;
		}

		if (this.state.cameraConnected) {
			return (
				<div>
					<Webcam
						audio={false}
						height={height}
						ref={this.webcam}
						screenshotFormat="image/jpeg"
						width={width}
						videoConstraints={videoConstraints}
						className="videoStream"
						screenshotWidth={224}
					/>
				</div>
			);
		}
		return <ErrorMessage text="failed to load video feed" />;
	}
}

WebcamCapture.propTypes = {
	setPrediction: PropTypes.func.isRequired,
	prediction: PropTypes.object
};

export default WebcamCapture;
