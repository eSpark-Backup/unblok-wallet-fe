import { SEND_WALLET_DATA } from "./types";

//for save
export const sendData = (item) => ({
  type: SEND_WALLET_DATA,
  data: item,
});
