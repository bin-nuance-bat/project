import React from 'react';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ConfirmationBox from './ConfirmationBox';

configure({adapter: new Adapter()});

const getProps = () => {
  return {
    history: {
      replace: jest.fn()
    },
    setActualItem: jest.fn(),
    sendWithPhoto: false,
    storeList: {
      'ccad58e3-e27a-4463-9139-17a36ff7f7b8': {
        name: 'Coke',
        image:
          'OTgyZDllM2ViOTk2ZjU1OWU2MzNmNGQxOTRkZWYzNzYxZDkwOWY1YTNiNjQ3ZDFhODUxZmVhZDY3YzMyYzlkMQ=='
      }
    },
    prediction: {
      id: 'ccad58e3-e27a-4463-9139-17a36ff7f7b8',
      img:
        'OTgyZDllM2ViOTk2ZjU1OWU2MzNmNGQxOTRkZWYzNzYxZDkwOWY1YTNiNjQ3ZDFhODUxZmVhZDY3YzMyYzlkMQ=='
    }
  };
};

it('calls setActualItem when yes is clicked', () => {
  const mockProps = getProps();

  const wrapper = shallow(<ConfirmationBox {...mockProps} />);

  wrapper.find({'data-test': 'YES'}).simulate('click');
  expect(mockProps.setActualItem).toHaveBeenCalledWith(mockProps.prediction.id);
});

it('Goes to username entry page if yes clicked', () => {
  const mockProps = getProps();

  const wrapper = shallow(<ConfirmationBox {...mockProps} />);
  wrapper.find({'data-test': 'YES'}).simulate('click');
  expect(mockProps.history.replace).toHaveBeenCalledWith('/slackname');
});

it('Goes to edit snack page if no clicked', () => {
  const mockProps = getProps();

  const wrapper = shallow(<ConfirmationBox {...mockProps} />);
  wrapper.find({'data-test': 'NO'}).simulate('click');
  expect(mockProps.history.replace).toHaveBeenCalledWith('/editsnack');
});
