import React, {Component} from 'react';
import './TimeoutNotification.css';
import {Redirect} from 'react-router';

const WAIT_BEFORE_DISPLAY = 0.1;
const COUNTDOWN = 100;

class TimeoutNotification extends Component {
	state = {
		displayWarning: false,
		countdown: COUNTDOWN
	};

	componentDidMount() {
		document.body.addEventListener('touchstart', () => {
			this.dismissMessage();
			this.resetTimer();
		});
		this.resetTimer(0);
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	resetTimer = () => {
		clearTimeout(this.timer);
		this.timer = setTimeout(this.showMessage, WAIT_BEFORE_DISPLAY * 1000);
	};

	showMessage = () => {
		this.setState({displayWarning: true});
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
						<div className="timeout-notification--info">
							<div className="timeout-notification--alert">
								Are you still there?
							</div>
							<div className="timeout-notification--timer">
								{'Timeout in ' + this.state.countdown + 's'}
							</div>
						</div>
						<div className="timeout-notification--dismiss">
							DISMISS
						</div>
					</div>
				)}
				{this.state.countdown === 0 && <Redirect to="/" />}
			</div>
		);
	}
}

export default TimeoutNotification;
