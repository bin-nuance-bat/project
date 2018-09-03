import {connect} from 'react-redux';
import UsernameEntry from './UsernameEntry';

const mapStateToProps = state => ({
  users: state.users.data,
  actualItem: state.actualItem,
  storeList: state.storeList,
  sendWithPhoto: state.sendWithPhoto,
  snackChat: state.snackChat,
  predictionID: state.prediction ? state.prediction.id : null,
  capturedImg: state.prediction ? state.prediction.img : null,
  dataController: state.dataController,
  shortList: state.users.data.filter(
    user => ({U03JBRHBZ: true}[user.id] === true)
  )
});

export default connect(mapStateToProps)(UsernameEntry);
