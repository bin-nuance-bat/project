import {SET_PREDICTION} from './actionTypes';

export function setPrediction(prediction) {
	return {
		type: SET_PREDICTION,
		prediction
	};
}
