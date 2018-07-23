import React from 'react';
import handBg from './HandBg.svg';
import handFg from './HandFg.svg';
import './Hand.css';

const Hand = props => (
	<div className="hand">
		<img className="hand-component" src={handBg} alt="" />
		<img className="hand-snack" src={props.snack} alt="" />
		<img className="hand-component" src={handFg} alt="" />
	</div>
);

export default Hand;
