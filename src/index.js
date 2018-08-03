import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import store from './utils/reduxStore';
import registerServiceWorker from './registerServiceWorker';
import App from './components/App/AppContainer';

import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

if (window.location.host === 'honesty-store-kiosk.firebaseapp.com')
  registerServiceWorker();
