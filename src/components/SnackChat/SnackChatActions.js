import {SET_SNACK_CHAT} from './SnackChatActionTypes';

const snackChat = snackChat => ({
	type: SET_SNACK_CHAT,
	snackChat
});

export const setSnackChat = img => dispatch => {
	dispatch(snackChat(img));
};
