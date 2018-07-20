import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Model from './../../utils/model';
import WebcamCapture from '../WebcamCapture/WebcamCaptureContainer';
import Logo from '../Logo/Logo';
import './ItemRecognition.css';

const ML_THRESHOLD = 0.06;

class ItemRecognition extends Component {
	model = new Model();

	componentDidMount() {
		this.props.setPrediction(null, null);
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
		return (
			<div>
				<div className="item-recognition--header">
					<Logo />
					<div className="item-recognition item-recognition--instructions">
						Scan item using the front facing camera
					</div>
				</div>
				<WebcamCapture
					className="item-recognition item-recognition--display"
					onImgLoad={this.handleImg}
					interval={1000}
				/>
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
