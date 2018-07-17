import React from 'react';
import _ from 'lodash';

const getGroupedItems = items => {
	return _.groupBy(items, item => item.name[0]);
};

const ListSelection = ({items}) => {
	const groupedItems = getGroupedItems(items);
	return Object.entries(groupedItems).map(([group, groupItems]) => (
		<div key={group}>
			<h6>{group.toUpperCase()}</h6>
			{groupItems.map(item => <div key={item.id}>{item.name}</div>)}
		</div>
	));
};

export default ListSelection;
