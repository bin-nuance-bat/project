import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ButtonList from '../ButtonList/ButtonList';
import Logo from '../Logo/Logo';
import {uriToTensor} from '../Admin/AdminUtils.js';
import {ControllerDataset} from '../Admin/Trainer/ControllerDataset';

class EditSnack extends Component {
	handleClick = (id, name) => {
		this.props.setActualItem(id);
		let tensor = uriToTensor(this.props.prediction.img);
		let image = {
			img: this.props.prediction.img,
			activation: tensor,
			label: name
		};
		this.controllerDataset.addImage(image, false);
		this.props.history.push('/slackname');
	};

	componentDidMount() {
		this.controllerDataset = new ControllerDataset();
	}

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
