import { SELECTED_TOKEN_LIST } from "../Actions/types";

const initialState = {
  tokenList: [],
};

const tokenListReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECTED_TOKEN_LIST:
      return {
        ...state,
        tokenList: action.data,
      };

    default:
      return state;
  }
};

export default tokenListReducer;
