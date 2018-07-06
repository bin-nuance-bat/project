import {connect} from 'react-redux';
import App from './App';
import {loadUsers} from './../../utils/slack';
import {
	setUsers,
	setSlackUserFetchError,
	setCurrentUser,
	setPrediction
} from './actions';
import {setShowList} from './../StoreList/actions';

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
		setCurrentUser: currentUser => dispatch(setCurrentUser(currentUser)),
		setPrediction: prediction => dispatch(setPrediction(prediction)),
		setShowList: showList => dispatch(setShowList(showList))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
