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
  dispatch(predict({id, img}));
};

export const setSuggestions = suggestions => dispatch => {
  dispatch(suggest(suggestions));
};
