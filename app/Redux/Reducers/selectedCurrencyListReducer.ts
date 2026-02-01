import { SELECT_CURRENCY_LIST } from "../Actions/types";

const initialState = {
  selectedList: [],
};

const selectedCurrencyListReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_CURRENCY_LIST:
      return {
        ...state,
        selectedList: action.data,
      };

    default:
      return state;
  }
};

export default selectedCurrencyListReducer;
