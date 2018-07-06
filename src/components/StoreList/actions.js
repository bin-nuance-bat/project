import {SET_STORELIST} from './actionTypes';

export function setStoreList(storeList) {
	return {
		type: SET_STORELIST,
		storeList
	};
}
