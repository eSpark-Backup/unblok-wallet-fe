import Clipboard from "@react-native-community/clipboard";
import { ApiConstants } from "../../../api/ApiConstants";
import TokenClient from "../../../api/TokenClient";

export const fetchCopiedText = async () => {
    var text = await Clipboard.getString();
    // setToaddress(text);
    if (text.length == 51) {
        text = await text.replace("ethereum:", "");
    }
    return text
};

export const sendFunc = async (data) => {
    try {
        var resp = TokenClient.post(ApiConstants.addressValidate, data);
        console.log("resp on send fumnction",resp.data);
        return resp
    } catch (error) {
        console.log("error on send function ", error);
    }

}