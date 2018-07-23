import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ConfirmationBox from './ConfirmationBox';

configure({adapter: new Adapter()});

const getProps = () => {
	return {
		name: 'fooBar',
		id: 'sample-id',
		history: {
			push: jest.fn()
		},
		setActualItem: jest.fn(),
		img: 'barFoo'
	};
};

it('calls setActualItem when yes is clicked', () => {
	const mockProps = getProps();

	const wrapper = shallow(<ConfirmationBox {...mockProps} />);
	wrapper.find({testattribute: 'YES'}).simulate('click');
	expect(mockProps.setActualItem).toHaveBeenCalledWith('sample-id');
});

it('Goes to username entry page if yes clicked', () => {
	const mockProps = getProps();

	const wrapper = shallow(<ConfirmationBox {...mockProps} />);
	wrapper.find({testattribute: 'YES'}).simulate('click');
	expect(mockProps.history.push).toHaveBeenCalledWith('/slackname');
});

it('Goes to edit snack page if no clicked', () => {
	const mockProps = getProps();

	const wrapper = shallow(<ConfirmationBox {...mockProps} />);
	wrapper.find({testattribute: 'NO'}).simulate('click');
	expect(mockProps.history.push).toHaveBeenCalledWith('/editSnack');
});
