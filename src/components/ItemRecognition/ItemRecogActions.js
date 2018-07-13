import {SET_PREDICTION} from './ItemRecogActionTypes';

export function setPrediction(prediction) {
	return {
		type: SET_PREDICTION,
		prediction
	};
}
