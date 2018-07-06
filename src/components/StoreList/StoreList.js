import React from 'react';
import ButtonList from '../ButtonList/ButtonList';
import {sendSlackMessage, getUserSlackID} from '../../utils/slack';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

class StoreList extends React.Component {
	componentDidMount() {
		console.log(this.props);
		this.props.getStoreList();
	}

	render() {
		return (
			<div>
				<ButtonList
					items={this.props.storeList}
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
				{this.props.loadStoreListError && (
					<ErrorMessage text={'failed to load store items'} />
				)}
				{this.props.sendSlackMessageError && (
					<ErrorMessage text={'failed to send Slack message'} />
				)}
			</div>
		);
	}
}

export default StoreList;
