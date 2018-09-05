import React, {Component} from 'react';
import './NotificationBar.css';
import PropTypes from 'prop-types';

class NotificationBar extends Component {
  state = {countdown: 20, show: false};

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
        this.context.router.history.replace('/');
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
    this.props.handleTouch && this.props.handleTouch();
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
      <div className="notification-bar">
        <div className={'notification'} id="notificationBar">
          <div className="info">
            <div className="text">{this.props.mainText}</div>
            <div className="sub-text">{this.getSubtext()}</div>
          </div>
          <div className="dismiss">{this.props.userTouchActionText}</div>
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

NotificationBar.contextTypes = {
  router: PropTypes.object.isRequired
};

export default NotificationBar;
