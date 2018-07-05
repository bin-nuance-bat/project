import {SET_USERS, SET_SLACK_USER_FETCH_ERROR} from './actionTypes';

export function setUsers(users) {
	return {
		type: SET_USERS,
		users
	};
}

export function setSlackUserFetchError(error) {
	return {
		type: SET_SLACK_USER_FETCH_ERROR,
		error
	};
}
