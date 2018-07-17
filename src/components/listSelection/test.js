import React from 'react';
import ListSelection from './listSelection';

const test = () => {
	const items = [
		{id: 'foo', name: 'bar'},
		{id: 'foo2', name: 'cbar'},
		{id: 'foo3', name: 'dbar3'},
		{id: 'foo4', name: 'bar4'},
		{id: 'foo6', name: 'gar6'},
		{id: 'foo7', name: 'bar7'},
		{id: 'foo8', name: 'bar8'},
		{id: 'foo9', name: 'bar9'},
		{id: 'foo20', name: 'zbar20'},
		{id: 'foo10', name: 'bar10'},
		{id: 'foo11', name: 'bar11'},
		{id: 'foo12', name: 'bar12'},
		{id: 'foo18', name: 'bar18'},
		{id: 'foo19', name: 'bar19'},
		{id: 'foo5', name: 'bar5'}
	];

	return <ListSelection items={items} />;
};

export default test;
