import {connect} from 'react-redux';
import UsernameEntry from './UsernameEntry';
import {getUsers} from './UsernameEntrySelectors';

const mapStateToProps = state => ({
  users: getUsers(state),
  actualItem: state.actualItem,
  storeList: state.storeList,
  sendWithPhoto: state.sendWithPhoto,
  snackChat: state.snackChat,
  predictionID: state.prediction ? state.prediction.id : null,
  capturedImg: state.prediction ? state.prediction.img : null,
  dataController: state.dataController
});

export default connect(mapStateToProps)(UsernameEntry);
