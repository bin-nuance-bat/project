import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunk from 'redux-thunk';
import {
	storeList,
	loadStoreListError,
	showList
} from '../components/StoreList/reducer';
import {users, slackUserFetchError} from '../components/OldApp/reducer';
import {currentUser} from '../components/UsernameEntry/reducer';
import {prediction} from '../components/WebcamCapture/reducer';
import {sendWithPhoto} from '../components/App/reducer';

const rootReducer = combineReducers({
	storeList,
	loadStoreListError,
	users,
	slackUserFetchError,
	currentUser,
	showList,
	prediction,
	sendWithPhoto
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(thunk))
);

export default store;
