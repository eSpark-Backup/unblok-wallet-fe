import { ApiConstants } from "../../../api/ApiConstants";
import TokenClient from "../../../api/TokenClient";
import { Images } from "../../../utils/Images";
import React from "react";
import { Image } from "react-native-elements";


export const GaslimitFun = async (data) =>{
    try {
        var resp = await TokenClient.post(ApiConstants.gaslimit,data )
        return resp
    } catch (error) {
        console.log("error on getamount In func",error);
    }
} 

export const approveFun = async (data) =>{
    try {
        var resp = await TokenClient.post(ApiConstants.approved, data)
        return resp
    } catch (error) {
        console.log("error on getamount In func",error);
    }
} 