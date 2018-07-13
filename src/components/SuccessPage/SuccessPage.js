import React from 'react';
import './SuccessPage.css';

const SuccessPage = props => {
	return (
		<div id="page" onClick={() => props.history.push('/')}>
			Reminder sent!
		</div>
	);
};

export default SuccessPage;
