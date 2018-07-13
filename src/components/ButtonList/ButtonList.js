import React from 'react';
import PropTypes from 'prop-types';

class ButtonList extends React.Component {
	state = {
		userEntry: ''
	};

	getFilteredList() {
		return this.props.items.filter(item =>
			item.name.includes(this.state.userEntry)
		);
	}

	render() {
		const filteredList = this.getFilteredList();

		return (
			<div>
				<input
					value={this.state.userEntry}
					onChange={event =>
						this.setState({userEntry: event.target.value})
					}
				/>
				{filteredList.map(item => (
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
	).isRequired
};

export default ButtonList;
