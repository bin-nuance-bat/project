import App from './App';
import {connect} from 'react-redux';
import {setDataController} from './actions';
import {loadUsers, loadSlackUserReference} from '../Home/actions';

const mapDispatchToProps = {
  setDataController,
  loadSlackUserReference,
  loadUsers
};

export default connect(
  null,
  mapDispatchToProps
)(App);
