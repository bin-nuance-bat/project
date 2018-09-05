import {connect} from 'react-redux';
import Home from './Home';
import {
  loadStoreList,
  setSendWithPhoto,
  loadUsers,
  loadSlackUserReference
} from './actions';

const mapStateToProps = state => ({
  latestUsersFetchTime: state.users ? state.users.time : null
});

const mapDispatchToProps = {
  loadSlackUserReference,
  setSendWithPhoto,
  loadStoreList,
  loadUsers
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
