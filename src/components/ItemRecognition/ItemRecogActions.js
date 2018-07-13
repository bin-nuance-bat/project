import {SET_PREDICTION} from './ItemRecogActionTypes';

const predict = prediction => ({
	type: SET_PREDICTION,
	prediction
});

export const setPrediction = (id, img) => dispatch => {
	dispatch(predict({id, img}));
};
