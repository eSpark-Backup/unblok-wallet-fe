import { TOTAL_CONVERT_BAL } from "./types";

//for save
export const convertedBalance = (item) => ({
  type: TOTAL_CONVERT_BAL,
  data: item,
});
