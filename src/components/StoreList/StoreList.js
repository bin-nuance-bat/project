import React from 'react';
import ButtonList from '../ButtonList/ButtonList';
import getStore from '../../utils/honestyStore.js';
import sendSlackMessage from '../../utils/slack';

export default class StoreList extends React.Component {
	state = {
		storeList: []
	};

	componentDidMount() {
		getStore((err, items) => {
			if (err) return;
			this.setState({
				storeList: items.map(item => ({
					name:
						item.name +
						(item.qualifier ? ' ' + item.qualifier : ''),
					index: item.id
				}))
			});
		});
	}

	render() {
		return (
			<div>
				<ButtonList
					items={this.state.storeList}
					onClick={(storeCode, itemName) => {
						try {
							sendSlackMessage(
								this.props.username,
								itemName,
								storeCode
							);
						} catch (error) {
							alert(error);
						}
					}}
				/>
			</div>
		);
	}
}
