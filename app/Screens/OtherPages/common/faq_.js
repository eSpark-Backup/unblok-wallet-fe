import isEmpty from "../../../utils/isEmpty"
import { ApiConstants } from "../../../api/ApiConstants";
import ApiClient from "../../../api/ApiClient";

export const getFaqContentApi = async (data) => {
    try {
        var resp = await ApiClient.get(ApiConstants.getFaqContent, { params: { from: data } })
        // console.log("resspppss",resp);
        return resp
    } catch (error) {
        console.log("erroro on register function", error);
    }
} 