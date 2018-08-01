import {SET_STORELIST, SET_LOAD_STORE_LIST_ERROR} from './actionTypes';

import fetchItems from '../../utils/honestyStore.js';

import retry from '../../utils/retry';

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
  retry(() => fetchItems(), () => dispatch(setLoadStoreListError(true)))
    .then(storeList => {
      dispatch(setStoreList(storeList));
      dispatch(setLoadStoreListError(false));
    })
    .catch(() => dispatch(setLoadStoreListError(true)));
