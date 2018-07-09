import React from 'react';
import ButtonList from '../ButtonList/ButtonList';
import {sendSlackMessage, getUserSlackID} from '../../utils/slack';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import PropTypes from 'prop-types';

const StoreList = props => {
	return (
		<div>
			Please select the correct item:
			<ButtonList
				items={Object.values(props.storeList)}
				onClick={(storeCode, itemName) => {
					let id = getUserSlackID(props.currentUser, props.users);
					sendSlackMessage(id, itemName, storeCode);
					props.setShowList(false);
					props.showNotification('Reminder sent to Slack');
				}}
			/>
			{props.loadStoreListError && (
				<ErrorMessage text="failed to load store items" />
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
