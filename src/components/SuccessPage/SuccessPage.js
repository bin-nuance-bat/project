import React from 'react';
import './SuccessPage.css';
import Logo from './../Logo/Logo';
import Hand from './../Hand/Hand';

const SuccessPage = props => {
	return (
		<div onClick={() => props.history.push('/')}>
			<Logo />
			<div className="text text-remindersent">Reminder sent!</div>
			<Hand />
		</div>
	);
};

export default SuccessPage;
