// import React from 'react';
// import {render, configure, shallow, mount} from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
import {loadUsers} from './actions';
import {loadStoreList} from './../StoreList/actions';
import fetch from 'jest-fetch-mock';
// import Home from './home.js';
// console.log(89);

// configure({adapter: new Adapter()});

describe('Load Users behaves correctly', () => {
  it('Calls dispatch when first call is a sucsess', () => {
    // fetch.mockResponse(JSON.stringify({access_token: '12345'}));
    const mockDispatch = jest.fn();
    loadUsers()(mockDispatch);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
