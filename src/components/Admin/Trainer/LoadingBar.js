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
    </div>
  );
};

LoadingBar.propTypes = {
  completion: PropTypes.number.isRequired
};

export default LoadingBar;
