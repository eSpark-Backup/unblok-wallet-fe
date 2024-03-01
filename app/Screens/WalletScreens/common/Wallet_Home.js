import axios from "axios";
import { ApiConstants } from "../../../api/ApiConstants";
import tokenClient from "../../../api/TokenClient";

export const assets_update_function = async (data) => {
  try {
    // console.log("datattaattatatata",data);
    var resp = await tokenClient.post(ApiConstants.assets_update, data)
    // console.log("resp.dataaa",resp.data);
    return resp.data
  } catch (error) {
    console.log("error on assest update function", error);
  }

};

export const tokenAssetUpdateFunc = async (data) => {
  try {
    // console.log("datattaattatatata",data);
    var resp = await tokenClient.post(ApiConstants.tokenAssetUpdateFunc, data)
    // console.log("resp.dataaa",resp.data);
    return resp
  } catch (error) {
    console.log("error on assest update function", error);
  }

};

export const enable_Coin_func = async (data) => {
  try {
    var resp = await tokenClient.post(ApiConstants.enable_coin, data)
    // console.log("resp",resp);
    return resp
  } catch (error) {
    console.log("seed import errr", error);
  }
}

export const graphData = async (Arr) => {
  try {

    const Data = await Promise.all(Arr.map(async (val) => {
      try {
        const candlestickData = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${val.currency}USDT&interval=1h&limit=1`);

        // Calculate percentage change
        const lastCandlestick = candlestickData.data[0];
        const openingPrice = parseFloat(lastCandlestick[1]);
        const closingPrice = parseFloat(lastCandlestick[4]);

        const change = ((closingPrice - openingPrice) / openingPrice) * 100;
        console.log('lastCandlestick', JSON.stringify(lastCandlestick, null, 2))
        val.openPrice = openingPrice
        val.closePrice = closingPrice
        val.changePer = change
        val.graphVal = lastCandlestick
        return val
      } catch (error) {
        console.log("err on mar", error);
        val.openPrice = 0.000
        val.closePrice = 0.000
        val.changePer = 0.000
        val.graphVal = []
        return val
      }

    }))

    return Data
  } catch (e) {
    console.log("graphData", e)
  }
}

