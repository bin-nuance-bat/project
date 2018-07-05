import React from 'react';
import PropTypes from 'prop-types';

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

ConfirmationBox.propTypes = {
	onYes: PropTypes.func.isRequired,
	onNo: PropTypes.any.isRequired,
	text: PropTypes.string.isRequired
};

export default ConfirmationBox;
