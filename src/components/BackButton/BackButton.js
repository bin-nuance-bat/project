import React from 'react';
import PropTypes from 'prop-types';
import BackArrow from './BackArrow.svg';

const BackButton = props => {
  return (
    <div>
      <button
        className="button button-back"
        onClick={() => props.history.replace('/')}>
        <img src={BackArrow} alt="" />
      </button>
    </div>
  );
};

BackButton.propTypes = {
  history: PropTypes.object.isRequired
};

export default BackButton;
