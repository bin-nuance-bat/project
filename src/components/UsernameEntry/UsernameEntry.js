import React from 'react';
import PropTypes from 'prop-types';
import SlackIcon from './../../res/SlackIcon';
import './UsernameEntry.css';

class UsernameEntry extends React.Component {
	componentDidMount() {
		this.props.loadUsers();
	}

	render() {
		return (
			<div>
				<SlackIcon size={100} />
				Your Slack handle is...
				<div>
					<input
						value={this.props.currentUser}
						onChange={event =>
							this.props.setCurrentUser(event.target.value)
						}
					/>
				</div>
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
