import {
	SET_USERS,
	SET_SLACK_USER_FETCH_ERROR,
	SET_CURRENT_USER
} from './actionTypes';

export function setUsers(users) {
	return {
		type: SET_USERS,
		users
	};
}

export function setSlackUserFetchError(error) {
	console.log('error');
	return {
		type: SET_SLACK_USER_FETCH_ERROR,
		error
	};
}

export function setCurrentUser(currentUser) {
	return {
		type: SET_CURRENT_USER,
		currentUser
	};
}
