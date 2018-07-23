import React from 'react';
import './SuccessPage.css';
import Logo from './../Logo/Logo';
import Hand from './../Hand/Hand';

const SuccessPage = props => {
	return (
		<div onClick={() => props.history.push('/')}>
			<Logo />
			<div className="text text-remindersent">Reminder sent!</div>
			<div className="success-hand">
				<Hand
					snack={
						props.storeList.find(
							item => item.id === props.prediction.id
						).image
					}
				/>
			</div>
		</div>
	);
};

export default SuccessPage;
