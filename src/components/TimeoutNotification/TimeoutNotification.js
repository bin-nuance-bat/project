import React, {Component} from 'react';
import './TimeoutNotification.css';
import {Redirect} from 'react-router';

const WAIT_BEFORE_DISPLAY = 2;
const COUNTDOWN = 5;

class TimeoutNotification extends Component {
	state = {
		displayWarning: false,
		countdown: COUNTDOWN
	};

	componentDidMount() {
		console.log(this.props);
		document.body.addEventListener('touchstart', () => {
			this.resetTimer(), this.dismissMessage();
		});
		this.resetTimer(0);
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	resetTimer = () => {
		console.log(22);
		clearTimeout(this.timer);
		this.timer = setTimeout(this.showMessage, WAIT_BEFORE_DISPLAY * 1000);
	};

	showMessage = () => {
		this.setState({displayWarning: true});
		clearInterval(this.interval); //WHAT????
		this.interval = setInterval(this.countdown, 1000);
	};

	countdown = () => {
		this.setState(prevState => ({countdown: prevState.countdown - 1}));
	};

	dismissMessage = () => {
		this.timer = setTimeout(this.showMessage, WAIT_BEFORE_DISPLAY * 1000);
		clearInterval(this.interval);
		this.setState({displayWarning: false, countdown: COUNTDOWN});
	};

	render() {
		if (this.state.countdown === 0) {
			clearInterval(this.interval);
		}

		return (
			<div>
				{this.state.displayWarning && (
					<div className="timeout-notification--notification">
						{this.state.countdown}
					</div>
				)}
				{this.state.countdown === 0 && <Redirect to="/" />}
			</div>
		);
	}
}

export default TimeoutNotification;
