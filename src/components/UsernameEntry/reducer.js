import {SET_SEND_MESSAGE_ERROR} from './actionTypes';

export function sendMessageError(state = false, action) {
  if (action.type === SET_SEND_MESSAGE_ERROR) return action.sendMessageError;
  return state;
}
