import isEmpty from "../../../utils/isEmpty"
import { ApiConstants } from "../../../api/ApiConstants";
import ApiClient from "../../../api/ApiClient";
import axios from 'axios'
const libphonenumber = require('google-libphonenumber');

export const formValidation = async (data) => {

    const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    let phRegex = new RegExp(/^[6789]\d{9}$/); //^[789][0-9]{9}
    console.log("dataa", data);
    var error = {}
    if (isEmpty(data.firstName)) error.firstNameError = "First Name Required"
    // if (isEmpty(data.middleName)) error.middleNameError = "MiddleName is can't be Empty"
    if (isEmpty(data.lastName)) error.lastNameError = "Last Name Required"
    if (isEmpty(data.phoneNumber)) error.phoneNumberError = "Phone Number Required"
    // if (isEmpty(data.DOB)) error.DOB = "Date of birth Required"
    if (isEmpty(data.gender)) error.gender = "Gender Required"
    if (isEmpty(data.language)) error.language = "language Required"    
    if (data.phoneNumber && data.countryCode) if(!phoneUtil.isValidNumber(phoneUtil.parse(`+${data.countryCode}${data.phoneNumber}`))) error.phTestErr = "Mobile Number Format is Wrong"
    // if (data.phoneNumber) {
    //     var testPh = phRegex.test(Number(data.phoneNumber))
    //     console.log("testPh",testPh);
    //     if (testPh == false) error.phTestErr = "Please Enter Valid phone number"
    // }
    return error
}

export const updateProfileFunction = async (userDetails, imageFile) => {
    try {
        var formData = new FormData();
        formData.append("userDetails", JSON.stringify(userDetails));
        formData.append("deviceId", global.deviceId);
        formData.append("from", "updateProfile");
        !isEmpty(imageFile) && (formData.append("profile", {
            uri: Platform.OS === 'android'
                ? imageFile.uri
                : imageFile.uri.replace('file://', ''),
            type: imageFile.type,
            name: imageFile.fileName
        }))

        var chk = await axios({
            method: "POST",
            url: ApiConstants.BASE_URL + ApiConstants.updateProfileApi,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                "Authorization": "Bearer " + global.token
            },
            data: formData,
        })

        return chk

    } catch (error) {
        console.log("erroro on register function", error);
    }
}

export const removeProfilefunc = async (params) => {
    try {
        var resp = await ApiClient.post(ApiConstants.changeFunction, params)
        // console.log("resspppss",resp);
        return resp
    } catch (error) {
        console.log("errro on remove profile functionj",error);
    }
}