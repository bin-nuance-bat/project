import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import AppContainer from './components/App/AppContainer';
import registerServiceWorker from './registerServiceWorker';
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunk from 'redux-thunk';
import storeList from './components/StoreList/reducer';
import {
	users,
	slackUserFetchError,
	currentUser
} from './components/App/reducer';

const rootReducer = combineReducers({
	storeList,
	users,
	slackUserFetchError,
	currentUser
});

const store = createStore(
	rootReducer,
	compose(
		applyMiddleware(thunk),
		window.__REDUX_DEVTOOLS_EXTENSION__ &&
			window.__REDUX_DEVTOOLS_EXTENSION__()
	)
);

ReactDOM.render(
	<Provider store={store}>
		<AppContainer />
	</Provider>,
	document.getElementById('root')
);

registerServiceWorker();
