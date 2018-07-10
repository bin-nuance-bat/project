import React from 'react';
import PropTypes from 'prop-types';

class UsernameEntry extends React.Component {
	changeCurrentUser = currentUser => {
		this.props.setCurrentUser(currentUser);
	};

	render() {
		return (
			<div>
				Slack Username:
				<input
					value={this.props.currentUser}
					onChange={event =>
						this.changeCurrentUser(event.target.value)
					}
				/>
			</div>
		);
	}
}

UsernameEntry.propTypes = {
	currentUser: PropTypes.string,
	setCurrentUser: PropTypes.func.isRequired
};

export default UsernameEntry;
