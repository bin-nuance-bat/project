import React from 'react';
import PropTypes from 'prop-types';

const ButtonList = props => {
	return (
		<div>
			{props.items.map(item => (
				<div key={item[0]}>
					<button
						onClick={() => props.onClick(item[0], item[1].name)}>
						{item[1].name}
					</button>
				</div>
			))}
		</div>
	);
};

ButtonList.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			index: PropTypes.number.isRequired,
			name: PropTypes.string.isRequired
		}).isRequired
	).isRequired
};

export default ButtonList;
