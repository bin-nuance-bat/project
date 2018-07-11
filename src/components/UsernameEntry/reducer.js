import {SET_CURRENT_USER} from './actionTypes';

export function currentUser(state = '', action) {
	if (action.type === SET_CURRENT_USER) return action.currentUser;
	return state;
}
