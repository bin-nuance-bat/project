import {connect} from 'react-redux';
import App from './App';
import getStore from '../../utils/honestyStore.js';
import {loadUsers} from './../../utils/slack';
import {
	setUsers,
	setSlackUserFetchError,
	setCurrentUser,
	setPrediction
} from './actions';
import {
	setStoreList,
	setLoadStoreListError,
	setShowList
} from './../StoreList/actions';

const mapStateToProps = state => {
	return {
		storeList: state.storeList,
		showList: state.showList,
		slackUserFetchError: state.slackUserFetchError,
		currentUser: state.currentUser,
		users: state.users,
		prediction: state.prediction
	};
};

const mapDispatchToProps = dispatch => {
	return {
		loadUsers: () =>
			loadUsers()
				.then(users => dispatch(setUsers(users)))
				.catch(() => dispatch(setSlackUserFetchError(true))),
		setCurrentUser: currentUser => dispatch(setCurrentUser(currentUser)),
		setPrediction: prediction => dispatch(setPrediction(prediction)),
		setShowList: showList => dispatch(setShowList(showList)),
		setSlackUserFetchError: isError =>
			dispatch(setSlackUserFetchError(isError)),
		getStoreList: () =>
			getStore()
				.then(storeList => {
					dispatch(setStoreList(storeList));
				})
				.catch(() => dispatch(setLoadStoreListError(true)))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
