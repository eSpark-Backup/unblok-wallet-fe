import isEmpty from "../../../utils/isEmpty"
import { ApiConstants } from "../../../api/ApiConstants";
import ApiClient from "../../../api/ApiClient";

export const getProfileFunc = async (mail) => {
    try {
        var params = { mailAddress: mail }
        var resp = await ApiClient.post(ApiConstants.getProfile, params)
        // console.log("resspppss",resp.data);
        return resp
    } catch (error) {
        console.log("erroro on register function", error);
    }
} 