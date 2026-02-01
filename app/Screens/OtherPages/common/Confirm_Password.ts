import isEmpty from "../../../utils/isEmpty"
import { ApiConstants } from "../../../api/ApiConstants";
import ApiClient from "../../../api/ApiClient";


export const formValidation = async (data) => {
    var error = {}
    if (isEmpty(data.newPassword)) error.newPasswordError = "New Password Required"
    if (isEmpty(data.confirmPassword)) error.confirmPasswordError = "Confirm New Password"
    if (!isEmpty(data.confirmPassword) && !isEmpty(data.newPassword) && (data.newPassword != data.confirmPassword)) error.sameError = "Password Do Not Match"
    return error
}

export const ChangePassword = async (params) => {
    try {
        var resp = await ApiClient.post(ApiConstants.changeFunction, params)
        // console.log("resspppss",resp);
        return resp
    } catch (error) {
        console.log("erroro on ,login function", error);
    }
} 