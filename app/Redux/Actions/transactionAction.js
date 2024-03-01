import { TRANSACTION_DATA } from "./types";

//for save
export const addTransactionData = (item) => ({
  type: TRANSACTION_DATA,
  data: item,
});
