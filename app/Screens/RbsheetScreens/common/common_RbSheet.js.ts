
import React from "react";
import TokenClient from "../../../api/TokenClient";
import { ApiConstants } from "../../../api/ApiConstants";

export const tokenAssetUpdateFunc = async (data) => {
    try {
      // console.log("datattaattatatata",data);
      var resp = await TokenClient.post(ApiConstants.tokenAssetUpdateFunc, data)
      // console.log("resp.dataaa",resp.data);
      return resp
    } catch (error) {
      console.log("error on assest update function", error);
    }
  
  };