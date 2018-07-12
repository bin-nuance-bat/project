import React from 'react';
import PropTypes from 'prop-types';

class UsernameEntry extends React.Component {
	componentDidMount() {
		this.props.loadUsers();
	}

	render() {
		return (
			<div>
				Slack Username:
				<input
					value={this.props.currentUser}
					onChange={event =>
						this.props.setCurrentUser(event.target.value)
					}
				/>
			</div>
		);
	}
}

UsernameEntry.propTypes = {
	users: PropTypes.arrayOf(PropTypes.object).isRequired,
	currentUser: PropTypes.string,
	setCurrentUser: PropTypes.func.isRequired,
	loadUsers: PropTypes.func.isRequired
};

export default UsernameEntry;
