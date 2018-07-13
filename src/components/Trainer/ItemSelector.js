import React, {Component} from 'react';

export default class ItemSelector extends Component {
	render() {
		return (
			<select
				value={this.props.item}
				disabled={this.props.disabled}
				onChange={e => this.props.setItem(e.target.value)}>
				{this.props.items.map(item => (
					<option key={item.id} value={item.id}>
						{item.name +
							(item.qualifier ? ` (${item.qualifier})` : '')}
					</option>
				))}
			</select>
		);
	}
}
