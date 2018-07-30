import React, {Component} from 'react';
import {Redirect} from 'react-router';
import './NotificationBar.css';

class NotificationBar extends Component {
  state = {countdown: 9};

  componentDidMount() {
    this.timer = setInterval(this.tick, 1000);
  }

  tick = () => {
    this.setState(prevState => {
      if (prevState.countdown === 1) {
        this.props.timeoutAction();
      }
      return {countdown: prevState.countdown - 1};
    });
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div className="notification-bar--notification" id="notificationBar">
        <div className="notification-bar--info">
          <div className="notification-bar--alert">{this.props.mainText}</div>
          <div className="notification-bar--timer">
            {this.props.autoActionWord} in{' ' + this.state.countdown}s
          </div>
        </div>
        <div className="notification-bar--dismiss">
          {this.props.userActionText.toUpperCase()}
        </div>
      </div>
    );
  }
}

export default NotificationBar;
