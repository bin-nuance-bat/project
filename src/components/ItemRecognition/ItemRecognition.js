import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Model from './../../utils/model';
import WebcamCapture from '../WebcamCapture/container';

const ML_THRESHOLD = 0.06;

class ItemRecognition extends Component {
	model = new Model();

	componentDidMount() {
		this.model.load();
	}

	handleImg = img => {
		this.model.predict(img).then(item => {
			if (
				item.value > ML_THRESHOLD &&
				item.id !== '' &&
				!this.props.prediction
			) {
				this.props.setPrediction(item.id, img.src);
				this.props.history.push('/confirmitem');
			}
		});
	};

	render() {
		<header>Hold up your snack to the camera</header>;
		return <WebcamCapture onImgLoad={this.handleImg} interval={1000} />;
	}
}

ItemRecognition.propTypes = {
	setPrediction: PropTypes.func.isRequired,
	prediction: PropTypes.object
};

export default ItemRecognition;
