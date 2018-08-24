import {connect} from 'react-redux';
import Home from './Home';
import {setSendWithPhoto, loadUsers} from './actions';
import {loadStoreList} from './../StoreList/actions';

const mapDispatchToProps = {
  setSendWithPhoto,
  loadStoreList,
  loadUsers
};

export default connect(
  null,
  mapDispatchToProps
)(Home);
