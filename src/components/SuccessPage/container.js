import SuccessPage from './SuccessPage';
import {connect} from 'react-redux';

const mapStateToProps = state => ({
  actualItem: state.actualItem,
  storeList: state.storeList
});

export default connect(mapStateToProps)(SuccessPage);
