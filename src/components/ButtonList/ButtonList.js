import React from 'react';

const ButtonList = props => {
	return (
		<div>
			{props.items.map((item) => (
				<div key={item.index}>
					<button onClick={() => props.onClick(item.index)}>{item.name}</button>
				</div>
			))}
		</div>
	);
};

export default ButtonList;
