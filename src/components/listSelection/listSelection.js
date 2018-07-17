import React from 'react';
import _ from 'lodash';
import './ListSelection.css';

const compare = (a, b) => {
	if (a[0] > b[0]) return 1;
	if (a[0] < b[0]) return -1;
	return 0;
};

const getGroupedItems = items => {
	const groupList = _.groupBy(items, item => item.name[0]);
	return Object.entries(groupList).sort(compare);
};

const ListSelection = ({items}) => {
	const groupedItems = getGroupedItems(items);
	return (
		<div className="listselection">
			{groupedItems.map(([group, groupItems]) => (
				<div key={group}>
					<p className="listtext group">{group.toUpperCase()}</p>
					<hr />
					{groupItems.map(item => (
						<div key={item.id}>
							<img className="itemicon" src={item.image} alt="" />
							<p className="listtext item">{item.name}</p>
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default ListSelection;
