import React from 'react';
import {shallow, configure} from 'enzyme';
import ListSelection from './ListSelection';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

it('Gnerates the list correctly', () => {
	const props = {
		onClick: jest.fn(),
		items: [
			{name: 'foo', id: 'sample-foo', img: ''},
			{name: 'bar', id: 'sample-bar', img: ''},
			{name: 'foobar', id: 'sample-foobar', img: ''}
		]
	};
	const wrapper = shallow(<ListSelection {...props} />);
	expect(wrapper).toMatchSnapshot();
});
