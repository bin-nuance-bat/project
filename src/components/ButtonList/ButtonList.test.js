import React from 'react';
import ReactDOM from 'react-dom';
import ButtonList from './ButtonList';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

it('renders a list correctly', () => {
    const items = ["apple", "mars"]
    const wrapper = shallow(<ButtonList items={items} onClick={console.log}/>);
    expect(wrapper.find("button")).toHaveLength(2);
    expect(wrapper.find("button").at(0).contains('apple')).toBeTruthy();
    expect(wrapper.find("button").at(1).contains('mars')).toBeTruthy();
});

it('Click functions properly', () => {
    const items = ["apple", "mars"]
    let testFunc = jest.fn();
    const wrapper = shallow(<ButtonList items={items} onClick={testFunc}/>);
    wrapper.find("button").at(0).simulate('click');
    expect(testFunc).toHaveBeenCalledWith(0);
});