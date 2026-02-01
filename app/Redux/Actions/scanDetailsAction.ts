import { ADD_SCAN_DATA } from "./types";

//for save
export const addScanDetails = (item) => ({
  type: ADD_SCAN_DATA,
  data: item,
});
