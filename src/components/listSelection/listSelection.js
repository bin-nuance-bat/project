import React, {Component} from 'react';
import _ from 'lodash';
import './ListSelection.css';
import line from './line.svg';

const compare = (a, b) => {
	if (a[0] > b[0]) return 1;
	if (a[0] < b[0]) return -1;
	return 0;
};

const getGroupedItems = items => {
	const groupList = _.groupBy(items, item => item.name[0]);
	return Object.entries(groupList).sort(compare);
};

class ListSelection extends Component {
	handleClick = event => {
		this.props.onClick(event.target.getAttribute('data-key'));
	};

	render() {
		const groupedItems = getGroupedItems(this.props.items);
		return (
			<div className="listselection">
				{groupedItems.map(([group, groupItems]) => (
					<div className="listgroup" key={group}>
						<p className="listtext grouptext">
							{group.toUpperCase()}
						</p>
						<img src={line} alt="" />
						{groupItems.map(item => (
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
