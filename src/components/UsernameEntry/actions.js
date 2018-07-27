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

// const getIDByUsername = (username, users) => {
//   const currentUser = users.find(
//     user => user.name === username || user.profile.real_name === username
//   );
//   return currentUser ? currentUser.id : null;
// };

export const sendSlackMessage = userid => async (dispatch, getState) => {
  const state = getState();
  //const id = getIDByUsername(username, state.users);

  const actualItemID = state.actualItem;
  const itemName = state.storeList[actualItemID].name;

  try {
    await fetch(`https://slack.com/api/chat.postMessage?token=${token}&
		channel=${userid}&
		text=${`Click to purchase your ${itemName}: https://honesty.store/item/${actualItemID}`}`)
      .then(result => result.json())
      .then(json => console.log(json));
    return true;
  } catch (error) {
    return false;
  }
};
