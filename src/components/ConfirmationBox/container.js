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
	id: getPredictionId(state)
});

const mapDispatchToProps = {
	setActualItem
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ConfirmationBox);
