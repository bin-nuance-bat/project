import {
	SET_STORELIST,
	SET_LOAD_STORE_LIST_ERROR,
	SET_SHOW_LIST
} from './actionTypes';

import getStore from '../../utils/honestyStore.js';

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

export function setShowList(showList) {
	return {
		type: SET_SHOW_LIST,
		showList
	};
}

export const loadStoreList = () => (dispatch, props) =>
	getStore()
		.then(storeList => dispatch(setStoreList(storeList)))
		.catch(() => dispatch(setLoadStoreListError(true)));
