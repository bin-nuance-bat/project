import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WebcamCaptureContainer from './WebcamCaptureContainer';

configure({adapter: new Adapter()});

it('It renders a webcam capture container correctly', () => {
	const wrapper = shallow(<WebcamCaptureContainer />);
	expect(wrapper).toHaveLength(1);
});