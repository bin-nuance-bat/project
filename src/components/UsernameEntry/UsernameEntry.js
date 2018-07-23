import React from 'react';
import PropTypes from 'prop-types';
import './UsernameEntry.css';
import Logo from '../Logo/Logo';
import ListSelection from '../listSelection/ListSelection';
import TimeoutNotification from '../TimeoutNotification/TimeoutNotification';

class UsernameEntry extends React.Component {
	sendReminder = async name => {
		let result = await this.props.sendSlackMessage(name);
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
				<div>
					{this.props.users.length !== 0 && (
						<ListSelection
							items={this.props.users}
							onClick={this.sendReminder}
							iconSize={48}
						/>
					)}
				</div>
				<TimeoutNotification />
			</div>
		);
	}
}

UsernameEntry.propTypes = {
	users: PropTypes.arrayOf(PropTypes.object).isRequired,
	loadUsers: PropTypes.func.isRequired
};

export default UsernameEntry;
