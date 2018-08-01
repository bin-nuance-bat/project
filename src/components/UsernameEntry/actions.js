import {SET_USERS, SET_USERS_FETCH_ERROR} from './actionTypes';

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
    const result = await fetch(`https://slack.com/api/chat.postMessage?token=${token}&
		channel=${userid}&
		text=${`Click to purchase your ${itemName}: https://honesty.store/item/${actualItemID}`}`).then(
      response => response.json()
    );
    return result.ok;
  } catch (error) {
    return false;
  }
};
