import { ApiConstants } from "../../../api/ApiConstants";
import TokenClient from "../../../api/TokenClient";


export const swapApiFun = async (data) => {
    try {
        var resp = await TokenClient.post(ApiConstants.swap, data)
        return resp.data
    } catch (error) {
        console.log("errro on selected func", error);
    }
}
