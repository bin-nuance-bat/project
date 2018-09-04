import {
  SET_SEND_WITH_PHOTO,
  SET_USERS,
  SET_USER_REFERENCE,
  SET_STORELIST,
  SET_LOAD_STORE_LIST_ERROR
} from './actionTypes';

export function storeList(state = {}, action) {
  if (action.type === SET_STORELIST) return action.storeList;
  return state;
}

export function loadStoreListError(state = false, action) {
  if (action.type === SET_LOAD_STORE_LIST_ERROR)
    return action.loadStoreListError;
  return state;
}

export function sendWithPhoto(state = true, action) {
  if (action.type === SET_SEND_WITH_PHOTO) return action.sendWithPhoto;
  return state;
}

export function users(state = {time: null, data: []}, action) {
  if (action.type === SET_USERS) return action.users;
  return state;
}

export function userReference(state = {}, action) {
  if (action.type === SET_USER_REFERENCE) return action.userReference;
  return state;
}
