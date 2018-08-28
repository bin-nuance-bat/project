import {SET_PREDICTION, SET_CAMERA_CONNECTED} from './actionTypes';

export function setPrediction(prediction) {
  return {
    type: SET_PREDICTION,
    prediction
  };
}

export function setCameraConnected(cameraConnected) {
  return {
    type: SET_CAMERA_CONNECTED,
    cameraConnected
  };
}
