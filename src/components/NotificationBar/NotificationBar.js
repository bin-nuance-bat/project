import React, {Component} from 'react';
import {Redirect} from 'react-router';
import './NotificationBar.css';

class NotificationBar extends Component {
  state = {timer: 9};

  componentDidMount() {
    this.timer = setInterval(this.tick, 1000);
  }

  tick() {
    this.setState(prevState => ({timer: prevState.timer - 1}));
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div>
        <div
          className={
            'notification-bar--notification--' +
            (this.state.displayWarning ? 'show' : 'hide')
          }
          id="notificationBar">
          <div className="notification-bar--info">
            <div className="notification-bar--alert">{this.props.mainText}</div>
            <div className="notification-bar--timer">
              {this.props.autoActionWord} in{' ' + this.state.countdown}s
            </div>
          </div>
          <div className="notification-bar--dismiss">
            {this.props.userActionText.toUpper()}
          </div>
        </div>
        {this.state.countdown === 0 && this.props.timeoutAction}
      </div>
    );
  }
}

export default NotificationBar;
