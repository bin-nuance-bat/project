import {connect} from 'react-redux';
import App from './App';
import {setSlackUserFetchError, loadUsers} from './actions';
import {loadStoreList, setShowList} from './../StoreList/actions';

const mapStateToProps = state => {
	return {
		storeList: state.storeList,
		showList: state.showList,
		slackUserFetchError: state.slackUserFetchError,
		users: state.users,
		prediction: state.prediction
	};
};

const mapDispatchToProps = dispatch => {
	return {
		loadUsers,
		loadStoreList,
		setShowList: showList => dispatch(setShowList(showList)),
		setSlackUserFetchError: isError =>
			dispatch(setSlackUserFetchError(isError))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
