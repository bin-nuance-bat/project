import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';
import store from './utils/reduxStore';

import AppContainer from './components/App/container';
import SnackChat from './components/SnackChat/SnackChatContainer';
import ItemRecognition from './components/ItemRecognition/ItemRecognitionContainer';
import Disclaimer from './components/Disclaimer/Disclaimer';
import ConfirmationBox from './components/ConfirmationBox/container';
import UsernameEntryContainer from './components/UsernameEntry/container';
import EditSnack from './components/EditSnack/EditSnackContainer';
import SuccessPage from './components/SuccessPage/SuccessPage';

import Admin from './components/Admin/Admin';
import Trainer from './components/Admin/Trainer/Trainer';
import Viewer from './components/Admin/Preview/Viewer';
import ImageApproval from './components/Admin/ImageApproval/ImageApproval';

import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={AppContainer} />
        <Route exact path="/snackchat" component={SnackChat} />
        <Route exact path="/disclaimer" component={Disclaimer} />
        <Route exact path="/scanitem" component={ItemRecognition} />
        <Route exact path="/confirmitem" component={ConfirmationBox} />
        <Route exact path="/editsnack" component={EditSnack} />
        <Route exact path="/slackname" component={UsernameEntryContainer} />
        <Route exact path="/success" component={SuccessPage} />
        <Route exact path="/admin" component={Admin} />
        <Route exact path="/admin/preview" component={Viewer} />
        <Route exact path="/admin/training" component={Trainer} />
        <Route exact path="/admin/imageapproval" component={ImageApproval} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
