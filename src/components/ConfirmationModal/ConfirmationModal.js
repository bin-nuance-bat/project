import React from 'react';
import PropTypes from 'prop-types';

import './ConfirmationModal.css';

const ConfirmationModal = props => {
  return (
    <div className="confirm-modal">
      <button
        className="button btn-primary btn-half-block btn-modal"
        disabled={props.disabled}
        onClick={props.onClick}>
        {props.disabled ? 'Sending...' : 'Next'}
      </button>
    </div>
  );
};

ConfirmationModal.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default ConfirmationModal;
