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

class App extends Component {
  state = {isOnline: navigator.onLine};

  componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  handleOnline = () => {
    this.setState({isOnline: true});
  };

  handleOffline = () => {
    this.setState({isOnline: false});
  };

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
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
            <Route exact path="/preview" component={Viewer} />
            <Route exact path="/admin" component={Admin} />
            <Route exact path="/training" component={Trainer} />
            <Route exact path="/imageapproval" component={ImageApproval} />
          </Switch>
        </Router>
        {!this.state.isOnline && 'NOT online'}
      </div>
    );
  }
}

export default App;
