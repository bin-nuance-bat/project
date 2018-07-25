import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ConfirmationBox from './ConfirmationBox';

configure({adapter: new Adapter()});

const getProps = () => {
  return {
    name: 'coke',
    id: 'sampleid',
    history: {
      push: jest.fn()
    },
    setActualItem: jest.fn(),
    sendWithPhoto: false,
    img:
      'OTgyZDllM2ViOTk2ZjU1OWU2MzNmNGQxOTRkZWYzNzYxZDkwOWY1YTNiNjQ3ZDFhODUxZmVhZDY3YzMyYzlkMQ==',
    storeList: {
      sampleid: {
        name: 'coke',
        image:
          'OTgyZDllM2ViOTk2ZjU1OWU2MzNmNGQxOTRkZWYzNzYxZDkwOWY1YTNiNjQ3ZDFhODUxZmVhZDY3YzMyYzlkMQ=='
      }
    }
  };
};

it('calls setActualItem when yes is clicked', () => {
  const mockProps = getProps();

  const wrapper = shallow(<ConfirmationBox {...mockProps} />);
  wrapper.find({testattribute: 'YES'}).simulate('click');
  expect(mockProps.setActualItem).toHaveBeenCalledWith(mockProps.id);
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
