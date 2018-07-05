import React from 'react';
import ButtonList from './ButtonList';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

it('renders a list correctly', () => {
	const items = [{name: 'apple', index: 0}, {name: 'mars', index: 1}];
	const wrapper = shallow(
		<ButtonList items={items} onClick={function() {}} />
	);
	expect(wrapper.find('button')).toHaveLength(2);
	expect(
		wrapper
			.find('button')
			.at(0)
			.contains('apple')
	).toBeTruthy();
	expect(
		wrapper
			.find('button')
			.at(1)
			.contains('mars')
	).toBeTruthy();
});

it('Click functions properly', () => {
	const items = [{name: 'apple', index: 0}, {name: 'mars', index: 1}];
	let testFunc = jest.fn();
	const wrapper = shallow(<ButtonList items={items} onClick={testFunc} />);
	wrapper
		.find('button')
		.at(0)
		.simulate('click');
	expect(testFunc).toHaveBeenCalledWith(0, 'apple');
});
