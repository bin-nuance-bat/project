import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ConfirmationBox extends Component {
	handleYes = () => {
		// go to slack enter
	};

	handleNo = () => {
		// go to item enter
	};

	render() {
		return (
			<div>
				<div>{`Did you take ${
					this.props.storeList[this.props.prediction.id]
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
	storeList: PropTypes.object.isRequired
};

export default connect(
	mapStateToProps,
	null
)(ConfirmationBox);
