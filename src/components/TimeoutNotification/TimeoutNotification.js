import React, {Component} from 'react';
import {Redirect} from 'react-router';
import './TimeoutNotification.css';

const WAIT_BEFORE_DISPLAY = 10;
const COUNTDOWN = 10;

class TimeoutNotification extends Component {
	state = {
		displayWarning: false,
		countdown: COUNTDOWN
	};

	componentDidMount() {
		document.body.addEventListener('touchstart', () => {
			this.dismissMessage();
		});
		this.resetTimer();
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
		this.interval = setInterval(this.countdownTick, 1000);
	};

	countdownTick = () => {
		this.setState(prevState => ({countdown: prevState.countdown - 1}));
	};

	dismissMessage = () => {
		clearInterval(this.interval);
		this.resetTimer();
		this.setState({displayWarning: false, countdown: COUNTDOWN});
	};

	render() {
		if (this.state.countdown === 0) {
			clearInterval(this.interval);
		}

		return (
			<div>
				<div
					className={
						'timeout-notification--notification--' +
						(this.state.displayWarning ? 'show' : 'hide')
					}>
					<div className="timeout-notification--info">
						<div className="timeout-notification--alert">
							Are you still there?
						</div>
						<div className="timeout-notification--timer">
							{'Timeout in ' + this.state.countdown + 's'}
						</div>
					</div>
					<div className="timeout-notification--dismiss">DISMISS</div>
				</div>
				{this.state.countdown === 0 && <Redirect to="/" />}
			</div>
		);
	}
}

export default TimeoutNotification;
