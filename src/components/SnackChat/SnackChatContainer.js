import SnackChat from './SnackChat';
import {connect} from 'react-redux';
import {setSnackChat} from './SnackChatActions';

const mapDispatchToProps = {
	setSnackChat
};

export default connect(
	null,
	mapDispatchToProps
)(SnackChat);
