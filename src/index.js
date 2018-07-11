import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import AppContainer from './components/App/AppContainer';
import store from './utils/reduxStore';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import NewApp from './components/NewApp/NewApp';
import Trainer from './components/Trainer/Trainer';
import WebcamCaptureContainer from './components/WebcamCapture/WebcamCaptureContainer';

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<Switch>
				<Route exact path="/" component={NewApp} />
				<Route exact path="/old" component={AppContainer} />
				<Route
					exact
					path="/scanItem"
					component={WebcamCaptureContainer}
				/>
				<Route exact path="/training" component={Trainer} />
			</Switch>
		</Router>
	</Provider>,
	document.getElementById('root')
);

registerServiceWorker();
