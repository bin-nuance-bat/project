import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = props => {
	return <div className="errorMessage">Error: {props.text}</div>;
};

export default ErrorMessage;
