import SuccessPage from './SuccessPage';
import {connect} from 'react-redux';

const mapStateToProps = state => ({
	prediction: state.prediction,
	storeList: state.storeList
});

export default connect(mapStateToProps)(SuccessPage);
