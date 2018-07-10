import {
	SET_USERS,
	SET_SLACK_USER_FETCH_ERROR,
	SET_PREDICTION
} from './actionTypes';

import {loadUsers as reallyLoadUsers} from './../../utils/slack';

export function setUsers(users) {
	return {
		type: SET_USERS,
		users
	};
}

export function setSlackUserFetchError(slackUserFetchError) {
	return {
		type: SET_SLACK_USER_FETCH_ERROR,
		slackUserFetchError
	};
}

export function setPrediction(prediction) {
	return {
		type: SET_PREDICTION,
		prediction
	};
}

export const loadUsers = () => (dispatch, getState) =>
	reallyLoadUsers()
		.then(users => dispatch(setUsers(users)))
		.catch(() => dispatch(setSlackUserFetchError(true)));
