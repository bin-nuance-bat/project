import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WebcamCapture from './WebcamCapture';

configure({adapter: new Adapter()});

it("Tells the user that webcam isn't found if not found", () => {
	const wrapper = shallow(
		<WebcamCapture cameraConnected={false} cameraRef={{current: null}} />
	);
	expect(wrapper.text()).toEqual('Cannot access camera');
});

it('Renders webcam with correct props if webcamconnected', () => {
	const wrapper = shallow(
		<WebcamCapture cameraConnected={true} cameraRef={{test: 'value'}} />
	);
	expect(
		wrapper.find(
			'Webcam[screenshotFormat="image/jpeg"][screenshotWidth=224]'
		)
	).toHaveLength(1);
});
