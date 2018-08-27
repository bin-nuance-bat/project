import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WebcamCapture from './WebcamCapture';
import Webcam from 'react-webcam';

configure({adapter: new Adapter()});

describe('<WebcamCapture />', () => {
  it('Renders webcam with screenshot width of 4/3 * imgSize', () => {
    const wrapper = shallow(<WebcamCapture imgSize={300} onFail={jest.fn()} />);
    wrapper.setState({isDetecting: false});
    expect(wrapper.find(Webcam).props().screenshotWidth).toEqual(400);
  });

  it('Renders webcam with screenshot format of jpeg', () => {
    const wrapper = shallow(<WebcamCapture imgSize={300} onFail={jest.fn()} />);
    wrapper.setState({isDetecting: false});
    expect(wrapper.find(Webcam).props().screenshotFormat).toEqual('image/jpeg');
  });

  it('Renders file input when fakeWebcam state is set', () => {
    const wrapper = shallow(<WebcamCapture imgSize={300} onFail={jest.fn()} />);
    wrapper.setState({
      isDetecting: false,
      cameraConnected: true,
      fakeWebcam: true
    });
    expect(wrapper.find('input')).toHaveLength(1);
  });
});
