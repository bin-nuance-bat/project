import React from 'react';
import ButtonList from '../ButtonList/ButtonList';
import {sendSlackMessage, getUserSlackID} from '../../utils/slack';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

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
				}}
			/>
			{props.loadStoreListError && (
				<ErrorMessage text="failed to load store items" />
			)}
		</div>
	);
};

export default StoreList;
