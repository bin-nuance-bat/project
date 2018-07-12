import ConfirmationPage from './ConfirmationPage';
import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

it('Directs the user to the homepage on click', () => {
	const mockProps = {
		storeList: {xxx: {name: 'Alfred'}},
		prediction: {id: 'xxx'},
		history: {push: jest.fn()}
	};

	const wrapper = shallow(<ConfirmationPage {...mockProps} />);
	var evt = document.createEvent('HTMLEvents');
	evt.initEvent('click', false, true);
	document.body.dispatchEvent(evt);
	expect(mockProps.history.push).toHaveBeenCalledWith('/');
});
