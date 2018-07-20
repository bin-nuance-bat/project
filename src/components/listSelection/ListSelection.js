import React, {Component} from 'react';
import _ from 'lodash';
import './ListSelection.css';
import line from './line.svg';

class ListSelection extends Component {
	startsWithLetter = str => {
		return str.match(/^[a-z]/i);
	};

	formattedItems = (() => {
		let items = Object.entries(
			_.groupBy(
				_.sortBy(this.props.items, 'name'),
				item =>
					this.startsWithLetter(item.name)
						? item.name[0].toUpperCase()
						: '#'
			)
		);

		return items;
	})();

	handleClick = event => {
		this.props.onClick(event.target.getAttribute('data-key'));
	};

	render() {
		return (
			<div className="list-selection list-selection--body">
				{this.props.items.length > 0 &&
					this.formattedItems.map(([group, groupItems]) => (
						<div key={group}>
							<p className="list-selection list-selection--list-text list-selection--list-text--group-header">
								{group.toUpperCase()}
							</p>
							<img src={line} alt="" />
							{groupItems.map(item => (
								<div
									className="list-selection list-selection--list-item"
									key={item.id}
									data-key={item.id}
									onClick={this.handleClick}>
									<img
										className="list-selection list-selection--item-icon"
										src={item.image}
										alt=""
										data-key={item.id}
									/>
									<p
										data-key={item.id}
										className="list-selection list-selection--list-text list-selection--list-text--item-name">
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
