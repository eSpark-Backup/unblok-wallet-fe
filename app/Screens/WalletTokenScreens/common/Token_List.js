import React from "react";
import { Image } from "react-native-elements";
import { ApiConstants } from "../../../api/ApiConstants";
import TokenClient from "../../../api/TokenClient";
import { Images } from "../../../utils/Images";


export const gettokenList = async (data) => {
    try {
        let params = {
            deviceId: global.deviceId,
            currency: "Ethereum",
            tokenType: "ERC20",
            singlecoin: "",
            from: "token"
        };
        var resp = await TokenClient.post(ApiConstants.tokenList, params)
        return resp.data

    } catch (error) {
        console.log("error on tokenList", error);
    }
}
