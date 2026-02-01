import { TRANSACTION_DATA } from "../Actions/types";

const initialState = {
  transactionData: [],
};

const transactionDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case TRANSACTION_DATA:
      return {
        ...state,
        transactionData: action.data,
      };

    default:
      return state;
  }
};

export default transactionDataReducer;
