import {SET_STORELIST} from './actionTypes';

export default function setStoreList(storeList) {
	return {
		type: SET_STORELIST,
		storeList
	};
}
