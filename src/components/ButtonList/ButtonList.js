import React from 'react';
import PropTypes from 'prop-types';

class ButtonList extends React.Component {
	state = {
		currentList: this.props.items,
		userEntry: ''
	};

	componentDidUpdate(prevProps, prevState) {
		if (prevState.userEntry !== this.state.userEntry) {
			const currentList = this.props.items.filter(item =>
				item.name.includes(this.state.userEntry)
			);
			this.setState({currentList});
		}
	}

	render() {
		return (
			<div>
				<input
					value={this.state.userEntry}
					onChange={event =>
						this.setState({userEntry: event.target.value})
					}
				/>
				{this.state.currentList.map(item => (
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
