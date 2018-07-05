import {combineReducers} from 'redux';

// Actions
const SET_STORELIST = 'SET_STORELIST';
const SET_USERS = 'SET_USERS';

// Reducers
function storeList(state = [], action) {
	if (action.type === SET_STORELIST) return action.store;
	return state;
}

function users(state = [], action) {
	if (action.type === SET_USERS) return action.users;
	return state;
}

// Action Creators
export function setStoreList(storeList) {
	return {
		type: SET_STORELIST,
		storeList
	};
}

export function setUsers(users) {
	return {
		type: SET_USERS,
		users
	};
}

export default combineReducers({
	exchange: combineReducers({
		storeList,
		users
	})
});
