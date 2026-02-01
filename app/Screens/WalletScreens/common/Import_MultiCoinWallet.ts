import React from "react";
import ApiClient from "../../../api/ApiClient";
import { ApiConstants } from "../../../api/ApiConstants";





export const seedimportmulicoin = async (data) => {
    try {
        var resp = await ApiClient.post(ApiConstants.seedvalidation, data)
        console.log("resp",resp.data);
        return resp
    } catch (error) {
        console.log("seed import errr", error);
    }

}
