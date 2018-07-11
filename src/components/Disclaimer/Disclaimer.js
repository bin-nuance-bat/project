import React from 'react';

const Disclaimer = props => {
	return (
		<div>
			~disclaimer~
			<button onClick={() => props.history.push('/scanitem')}>
				Agree
			</button>
		</div>
	);
};

export default Disclaimer;
