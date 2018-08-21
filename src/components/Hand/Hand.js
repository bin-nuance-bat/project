import React from 'react';
import handBg from './HandBg.svg';
import handFg from './HandFg.svg';
import './Hand.css';
import PropTypes from 'prop-types';
import getSnackTransform from './../../utils/snackTransform';

const Hand = props => {
  const transformationMatrix = getSnackTransform(props.snack);
  return (
    <div className="hand-container">
      <div className="hand">
        <img className="hand-component" src={handBg} alt="" />
        <img
          className="hand-snack"
          src={props.snack}
          style={{
            transform: `matrix(${transformationMatrix.join(',')})`
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
