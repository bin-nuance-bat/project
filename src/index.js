import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import OldAppContainer from './components/OldApp/OldAppContainer';
import store from './utils/reduxStore';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import AppContainer from './components/App/container';
import Trainer from './components/Admin/Trainer/Trainer';
import SnackChat from './components/SnackChat/SnackChatContainer';
import ItemRecognition from './components/ItemRecognition/ItemRecognitionContainer';
import Disclaimer from './components/Disclaimer/Disclaimer';
import ConfirmationBox from './components/ConfirmationBox/container';
import UsernameEntryContainer from './components/UsernameEntry/container';
import EditSnack from './components/EditSnack/EditSnackContainer';
import SuccessPage from './components/SuccessPage/SuccessPage';
import Auth from './components/Admin/Auth/Auth.js';

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
				<Route
					exact
					path="/slackname"
					component={UsernameEntryContainer}
				/>
				<Route exact path="/success" component={SuccessPage} />
				<Route exact path="/old" component={OldAppContainer} />
				<Route exact path="/training" component={Trainer} />
				<Route exact path="/auth" component={Auth} />
			</Switch>
		</Router>
	</Provider>,
	document.getElementById('root')
);

registerServiceWorker();
