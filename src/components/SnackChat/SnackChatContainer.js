import SnackChat from './SnackChat';
import {connect} from 'react-redux';
import {setSnackChat} from './SnackChatActions';
import {setSendWithPhoto} from '../Home/actions';

const mapStateToProps = state => ({
  storeList: state.storeList,
  actualItem: state.actualItem
});

const mapDispatchToProps = {
  setSendWithPhoto,
  setSnackChat
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SnackChat);
