import React, {Component} from 'react';
import './WebcamCapture.css';
import WebcamCapture from './WebcamCapture';
import Model from '../../utils/model';
import PropTypes from 'prop-types';
import getStore from '../../utils/honestyStore';

const ML_THRESHOLD = 0.06;

class WebcamCaptureContainer extends Component {
	state = {
		isDetecting: true,
		cameraConnected: false
	};

	constructor(props) {
		super(props);
		this.webcam = React.createRef();
		getStore().then(res => (this.store = res));

		if (this.props.loadModel) {
			this.model = new Model();
			this.model.load();
		}
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
									item.id !== ''
								) {
									this.props.confirmMatch(item.id, img.src);
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

		return (
			<WebcamCapture
				cameraConnected={this.state.cameraConnected}
				cameraRef={this.webcam}
			/>
		);
	}
}

WebcamCaptureContainer.propTypes = {
	loadModel: PropTypes.bool,
	confirmMatch: PropTypes.func.isRequired
};

export default WebcamCaptureContainer;
