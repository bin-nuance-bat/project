import {SET_USERS, SET_USERS_FETCH_ERROR} from './actionTypes';

export function users(state = [], action) {
  if (action.type === SET_USERS) return action.users;
  return state;
}

export function loadUserListError(state = false, action) {
  if (action.type === SET_USERS_FETCH_ERROR) return action.usersFetchError;
  return state;
}
