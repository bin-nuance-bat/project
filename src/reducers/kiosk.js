import {combineReducers} from 'redux';

// Actions
const SET_STORE = 'SET_STORE';
const SET_USERS = 'SET_USERS';

// Reducers
function store(state = [], action) {
	if (action.type === SET_STORE) return action.store;
	return state;
}

function users(state = [], action) {
	if (action.type === SET_USERS) return action.users;
	return state;
}

// Action Creators
export function setStore(store) {
	return {
		type: SET_STORE,
		store
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
		store,
		users
	})
});
