import {connect} from 'react-redux';
import UsernameEntry from './UsernameEntry';
import {loadUsers, sendSlackMessage} from './actions';
import {getUsers} from './UsernameEntrySelectors';

const mapStateToProps = state => {
  return {
    users: getUsers(state)
  };
};

const mapDispatchToProps = {
  sendSlackMessage,
  loadUsers
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsernameEntry);
