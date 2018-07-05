import {SET_USERS, SET_SLACK_USER_FETCH_ERROR} from './actionTypes';

export function users(state = [], action) {
	if (action.type === SET_USERS) return action.users;
	return state;
}

export function userFetchError(state = false, action) {
	if (action.type === SET_SLACK_USER_FETCH_ERROR)
		return action.slackUserFetchError;
	return state;
}
