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
				items={props.storeList}
				onClick={async (storeCode, itemName) => {
					let id = getUserSlackID(props.currentUser, props.users);
					let result = await sendSlackMessage(
						id,
						itemName,
						storeCode
					);
					props.setShowList(false);
					if (result)
						props.showNotification('Reminder sent to Slack', false);
					else
						props.showNotification(
							'Failed to send reminder to Slack',
							true
						);
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
	storeList: PropTypes.arrayOf(PropTypes.object).isRequired,
	showNotification: PropTypes.func.isRequired,
	loadStoreListError: PropTypes.func.isRequired
};

export default StoreList;
