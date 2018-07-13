import {SET_SNACK_CHAT} from './SnackChatActionTypes';

export function snackChat(state = {}, action) {
	console.log(action.type);
	console.log(action.snackChat);
	if (action.type === SET_SNACK_CHAT) return action.snackChat;
	return state;
}
