import React from 'react';
import PropTypes from 'prop-types';
import labels from '../../utils/labels';

const ConfirmationBox = props => {
	return (
		<div>
			<div>{`Is this a ${labels[this.props.item]}?`}</div>
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
	item: PropTypes.string.isRequired,
	children: PropTypes.node
};

export default ConfirmationBox;
