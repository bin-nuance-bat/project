import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ConfirmationPage extends Component {
	constructor(props) {
		super(props);
		document.addEventListener('click', this.handleClick, false);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleClick, false);
	}

	handleClick = () => {
		this.props.history.push('/');
	};

	render() {
		return (
			<div>
				Enjoy your {this.props.storeList[this.props.prediction.id].name}
			</div>
		);
	}
}

ConfirmationPage.propTypes = {
	prediction: PropTypes.object,
	storeList: PropTypes.objectOf(PropTypes.object)
};

export default ConfirmationPage;
