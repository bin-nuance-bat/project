import StoreList from './StoreList';
import {connect} from 'react-redux';
import {setShowList} from './actions';

const mapStateToProps = state => {
	return {
		storeList: Object.values(state.storeList),
		loadStoreListError: state.loadStoreListError,
		currentUser: state.currentUser,
		users: state.users
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setShowList: showList => dispatch(setShowList(showList))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(StoreList);
