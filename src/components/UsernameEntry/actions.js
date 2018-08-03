import {SET_SEND_MESSAGE_ERROR} from './actionTypes';

import retry from '../../utils/retry';
import firebase from 'firebase/app';
import 'firebase/functions';

import firebase from 'firebase/app';
import 'firebase/functions';

function setSendMessageError(sendMessageError) {
  return {
    type: SET_SEND_MESSAGE_ERROR,
    sendMessageError
  };
}

export const sendSlackMessage = userid => async (dispatch, getState) => {
  const state = getState();
  const actualItemID = state.actualItem;
  const itemName = state.storeList[actualItemID].name;

  try {
    const result = await retry(
      () => attemptSendSlackMessage(userid, itemName, actualItemID),
      () => dispatch(setSendMessageError(true))
    );
    dispatch(setSendMessageError(false));

    return result.ok;
  } catch (error) {
    return false;
  }
};

const attemptSendSlackMessage = async (userid, itemName, actualItemID) => {
  const send = firebase.functions().httpsCallable('sendSlackMessage');

  const result = await send({userid, itemName, actualItemID}).then(response => {
    return response.data;
  });
  if (!result.ok) {
    throw Error('A network error occured');
  }
  return result;
};
