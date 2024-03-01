import { ADD_SCAN_DATA } from "../Actions/types";

const initialState = {
  scanData: [],
};

const scanDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SCAN_DATA:
      return {
        ...state,
        scanData: action.data,
      };

    default:
      return state;
  }
};

export default scanDataReducer;
