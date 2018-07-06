import getStore from '../../utils/honestyStore.js';
import StoreList from './StoreList';
import {connect} from 'react-redux';
import {setStoreList} from './actions';

const mapStateToProps = state => {
	return {
		storeList: state.storeList,
		sendSlackMessageError: state.sendSlackMessageError
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
				.catch(err => console.error(err))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(StoreList);
