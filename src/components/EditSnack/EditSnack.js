import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListSelection from '../listSelection/ListSelection';
import Logo from '../Logo/Logo';
import {uriToTensor} from '../Admin/AdminUtils.js';
import {ControllerDataset} from '../Admin/Trainer/ControllerDataset';
import './EditSnack.css';
import Model from '../Admin/Trainer/Model';

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

const setStatusMock = () => {};

class EditSnack extends Component {
	constructor(props) {
		super(props);
		this.controllerDataset = new ControllerDataset();
		this.model = new Model(setStatusMock, setStatusMock);
		this.model.init();
	}

	handleClick = id => {
		this.props.setActualItem(id);
		let trainingImage = new Image(224, 224);
		trainingImage.src = this.props.prediction.img;
		let tensor = uriToTensor(trainingImage);
		let image = {
			img: this.props.prediction.img,
			activation: this.model.mobilenet.infer(tensor, 'conv_pw_13_relu'),
			label: id
		};
		this.controllerDataset.addImage(image, false);
		const nextPage = this.props.sendWithPhoto ? 'snackchat' : 'slackname';
		this.props.history.push('/' + nextPage);
	};

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
