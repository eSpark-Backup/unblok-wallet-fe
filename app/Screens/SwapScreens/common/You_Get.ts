import { ApiConstants } from "../../../api/ApiConstants";
import TokenClient from "../../../api/TokenClient";
import { Images } from "../../../utils/Images";
import React from "react";
import { Image } from "react-native-elements";


export const getTokenList = async (data) => {
  try {
    var resp = await TokenClient.post(ApiConstants.tokensForSwap, data)
    console.log("respppppp", resp.data);
    return resp.data
  } catch (error) {
    console.log("errro on token list", error);
  }

}
