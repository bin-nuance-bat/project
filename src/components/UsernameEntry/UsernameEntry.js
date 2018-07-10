import React from 'react';
import PropTypes from 'prop-types';

const UsernameEntry = props => {
	return (
		<div>
			Slack Username:
			<input
				value={props.currentUser}
				onChange={event => props.setCurrentUser(event.target.value)}
			/>
		</div>
	);
};

UsernameEntry.propTypes = {
	currentUser: PropTypes.string,
	setCurrentUser: PropTypes.func.isRequired
};

export default UsernameEntry;
