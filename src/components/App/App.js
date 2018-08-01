import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Home from '../Home/container';
import Viewer from '../Admin/Preview/Viewer';
import Trainer from '../Admin/Trainer/Trainer';
import SnackChat from '../SnackChat/SnackChatContainer';
import ItemRecognition from '../ItemRecognition/ItemRecognitionContainer';
import Disclaimer from '../Disclaimer/Disclaimer';
import ConfirmationBox from '../ConfirmationBox/container';
import UsernameEntry from '../UsernameEntry/container';
import EditSnack from '../EditSnack/EditSnackContainer';
import SuccessPage from '../SuccessPage/container';
import Admin from '../Admin/Admin';
import ImageApproval from '../ImageApproval/ImageApproval';
import NotificationBar from '../NotificationBar/NotificationBar';

import PropTypes from 'prop-types';

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
    isOnline: true,
    refresh: 0
  };

  componentDidMount() {
    document.body.addEventListener('touchstart', this.resetTimeoutTimer);
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
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
    this.setState(prevState => ({
      isOnline: true,
      refresh: prevState.refresh + 1
    }));
    // this isnt the nicest way of doing it but Im uysing this to reload the route, I only want to do this on the online event though, hence im not using the isOnline as a key (to router)
  };

  handleOffline = () => {
    this.setState({isOnline: false});
  };

  connectionError() {
    return (
      !this.state.isOnline ||
      this.props.loadStoreListError ||
      this.props.loadUserListError
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearInterval(this.interval);
    document.body.removeEventListener('touchstart', this.resetTimeoutTimer);
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  render() {
    return (
      <div key={this.state.refresh}>
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
            <Route exact path="/preview" component={Viewer} />
            <Route exact path="/admin" component={Admin} />
            <Route exact path="/training" component={Trainer} />
            <Route exact path="/imageapproval" component={ImageApproval} />
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
  loadUserListError: PropTypes.bool
};

export default App;
