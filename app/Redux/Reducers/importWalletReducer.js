import { IMPORT_WALLET_DATA } from "../Actions/types";

const initialState = {
  importData: [],
};

const importWalletReducer = (state = initialState, action) => {
  switch (action.type) {
    case IMPORT_WALLET_DATA:
      return {
        ...state,
        importData: action.data,
      };

    default:
      return state;
  }
};

export default importWalletReducer;
