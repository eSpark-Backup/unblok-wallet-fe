import { SELECT_CURRENCY_LIST } from "./types";

//for save
export const selectedCurrencyList = (item) => ({
  type: SELECT_CURRENCY_LIST,
  data: item,
});
