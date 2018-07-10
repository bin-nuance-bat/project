import React from 'react';
import './Notification.css';
import PropTypes from 'prop-types';

export const Notification = props => {
	return (
		<div className={'notification' + (props.isError ? 'Error' : 'Success')}>
			{props.message}
		</div>
	);
};

Notification.propTypes = {
	isError: PropTypes.bool.isRequired,
	message: propTypes.string.isRequired
};
