import React from 'react';

const ErrorMessage = props => {
	return <div style={{color: 'red'}}>Error: {props.text}</div>;
};

export default ErrorMessage;
