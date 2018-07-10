import React from 'react';
import PropTypes from 'prop-types';

const ButtonList = props => {
	return (
		<div>
			{props.items.map(item => (
				<div key={item.id}>
					<button onClick={() => props.onClick(item.id, item.name)}>
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
			index: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired
		}).isRequired
	).isRequired
};

export default ButtonList;
