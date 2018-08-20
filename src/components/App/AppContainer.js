import App from './App';
import {connect} from 'react-redux';
import {setDataController} from './actions';

const mapDispatchToProps = {
  setDataController
};

export default connect(
  null,
  mapDispatchToProps
)(App);
