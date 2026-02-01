import React from "react";
import ApiClient from "../../../api/ApiClient";
import { ApiConstants } from "../../../api/ApiConstants";





export const seedimportPrivKey = async (data) => {
    try {
        var resp = await ApiClient.post(ApiConstants.seedimportprivatekey, data)
        // console.log("resp",resp);
        return resp
    } catch (error) {
        console.log("seed import errr", error);
    }

}
