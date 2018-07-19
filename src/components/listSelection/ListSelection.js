import React, {Component} from 'react';
import _ from 'lodash';
import './ListSelection.css';
import line from './line.svg';

class ListSelection extends Component {
	formattedItems = (() => {
		let items = Object.entries(
			_.groupBy(
				_.sortBy(this.props.items, 'name'),
				item => (isNaN(item.name[0]) ? item.name[0] : '#')
			)
		);
		items.push(items.shift());
		return items;
	})();

	handleClick = event => {
		this.props.onClick(event.target.getAttribute('data-key'));
	};

	render() {
		return (
			<div className="listselection">
				{this.props.items.length > 0 &&
					this.formattedItems.map(([group, groupItems]) => (
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
