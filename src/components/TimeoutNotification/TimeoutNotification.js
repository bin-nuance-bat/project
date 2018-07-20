import React, {Component} from 'react';
import './TimeoutNotification.css';

const WAITBEFOREDISPLAY = 1;

class TimeoutNotification extends Component {
	state = {
		displayWarning: false,
		countdown: 10
	};

	componentDidMount() {
		this.timer = setTimeout(this.showMessage, WAITBEFOREDISPLAY * 1000);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	showMessage = () => {};

	render() {
		return (
			this.state.displayWarning && (
				<div className="timeout-notification">
					{' '}
					{this.countdown.timer}{' '}
				</div>
			)
		);
	}
}

export default TimeoutNotification;
