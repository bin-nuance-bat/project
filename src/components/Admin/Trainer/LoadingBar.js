import React, {Component} from 'react';

const LoadingBar = props => {
  return (
    <div className="loading-bar">
      <div className="progress" style={{width: props.completion * 100 + '%'}} />
    </div>
  );
};

export default LoadingBar;
