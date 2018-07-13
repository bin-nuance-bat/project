import React from 'react';
import PropTypes from 'prop-types';
import SlackIcon from './SlackIcon';
import './UsernameEntry.css';
import Logo from '../Logo/Logo';

class UsernameEntry extends React.Component {
	sendReminder = async () => {
		let result = await this.props.sendSlackMessage(this.props.currentUser);
		if (result) this.props.history.push('/success');
		// TODO handle when result is false (i.e. message fails to send - redirect to error page?)
	};

	componentDidMount() {
		this.props.loadUsers();
	}

	render() {
		return (
			<div>
				<Logo />
				<div id="contents" className="flexColumn">
					<div className="flexRow">
						<div id="slackIcon">
							<SlackIcon size={100} />
						</div>
						<div className="flexColumn">
							<label id="formLabel" for="enterName">
								Your Slack handle is...
							</label>
							<input
								list="slackUsers"
								name="enterName"
								value={this.props.currentUser}
								onChange={event =>
									this.props.setCurrentUser(
										event.target.value
									)
								}
							/>
							<datalist id="slackUsers">
								{this.props.users.map((user, index) => (
									<option key={index} value={user.name} />
								))}
							</datalist>
						</div>
					</div>
					<div>
						<button
							onClick={this.sendReminder}
							className="button button-accept">
							Send me this reminder
						</button>
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
	loadUsers: PropTypes.func.isRequired,
	sendReminderError: PropTypes.bool.isRequired
};

export default UsernameEntry;
