import React, {Component} from 'react';
import Notification from './../Notification/Notification';
import PropTypes from 'prop-types';
import Model from './../../utils/model';
import WebcamCapture from '../WebcamCapture/WebcamCaptureContainer';

const ML_THRESHOLD = 0.06;

class ItemRecognition extends Component {
	render() {
		return <WebcamCapture />;
	}
}

export default ItemRecognition;
