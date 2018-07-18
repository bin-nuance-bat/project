import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ButtonList from '../ButtonList/ButtonList';
import Logo from '../Logo/Logo';

class EditSnack extends Component {
	handleClick = (id, name) => {
		this.props.setActualItem(id);
		this.props.history.push('/slackname');
	};

	render() {
		return (
			<div>
				<Logo />
				<ButtonList
					items={this.props.items}
					onClick={this.handleClick}
				/>
			</div>
		);
	}
}

EditSnack.propTypes = {
	setActualItem: PropTypes.func.isRequired,
	items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default EditSnack;
