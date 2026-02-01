import axios from "axios";
import { ApiConstants } from "./ApiConstants";
import EncryptedStorage from "react-native-encrypted-storage";
import isEmpty from "../utils/isEmpty";

let TokenClient = axios.create({
  baseURL: ApiConstants.TOKEN_URL,
  timeout: 10000,
});

TokenClient.interceptors.request.use(
  async (configure) => {
    const newUserToken = await EncryptedStorage.getItem("UserToken");
    global.token = newUserToken;

    if (!isEmpty(global.token)) {
      configure.headers.Authorization = "Bearer " + global.token;
    }
    return configure;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default TokenClient;
