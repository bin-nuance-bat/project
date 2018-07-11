import {SET_ACTUALITEM} from './actionTypes';

export function storeList(state = {name: ''}, action) {
	if (action.type === SET_ACTUALITEM) return action.name;
	return state;
}
