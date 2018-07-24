import React, {Component} from 'react';
import _ from 'lodash';
import './ListSelection.css';
import line from './line.svg';

class ListSelection extends Component {
	startsWithLetter = str => {
		return str.match(/^[a-z]/i);
	};

	componentDidMount() {
		document.addEventListener('touchmove', this.handleMove, false);
	}

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

	handleMove(e) {
		console.log(e.changedTouches[0]);
	}

	handleClick = event => {
		this.props.onClick(event.target.getAttribute('data-key'));
	};

	render() {
		return (
			<div className="list-selection list-selection--body">
				<div className="list-selection list-selection--list">
					{this.props.items.length > 0 &&
						this.formattedItems.map(([group, groupItems]) => (
							<div key={group} id={group}>
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
				<div className="list-selection--scroll-select">
					{this.formattedItems.map(([group, groupHeading]) => (
						<div
							key={group}
							type="scrollSelector"
							onTouchStart={() =>
								(window.location.hash = '#' + group)
							}>
							{group}
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default ListSelection;
