import React from 'react';
import ButtonList from '../ButtonList/ButtonList';
import {sendSlackMessage, getUserSlackID} from '../../utils/slack';
import Notification from './../Notification/Notification';
import PropTypes from 'prop-types';

const StoreList = props => {
  return (
    <div>
      My snack is a:
      <ButtonList
        items={props.storeList}
        onClick={async (storeCode, itemName) => {
          let id = getUserSlackID(props.currentUser, props.users);
          let result = await sendSlackMessage(id, itemName, storeCode);
          props.setShowList(false);
          if (result) props.showNotification('Reminder sent to Slack', false);
          else props.showNotification('Failed to send reminder to Slack', true);
        }}
      />
      {props.loadStoreListError && (
        <Notification message="failed to load store items" isError={true} />
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
