import { ADD_WALLET_NAME } from "./types";

//for save
export const addWalletName = (item) => ({
  type: ADD_WALLET_NAME,
  data: item,
});

export const setShowingType = (item) => ({
  type: "setShowingType",
  data: item,
});
