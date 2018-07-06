import React from 'react';
import ButtonList from '../ButtonList/ButtonList';
import {sendSlackMessage, getUserSlackID} from '../../utils/slack';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const StoreList = props => {
	return (
		<div>
			<ButtonList
				items={props.storeList}
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
			{props.sendSlackMessageError && (
				<ErrorMessage text={'failed to send Slack message'} />
			)}
		</div>
	);
};

export default StoreList;
