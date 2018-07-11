import {SET_CURRENT_USER} from './actionTypes';

export function setCurrentUser(currentUser) {
	return {
		type: SET_CURRENT_USER,
		currentUser
	};
}
