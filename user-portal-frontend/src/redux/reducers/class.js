import { ActionTypes } from "../actions/classAction";

const initialState = {
  classes: []
}

export const classReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.GET_CLASSES:
      return { ...state, classes: payload };
    default:
      return state;
  }
}
