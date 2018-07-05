import {
	SET_USERS,
	SET_SLACK_USER_FETCH_ERROR,
	SET_CURRENT_USER
} from './actionTypes';

export function users(state = [], action) {
	if (action.type === SET_USERS) return action.users;
	return state;
}

export function slackUserFetchError(state = false, action) {
	if (action.type === SET_SLACK_USER_FETCH_ERROR)
		return action.slackUserFetchError;
	return state;
}

export function currentUser(state = '', action) {
	if (action.type === SET_CURRENT_USER) return action.currentUser;
	return state;
}
