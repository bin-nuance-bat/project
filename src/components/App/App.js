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
    showConnectionLost: false,
    isOnline: true
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

  timeout = () => {
    window.location.href = '/';
  };

  showTimeoutMessage = () => {
    if (PAGES_TO_SHOW_TIMEOUT.indexOf(window.location.pathname) !== -1) {
      this.setState({showTimer: true});
    }
  };

  handleOnline = () => {
    this.setState({isOnline: true});
  };

  handleOffline = () => {
    this.setState({isOnline: false});
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearInterval(this.interval);
    document.body.removeEventListener('touchstart', this.resetTimeoutTimer);
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  render() {
    return (
      <div key={this.state.isOnline}>
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
          this.isOnline && (
            <NotificationBar
              mainText="Are you still there?"
              autoActionWord="Timeout"
              userTouchActionText="dismiss"
              handleTouch={this.resetTimeoutTimer}
              handleTimeout={this.timeout}
            />
          )}
        {!this.state.isOnline && (
          <NotificationBar
            mainText="Connection Lost"
            autoActionWord="Retrying in"
            userTouchActionText="retry"
            handleTouch={this.refresh}
            handleTimeout={this.refresh}
          />
        )}
      </div>
    );
  }
}

export default App;
