import React from 'react';
import './Notification.css';

export const Notification = props => {
	return (
		<div className={'notification' + (props.isError ? 'Error' : 'Success')}>
			{props.message}
		</div>
	);
};

App.propTypes = {
	isError: PropTypes.bool.isRequired,
	message: propTypes.string.isRequired
};
