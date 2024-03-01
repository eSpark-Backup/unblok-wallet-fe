import { ALL_CURRENCY } from "../Actions/types";

const initialState = {
  Allcurrency: [],
};

const allCurrrencyReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALL_CURRENCY:
      return {
        ...state,
        Allcurrency: action.data,
      };

    default:
      return state;
  }
};

export default allCurrrencyReducer;
