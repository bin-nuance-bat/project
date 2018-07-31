import React, {Component} from 'react';
import './NotificationBar.css';
import PropTypes from 'prop-types';

class NotificationBar extends Component {
  state = {countdown: 9, show: false};

  componentDidMount() {
    setTimeout(() => this.setState({show: true}), 50);
    this.timer = setInterval(this.tick, 1000);
    document
      .getElementById('notificationBar')
      .addEventListener('touchstart', this.notificationTouch, {passive: false});
  }

  tick = () => {
    this.setState(prevState => {
      if (prevState.countdown === 1) {
        this.props.handleTimeout();
      }
      return {countdown: prevState.countdown - 1};
    });
  };

  notificationTouch = e => {
    this.props.handleTouch();
    e.preventDefault();
  };

  componentWillUnmount() {
    clearInterval(this.timer);
    document
      .getElementById('notificationBar')
      .removeEventListener('touchstart', this.notificationTouch);
  }

  render() {
    return (
      <div
        className={
          'notification-bar--notification--' +
          (this.state.show ? 'show' : 'hide')
        }
        id="notificationBar">
        <div className="notification-bar--info">
          <div className="notification-bar--alert">{this.props.mainText}</div>
          <div className="notification-bar--timer">
            {this.props.autoActionWord + ' in ' + this.state.countdown}s
          </div>
        </div>
        <div className="notification-bar--dismiss">
          {this.props.userTouchActionText.toUpperCase()}
        </div>
      </div>
    );
  }
}

NotificationBar.propTypes = {
  userTouchActionText: PropTypes.string.isRequired,
  autoActionWord: PropTypes.string.isRequired,
  mainText: PropTypes.string.isRequired,
  handleTouch: PropTypes.func.isRequired,
  handleTimeout: PropTypes.func.isRequired
};

export default NotificationBar;
