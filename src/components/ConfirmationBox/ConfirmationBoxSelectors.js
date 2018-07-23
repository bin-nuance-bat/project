export const getPredictionName = state => {
	return state.storeList && state.prediction
		? state.storeList.find(item => item.id === state.prediction.id).name
		: 'UNKNOWN';
};

export const getPredictionId = state => {
	return state.prediction ? state.prediction.id : null;
};

export const getPredictionImg = state => {
	return state.prediction ? state.prediction.img : null;
};
