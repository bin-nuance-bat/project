import ConfirmationBox from './ConfirmationBox';
import {setActualItem} from './actions';
import {
  getPredictionName,
  getPredictionImg,
  getPredictionId
} from './ConfirmationBoxSelectors';
import {connect} from 'react-redux';

const mapStateToProps = state => ({
  name: getPredictionName(state),
  img: getPredictionImg(state),
  id: getPredictionId(state),
  sendWithPhoto: state.sendWithPhoto,
  storeList: state.storeList,
  dataController: state.dataController,
  prediction: state.prediction
});

const mapDispatchToProps = {
  setActualItem
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmationBox);
