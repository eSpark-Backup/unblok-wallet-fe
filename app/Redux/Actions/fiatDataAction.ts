import { FITA_DATA ,MY_ADD } from "./types";

//for save
export const fiatData = (item) => ({
  type: FITA_DATA,
  data: item,
});

export const swapData = (item) => ({
   type: "swap_datas",
  data: item,
});

export const DefaultCurrency = (item) => ({
  type: "DefaultCurrencys",
 data: item,
});

export const DefaultCurrencyName = (item) => ({
  type: "defaultCurrency",
 data: item,
});

export const footReducer = (item) => ({
  type: "footReducer",
 data: item,
});