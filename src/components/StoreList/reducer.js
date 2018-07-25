import {
  SET_STORELIST,
  SET_LOAD_STORE_LIST_ERROR,
  SET_SHOW_LIST
} from './actionTypes';

export function storeList(state = [], action) {
  if (action.type === SET_STORELIST) return action.storeList;
  return state;
}

export function loadStoreListError(state = false, action) {
  if (action.type === SET_LOAD_STORE_LIST_ERROR)
    return action.loadStoreListError;
  return state;
}

export function showList(state = false, action) {
  if (action.type === SET_SHOW_LIST) return action.showList;
  return state;
}
