import React from 'react';
import PropTypes from 'prop-types';
import ListSelection from '../Listselection/ListSelection';
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
				'./' + item.image.endsWith('.svg')
					? './' + item.image
					: './' + item.image + '.svg';
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
		<ListSelection
			items={items}
			onClick={id => {
				props.setActualItem(id);
				props.history.push('/slackname');
			}}
		/>
	);
};

EditSnack.propTypes = {
	setActualItem: PropTypes.func.isRequired,
	items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default EditSnack;
