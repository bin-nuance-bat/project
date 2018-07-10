import React from 'react';
import './ErrorMessage.css';
import PropTypes from 'prop-types';

const ErrorMessage = props => {
	return <div className="errorMessage">Error: {props.text}</div>;
};

ErrorMessage.propTypes = {
	text: PropTypes.string.isRequired
};

export default ErrorMessage;
