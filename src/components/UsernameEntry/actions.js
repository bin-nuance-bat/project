import {SET_USERS, SET_CURRENT_USER} from './actionTypes';
import {loadUsers as fetchUsers} from './../../utils/slack';

export function setUsers(users) {
	return {
		type: SET_USERS,
		users
	};
}

export function setCurrentUser(currentUser) {
	return {
		type: SET_CURRENT_USER,
		currentUser
	};
}

export const loadUsers = () => dispatch =>
	fetchUsers()
		.then(users => dispatch(setUsers(users)))
		.catch(() => dispatch(setUsers([])));
