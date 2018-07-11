import {SET_SEND_WITH_PHOTO} from './actionTypes';

export function sendWithPhoto(state = true, action) {
	if (action.type === SET_SEND_WITH_PHOTO) return action.sendWithPhoto;
	return state;
}
