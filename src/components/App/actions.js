import {SET_USERS, SET_SLACK_USER_FETCH_ERROR} from './actionTypes';

import {loadUsers as fetchUsers} from './../../utils/slack';

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

export const loadUsers = () => (dispatch, getState) =>
	fetchUsers()
		.then(users => dispatch(setUsers(users)))
		.catch(() => dispatch(setSlackUserFetchError(true)));
