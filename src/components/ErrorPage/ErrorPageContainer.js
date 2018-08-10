import ErrorPage from './ErrorPage';
import {connect} from 'react-redux';
import {clearErrors} from './actions';

const mapDispatchToProps = {
  clearErrors
};

export default connect(
  null,
  mapDispatchToProps
)(ErrorPage);
