import {connect} from 'react-redux';
import UsernameEntry from './UsernameEntry';
import {loadUsers, setCurrentUser, sendSlackMessage} from './actions';

const mapStateToProps = state => {
	return {
		currentUser: state.currentUser,
		users: state.users,
		sendReminderError: state.sendReminderError
	};
};

const mapDispatchToProps = {
	sendSlackMessage,
	loadUsers,
	setCurrentUser
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UsernameEntry);
