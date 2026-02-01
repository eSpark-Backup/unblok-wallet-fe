import { SEND_WALLET_DATA } from "../Actions/types";

const initialState = {
  sendData: [],
};

const walletSendDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_WALLET_DATA:
      return {
        ...state,
        sendData: action.data,
      };

    default:
      return state;
  }
};

export default walletSendDataReducer;
