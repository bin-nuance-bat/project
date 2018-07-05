import React, {Component} from 'react';
import ConfirmationBox from './ConfirmationBox';
import labels from '../../utils/labels';
import PropTypes from 'prop-types';

class ConfirmationBoxContainer extends Component {
	render() {
		return (
			<ConfirmationBox
				text={`Is this a ${labels[this.props.item]}?`}
				onYes={this.confirm}
				onNo={this.props.onNo}>
				{this.props.children}
			</ConfirmationBox>
		);
	}
}

ConfirmationBoxContainer.propTypes = {
	item: PropTypes.string.isRequired,
	onNo: PropTypes.any.isRequired
};

export default ConfirmationBoxContainer;
