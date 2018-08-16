import React from 'react';
import PropTypes from 'prop-types';

import './BackButton.css';
import BackArrow from './BackArrow.svg';

const BackButton = props => {
  return (
    <div>
      <button className="button btn-back" onClick={props.handleClick}>
        <img src={BackArrow} alt="" />
      </button>
    </div>
  );
};

BackButton.propTypes = {
  handleClick: PropTypes.func.isRequired
};

export default BackButton;
