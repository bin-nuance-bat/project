import React, {Component} from 'react';
import PropTypes from 'prop-types';
import setActualItem from './actions';

class ConfirmationBox extends Component {
	handleYes = () => {
		// set name of
		// go to slack enter
	};

	handleNo = () => {
		// go to item enter
	};

	render() {
		return (
			<div>
				<div>{`Did you take ${
					this.props.storeList[this.props.prediction.id].name
				}?`}</div>
				<img src={this.props.prediction.img} alt="" />
				<div>
					<button testID="YES" onClick={this.handleYes}>
						Yes
					</button>
					<button testID="NO" onClick={this.handleNo}>
						No
					</button>
				</div>
			</div>
		);
	}
}

ConfirmationBox.propTypes = {
	prediction: PropTypes.object.isRequired,
	storeList: PropTypes.objectOf(object).isRequired
};

const mapDispatchToProps = dispatch => {
	return {
		setActualItem: itemName => {
			dispatch(setActualItem(itemName));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ConfirmationBox);
