import {SET_USERS} from './actionTypes';

const token = process.env.REACT_APP_SLACK_TOKEN;

function setUsers(users) {
  return {
    type: SET_USERS,
    users
  };
}

export const loadUsers = () => dispatch => {
  fetch(`https://slack.com/api/users.list?token=${token}`)
    .then(res => res.json())
    .then(data => {
      if (!data.ok) throw Error('failed to fetch users');
      else return data.members;
    })
    .then(users => dispatch(setUsers(users)))
    .catch(() => dispatch(setUsers([])));
};

const getIDByUsername = (username, users) => {
  const currentUser = users.find(
    user => user.name === username || user.profile.real_name === username
  );
  return currentUser ? currentUser.id : null;
};

export const sendSlackMessage = username => async (dispatch, getState) => {
  const state = getState();
  const id = getIDByUsername(username, state.users);

  const storeCode = state.actualItem;
  const itemName = state.storeList[storeCode].name;
  const names = Object.keys(state.storeList);
  // check that the saved store code exists
  let i;

  for (; i < names.length; i++) {
    if (names[i] === storeCode) break;
  }

  if (i === names.length) return false;

  try {
    await fetch(`https://slack.com/api/chat.postMessage?token=${token}&
		channel=${id}&
		text=${`Click to purchase your ${itemName}: https://honesty.store/item/${storeCode}`}`);
    return true;
  } catch (error) {
    return false;
  }
};
