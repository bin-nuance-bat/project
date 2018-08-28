import {SET_CAMERA_CONNECTED} from './actionTypes';

export function cameraConnected(state = true, action) {
  if (action.type === SET_CAMERA_CONNECTED) return action.cameraConnected;
  return state;
}
