import {SET_USERS} from './actionTypes';

export default function setUsers(users) {
	return {
		type: SET_USERS,
		users
	};
}
