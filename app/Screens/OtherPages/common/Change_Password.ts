import isEmpty from "../../../utils/isEmpty"
import { ApiConstants } from "../../../api/ApiConstants";
import ApiClient from "../../../api/ApiClient";


export const formValidation = async (data) => {
    var error = {}
    if (isEmpty(data.currentPassword)) error.currentPassword = "Current Password Required"
    if (isEmpty(data.newpassword)) error.newpassword = "New Password Required"
    if (isEmpty(data.confirmPassword)) error.confirmPassword = "Confirm New Password"
    if (data.newpassword != data.confirmPassword) error.sameError = "Passwords Must Match"

    return error
}

export const changePasswordFun = async (data) => {
    try {
        console.log("chnagepassword open");
        var resp = await ApiClient.post(ApiConstants.changeFunction, data)
        console.log("resspppss",resp);
        return resp
    } catch (error) {
        console.log("erroro on ,login function", error);
    }
} 