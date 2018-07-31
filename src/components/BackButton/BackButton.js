import React from 'react';
import PropTypes from 'prop-types';

const BackButton = props => {
  return (
    <div>
      <button
        className="button button-back"
        onClick={() => props.history.replace('/')}>
        <svg width="59" height="61" viewBox="0 0 59 61">
          <g fill="none" fillRule="evenodd">
            <polygon points="0 0 59 0 59 59 0 59" />
            <polygon
              fill="#FFF"
              fillRule="nonzero"
              points="44 10.38 39.602 6 15 30.5 39.602 55 44 50.62 23.797 30.5"
            />
          </g>
        </svg>
      </button>
    </div>
  );
};

BackButton.propTypes = {
  history: PropTypes.object.isRequired
};

export default BackButton;
