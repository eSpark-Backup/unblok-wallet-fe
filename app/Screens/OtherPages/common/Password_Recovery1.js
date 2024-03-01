import isEmpty from "../../../utils/isEmpty"
import { ApiConstants } from "../../../api/ApiConstants";
import ApiClient from "../../../api/ApiClient";


export const formValidation = async (data) => {
    var error = {}
    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    if (isEmpty(data.mailAddress)) error.mailAddress = "Email Address Required"
    if (data.mailAddress) {
        var hello = regex.test(data.mailAddress)
        if (hello == false) error.mailValidateErr = "Enter Valid Address"
    }
    return error
}

export const sendMailFunc = async (mailAddress) => {
    try {
        var val = Math.floor(1000 + Math.random() * 9000);
            console.log("matattat", val);

            var params = {
                subject: `Password Reset Request`,
                mailAddress: mailAddress,
                text: `Your Verification code is : ${val}`,
                verifyCode:val
            }
            global.verificationCode = val
            global.verifimail = mailAddress
        var resp = await ApiClient.post(ApiConstants.sendMailinNode, params)
        // console.log("resspppss",resp);
        return resp
    } catch (error) {
        console.log("erroro on ,login function", error);
    }
} 