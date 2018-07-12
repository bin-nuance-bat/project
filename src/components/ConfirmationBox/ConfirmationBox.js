import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {setActualItem} from './actions';
import {connect} from 'react-redux';

class ConfirmationBox extends Component {
	handleYes = () => {
		this.props.setActualItem(
			this.props.storeList[this.props.prediction.id].name
		);
		this.props.history.push('/slackname');
	};

	handleNo = () => {
		this.props.history.push('/editSnack');
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
	storeList: PropTypes.objectOf(PropTypes.object).isRequired
};

const mapStateToProps = state => {
	return {
		prediction: state.prediction,
		storeList: state.storeList
	};
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
