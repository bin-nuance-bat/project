import {SET_ACTUALITEM} from './actionTypes';

export function setActualItem(actualItem) {
	return {
		type: SET_ACTUALITEM,
		actualItem
	};
}
