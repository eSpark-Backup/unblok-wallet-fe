import isEmpty from "../../../utils/isEmpty"
import { ApiConstants } from "../../../api/ApiConstants";
import ApiClient from "../../../api/ApiClient";


export const formValidation = async (data) => {
    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    console.log("dataa", data)
    var error = {}
    if (isEmpty(data.mailAddress)) error.mailAddressError = "Email Address Required"
    if (isEmpty(data.password)) error.passwordError = "Password Required"
    if (data.mailAddress) {
        var hello = regex.test(data.mailAddress)
        if(hello == false) error.mailValidateErr = "Enter Valid Address"
    }
    return error
}

export const loginFunction = async (data) => {
    try {
        var resp = await ApiClient.post(ApiConstants.userLoginFun, data)
        // console.log("resspppss",resp);
        return resp
    } catch (error) {
        console.log("erroro on ,login function", error);
    }
} 

export const encryptFunction = async (data) => {
    try {
        var resp = await ApiClient.post(ApiConstants.encryptpass, data)
        console.log("resspppss",resp.data);
        return resp
    } catch (error) {
        console.log("erroro on ,login function", error);
    }
} 
