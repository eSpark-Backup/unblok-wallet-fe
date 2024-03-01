import { TOTAL_CONVERT_BAL } from "../Actions/types";

const initialState = {
  convertedBalVal: [],
};

const totalConvertedBalReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOTAL_CONVERT_BAL:
      return {
        ...state,
        convertedBalVal: action.data,
      };

    default:
      return state;
  }
};

export default totalConvertedBalReducer;
