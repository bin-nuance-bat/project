import {connect} from 'react-redux';
import ConfirmationPage from './ConfirmationPage';

const mapStateToProps = state => {
	return {
		prediction: state.prediction,
		storeList: state.storeList
	};
};

export default connect(mapStateToProps)(ConfirmationPage);
