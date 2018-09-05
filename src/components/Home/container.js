import {connect} from 'react-redux';
import Home from './Home';
import {setSendWithPhoto, loadUsers, loadSlackUserReference} from './actions';
import {loadStoreList} from './../StoreList/actions';

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
