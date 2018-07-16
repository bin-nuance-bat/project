import {connect} from 'react-redux';
import UsernameEntry from './UsernameEntry';
import {loadUsers, sendSlackMessage} from './actions';

const mapStateToProps = state => {
	return {
		users: state.users,
		sendReminderError: state.sendReminderError
	};
};

const mapDispatchToProps = {
	sendSlackMessage,
	loadUsers
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UsernameEntry);
