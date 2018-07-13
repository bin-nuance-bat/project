import {SET_SEND_WITH_PHOTO} from './actionTypes';

export function setSendWithPhoto(sendWithPhoto) {
	return {
		type: SET_SEND_WITH_PHOTO,
		sendWithPhoto
	};
}
