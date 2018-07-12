import React from 'react';
import PropTypes from 'prop-types';
import SlackIcon from './SlackIcon';
import './UsernameEntry.css';

class UsernameEntry extends React.Component {
	componentDidMount() {
		this.props.loadUsers();
	}

	render() {
		return (
			<div id="contents" className="flex-row">
				<div id="slackIcon">
					<SlackIcon size={100} />
				</div>
				<div className="flex-column">
					<label id="formLabel">Your Slack handle is...</label>
					<div>
						<input
							value={this.props.currentUser}
							onChange={event =>
								this.props.setCurrentUser(event.target.value)
							}
						/>
					</div>
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
