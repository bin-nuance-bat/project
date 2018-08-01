import {connect} from 'react-redux';
import ItemRecognition from './ItemRecognition';
import {setPrediction} from './ItemRecognitionActions';

const mapStateToProps = state => ({
  prediction: state.prediction,
  storeList: state.storeList
});

const mapDispatchToProps = {
  setPrediction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemRecognition);
