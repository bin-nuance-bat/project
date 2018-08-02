export const getPredictionName = state => {
  return state.storeList &&
    state.prediction &&
    state.storeList[state.prediction.id]
    ? state.storeList[state.prediction.id].name
    : 'UNKNOWN';
};

export const getPredictionId = state => {
  return state.prediction ? state.prediction.id : null;
};

export const getPredictionImg = state => {
  return state.prediction ? state.prediction.img : null;
};
