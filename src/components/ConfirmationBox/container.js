import ConfirmationBox from './ConfirmationBox';
import {setActualItem} from './actions';
import {connect} from 'react-redux';

const mapStateToProps = state => {
	return {
		prediction: state.prediction,
		storeList: state.storeList
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setActualItem: itemName => {
			dispatch(setActualItem(itemName));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ConfirmationBox);
