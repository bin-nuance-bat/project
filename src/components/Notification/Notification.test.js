import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {Notification} from './Notification';

configure({adapter: new Adapter()});

it('displays the message correctly', () => {
	const wrapper = shallow(<Notification message="testMessage" />);
	expect(wrapper.text()).toEqual('testMessage');
});
