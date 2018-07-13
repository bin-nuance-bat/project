import {SET_PREDICTION} from '../ItemRecognition/actionTypes';

export function prediction(state = null, action) {
	if (action.type === SET_PREDICTION) return action.prediction;
	return state;
}
