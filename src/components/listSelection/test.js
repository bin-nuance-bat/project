import React from 'react';
import ListSelection from './ListSelection';
const importImages = require.context('./assets', true, /\.svg$/);
const imgFilesObject = importImages.keys().reduce((images, key) => {
	images[key] = importImages(key);
	return images;
}, {});

const test = () => {
	const items = [
		{
			id: 'foo',
			name: 'aar'
		},
		{
			id: 'foo2',
			name: 'cbar',
			image: imgFilesObject['./kit-kat-chunky.svg']
		},
		{
			id: 'foo3',
			name: 'dbar3',
			image: imgFilesObject['./kit-kat-chunky.svg']
		},
		{
			id: 'foo4',
			name: 'bar4',
			image: imgFilesObject['./kit-kat-chunky.svg']
		},
		{id: 'foo6', name: 'gar6'},
		{id: 'foo7', name: 'sdar7'},
		{id: 'foo8', name: 'bar8', image: imgFilesObject['./misc-bar.svg']},
		{id: 'foo9', name: 'nar9'},
		{id: 'foo20', name: 'zbar20'},
		{id: 'foo10', name: 'bar10'},
		{id: 'foo11', name: 'bar11'},
		{id: 'foo12', name: 'kar12'},
		{id: 'foo18', name: 'bar18'},
		{id: 'foo19', name: 'nar19'},
		{id: 'foo5', name: 'bar5'},
		{id: 'foo10', name: 'bar10'},
		{id: 'foo11', name: 'bar11'},
		{id: 'foo12', name: 'kar12'},
		{id: 'foo18', name: 'tsar18'},
		{id: 'foo19', name: 'nar19'}
	];

	return (
		<div>
			<h3 style={{position: 'sticky', top: '0'}}>Find Thing</h3>
			<ListSelection items={items} onClick={console.log} />
		</div>
	);
};

export default test;
