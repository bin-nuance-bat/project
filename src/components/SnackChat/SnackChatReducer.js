import {SET_SNACK_CHAT} from './SnackChatActionTypes';

export function snackChat(state = {}, action) {
  if (action.type === SET_SNACK_CHAT) return action.snackChat;
  return state;
}
