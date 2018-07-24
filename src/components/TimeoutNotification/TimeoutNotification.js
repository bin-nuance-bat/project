import React, {Component} from 'react';
import {Redirect} from 'react-router';
import './TimeoutNotification.css';

const WAIT_BEFORE_DISPLAY = 45;
const COUNTDOWN = 9;

class TimeoutNotification extends Component {
  state = {
    displayWarning: false,
    countdown: COUNTDOWN
  };

  componentDidMount() {
    document.body.addEventListener('touchstart', this.dismissMessage);
    document
      .getElementById('notificationBar')
      .addEventListener('touchstart', this.notificationTouch, {passive: false});
    this.resetTimer();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearInterval(this.interval);
    document.body.removeEventListener('touchstart', this.dismissMessage);
    document
      .getElementById('notificationBar')
      .removeEventListener('touchstart', this.notificationTouch);
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
    this.setState(prevState => {
      if (prevState.countdown === 0) {
        clearInterval(this.interval);
      }
      return {countdown: prevState.countdown - 1};
    });
  };

  notificationTouch = e => {
    this.dismissMessage();
    e.preventDefault();
  };

  dismissMessage = () => {
    clearInterval(this.interval);
    this.resetTimer();
    this.setState({displayWarning: false, countdown: COUNTDOWN});
  };

  render() {
    return (
      <div>
        <div
          className={
            'timeout-notification--notification--' +
            (this.state.displayWarning ? 'show' : 'hide')
          }
          id="notificationBar">
          <div className="timeout-notification--info">
            <div className="timeout-notification--alert">
              Are you still there?
            </div>
            <div className="timeout-notification--timer">
              Timeout in{' ' + this.state.countdown}s
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
