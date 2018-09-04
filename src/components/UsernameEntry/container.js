import {connect} from 'react-redux';
import UsernameEntry from './UsernameEntry';

const mapStateToProps = state => ({
  users: state.users.data.filter(
    user => state.userReference[user.name] !== 'BLACK_LIST'
  ),
  shortList: state.users.data.filter(
    user => state.userReference[user.name] === 'SHORT_LIST'
  ),
  actualItem: state.actualItem,
  storeList: state.storeList,
  sendWithPhoto: state.sendWithPhoto,
  snackChat: state.snackChat,
  predictionID: state.prediction ? state.prediction.id : null,
  capturedImg: state.prediction ? state.prediction.img : null,
  dataController: state.dataController
});

export default connect(mapStateToProps)(UsernameEntry);
