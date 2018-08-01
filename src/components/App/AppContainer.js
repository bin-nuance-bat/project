import App from './App';
import {connect} from 'react-redux';

const mapStateToProps = state => ({
  loadStoreListError: state.loadStoreListError,
  loadUserListError: state.loadUserListError,
  sendMessageError: state.sendMessageError
});

export default connect(mapStateToProps)(App);
