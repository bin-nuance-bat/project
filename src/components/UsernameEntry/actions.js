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

export const sendSlackMessage = user => async (dispatch, getState) => {
  const state = getState();

  const item = {
    id: state.actualItem,
    name: state.storeList[state.actualItem].name,
    price: state.storeList[state.actualItem].price.total
  };
  const snackChat = state.sendWithPhoto ? state.snackChat : null;

  try {
    const result = await retry(
      () => attemptSendSlackMessage(user, item, snackChat),
      () => dispatch(setSendMessageError(true))
    );
    dispatch(setSendMessageError(false));

    return result.ok;
  } catch (error) {
    return false;
  }
};

const attemptSendSlackMessage = async (user, item, snackChat) => {
  const endpoint = snackChat ? 'sendSnackChat' : 'sendSlackMessage';
  const send = firebase.functions().httpsCallable(endpoint);

  const result = await send({user, item, snackChat}).then(response => {
    return response.data;
  });
  if (!result.ok || result.error) {
    throw Error('A network error occured');
  }
  return result;
};
