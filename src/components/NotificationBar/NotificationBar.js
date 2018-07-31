import React, {Component} from 'react';
import './NotificationBar.css';
import PropTypes from 'prop-types';

class NotificationBar extends Component {
  state = {countdown: 9, show: false};

  componentDidMount() {
    setTimeout(() => this.setState({show: true}), 50);

    if (this.props.handleTimeout) {
      this.timer = setInterval(this.tick, 1000);
    }

    if (this.props.preventInteraction) {
      document.addEventListener('click', this.preventInteraction, true);
    }

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

  getSubtext = () => {
    return (
      this.props.autoActionWord +
      (this.props.handleTimeout ? ' in ' + this.state.countdown + 's' : '...')
    );
  };

  notificationTouch = e => {
    this.props.handleTouch ? this.props.handleTouch() : null;
    e.preventDefault();
  };

  preventInteraction = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  componentWillUnmount() {
    clearInterval(this.timer);
    document
      .getElementById('notificationBar')
      .removeEventListener('touchstart', this.notificationTouch);
    document.removeEventListener('click', this.preventInteraction, true);
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
          <div className="notification-bar--sub-text">{this.getSubtext()}</div>
        </div>
        <div className="notification-bar--dismiss">
          {this.props.userTouchActionText}
        </div>
      </div>
    );
  }
}

NotificationBar.propTypes = {
  userTouchActionText: PropTypes.string,
  autoActionWord: PropTypes.string,
  mainText: PropTypes.string.isRequired,
  handleTouch: PropTypes.func,
  handleTimeout: PropTypes.func,
  preventInteraction: PropTypes.bool
};

export default NotificationBar;
