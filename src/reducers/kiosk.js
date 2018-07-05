import {combineReducers} from 'redux';

// Actions
const SET_STORE = 'GET_STORE';

// Reducers
function store(state = [], action) {
	if (action.type === SET_STORE) return action.store;
	return state;
}

// Action Creators
export function setStore(store) {
	return {
		type: SET_STORE,
		store
	};
}

export default combineReducers({
	exchange: combineReducers({
		store
	})
});
