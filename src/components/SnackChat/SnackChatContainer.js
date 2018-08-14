import SnackChat from './SnackChat';
import {connect} from 'react-redux';
import {setSnackChat} from './SnackChatActions';

const mapStateToProps = state => ({
  storeList: state.storeList,
  actualItem: state.actualItem
});

const mapDispatchToProps = {
  setSnackChat
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SnackChat);
