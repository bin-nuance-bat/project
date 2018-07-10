import {
	SET_USERS,
	SET_SLACK_USER_FETCH_ERROR,
	SET_PREDICTION
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

export function prediction(state = null, action) {
	if (action.type === SET_PREDICTION) return action.prediction;
	return state;
}
