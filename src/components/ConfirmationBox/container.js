import ConfirmationBox from './ConfirmationBox';
import {setActualItem} from './actions';
import {getPredictionName, getPredictionImg} from './ConfirmationBoxSelectors';
import {connect} from 'react-redux';

const mapStateToProps = state => ({
	name: getPredictionName(state),
	img: getPredictionImg(state)
});

const mapDispatchToProps = {
	setActualItem
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ConfirmationBox);
