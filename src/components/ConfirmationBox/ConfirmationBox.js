import React from 'react';
import PropTypes from 'prop-types';

const ConfirmationBox = props => {
	return (
		<div>
			<div>{`Is this a ${props.item.name}?`}</div>
			{props.children}
			<div>
				<button id="YES" onClick={props.onYes}>
					Yes
				</button>
				<button id="NO" onClick={props.onNo}>
					No
				</button>
			</div>
		</div>
	);
};

ConfirmationBox.propTypes = {
	onYes: PropTypes.func.isRequired,
	onNo: PropTypes.any.isRequired,
	item: PropTypes.object.isRequired,
	children: PropTypes.node
};

export default ConfirmationBox;
