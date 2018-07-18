import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WebcamCapture from './WebcamCapture';
import Webcam from 'react-webcam';
import Notification from './../Notification/Notification';

configure({adapter: new Adapter()});

const getProps = () => {
	return {
		onImgLoad: jest.fn(),
		interval: 1
	};
};

it("Tells the user that webcam isn't found if not found", () => {
	const mockProps = getProps();
	const wrapper = shallow(<WebcamCapture {...mockProps} />);
	wrapper.setState({isDetecting: false});
	expect(wrapper.find(Notification)).toHaveLength(1);
});

it('Renders webcam with screenshot width of 300', () => {
	const mockProps = getProps();
	const wrapper = shallow(<WebcamCapture {...mockProps} />);
	wrapper.setState({isDetecting: false, cameraConnected: true});
	expect(wrapper.find(Webcam).props().screenshotWidth).toEqual(300);
});

it('Renders webcam with screenshot format of jpeg', () => {
	const mockProps = getProps();
	const wrapper = shallow(<WebcamCapture {...mockProps} />);
	wrapper.setState({isDetecting: false, cameraConnected: true});
	expect(wrapper.find(Webcam).props().screenshotFormat).toEqual('image/jpeg');
});
