import React from 'react';
import WebcamCapture from './webcamcapture.js';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Webcam from 'react-webcam';

configure({adapter: new Adapter()});

it('It renders a webcam component with class videoStream', () => {
	const wrapper = shallow(<WebcamCapture />);
	expect(wrapper.contains(<Webcam className="videoStream" />)).toEqual(true);
});
