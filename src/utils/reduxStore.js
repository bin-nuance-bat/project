import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunk from 'redux-thunk';
import {
  prediction,
  suggestions
} from '../components/ItemRecognition/ItemRecognitionReducer';
import {
  sendWithPhoto,
  users,
  userReference,
  storeList
} from '../components/Home/reducer';
import {actualItem} from '../components/ConfirmationBox/reducer';
import {snackChat} from '../components/SnackChat/SnackChatReducer';
import {dataController} from '../components/App/reducer';

const rootReducer = combineReducers({
  storeList,
  users,
  prediction,
  suggestions,
  sendWithPhoto,
  actualItem,
  snackChat,
  dataController,
  userReference
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
