import {SET_ACTUAL_ITEM} from './actionTypes';

export function actualItem(state = {}, action) {
	if (action.type === SET_ACTUAL_ITEM) return action.name;
	return state;
}
