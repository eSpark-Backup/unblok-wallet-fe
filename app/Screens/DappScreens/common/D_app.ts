import { ApiConstants } from "../../../api/ApiConstants";
import TokenClient from "../../../api/TokenClient";


export const dappCategoryList = async () => {

    try {
        // setActiveIndicator(true);
        let params = {
            deviceId: global.deviceId,
        };
        var resp = await TokenClient.post(ApiConstants.dappcategory, params);
        // console.log("resp,resp",resp.data);
        return resp.data
    } catch (error) {
        console.log("eroror on dapp cat list", error);
    }


};

export const dappitemList = async (data) => {
    try {
        var resp = await TokenClient.post(ApiConstants.dapps, data)
        return resp
    } catch (error) {
        console.log("errro on dappitem list", error);
    }
}

export const addFavDappApi = async (data) => {
    try {
        var resp = await TokenClient.post(ApiConstants.add_fav_dapp, data)
        return resp
    } catch (error) {
        console.log("errro on dappitem list", error);
    }
}

export const removeFavDappApi = async (data) => {
    try {
        var resp = await TokenClient.post(ApiConstants.remove_fav_dapp, data)
        return resp
    } catch (error) {
        console.log("errro on dappitem list", error);
    }
}

export const FavDappApi = async (data) => {
    try {
        var resp = await TokenClient.post(ApiConstants.dapps_fav, data)
        return resp
    } catch (error) {
        console.log("errro on dappitem list", error);
    }
}

export const getDapphistory = async (data) => {
    try {
        var resp = await TokenClient.post(ApiConstants.getHistoryBymail, data)
        return resp
    } catch (error) {
        console.log("errro on dappitem list", error);
    }
}

export const setDapphistory = async (data) => {
    try {
        var resp = await TokenClient.post(ApiConstants.setDapphistory, data)
        return resp
    } catch (error) {
        console.log("errro on dappitem list", error);
    }
}