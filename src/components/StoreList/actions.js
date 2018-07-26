import {SET_STORELIST, SET_LOAD_STORE_LIST_ERROR} from './actionTypes';

import fetchItems from '../../utils/honestyStore.js';

export function setStoreList(storeList) {
  return {
    type: SET_STORELIST,
    storeList
  };
}

export function setLoadStoreListError(loadStoreListError) {
  return {
    type: SET_LOAD_STORE_LIST_ERROR,
    loadStoreListError
  };
}

export const loadStoreList = () => dispatch =>
  fetchItems()
    .then(storeList => dispatch(setStoreList(storeList)))
    .catch(() => dispatch(setLoadStoreListError(true)));
