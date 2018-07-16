import {SET_ACTUAL_ITEM} from './actionTypes';

const setActual = actualItem => ({
	type: SET_ACTUAL_ITEM,
	name: actualItem
});

export const setActualItem = item => dispatch => {
	dispatch(setActual(item));
};
