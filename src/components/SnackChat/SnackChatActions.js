import {SET_SNACK_CHAT} from './SnackChatActionTypes';

const snackChat = snackChatImage => ({
  type: SET_SNACK_CHAT,
  snackChatImage
});

export const setSnackChat = img => dispatch => {
  dispatch(snackChat(img));
};
