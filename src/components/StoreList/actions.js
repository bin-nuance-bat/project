import {SET_STORELIST} from './actionTypes';
import {storeList} from './reducer';

export default function setStoreList(storeList) {
	return {
		type: SET_STORELIST,
		storeList
	};
}
