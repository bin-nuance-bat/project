import React from 'react';
import PropTypes from 'prop-types';
import SlackIcon from './SlackIcon';
import './UsernameEntry.css';

class UsernameEntry extends React.Component {
	sendReminder = () => {
		this.props.sendSlackMessage(this.props.currentUser);
		// handle this.props.sendReminderError
	};

	componentDidMount() {
		this.props.loadUsers();
	}

	render() {
		return (
			<div id="contents" className="flexColumn">
				<div className="flexRow">
					<div id="slackIcon">
						<SlackIcon size={100} />
					</div>
					<div className="flexColumn">
						<label id="formLabel">Your Slack handle is...</label>
						<div>
							<input
								value={this.props.currentUser}
								onChange={event =>
									this.props.setCurrentUser(
										event.target.value
									)
								}
							/>
						</div>
					</div>
				</div>
				<div>
					<button onClick={this.sendReminder} className="buttonBlue">
						Send me this reminder
					</button>
				</div>
			</div>
		);
	}
}

UsernameEntry.propTypes = {
	users: PropTypes.arrayOf(PropTypes.object).isRequired,
	currentUser: PropTypes.string,
	setCurrentUser: PropTypes.func.isRequired,
	loadUsers: PropTypes.func.isRequired,
	sendReminderError: PropTypes.bool.isRequired
};

export default UsernameEntry;
