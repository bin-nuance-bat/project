import {connect} from 'react-redux';
import Home from './Home';
import {setSendWithPhoto} from './actions';
import {loadStoreList} from './../StoreList/actions';

const mapDispatchToProps = {
  setSendWithPhoto,
  loadStoreList
};

export default connect(
  null,
  mapDispatchToProps
)(Home);
