import React from 'react';
import PropTypes from 'prop-types';

const LoadingBar = props => {
  return (
    <div className="loading-bar">
      {props.completion < 1 && (
        <div
          className="progress"
          style={{width: props.completion * 100 + '%'}}
        />
      )}
      <div id="status-text">{props.status}</div>
    </div>
  );
};

LoadingBar.propTypes = {
  completion: PropTypes.number.isRequired,
  status: PropTypes.string
};

export default LoadingBar;
