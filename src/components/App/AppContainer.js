import {connect} from 'react-redux';
import App from './App';
import {
	setSlackUserFetchError,
	setCurrentUser,
	setPrediction,
	loadUsers
} from './actions';
import {loadStoreList, setShowList} from './../StoreList/actions';

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
		loadUsers,
		loadStoreList,
		setCurrentUser: currentUser => dispatch(setCurrentUser(currentUser)),
		setPrediction: prediction => dispatch(setPrediction(prediction)),
		setShowList: showList => dispatch(setShowList(showList)),
		setSlackUserFetchError: isError =>
			dispatch(setSlackUserFetchError(isError))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
