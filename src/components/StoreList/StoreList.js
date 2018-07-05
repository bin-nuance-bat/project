import React from 'react';
import ButtonList from '../ButtonList/ButtonList';
import getStore from '../../utils/honestyStore.js';
import {sendSlackMessage, getUserSlackID} from '../../utils/slack';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

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
							let id = getUserSlackID(
								this.props.currentUser,
								this.props.users
							);
							if (!id) throw new Error();
							sendSlackMessage(id, itemName, storeCode);
						} catch (error) {
							this.setState({sendSlackMessageError: true});
						}
					}}
				/>
				{this.state.sendSlackMessageError && (
					<ErrorMessage text={'failed to send Slack message'} />
				)}
			</div>
		);
	}
}
