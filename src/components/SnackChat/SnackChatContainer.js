import SnackChat from './SnackChat';
import {connect} from 'react-redux';
import {setSnackChat} from './SnackChatActions';

const mapStateToProps = state => ({
	storeList: state.storeList,
	prediction: state.prediction
});

const mapDispatchToProps = {
	setSnackChat
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SnackChat);
