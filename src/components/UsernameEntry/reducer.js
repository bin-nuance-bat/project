import {
	SET_USERS,
	SET_CURRENT_USER,
	SET_SEND_REMINDER_ERROR
} from './actionTypes';

export function users(state = [], action) {
	if (action.type === SET_USERS) return action.users;
	return state;
}

export function currentUser(state = '', action) {
	if (action.type === SET_CURRENT_USER) return action.currentUser;
	return state;
}
