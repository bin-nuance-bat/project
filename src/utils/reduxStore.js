import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunk from 'redux-thunk';
import {
	storeList,
	loadStoreListError,
	showList
} from '../components/StoreList/reducer';
import {
	users,
	slackUserFetchError,
	prediction
} from '../components/App/reducer';
import {currentUser} from '../components/UsernameEntry/reducer';

const rootReducer = combineReducers({
	storeList,
	loadStoreListError,
	users,
	slackUserFetchError,
	currentUser,
	showList,
	prediction
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(thunk))
);

export default store;
