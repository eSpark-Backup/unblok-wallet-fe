import { DAPP_WEB } from "./types";

//for save
export const dappWeb = (item) => ({
  type: DAPP_WEB,
  data: item,
});

export const webtabs = (item) => ({
  type: "web_tabs",
  data: item,
});

export const webref = (item) => ({
  type: "web_Ref",
  data: item,
});