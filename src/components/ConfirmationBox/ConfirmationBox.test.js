import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ConfirmationBox from './ConfirmationBox';

configure({adapter: new Adapter()});

it('calls the onYes correct functions when clicked', () => {
	const mockFuncYes = jest.fn();
	const mockFuncNo = jest.fn();
	const wrapper = shallow(
		<ConfirmationBox
			item={{name: 'test', id: 'xxx'}}
			onYes={mockFuncYes}
			onNo={mockFuncNo}
			store={{}}
		/>
	);
	wrapper.find('[testID="YES"]').simulate('click');
	expect(mockFuncYes).toHaveBeenCalledTimes(1);
});

it('calls the onNo correct functions when clicked', () => {
	const mockFuncNo = jest.fn();
	const mockFuncYes = jest.fn();
	const wrapper = shallow(
		<ConfirmationBox
			item={{name: 'test', id: 'xxx'}}
			onYes={mockFuncYes}
			onNo={mockFuncNo}
			store={{}}
		/>
	);
	wrapper.find('[testID="NO"]').simulate('click');
	expect(mockFuncNo).toHaveBeenCalledTimes(1);
});
