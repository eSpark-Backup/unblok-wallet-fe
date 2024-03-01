import axios from "axios";
import { ApiConstants } from "./ApiConstants";
import EncryptedStorage from "react-native-encrypted-storage";
import isEmpty from "../utils/isEmpty";

let ApiClient = axios.create({
  baseURL: ApiConstants.BASE_URL,
  timeout: 10000,
});

ApiClient.interceptors.request.use(
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

export default ApiClient;
