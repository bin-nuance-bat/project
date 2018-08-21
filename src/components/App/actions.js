import {SET_DATA_CONTROLLER} from './actionTypes';

const setController = dataController => ({
  type: SET_DATA_CONTROLLER,
  name: dataController
});

export const setDataController = dataController => dispatch => {
  dispatch(setController(dataController));
};
