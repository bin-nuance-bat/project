import {SET_ACTUAL_ITEM} from './actionTypes';

export function setActualItem(actualItem) {
	return {
		type: SET_ACTUAL_ITEM,
		name: actualItem
	};
}
