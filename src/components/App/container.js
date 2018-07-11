import {connect} from 'react-redux';
import App from './App';
import {setSendWithPhoto} from './actions';
import {loadStoreList} from './../StoreList/actions';

const mapDispatchToProps = {
	setSendWithPhoto,
	loadStoreList
};

export default connect(
	null,
	mapDispatchToProps
)(App);
