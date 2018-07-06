import {
	SET_USERS,
	SET_SLACK_USER_FETCH_ERROR,
	SET_CURRENT_USER,
	SET_PREDICTION
} from './actionTypes';

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

export function setCurrentUser(currentUser) {
	return {
		type: SET_CURRENT_USER,
		currentUser
	};
}

export function setPrediction(prediction) {
	return {
		type: SET_PREDICTION,
		prediction
	};
}
