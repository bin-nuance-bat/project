import React from 'react';
import ButtonList from './ButtonList';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

it('renders a list correctly', () => {
	const items = [{name: 'apple', id: 'xxx'}, {name: 'mars', id: 'yyy'}];
	const wrapper = shallow(
		<ButtonList items={items} handleClick={function() {}} />
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
	const items = [{name: 'apple', id: 'xxx'}, {name: 'mars', id: 'yyy'}];
	let testFunc = jest.fn();
	const wrapper = shallow(
		<ButtonList items={items} handleClick={testFunc} />
	);
	wrapper
		.find('button')
		.at(0)
		.simulate('click');
	expect(testFunc).toHaveBeenCalledWith('xxx', 'apple');
});
