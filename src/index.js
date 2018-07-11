import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import AppContainer from './components/App/AppContainer';
import store from './utils/reduxStore';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router, Route} from 'react-router-dom';

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<Route path="/" component={AppContainer} />
		</Router>
	</Provider>,
	document.getElementById('root')
);

registerServiceWorker();
