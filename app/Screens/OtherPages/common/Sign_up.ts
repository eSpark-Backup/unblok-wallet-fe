import isEmpty from "../../../utils/isEmpty"
import { ApiConstants } from "../../../api/ApiConstants";
import ApiClient from "../../../api/ApiClient";
import { ToastAndroid } from "react-native";
const libphonenumber = require('google-libphonenumber');


export const formValidation = async (data) => {
    const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
    var error = {}
    try {
        let regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/);
    // let phRegex = new RegExp(/^[6789]\d{9}$/);
    let phRegex = new RegExp("^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$");
    console.log("dataa", data,+`${data.countryCode}${data.phoneNumber}`);
    
    if (isEmpty(data.firstName)) error.firstNameError = "First Name Required"
    if (isEmpty(data.lastName)) error.lastNameError = "Last Name Required"
    if (isEmpty(data.phoneNumber)) error.phoneNumberError = "Phone Number Required"
    if (isEmpty(data.mailAddress)) error.mailAddressError = "Email Address Required"
    if (isEmpty(data.password)) error.passwordError = "Password Required"
    if (isEmpty(data.confirmPassword)) error.confirmPasswordError = "Confirm New Password"
    // if (isEmpty(data.DOB)) error.DOB = "Date of birth Required"
    if (isEmpty(data.gender)) error.gender = "Gender Required"
    if (isEmpty(data.language)) error.language = "Language Required"    
    if (isEmpty(data.location)) error.location = "Location Required"    
    if(new Date(data.DOB).getFullYear() == new Date().getFullYear()) error.DOB = "Date Of Birth Required"
    if (!isEmpty(data.confirmPassword) && !isEmpty(data.password) && (data.password != data.confirmPassword)) error.sameError = "Invalid Password"
    if (data.mailAddress) {
        var hello = regex.test(String(data.mailAddress))
        if (hello == false) error.mailValidateErr = "Enter Valid Address"
    }
    if (data.phoneNumber && data.countryCode) if(!phoneUtil.isValidNumber(phoneUtil.parse(`+${data.countryCode}${data.phoneNumber}`))) error.phTestErr = "Mobile Number Format is Wrong"

    return error
    } catch (error) {
        console.log("error on form valif=dation",error);
        error.phTestErr = "Mobile Number Format is Wrong"
        return error
    }

    
}

export const registerFunction = async (data, props) => {
    try {
        // var resp = await ApiClient.post(ApiConstants.userRegister, data)
        // console.log("resspppss", resp);
        // if (resp.data.success) {
        var val = Math.floor(1000 + Math.random() * 9000);
        console.log("matattat", val);

        var params = {
            subject: `Welcome to UNBLOK! `,
            mailAddress: data.mailAddress,
            text: `Welcome To unblok Wallet , Here is Your Verification code is : ${val}`,
            from: "register",
            verifyCode: val,
            name:data.firstName
        }
        global.verificationCode = val
        var res = await ApiClient.post(ApiConstants.sendMailinNode, params)
        console.log("RESPONSEEEEEEEEE", res.data);
        if (res.data.success) {
            props.navigation.navigate("VerificationForSign", data)
        } else {
            return res.data
        }
    } catch (error) {

        console.log("erroro on register function", error);
        return false
    }
} 