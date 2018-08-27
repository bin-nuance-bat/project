import {SET_SEND_WITH_PHOTO, SET_USERS} from './actionTypes';

export function sendWithPhoto(state = true, action) {
  if (action.type === SET_SEND_WITH_PHOTO) return action.sendWithPhoto;
  return state;
}

export function users(state = [], action) {
  if (action.type === SET_USERS) return action.users;
  return state;
}
