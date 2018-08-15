import React from 'react';
import handBg from './HandBg.svg';
import handFg from './HandFg.svg';
import './Hand.css';
import PropTypes from 'prop-types';

const Hand = props => {
  const horizontalWideLong = [
    'boost',
    'crunchie',
    'curly-wurly',
    'mentos',
    'panda-liquorice',
    'twix',
    'winegums',
    'wrigleys'
  ];
  const horizontalWideShort = [
    'getbuzzing-mint-choc-high-protein',
    'getbuzzing-mixed-berries',
    'kit-kat-chunky',
    'mars',
    'misc-bar',
    'misc-big-bar',
    'nakd-apple-crunch',
    'nakd-berry-delight',
    'nakd-cashew-cookie',
    'nakd-cocoa-orange',
    'nature-valley-maple-syrup',
    'nature-valley-oats-dark-chocolate',
    'nature-valley-oats-n-honey',
    'smarties',
    'snickers',
    'trek-banana-bread-flapjack',
    'trek-peanut-power'
  ];
  const horizontalVeryWide = ['nakd-coconut-bliss-nibbles', 'skittles'];
  const horizontalNarrow = ['fruit-pastilles-roll'];
  const verticalLeftAligned = ['freddo'];
  const verticalRightAligned = [
    'coca-cola-can',
    'coca-cola-zero-can',
    'diet-cola-can',
    'diet-pepsi-can',
    'fruit-n-nuts-cranberry',
    'good4u-superseed-coconut-berry',
    'misc-can',
    'pepsi-max-can',
    'propercorn-fiery-worcester',
    'propercorn-lightly-salted',
    'propercorn-sweet-coconut-vanilla',
    'smokey-almonds-corn-cranberry'
  ];
  const verticalTall = ['misc-bottle'];
  const smallSquare = [
    'love-corn-habanero',
    'love-corn-sea-salt',
    'love-corn-smoked-bbq',
    'misc-crisps',
    'popchips-ridges-salt-vinegar',
    'popchips-ridges-smokey-bacon',
    'popchips-salt-pepper',
    'popchips-sour-cream-onion',
    'sun-maid',
    'walkers-cheese-onion',
    'walkers-ready-salted',
    'walkers-salt-vinegar'
  ];
  const largeSquare = [
    'mccoys',
    'mini-cheddars',
    'nude-popcorn-blue',
    'nude-popcorn',
    'snack-a-jacks'
  ];

  let transformationMatrix;
  if (props.snack) {
    if (horizontalWideLong.some(item => props.snack.includes(item)))
      transformationMatrix = 'matrix(0, 1.4, -1.4, 0, -35, 90)';
    else if (horizontalWideShort.some(item => props.snack.includes(item)))
      transformationMatrix = 'matrix(0, 1.2, -1.2, 0, -35, -10)';
    else if (horizontalVeryWide.some(item => props.snack.includes(item)))
      transformationMatrix = 'matrix(0, 1, -1, 0, -30, -10)';
    else if (horizontalNarrow.some(item => props.snack.includes(item)))
      transformationMatrix = 'matrix(0, 1.4, -1.4, 0, -35, 10)';
    else if (verticalRightAligned.some(item => props.snack.includes(item)))
      transformationMatrix = 'matrix(1.05, 0, 0, 1.05, -30, -20)';
    else if (verticalLeftAligned.some(item => props.snack.includes(item)))
      transformationMatrix = 'matrix(1.05, 0, 0, 1.05, 40, -20)';
    else if (verticalTall.some(item => props.snack.includes(item)))
      transformationMatrix = 'matrix(1.4, 0, 0, 1.4, -35, -30)';
    else if (smallSquare.some(item => props.snack.includes(item)))
      transformationMatrix = 'matrix(0.7, 0, 0, 0.7, -25, 10)';
    else if (largeSquare.some(item => props.snack.includes(item)))
      transformationMatrix = 'matrix(0.7, 0, 0, 0.7, -22, -30)';
  }
  return (
    <div className="hand-container">
      <div className="hand">
        <img className="hand-component" src={handBg} alt="" />
        <img
          className="hand-snack"
          src={props.snack}
          style={{
            transform: transformationMatrix
          }}
          alt=""
        />
        <img className="hand-component" src={handFg} alt="" />
      </div>
    </div>
  );
};

Hand.propTypes = {
  snack: PropTypes.string
};

export default Hand;
