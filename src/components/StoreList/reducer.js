import {SET_STORELIST} from './actionTypes';

export default function storeList(state = [], action) {
	if (action.type === SET_STORELIST) return action.storeList;
	return state;
}
