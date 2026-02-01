import WalletConnect from "@walletconnect/client";
// import configureStore from "../../Redux/store";
import { EncodePrivateKey } from "../../utils/common";
import { CHAIN_INFO, useWeb3WithRPC } from "../DappScreens/useWeb3";

// var store_value = configureStore();
// const {wallet} = store_value.getState()?.fiatDataReducer
// console.log("store.getState()",wallet)
var connector;
export const connect_Wallet_WC1 = async (data) => {
  try {
    console.log("awwawawawawa",data);
    connector = new WalletConnect(
      data
    );
    if (data.session) return connector
    //  await connector.updateSession({accounts:data.session?.accounts,chainId:data.session?.chainId});
    else await connector.createSession();
    return connector
  }
  catch (e) {
    console.log("srgtweftwewer",e)
    return false
  }
  // console.log("connector",connector)

  // connector.on("call_request", (error, payload) => {
  //   if (error) {
  //     throw error;
  //   }
  // console.log("payload",JSN.stringify(payload,null,2))
  // });
  // return startSession(wallet);
};

export const connectors = () => {
  return connector;
};

const startSession = async (wallet) => {
  // let chaintype;
  await connector.on("session_request", (error, payload) => {
    console.log("accounts", JSON.stringify(payload, null, 2), error);
    if (error) {
      throw error;
    }

    const { accounts, chainId } = payload.params[0];
    console.log("accounts", accounts, chainId);

  });
  return chaintype;
};

export const Approvesession = (walley, adress, chainId) => {
  walley?.approveSession({
    accounts: [
      adress, // required
    ],
    chainId: chainId, // required
  })
  return true
}

// connector()?.killSession()
export const GetWalletType = (chainid) =>
  chainid == 56
    ? "BNB"
    : chainid == 5
      ? "ETH"
      : chainid == 50
        ? "XDC"
        : chainid == 137
          ? "MATIC"
          : "WAN";

export const personal_sign = (wallet, message, id) => {
  console.log("wallet", wallet, EncodePrivateKey(wallet.privKey).toString().substr(2, EncodePrivateKey(wallet.privKey).length - 1))

  const rpcurl = CHAIN_INFO.filter(item => item.currency == wallet.currency)
  console.log("rpcurl", rpcurl)
  const web3 = useWeb3WithRPC(rpcurl)
  const accountInfo = web3.eth.accounts.privateKeyToAccount(
    EncodePrivateKey(wallet.privKey)
  );
  const signature = accountInfo.sign(message, `${EncodePrivateKey(wallet.privKey).toString()}`);
  const result = { id, result: signature.signature };
  console.log("result", result)
  return result
}


export const ApproveReq = (result) => {
  try {
    connector.approveRequest(result);
    return true
  }
  catch (e) {
    return e.toString()
  }
}

