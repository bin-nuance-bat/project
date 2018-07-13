export const getPredictionName = state => {
	return state.storeList && state.prediction
		? state.storeList[state.prediction.id].name
		: 'UNKNOWN';
};

export const getPredictionImg = state => {
	return state.prediction ? state.prediction.img : null;
};
