import {SET_STORELIST} from './actionTypes';
import {storeList} from './actions';

export default function setStoreList(storeList) {
	return {
		type: SET_STORELIST,
		storeList
	};
}
