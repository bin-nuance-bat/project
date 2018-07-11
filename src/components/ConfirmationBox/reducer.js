import {SET_ACTUALITEM} from './actionTypes';

export function setActualItem(state = {}, action) {
	if (action.type === SET_ACTUALITEM) return action.name;
	return state;
}
