import React from 'react';

const ConfirmationBox = props => {
	return (
		<div>
			<div>{props.text}</div>
			{props.children}
			<div>
				<button onClick={props.onYes}>Yes</button>
				<button onClick={props.onNo}>No</button>
			</div>
		</div>
	);
};

export default ConfirmationBox;
