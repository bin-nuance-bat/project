import {connect} from 'react-redux';
import EditSnack from './EditSnack';
import {setActualItem} from '../ConfirmationBox/actions';

const mapStateToProps = state => {
	return {
		items: Object.values(state.storeList),
		prediction: state.prediction,
		sendWithPhoto: state.sendWithPhoto
	};
};

const mapDispatchToProps = {
	setActualItem
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditSnack);
