import {SET_DATA_CONTROLLER} from './actionTypes';

export function dataController(state = {}, action) {
  if (action.type === SET_DATA_CONTROLLER) return action.name;
  return state;
}
