import {connect} from 'react-redux';
import App from './App';
import {loadUsers} from './../../utils/slack';
import {setUsers, setSlackUserFetchError, setCurrentUser} from './actions';

const mapStateToProps = state => {
	return {
		storeList: state.storeList,
		showList: state.showList,
		users: state.users,
		slackUserFetchError: state.slackUserFetchError,
		currentUser: state.currentUser,
		prediction: state.prediction
	};
};

const mapDispatchToProps = dispatch => {
	return {
		loadUsers: () =>
			loadUsers()
				.then(users => dispatch(setUsers(users)))
				.catch(error => dispatch(setSlackUserFetchError(true))),
		setCurrentUser: currentUser => dispatch(setCurrentUser(currentUser))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
