import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
					<button testattribute="YES" onClick={this.handleYes}>
						Yes
					</button>
					<button testattribute="NO" onClick={this.handleNo}>
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

export default ConfirmationBox;
