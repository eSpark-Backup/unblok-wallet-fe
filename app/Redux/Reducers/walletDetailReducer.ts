import { ADD_CURRENCY_DETAILS } from "../Actions/types";

const initialState = {
  currencyList: [],
};

const walletDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CURRENCY_DETAILS:
      return {
        ...state,
        currencyList: action.data,
      };

    default:
      return state;
  }
};

export default walletDetailReducer;
