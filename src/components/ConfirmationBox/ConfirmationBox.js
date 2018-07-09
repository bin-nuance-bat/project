import React from 'react';
import PropTypes from 'prop-types';
import labels from '../../utils/labels';

const ConfirmationBox = props => {
	return (
		<div>
			<div>{`Is this a ${labels[props.item][0]}?`}</div>
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
	item: PropTypes.number.isRequired,
	children: PropTypes.node
};

export default ConfirmationBox;
