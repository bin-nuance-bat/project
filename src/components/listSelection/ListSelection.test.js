import React from 'react';
import {render, configure} from 'enzyme';
import ListSelection from './ListSelection.js';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

const getItems = () => [
  {
    id: 'fbe05463-a538-47aa-b4f1-654faa0a5b82',
    name: 'Granulated Sugar',
    qualifier: '2 Teaspoons',
    image: 'misc-bar.svg',
    isMarketplace: true,
    count: 979,
    price: {
      total: 6,
      breakdown: {
        wholesaleCost: 5,
        serviceFee: 1,
        donation: 0,
        handlingFee: 0,
        creditCardFee: 0,
        VAT: 0
      }
    },
    sellerId: '318ff9ec-4cd3-4eff-8f12-76f1e3ffa835'
  },
  {
    id: 'f589039e-c93b-45c1-99fc-1ee457ecb570',
    name: 'Wotsits',
    qualifier: null,
    image: 'misc-crisps.svg',
    isMarketplace: false,
    count: 0,
    price: {
      total: 25,
      breakdown: {
        wholesaleCost: 22,
        serviceFee: 3,
        donation: 0,
        handlingFee: 0,
        creditCardFee: 0,
        VAT: 0
      }
    },
    sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
  },
  {
    id: 'e615de4e-ce10-451b-80ad-9717662a904a',
    name: 'Pepsi Max',
    qualifier: null,
    image: 'pepsi-max-can.svg',
    isMarketplace: false,
    count: -8,
    price: {
      total: 38,
      breakdown: {
        wholesaleCost: 34,
        serviceFee: 4,
        donation: 0,
        handlingFee: 0,
        creditCardFee: 0,
        VAT: 0
      }
    },
    sellerId: '9127e1db-2a2c-41c5-908f-781ac816b633'
  }
];

it('Generates the list correctly', () => {
  const props = {
    onClick: jest.fn(),
    items: getItems(),
    iconStyle: ''
  };
  const wrapper = render(<ListSelection {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it('should put suggestions before the rest of the items if provided', () => {
  const props = {
    onClick: jest.fn(),
    items: getItems(),
    suggestions: [
      {
        id: 'e615de4e-ce10-451b-80ad-9717662a904a',
        name: 'Pepsi Max',
        qualifier: null,
        image: 'pepsi-max-can.svg',
        isMarketplace: false,
        count: -8,
        price: {
          total: 38,
          breakdown: {
            wholesaleCost: 34,
            serviceFee: 4,
            donation: 0,
            handlingFee: 0,
            creditCardFee: 0,
            VAT: 0
          }
        }
      }
    ],
    iconStyle: ''
  };

  const component = render(<ListSelection {...props} />);

  expect(
    component[0].children.find(
      child => child.attribs.class === 'list-selection--scroll-select'
    ).children[0].children[0].data
  ).toEqual('\u00A0');
});
