import React, {Component} from 'react';
import _ from 'lodash';
import './ListSelection.css';
import line from './line.svg';

const compareItems = (item1, item2) => {
	if (item1.name > item2.name) return 1;
	if (item1.name < item2.name) return -1;
	return 0;
};

const compare = (a, b) => {
	if ((a[0] > b[0] && b[0] != '#') || a[0] == '#') return 1;
	if ((a[0] < b[0] && a[0] != '#') || b[0] == '#') return -1;
	return 0;
};

const getGroupedItems = items => {
	const groupList = _.groupBy(items, item => {
		const firstLetter = item.name[0];
		const groupHeading = firstLetter.match(/[a-z]/i) ? firstLetter : '#';
		return groupHeading;
	});
	return Object.entries(groupList).sort(compare);
};

class ListSelection extends Component {
	groupedItems = getGroupedItems(this.props.items);

	handleClick = event => {
		this.props.onClick(event.target.getAttribute('data-key'));
	};

	render() {
		return (
			<div className="listselection">
				{this.groupedItems.map(([group, groupItems]) => (
					<div className="listgroup" key={group}>
						<p className="listtext grouptext">
							{group.toUpperCase()}
						</p>
						<img src={line} alt="" />
						{groupItems.sort(compareItems).map(item => (
							<div
								className="listitem"
								key={item.id}
								data-key={item.id}
								onClick={this.handleClick}>
								<img
									className="itemicon"
									src={item.image}
									alt=""
									data-key={item.id}
								/>
								<p
									data-key={item.id}
									className="listtext itemtext">
									{item.name}
								</p>
							</div>
						))}
					</div>
				))}
			</div>
		);
	}
}

export default ListSelection;
