import React from 'react';
import ButtonList from '../ButtonList/ButtonList';
import getStore from '../../utils/honestyStore.js';

export default class StoreList extends React.Component {
	state = {
		storeList: []
	};

	getUserSlackID = () => {
		const user = this.props.users.find(
			user =>
				user.name === this.props.currentUser ||
				user.profile.real_name === this.props.currentUser
		);
		return user ? user.id : null;
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
							let id = this.getUserSlackID();
							if (!id) throw new Error();
							this.sendSlackMessage(id, itemName, storeCode);
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
