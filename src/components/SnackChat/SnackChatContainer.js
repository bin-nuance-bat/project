import SnackChat from './SnackChat';
import {connect} from 'react-redux';
import {setSnackChat} from './SnackChatActions';
import {setSendWithPhoto} from '../Home/actions';
import {loadStoreList} from '../StoreList/actions';

const mapStateToProps = state => ({
  storeList: state.storeList,
  actualItem: state.actualItem,
  predictionID: state.prediction ? state.prediction.id : null
});

const mapDispatchToProps = {
  setSendWithPhoto,
  setSnackChat,
  loadStoreList
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SnackChat);
