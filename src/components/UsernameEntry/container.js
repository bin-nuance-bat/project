import {connect} from 'react-redux';
import UsernameEntry from './UsernameEntry';
import {loadUsers, setCurrentUser} from './actions';

const mapStateToProps = state => {
	return {
		currentUser: state.currentUser,
		users: state.users
	};
};

const mapDispatchToProps = {
	loadUsers,
	setCurrentUser
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UsernameEntry);
