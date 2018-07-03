import React from 'react';

const IndexList = props => {
	return (
		<div>
			<ul>
				{props.items.map((item, index) => <li key={index}>{item}</li>)}
			</ul>
		</div>
	);
};

export default IndexList;
