import React from 'react';
import Slot from '../../assets/hands/HandsSlot.svg';
import HandsRight from '../../assets/hands/HandsRight.svg';
import HandsCenter from '../../assets/hands/HandsCenter.svg';
import HandsLeft from '../../assets/hands/HandsLeft.svg';
import PropTypes from 'prop-types';
import './HomeHands.css';

function HomeHands(props) {
  return (
    <div className={`home-hands ${props.up ? 'hands-up' : ''}`}>
      <img className="home-hands-slot" src={Slot} alt="" />
      <img className="home-hands-right" src={HandsRight} alt="" />
      <img className="home-hands-center" src={HandsCenter} alt="" />
      <img className="home-hands-left" src={HandsLeft} alt="" />
    </div>
  );
}

HomeHands.propTypes = {
  up: PropTypes.bool.isRequired
};

export default HomeHands;
