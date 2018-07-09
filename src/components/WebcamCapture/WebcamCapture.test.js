import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WebcamCapture from './WebcamCapture';

configure({adapter: new Adapter()});

it("Tells the user that webcam isn't found if not found", () => {
	const wrapper = shallow(
		<WebcamCapture cameraConnected={false} cameraRef={{current: null}} />
	);
	expect(wrapper.find('ErrorMessage')).toHaveLength(1);
});

it('Renders webcam with screenshot width of 224', () => {
	const wrapper = shallow(
		<WebcamCapture cameraConnected={true} cameraRef={{test: 'value'}} />
	);
	expect(wrapper.find('Webcam').props().screenshotWidth).toEqual(224);
});

it('Renders webcam with screenshot format of jpeg', () => {
	const wrapper = shallow(
		<WebcamCapture cameraConnected={true} cameraRef={{test: 'value'}} />
	);
	expect(wrapper.find('Webcam').props().screenshotFormat).toEqual(
		'image/jpeg'
	);
});
