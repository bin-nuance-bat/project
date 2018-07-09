import React from 'react';
import './Notification.css';

export const Notification = props => {
	return <div className="notification">{props.message}</div>;
};
