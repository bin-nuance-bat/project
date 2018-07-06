import getStore from '../../utils/honestyStore.js';
import StoreList from './StoreList';
import {connect} from 'react-redux';
import {setStoreList, setLoadStoreListError} from './actions';

const mapStateToProps = state => {
	return {
		storeList: state.storeList,
		sendSlackMessageError: state.sendSlackMessageError,
		loadStoreListError: state.loadStoreListError
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getStoreList: () =>
			getStore()
				.then(items =>
					items.map(item => ({
						name:
							item.name +
							(item.qualifier ? ' ' + item.qualifier : ''),
						index: item.id
					}))
				)
				.then(storeList => {
					dispatch(setStoreList(storeList));
				})
				.catch(err => dispatch(setLoadStoreListError(true)))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(StoreList);
