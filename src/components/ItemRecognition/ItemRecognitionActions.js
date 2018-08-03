import {SET_PREDICTION} from './ItemRecognitionActionTypes';
import {SET_SUGGESTIONS} from './ItemRecognitionActionTypes';

const predict = prediction => ({
  type: SET_PREDICTION,
  prediction
});

const suggest = suggestions => ({
  type: SET_SUGGESTIONS,
  suggestions
});

export const setPrediction = (id, img) => dispatch => {
  if (id && img) dispatch(predict({id, img}));
  else dispatch(predict(null));
};

export const setSuggestions = suggestions => dispatch => {
  dispatch(suggest(suggestions));
};
