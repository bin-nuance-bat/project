import React from 'react';
import _ from 'lodash';
import './ListSelection.css';
import line from './assets/line.svg';

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
				<div className="listgroup" key={group}>
					<p className="listtext grouptext">{group.toUpperCase()}</p>
					<img src={line} alt="" />
					{groupItems.map(item => (
						<div className="listitem" key={item.id}>
							<img className="itemicon" src={item.image} alt="" />
							<p className="listtext itemtext">{item.name}</p>
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default ListSelection;
