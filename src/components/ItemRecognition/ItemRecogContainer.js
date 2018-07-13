import {connect} from 'react-redux';
import ItemRecognition from './ItemRecognition';
import {setPrediction} from './ItemRecogActions';

const mapStateToProps = state => ({prediction: state.prediction});

const mapDispatchToProps = {
	setPrediction
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ItemRecognition);
