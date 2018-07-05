import React from 'react';
import ButtonList from '../ButtonList/ButtonList';
import getStore from '../../utils/honestyStore.js';

export default class StoreList extends React.Component {
	state = {
		storeList: []
	};

	usernameToID = username => {
		const user = this.props.users.find(
			user =>
				user.name === username || user.profile.real_name === username
		);
		return user ? user.id : null;
	};

	sendSlackMessage = async (username, itemName, storeCode) => {
		let id = this.usernameToID(username);
		if (!id) {
			alert('Error: Slack user not found');
			return null;
		}

		await fetch(`http://slack.com/api/chat.postMessage?token=${
			this.props.token
		}&
		channel=${id}&
		text=${`Click to purchase your ${itemName}: https://honesty.store/item/${storeCode}`}`)
			.then(res => alert('Payment reminder sent to Slack'))
			.catch(error => alert('Error: failed to send reminder'));
		return true;
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
							this.sendSlackMessage(
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
