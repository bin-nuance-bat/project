import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunk from 'redux-thunk';
import {storeList, loadStoreListError} from '../components/StoreList/reducer';
import {
  users,
  loadUserListError,
  sendMessageError
} from '../components/UsernameEntry/reducer';
import {prediction} from '../components/ItemRecognition/ItemRecognitionReducer';
import {sendWithPhoto} from '../components/Home/reducer';
import {actualItem} from '../components/ConfirmationBox/reducer';
import {snackChat} from '../components/SnackChat/SnackChatReducer';

const rootReducer = combineReducers({
  storeList,
  loadStoreListError,
  users,
  prediction,
  sendWithPhoto,
  actualItem,
  snackChat,
  loadUserListError,
  sendMessageError
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
