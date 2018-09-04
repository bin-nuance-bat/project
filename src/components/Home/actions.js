import fetchItems from '../../utils/honestyStore.js';
import {
  SET_SEND_WITH_PHOTO,
  SET_USERS,
  SET_USER_REFERENCE,
  SET_STORELIST
} from './actionTypes';
import initFirebase from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/functions';

export function setSendWithPhoto(sendWithPhoto) {
  return {
    type: SET_SEND_WITH_PHOTO,
    sendWithPhoto
  };
}

export function setUserReference(userReference) {
  return {
    type: SET_USER_REFERENCE,
    userReference
  };
}

function setUsers(users) {
  return {
    type: SET_USERS,
    users
  };
}

export function setStoreList(storeList) {
  return {
    type: SET_STORELIST,
    storeList
  };
}

export const loadStoreList = () => async dispatch => {
  return await fetchItems().then(storeList =>
    dispatch(setStoreList(storeList))
  );
};

export const attemptLoadUsers = async () => {
  initFirebase();
  const load = firebase.functions().httpsCallable('loadSlackUsers');
  const result = await load();
  const data = result.data;
  if (!data.ok) throw Error('Failed to fetch users');
  else {
    const users = data.members.filter(user => !user.is_bot);
    const usersData = users.map(user => ({
      name: user.name,
      id: user.id,
      image: user.profile['image_48']
    }));
    return usersData;
  }
};

export const loadUsers = () => async dispatch => {
  return await attemptLoadUsers().then(users =>
    dispatch(setUsers({time: Date.now(), data: users}))
  );
};

export const loadSlackUserReference = () => async dispatch => {
  initFirebase();
  const load = firebase
    .functions()
    .httpsCallable('loadSlackShortListAndBlackList');
  const result = await load();
  const data = result.data;
  dispatch(setUserReference(data));
};
