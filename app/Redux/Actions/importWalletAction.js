import { IMPORT_WALLET_DATA } from "./types";

//for save
export const importWallet = (item) => ({
  type: IMPORT_WALLET_DATA,
  data: item,
});
