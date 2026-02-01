import { Image } from "react-native-elements";
import ApiClient from "../../../api/ApiClient";
import { ApiConstants } from "../../../api/ApiConstants";
import  tokenClient from "../../../api/TokenClient";
import { Images } from "../../../utils/Images";
import React from "react";


export const get_CMS_function = async (data) => {
    try {
      // console.log("datattaattatatata",data);
      var resp = await ApiClient.post(ApiConstants.fetchCms, data)
      // console.log("resp.dataaa",resp.data);
      return resp.data
    } catch (error) {
      console.log("error on assest update function", error);
    }
  
  };