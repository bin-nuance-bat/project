import App from './App';
import {connect} from 'react-redux';
import {setDataController} from './actions';

const mapStateToProps = state => ({
  loadStoreListError: state.loadStoreListError,
  loadUserListError: state.loadUserListError,
  sendMessageError: state.sendMessageError
});

const mapDispatchToProps = {
  setDataController
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
