import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';

import Home from '../Home/container';
import SnackChat from '../SnackChat/SnackChatContainer';
import ItemRecognition from '../ItemRecognition/ItemRecognitionContainer';
import Disclaimer from '../Disclaimer/Disclaimer';
import ConfirmationBox from '../ConfirmationBox/container';
import UsernameEntry from '../UsernameEntry/container';
import EditSnack from '../EditSnack/EditSnackContainer';
import SuccessPage from '../SuccessPage/container';
import NotificationBar from '../NotificationBar/NotificationBar';

import Admin from '../Admin/Admin';
import Trainer from '../Admin/Trainer/Trainer';
import ImageApproval from '../Admin/ImageApproval/ImageApproval';
import Viewer from '../Admin/Preview/Viewer';

const WAIT_BEFORE_DISPLAY = 45;
const PAGES_TO_SHOW_TIMEOUT = [
  '/disclaimer',
  '/confirmitem',
  '/editsnack',
  '/slackname'
];

class App extends Component {
  state = {
    showTimer: false,
    isOnline: true
  };

  componentDidMount() {
    document.body.addEventListener('touchstart', this.resetTimeoutTimer);
    document.body.addEventListener('touchmove', this.resetTimeoutTimer);
    document.body.addEventListener('touchend', this.resetTimeoutTimer);
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);

    const isValidRoute =
      window.location.pathname === '/' ||
      window.location.pathname.startsWith('/admin');
    if (!isValidRoute) window.location.href = '/';
  }

  resetTimeoutTimer = () => {
    this.setState({showTimer: false});
    clearTimeout(this.timer);
    this.timer = setTimeout(
      this.showTimeoutMessage,
      WAIT_BEFORE_DISPLAY * 1000
    );
  };

  onTimeout = () => {
    window.location.href = '/';
  };

  showTimeoutMessage = () => {
    if (PAGES_TO_SHOW_TIMEOUT.indexOf(window.location.pathname) !== -1) {
      this.setState({showTimer: true});
    }
  };

  handleOnline = () => {
    this.setState({
      isOnline: true
    });
  };

  handleOffline = () => {
    this.setState({isOnline: false});
  };

  connectionError() {
    return (
      !this.state.isOnline ||
      this.props.loadStoreListError ||
      this.props.loadUserListError ||
      this.props.sendMessageError
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearInterval(this.interval);
    document.body.removeEventListener('touchstart', this.resetTimeoutTimer);
    document.body.removeEventListener('touchmove', this.resetTimeoutTimer);
    document.body.removeEventListener('touchend', this.resetTimeoutTimer);
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  render() {
    return (
      <div key={this.connectionError()}>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/snackchat" component={SnackChat} />
            <Route exact path="/disclaimer" component={Disclaimer} />
            <Route exact path="/scanitem" component={ItemRecognition} />
            <Route exact path="/confirmitem" component={ConfirmationBox} />
            <Route exact path="/editsnack" component={EditSnack} />
            <Route exact path="/slackname" component={UsernameEntry} />
            <Route exact path="/success" component={SuccessPage} />
            <Route exact path="/admin" component={Admin} />
            <Route exact path="/admin/preview" component={Viewer} />
            <Route exact path="/admin/training" component={Trainer} />
            <Route
              exact
              path="/admin/imageapproval"
              component={ImageApproval}
            />
          </Switch>
        </Router>
        {this.state.showTimer &&
          !this.connectionError() && (
            <NotificationBar
              mainText="Are you still there?"
              autoActionWord="Timeout"
              userTouchActionText="DISMISS"
              handleTouch={this.resetTimeoutTimer}
              handleTimeout={this.onTimeout}
            />
          )}
        {this.connectionError() && (
          <NotificationBar
            mainText="Connection lost"
            autoActionWord="Retrying"
            preventInteraction
          />
        )}
      </div>
    );
  }
}

App.propTypes = {
  loadStoreListError: PropTypes.bool,
  loadUserListError: PropTypes.bool,
  sendMessageError: PropTypes.bool
};

export default App;
