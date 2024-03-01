import { ADD_WALLET_NAME } from "../Actions/types";

const initialState = {
  walletName: [],
  showingType: ""
};

const walletNameEditReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_WALLET_NAME:
      return {
        ...state,
        walletName: action.data,
      };

    case "setShowingType":
      return {
        ...state,
        showingType: action.data,
      };

    default:
      return state;
  }
};

export default walletNameEditReducer;
