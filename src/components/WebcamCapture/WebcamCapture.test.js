import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WebcamCapture from './WebcamCapture';
import Webcam from 'react-webcam';
import Notification from './../Notification/Notification';

configure({adapter: new Adapter()});

describe('<WebcamCapture />', () => {
	it("Tells the user that webcam isn't found if not found", () => {
		const wrapper = shallow(<WebcamCapture imgSize={300} />);
		wrapper.setState({isDetecting: false});
		expect(wrapper.find(Notification)).toHaveLength(1);
	});

	it('Renders webcam with screenshot width of 4/3 * imgSize', () => {
		const wrapper = shallow(<WebcamCapture imgSize={300} />);
		wrapper.setState({isDetecting: false, cameraConnected: true});
		expect(wrapper.find(Webcam).props().screenshotWidth).toEqual(400);
	});

	it('Renders webcam with screenshot format of jpeg', () => {
		const wrapper = shallow(<WebcamCapture imgSize={300} />);
		wrapper.setState({isDetecting: false, cameraConnected: true});
		expect(wrapper.find(Webcam).props().screenshotFormat).toEqual(
			'image/jpeg'
		);
	});
});
