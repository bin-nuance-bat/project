import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListSelection from '../listSelection/ListSelection';
import Logo from '../Logo/Logo';
import './EditSnack.css';
import TimeoutNotification from '../TimeoutNotification/TimeoutNotification';

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
	handleClick = id => {
		this.props.setActualItem(id);
		const nextPage = this.props.sendWithPhoto ? 'snackchat' : 'slackname';
		this.props.history.push('/' + nextPage);
	};

	render() {
		const items = this.props.items.map(addItemImage);
		return (
			<div>
				<div className="edit-snack edit-snack--header">
					<Logo />
					<div className="edit-snack edit-snack--text-info">
						Sorry, I can’t recognise that snack. <br /> Please
						select it below
					</div>
				</div>
				<ListSelection
					className="edit-snack edit-snack--list-selection"
					iconStyle="snack-icon"
					items={items}
					onClick={this.handleClick}
				/>
				<TimeoutNotification />
			</div>
		);
	}
}

EditSnack.propTypes = {
	setActualItem: PropTypes.func.isRequired,
	items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default EditSnack;
