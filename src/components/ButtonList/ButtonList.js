import React from 'react';

const ButtonList = props => {

	return(
		<div>
			{props.items.map((item, index) => 
				<div key={index}>
					<button onClick={props.onClick}>{item}</button>
				</div>)}
		</div>
	);
}

export default ButtonList;
