import {
  SET_USERS,
  SET_USERS_FETCH_ERROR,
  SET_SEND_MESSAGE_ERROR
} from './actionTypes';

import retry from '../../utils/retry';

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
      () => `https://slack.com/api/chat.postMessage?token=${token}&
      channel=${userid}&icon_url=https://honesty.store/assets/android/icon@MDPI.png&username=honesty.store&
      text=${`Click to purchase your ${itemName}: https://honesty.store/item/${actualItemID}`}`,
      () => dispatch(setSendMessageError(true))
    ).then(response => {
      dispatch(setSendMessageError(false));
      return response.json();
    });
    return result.ok;
  } catch (error) {
    return false;
  }
};

// import initFirebase from '../../utils/firebase';
// import firebase from 'firebase/app';
// import functions from 'firebase/functions';
//     initFirebase();
//     const text = firebase.functions().httpsCallable('text');
//     text({text: 'a'}).then(function(result) {
//       console.log(result);
