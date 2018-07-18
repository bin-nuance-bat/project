import React from 'react';
import PropTypes from 'prop-types';

class ButtonList extends React.Component {
	render() {
		return (
			<div>
				{this.props.items.map(item => (
					<div key={item.id}>
						<button
							onClick={() =>
								this.props.onClick(item.id, item.name)
							}>
							{item.name}
						</button>
					</div>
				))}
			</div>
		);
	}
}

ButtonList.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired
		}).isRequired
	).isRequired,
	handleClick: PropTypes.func.isRequired
};

export default ButtonList;
