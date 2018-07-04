import React, {Component} from 'react';
import ConfirmationBox from './ConfirmationBox';
import labels from '../../utils/labels';

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

export default ConfirmationBoxContainer;
