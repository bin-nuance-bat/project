import {connect} from 'react-redux';
import ItemRecognition from './ItemRecognition';
import {setPrediction, setSuggestions} from './ItemRecognitionActions';

const mapStateToProps = state => ({
  prediction: state.prediction,
  storeList: state.storeList
});

const mapDispatchToProps = {
  setPrediction,
  setSuggestions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemRecognition);
