import {connect} from 'react-redux';
import ItemRecognition from './ItemRecognition';
import {setPrediction} from './actions';

const mapStateToProps = state => {
	return {prediction: state.prediction};
};

const mapDispatchToProps = dispatch => {
	return {
		setPrediction: (id, img) => {
			dispatch(setPrediction({id, img}));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ItemRecognition);
