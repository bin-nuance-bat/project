import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunk from 'redux-thunk';
import {
	storeList,
	loadStoreListError,
	showList
} from '../components/StoreList/reducer';
import {users, slackUserFetchError} from '../components/OldApp/reducer';
import {sendReminderError} from '../components/UsernameEntry/reducer';
import {prediction} from '../components/ItemRecognition/ItemRecognitionReducer';
import {sendWithPhoto} from '../components/App/reducer';
import {actualItem} from '../components/ConfirmationBox/reducer';

const rootReducer = combineReducers({
	storeList,
	loadStoreListError,
	users,
	slackUserFetchError,
	showList,
	prediction,
	sendWithPhoto,
	actualItem,
	sendReminderError
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(thunk))
);

export default store;
