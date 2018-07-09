import React from 'react';
import PropTypes from 'prop-types';

const ButtonList = props => {
	return (
		<div>
			{props.items.map(item => (
				<div key={item.index}>
					<button
						onClick={() => props.onClick(item.index, item.name)}>
						{item.name}
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
