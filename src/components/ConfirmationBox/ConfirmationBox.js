import React from 'react';
import PropTypes from 'prop-types';

class ConfirmationBox extends React.Component {
	handleYes = () => {
		this.props.setActualItem(this.props.id);
		this.props.history.push('/slackname');
	};

	handleNo = () => {
		this.props.history.push('/editSnack');
	};

	render() {
		return (
			<div>
				<div>{`Did you take ${this.props.name}?`}</div>
				<img src={this.props.img} alt="" />
				<div>
					<button testAttribute="YES" onClick={this.handleYes}>
						Yes
					</button>
					<button testAttribute="NO" onClick={this.handleNo}>
						No
					</button>
				</div>
			</div>
		);
	}
}

ConfirmationBox.propTypes = {
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	img: PropTypes.string.isRequired
};

export default ConfirmationBox;
