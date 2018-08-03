import {
  SET_USERS,
  SET_USERS_FETCH_ERROR,
  SET_SEND_MESSAGE_ERROR
} from './actionTypes';

import retry from '../../utils/retry';
import firebase from 'firebase/app';
import 'firebase/functions';

const token = process.env.REACT_APP_SLACK_TOKEN;

function setUsers(users) {
  return {
    type: SET_USERS,
    users
  };
}

function setUsersFetchError(usersFetchError) {
  return {
    type: SET_USERS_FETCH_ERROR,
    usersFetchError
  };
}

function setSendMessageError(sendMessageError) {
  return {
    type: SET_SEND_MESSAGE_ERROR,
    sendMessageError
  };
}

export const loadUsers = () => dispatch => {
  retry(
    () => fetch(`https://slack.com/api/users.list?token=${token}`),
    () => dispatch(setUsersFetchError(true))
  )
    .then(res => res.json())
    .then(data => {
      if (!data.ok) throw Error('failed to fetch users');
      else return data.members;
    })
    .then(users => users.filter(user => !user.is_bot))
    .then(users => {
      dispatch(setUsers(users));
      dispatch(setUsersFetchError(false));
    })
    .catch(() => dispatch(setUsers([])));
};

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
