import React from 'react';
import './SuccessPage.css';
import Logo from './../Logo/Logo';
import FreddoHand from './../FreddoHand/FreddoHand';
import TimeoutNotification from '../TimeoutNotification/TimeoutNotification';

const SuccessPage = props => {
	return (
		<div onClick={() => props.history.push('/')}>
			<Logo />
			<div className="text text-remindersent">Reminder sent!</div>
			<div className="hand">
				<FreddoHand />
			</div>
			<TimeoutNotification />
		</div>
	);
};

export default SuccessPage;
