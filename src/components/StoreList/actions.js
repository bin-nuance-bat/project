function storeList(state = [], action) {
	if (action.type === SET_STORELIST) return action.store;
	return state;
}
