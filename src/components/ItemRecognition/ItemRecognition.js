import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Model from './../../utils/model';
import WebcamCapture from '../WebcamCapture/WebcamCapture';
import Logo from '../Logo/Logo';

const ML_THRESHOLD = 0.06;

class ItemRecognition extends Component {
	model = new Model();
	webcam = React.createRef();

	componentDidMount() {
		this.props.setPrediction(null, null);
		this.model.load();
	}

	onConnect = () => {
		this.webcam.current
			.requestScreenshot()
			.then(this.handleImg)
			.catch(() => {
				setTimeout(this.onConnect, 100);
			});
	};

	handleImg = img => {
		this.model.predict(img).then(item => {
			if (
				item.value > ML_THRESHOLD &&
				item.id !== '' &&
				!this.props.prediction
			) {
				this.props.setPrediction(item.id, img.src);
				this.props.history.push('/confirmitem');
			} else {
				this.webcam.current.requestScreenshot().then(this.handleImg);
			}
		});
	};

	render() {
		return (
			<div>
				<Logo />
				<header>Hold up your snack to the camera</header>
				<WebcamCapture
					ref={this.webcam}
					onConnect={this.onConnect}
					imgSize={224}
				/>
				<button onClick={() => this.props.history.push('/editsnack')}>
					{' '}
					a
				</button>
			</div>
		);
	}
}

ItemRecognition.propTypes = {
	setPrediction: PropTypes.func.isRequired,
	prediction: PropTypes.shape({
		name: PropTypes.string,
		img: PropTypes.string.isRequired
	})
};

export default ItemRecognition;
