import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ConfirmationBox from './ConfirmationBox';

configure({adapter: new Adapter()});

const getProps = () => {
	return {
		setActualItem: jest.fn(),
		storeList: {xxx: {id: 'xxx', name: 'Alfred'}},
		prediction: {id: 'xxx'},

		history: {
			push: jest.fn()
		}
	};
};

it('calls setActualItem when yes is clicked', () => {
	const mockProps = getProps();

	const wrapper = shallow(<ConfirmationBox {...mockProps} />);
	wrapper.find({testattribute: 'YES'}).simulate('click');
	expect(mockProps.setActualItem).toHaveBeenCalledWith('Alfred');
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
