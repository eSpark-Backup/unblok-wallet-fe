import { ADD_SEED_DATA } from "./types";

//for save
export const addSeedData = (item) => ({
  type: ADD_SEED_DATA,
  data: item,
});
