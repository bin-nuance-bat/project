import React, {Component} from 'react';
import './TimeoutNotification.css';

const WAITBEFOREDISPLAY = 1;

class TimeoutNotification extends Component {
	state = {
		displayWarning: false,
		timer: 10
	};

	componentDidMount() {
		this.timer = setTimeout(function() {
			alert('Hello');
		}, WAITBEFOREDISPLAY * 1000);
	}

	render() {
		return <div> a </div>;
	}
}

export default TimeoutNotification;
