import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

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
  state = {showTimer: false};

  componentDidMount() {
    document.body.addEventListener('touchstart', this.resetTimeoutTimer);
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

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearInterval(this.interval);
    document.body.removeEventListener('touchstart', this.resetTimeoutTimer);
  }

  render() {
    return (
      <div>
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
        {this.state.showTimer && (
          <NotificationBar
            mainText="Are you still there?"
            autoActionWord="Timeout"
            userTouchActionText="dismiss"
            handleTouch={this.resetTimeoutTimer}
            handleTimeout={this.onTimeout}
          />
        )}
      </div>
    );
  }
}

export default App;
