import React from 'react';
import './SuccessPage.css';
import Logo from './../Logo/Logo';
import FreddoHand from './../FreddoHand/FreddoHand';

const SuccessPage = props => {
	return (
		<div id="page" onClick={() => props.history.push('/')}>
			<Logo />
			<div id="message">Reminder sent!</div>
			<div id="hand">
				<FreddoHand />
			</div>
		</div>
	);
};

export default SuccessPage;
