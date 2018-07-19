import React from 'react';
import PropTypes from 'prop-types';
import ListSelection from '../listSelection/ListSelection';
import Logo from '../Logo/Logo';
import './EditSnack.css';

const importImages = require.context('./assets', true, /\.svg$/);
const imgFilesObject = importImages.keys().reduce((images, key) => {
	images[key] = importImages(key);
	return images;
}, {});

const EditSnack = props => {
	const items = props.items.map(item => {
		const relativeImagePath = './' + item.image;
		let actualImagePath;

		if (imgFilesObject[relativeImagePath]) {
			actualImagePath =
				'./' + item.image + (item.image.endsWith('.svg') ? '' : '.svg');
		} else {
			actualImagePath = './misc-bar.svg';
		}

		const image = importImages(actualImagePath);
		return {
			...item,
			image
		};
	});
	return (
		<div>
			<Logo />
			<div className="textinfo">
				<nobr>
					Sorry, I can’t recognise that snack. <br /> Please select it
					below
				</nobr>
			</div>
			<ListSelection
				items={items}
				onClick={id => {
					props.setActualItem(id);
					const nextPage = props.sendWithPhoto
						? 'snackchat'
						: 'slackname';
					props.history.push('/' + nextPage);
				}}
			/>
		</div>
	);
};

EditSnack.propTypes = {
	setActualItem: PropTypes.func.isRequired,
	items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default EditSnack;
