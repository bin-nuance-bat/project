import {SET_SEND_MESSAGE_ERROR} from './actionTypes';

import retry from '../../utils/retry';
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
  const snackChat = state.sendWithPhoto ? state.snackChat : null;

  try {
    const result = await retry(
      () => attemptSendSlackMessage(userid, itemName, actualItemID, snackChat),
      () => dispatch(setSendMessageError(true))
    );
    dispatch(setSendMessageError(false));

    return result.ok;
  } catch (error) {
    return false;
  }
};

const attemptSendSlackMessage = async (
  userid,
  itemName,
  actualItemID,
  snackChat
) => {
  const endpoint = snackChat ? 'sendSnackChat' : 'sendSlackMessage';
  const send = firebase.functions().httpsCallable(endpoint);

  const result = await send({userid, itemName, actualItemID, snackChat}).then(
    response => {
      return response.data;
    }
  );
  if (!result.ok) {
    throw Error('A network error occured');
  }
  return result;
};
