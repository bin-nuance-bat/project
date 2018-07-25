import React from 'react';
import handBg from './HandBg.svg';
import handFg from './HandFg.svg';
import './Hand.css';
import PropTypes from 'prop-types';

const Hand = props => {
  const itemsToRotate = [
    'boost',
    'crunchie',
    'curly-wurly',
    'fruit-pastilles-roll',
    'getbuzzing-mint-choc-high-protein',
    'getbuzzing-mixed-berries',
    'kit-kat-chunky',
    'mars',
    'mentos',
    'misc-bar',
    'nakd-apple-crunch',
    'nakd-berry-delight',
    'nakd-cashew-cookie',
    'nakd-cocoa-orange',
    'nakd-coconut-bliss-nibbles',
    'nature-valley-maple-syrup',
    'nature-valley-oats-dark-chocolate',
    'nature-valley-oats-n-honey',
    'panda-liquorice',
    'skittles',
    'smarties',
    'snickers',
    'trek-banana-bread-flapjack',
    'trek-peanut-power',
    'twix',
    'winegums',
    'wrigleys'
  ];

  const rotate = itemsToRotate.some(item => props.snack.includes(item));

  const freddo = props.snack.includes('freddo');

  return (
    <div className="hand">
      <img className="hand-component" src={handBg} alt="" />
      <img
        className="hand-snack"
        src={props.snack}
        style={{
          transform: freddo
            ? 'matrix(1, 0, 0, 1, 85, 60)'
            : `matrix(${
                rotate ? '0, 1.2, -1.2, 0, 30, 140' : '0.8, 0, 0, 0.8, 30, 30'
              })`
        }}
        alt=""
      />
      <img className="hand-component" src={handFg} alt="" />
    </div>
  );
};

Hand.propTypes = {
  snack: PropTypes.string
};

export default Hand;
