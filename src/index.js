import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import OldAppContainer from './components/OldApp/OldAppContainer';
import store from './utils/reduxStore';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import AppContainer from './components/App/container';
import Trainer from './components/Trainer/Trainer';
import WebcamCaptureContainer from './components/WebcamCapture/WebcamCaptureContainer';

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<Switch>
				<Route exact path="/" component={AppContainer} />
				<Route
					exact
					path="/scanitem"
					component={WebcamCaptureContainer}
				/>
				<Route exact path="/old" component={OldAppContainer} />
				<Route exact path="/training" component={Trainer} />
			</Switch>
		</Router>
	</Provider>,
	document.getElementById('root')
);

registerServiceWorker();
