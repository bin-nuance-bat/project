import {connect} from 'react-redux';
import App from './OldApp';
import {setSlackUserFetchError, loadUsers} from './actions';
import {loadStoreList, setShowList} from './../StoreList/actions';

const mapStateToProps = state => {
  return {
    storeList: state.storeList,
    showList: state.showList,
    slackUserFetchError: state.slackUserFetchError,
    users: state.users,
    prediction: state.prediction
  };
};

const mapDispatchToProps = {
  loadUsers,
  loadStoreList,
  setShowList,
  setSlackUserFetchError
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
