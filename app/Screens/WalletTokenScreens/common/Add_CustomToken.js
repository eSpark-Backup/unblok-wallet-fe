import React from "react";
import { Image } from "react-native-elements";
import { ApiConstants } from "../../../api/ApiConstants";
import TokenClient from "../../../api/TokenClient";
import { Images } from "../../../utils/Images";

export const network_listFunc = async (data) => {
    try {
        var resp = await TokenClient.get(ApiConstants.networklist)
        // console.log("resp",resp);
        return resp
    } catch (error) {
        console.log("seed import errr", error);
    }
}


export const customToken_add = async (data) => {
    try {
        var resp = await TokenClient.post(ApiConstants.customtokenadd, data)
        // console.log("resp",resp);
        return resp
    } catch (error) {
        console.log("seed import errr", error);
    }
}

export const enable_coin_priv_func = async (data) => {
    try {
        var resp = await TokenClient.post(ApiConstants.enable_coin_privatekey, data)
        // console.log("resp",resp);
        return resp
    } catch (error) {
        console.log("seed import errr", error);
    }
}


export const enable_Coin_func  = async (data) => {
    try {
        var resp = await TokenClient.post(ApiConstants.enable_coin, data)
        // console.log("resp",resp);
        return resp
    } catch (error) {
        console.log("seed import errr", error);
    }
}

export const custom_token_fetch_func  = async (data) => {
    try {
        var resp = await TokenClient.post(ApiConstants.customtokenfetch, data)
        // console.log("resp",resp);
        return resp
    } catch (error) {
        console.log("seed import errr", error);
    }
}