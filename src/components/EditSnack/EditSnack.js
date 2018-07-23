import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListSelection from '../listSelection/ListSelection';
import Logo from '../Logo/Logo';
import {uriToTensor} from '../Admin/AdminUtils.js';
import {ControllerDataset} from '../Admin/Trainer/ControllerDataset';
import './EditSnack.css';

const importImages = require.context('./assets', true, /\.svg$/);
const imgFilesObject = importImages.keys().reduce((images, key) => {
	images[key] = importImages(key);
	return images;
}, {});

const getImagePath = item => {
	const givenPath = './' + item.image;
	let actualImagePath;

	if (imgFilesObject[givenPath]) {
		actualImagePath =
			'./' + item.image + (item.image.endsWith('.svg') ? '' : '.svg');
	} else {
		actualImagePath = './misc-bar.svg';
	}

	return actualImagePath;
};

const addItemImage = item => {
	const imagePath = getImagePath(item);
	const image = importImages(imagePath);
	return {
		...item,
		image
	};
};

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
		const nextPage = this.props.sendWithPhoto ? 'snackchat' : 'slackname';
		this.props.history.push('/' + nextPage);
	};

	componentDidMount() {
		this.controllerDataset = new ControllerDataset();
	}

	render() {
		const items = this.props.items.map(addItemImage);
		return (
			<div>
				<Logo />
				<div className="edit-snack edit-snack--text-info">
					Sorry, I can’t recognise that snack. <br /> Please select it
					below
				</div>
				<ListSelection items={items} onClick={this.handleClick} />
			</div>
		);
	}
}

EditSnack.propTypes = {
	setActualItem: PropTypes.func.isRequired,
	items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default EditSnack;
