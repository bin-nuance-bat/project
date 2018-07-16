import React from 'react';
import PropTypes from 'prop-types';
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
				<div className="text-select-slack">
					Please select your slack handle to send a reminder
				</div>
				<div>~list component~</div>
				<button className="button button-next">Next</button>
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
