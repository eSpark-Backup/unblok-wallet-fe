import { ADD_CURRENCY_DETAILS } from "./types";

//for save
export const addCurrencyDetails = (item) => ({
  type: ADD_CURRENCY_DETAILS,
  data: item,
});
