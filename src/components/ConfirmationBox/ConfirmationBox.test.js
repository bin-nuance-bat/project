import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ConfirmationBox from './ConfirmationBox';

configure({adapter: new Adapter()});

it('calls the correct functions when clicked', () => {
	const testFuncYes = jest.fn();
	const testFuncNo = jest.fn();
	const wrapper = shallow(
		<ConfirmationBox onYes={testFuncYes} onNo={testFuncNo} />
	);
	wrapper.find('#YES').simulate('click');
	expect(testFuncYes).toHaveBeenCalledTimes(1);
	wrapper.find('#NO').simulate('click');
	expect(testFuncNo).toHaveBeenCalledTimes(1);
});

it('Has the correct item name ', () => {});
