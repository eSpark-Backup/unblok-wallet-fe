import ApiClient from "../../../api/ApiClient";
import tokenClient from '../../../api/TokenClient'
import { ApiConstants } from "../../../api/ApiConstants";
import { Images } from "../../../utils/Images";
import { Image } from "react-native-elements";
import React from "react";


export const getTokenList = async () => {
    try {
        let params = {
            currency: "Ethereum",
            singlecoin: "single-coin",
            from: "importwallet"
        };
        var resp = await tokenClient.post(ApiConstants.tokenList, params)
        console.log("");
        return resp.data
    } catch (error) {
        console.log("errror on gettokenlist", error);
    }
}
