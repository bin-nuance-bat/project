import React from 'react';
import ButtonList from '../ButtonList/ButtonList';
import {sendSlackMessage, getUserSlackID} from '../../utils/slack';
import Notification from './../Notification/Notification';
import PropTypes from 'prop-types';

const StoreList = props => {
	return (
		<div>
			Please select the correct item:
			<ButtonList
				items={props.storeList}
				onClick={(storeCode, itemName) => {
					let id = getUserSlackID(props.currentUser, props.users);
					sendSlackMessage(id, itemName, storeCode);
					props.setShowList(false);
					props.showNotification('Reminder sent to Slack');
				}}
			/>
			{props.loadStoreListError && (
				<Notification
					message="failed to load store items"
					isError={true}
				/>
			)}
		</div>
	);
};

StoreList.propTypes = {
	setShowList: PropTypes.func.isRequired,
	currentUser: PropTypes.string,
	users: PropTypes.arrayOf(PropTypes.object).isRequired,
	storeList: PropTypes.objectOf(PropTypes.object).isRequired
};

export default StoreList;
