import { ApiConstants } from "../../../api/ApiConstants";
import TokenClient from "../../../api/TokenClient";
import { Images } from "../../../utils/Images";
import React from "react";
import { Image } from "react-native-elements";


export const selectedFun = async (data) => {
  try {
    var resp = await TokenClient.post(ApiConstants.approve_check, data)
    return resp.data
  } catch (error) {
    console.log("errro on selected func", error);
  }
}

export const IconShowing = (type) => {
  var type = type.toString().toLowerCase().split("20")[0];
  if (["erc", "eth"].includes(type)) {
    return (
      <Images.EthLogo
        width={28}
        height={28}
        style={{ alignSelf: "center" }}
      />
    );
  } else if (["bnb", "bep"].includes(type)) {
    return (
      <Images.biance
      width={28}
      height={28}
      style={{ position: "relative",  }}
    />
    );
  } else if (type.includes("btc")) {
    return (
      <Images.BtcLogo
        width={28}
        height={28}
        style={{ position: "relative", left: -20 }}
      />
    );
  } else if (["trc", "trx"].includes(type)) {
    return (
      <Images.TrxLogo
        width={28}
        height={28}
        style={{ position: "relative", left: -20 }}
      />
    );
  
  } else if (type.includes("mat")) {
    return (
      <Images.matcoin
        width={28}
        height={28}
        style={{ position: "relative", left: -20 }}
      />
    );
  } else if (["xrc", "wan"].includes(type))
    return (
      <Image
        source={Images[type]}
        style={{ width: 40, height: 40 }}
      />
    );
  // else
  //   return <Image source={Images.noimg} style={{ width: 40, height: 40 }} />;
};


export const getAmountInFun = async (data) => {
  try {
    var resp = await TokenClient.post(ApiConstants.getAmountIn, data)
    return resp
  } catch (error) {
    console.log("error on getamount In func", error);
  }
}


export const getAmountOutFun = async (data) => {
  try {
    var resp = await TokenClient.post(ApiConstants.getAmountOut, data)
    return resp
  } catch (error) {
    console.log("error on getamount In func", error);
  }
} 