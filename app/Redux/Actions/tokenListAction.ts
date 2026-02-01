import { SELECTED_TOKEN_LIST } from "./types";

//for save
export const selectedTokenList = (item) => ({
  type: SELECTED_TOKEN_LIST,
  data: item,
});
