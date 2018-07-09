import React from 'react';
import './Notification.css';

export const Notification = props => {
	return (
		<div
			className="notification"
			style={{backgroundColor: props.isError ? 'red' : 'lightgreen'}}>
			{props.message}
		</div>
	);
};
