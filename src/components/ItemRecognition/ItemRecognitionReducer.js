import {
  SET_PREDICTION,
  SET_SUGGESTIONS
} from '../ItemRecognition/ItemRecognitionActionTypes';

export function prediction(state = null, action) {
  if (action.type === SET_PREDICTION) return action.prediction;
  return state;
}

export function suggestions(state = [], action) {
  if (action.type === SET_SUGGESTIONS) return action.suggestions;
  return state;
}
