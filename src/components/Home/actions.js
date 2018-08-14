import {SET_SEND_WITH_PHOTO, SET_USERS} from './actionTypes';
import initFirebase from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/functions';

export function setSendWithPhoto(sendWithPhoto) {
  return {
    type: SET_SEND_WITH_PHOTO,
    sendWithPhoto
  };
}

function setUsers(users) {
  return {
    type: SET_USERS,
    users
  };
}

export const attemptLoadUsers = async () => {
  initFirebase();
  const load = firebase.functions().httpsCallable('loadSlackUsers');
  const result = await load();
  const data = result.data;
  if (!data.ok) throw Error('Failed to fetch users');
  else return data;
};

export const loadUsers = () => dispatch => {
  return attemptLoadUsers()
    .then(data => data.members)
    .then(users => users.filter(user => !user.is_bot))
    .then(users => {
      dispatch(setUsers(users));
    });
};
