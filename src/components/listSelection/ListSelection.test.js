import React from 'react';
import {shallow, configure} from 'enzyme';
import ListSelection from './ListSelection';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

it('Gnerates the list correctly', () => {
	const props = {
		onClick: jest.fn(),
		items: [
			{name: 'foo', id: 'sample-foo', image: ''},
			{name: 'bar', id: 'sample-bar', image: ''},
			{name: 'foobar', id: 'sample-foobar', image: ''}
		]
	};
	const wrapper = shallow(<ListSelection {...props} />);
	expect(wrapper).toMatchSnapshot();
});

it('Calls the required function', () => {
	const props = {
		onClick: jest.fn(),
		items: [
			{name: 'foo', id: 'sample-foo', image: ''},
			{name: 'bar', id: 'sample-bar', image: ''},
			{name: 'foobar', id: 'sample-foobar', image: ''}
		]
	};

	const wrapper = shallow(<ListSelection {...props} />);
	wrapper
		.find('[name="foo"]')
		.at(0)
		.simulate('click');
	expect(props.onClick).toHaveBeenCalledWith('sample-foo');
});
