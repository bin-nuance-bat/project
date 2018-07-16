import {SET_USERS, SET_SEND_REMINDER_ERROR} from './actionTypes';

export function users(state = [], action) {
	if (action.type === SET_USERS) return action.users;
	return state;
}

export function sendReminderError(state = true, action) {
	if (action.type === SET_SEND_REMINDER_ERROR)
		return action.sendReminderError;
	return state;
}
