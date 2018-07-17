import React from 'react';
import PropTypes from 'prop-types';
import './UsernameEntry.css';
import Logo from '../Logo/Logo';
import ButtonList from '../ButtonList/ButtonList';

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
					<ButtonList
						items={this.props.users}
						handleClick={(id, name) => this.sendReminder(name)}
					/>
				</div>
				<button className="button button-next">Next</button>
			</div>
		);
	}
}

UsernameEntry.propTypes = {
	users: PropTypes.arrayOf(PropTypes.object).isRequired,
	loadUsers: PropTypes.func.isRequired
};

export default UsernameEntry;
