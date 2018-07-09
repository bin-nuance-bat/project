import React from 'react';
import AppContainer from './AppContainer';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import store from '../../utils/reduxStore';
import {Provider} from 'react-redux';

configure({adapter: new Adapter()});

it('renders without crashing', () => {
	shallow(
		<Provider store={store}>
			<AppContainer />
		</Provider>
	);
});
