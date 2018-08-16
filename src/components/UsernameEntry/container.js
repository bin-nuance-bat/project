import {connect} from 'react-redux';
import UsernameEntry from './UsernameEntry';
import {sendSlackMessage} from './actions';
import {getUsers} from './UsernameEntrySelectors';

const mapStateToProps = state => {
  return {
    users: getUsers(state),
    sendWithPhoto: state.sendWithPhoto,
    actualItem: state.actualItem,
    prediction: state.prediction
  };
};

const mapDispatchToProps = {
  sendSlackMessage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsernameEntry);
