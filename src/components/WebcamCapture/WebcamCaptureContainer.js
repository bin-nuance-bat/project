import React, {Component} from 'react';
import './WebcamCapture.css';
import WebcamCapture from './WebcamCapture';
import Model from '../../utils/model';

const ML_THRESHOLD = 0.1;
const ML_UNKNOWN = 13;

class WebcamCaptureContainer extends Component {
	state = {
		cameraConnected: false
	};

	constructor(props) {
		super(props);
		this.webcam = React.createRef();
		this.model = new Model();
		this.model.load();
	}

	componentDidMount() {
		if (navigator.mediaDevices) {
			navigator.mediaDevices
				.getUserMedia({video: true})
				.then(() => {
					this.setState({cameraConnected: true});

					this.ticker = setInterval(() => {
						const img = new Image(224, 224);
						img.src = this.webcam.current.getScreenshot();

						img.onload = () => {
							this.model.predict(img).then(item => {
								if (
									item.value > ML_THRESHOLD &&
									item.index !== ML_UNKNOWN
								) {
									this.props.confirmMatch(
										item.index,
										img.src
									);
								}
							});
						};
					}, 1000);
				})
				.catch(() => this.setState({cameraConnected: false}));
		}
	}

	componentWillUnmount() {
		clearInterval(this.ticker);
	}

	render() {
		return (
			<WebcamCapture
				cameraConnected={this.state.cameraConnected}
				cameraRef={this.webcam}
			/>
		);
	}
}

export default WebcamCaptureContainer;
