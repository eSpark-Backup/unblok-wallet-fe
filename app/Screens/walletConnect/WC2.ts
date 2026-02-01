import { Core } from "@walletconnect/core";
import { getSdkError } from "@walletconnect/utils";
import { IWeb3Wallet, Web3Wallet } from "@walletconnect/web3wallet";
import { ApiConstants } from "../../api/ApiConstants";
import { EncodePrivateKey, convertHexToUtf8 } from "../../utils/common";
import { CHAIN_INFO, useWeb3WithRPC } from "../DappScreens/useWeb3";
import { Toastfn } from "../../utils/toast";
import isEmpty from "../../utils/isEmpty";


export var connector;
export const connect_Wallet_WC2 = async (data, con) => {
  try {
    const core = new Core({
      projectId: "3b20a050abc2aaffab54ac39207a2174",
    });

    // console.log("core",core);
    connector = await Web3Wallet.init({
      core,
      ...ApiConstants.clientMeta,
      // metadata: {
      //   name: "Yuse Wallet",
      //   description: "YUSE wallet",
      //   url: "https://yustoken.io",
      //   icons: [
      //     "https://imagedelivery.net/_aTEfDRm7z3tKgu9JhfeKA/4ca6cbac-48a2-4dc9-0712-0c75cd12c300/lg",
      //   ],
      // },
    });
    // console.log("connector",connector);
    return connector;
  } catch (e) {
    console.error("catch err in WC2", e)
    return e.toString()
  }
};
connect_Wallet_WC2()

// console.log("shshshshs",connector);
export const getcurrensession_WC2 = (refresh) => {
  return Object.values(connector?.getActiveSessions())
};

export const pair = async (val, uri) => {
  console.log("pairing")
  try {
    return await (connector || val).core.pairing.pair({
      uri: uri,
    });
    console.error("pairing ", (connector || val).core.pairing.getPairings())

    return connector || val
  }
  catch (e) {
    console.log("erereeerer", e);
    return false
  }
}

export const Approvesession_WC2 = async (data) => {
  console.log("data>>>>>>>>>>>>><<<<<", data)
  try {
    return await connector?.approveSession(data)
    return true
  }
  catch (e) {
    console.error("Approve sesiion>>>>>>>.", e)
  }
}


export const Approvesession = (data) => {
  console.log("data", data)
  try {
    connector?.approveSession(
      //   {
      //   accounts: [
      //     adress, // required
      //   ],
      //   chainId: chainId, // required
      // }
      data
    )
    return true
  }
  catch (e) {
    console.error("Approve sesiion>>>>>>>.", e)
  }
}


export const personal_sign_WC2 = (wallet, message, id, chainId) => {
  const rpcurl = CHAIN_INFO.filter(item => item.chainId == chainId)?.pop()?.rpc
  const web3 = useWeb3WithRPC(rpcurl)
  const accountInfo = accountInformation(web3, wallet.privKey)
  const signature = accountInfo.sign(message, `${EncodePrivateKey(wallet.privKey).toString()}`);
  const result = { id, result: signature.signature, jsonrpc: '2.0' };
  console.log("result", result)
  return result
}

const accountInformation = (web3, privKey) => {
  return web3.eth.accounts.privateKeyToAccount(
    EncodePrivateKey(privKey)
  );
}
export const ApproveReq_WC2 = async (result) => {
  try {
    console.log("data>>>>>", result)

    var data = await connector.respondSessionRequest(result);
    console.log("data", data)
    return true
  }
  catch (e) {
    console.log("e======", e)
    return e.toString()
  }
}


export const RejectReq = (payload) => {
  try {
    console.log("id", payload)
    connector.rejectRequest(payload);
    return true
  }
  catch (e) {
    console.error("RejectReq>>>>>>>", e, payload)

    return e.toString()
  }
}

export const eth_sendTransaction_WC2 = async (wallet, payload, Coming_Type, _Gas, chainid) => {
  try {
    console.log("fefefefe", wallet, payload, Coming_Type, _Gas, chainid);
    const rpcurl = CHAIN_INFO.filter(item => item.chainId == chainid)?.pop()?.rpc
    console.log("rpcurl111", rpcurl);
    const web3 = useWeb3WithRPC(rpcurl);
    console.log("web3web3", web3);
    const id = payload.id;
    const { params } = payload;
    console.log("idididid", id);
    let { nonce, gasPrice, gas, value, to, data, from } = payload?.params?.request?.params[0]
    console.log("jufhgaiuwdfiaw", payload?.params?.request?.params[0]);
    if (!value) {
      value = "0x0";
    }
    // //console.log("nonce",web3.eth)

    if (!nonce) {
      nonce = (await web3.eth.getTransactionCount(from))
    }
    // //console.log("nonce nonce",nonce)
    if (!gasPrice) {
      gasPrice = _Gas.gasPrice_custom;

    }

    // Estimate gas with { to, data } when gas is null
    if (!gas) {
      gas = _Gas.gas_custom;
    }

    // var valhexConvert = await convertHexToUtf8(value)
    // console.log("valhexConvert",valhexConvert);
    const txData = {
      nonce: web3.utils.toHex(nonce),
      data,
      gasLimit: gas,
      gasPrice,
      to,
      value,
    };
    console.log("txData", txData);
    return await COntract_Transaction(id, txData, web3, wallet, Coming_Type);
  }
  catch (e) {
    console.error("eth sign erro", e)
    return false
  }
}

async function checkIsContractAddress(address, web3) {
  try {
    //console.log("dsadhshdas",address,await web3.eth.getCode())
    const code = await web3.eth.getCode(address);
    //console.log("dsadhshdas>>>>>",code)

    return (code == "0x") ? false : true;
  }
  catch (e) {
    console.error("code >>>>", e)
  }
}
const COntract_Transaction = async (id, txData, web3, wallet, Coming_Type) => {
  try {
    console.log("rpcurl", id, txData)
    const accountInfo = accountInformation(web3, wallet.privKey)
    console.log("accountInfo", accountInfo);
    if (accountInfo.address != "") {
      const signedTransaction = await accountInfo.signTransaction(txData);
      console.log("signedTransaction", signedTransaction);
      const { rawTransaction, transactionHash } = signedTransaction;
      console.log("rpcurl", rawTransaction, signedTransaction)
      if (Coming_Type) {
        return { id, result: transactionHash, jsonrpc: '2.0' }
      }
      else {
        var trans = await web3.eth
          .sendSignedTransaction(rawTransaction)
        console.log("trans", trans);
        return { id, result: trans.transactionHash, jsonrpc: '2.0' }
      }
    }
  } catch (err) {
    console.log("eth_sendTransaction err: ", err);
    RejectReq({ id, error: err })
    // handleReject(id, err.message);
  }
}

export const tokenBlanace = async (chainId, address) => {
  try {
    if (chainId && address) {
      const rpcurl = CHAIN_INFO.filter(item => item.chainId == chainId)?.pop()?.rpc
      console.log("chainId, address", chainId, address);
      const web3 = useWeb3WithRPC(rpcurl)
      return await web3.eth.getBalance(address);
    } else {
      return 0
    }

  }
  catch (e) {
    console.error("rokenbalance", e);
    return 0
  }
};

export const UsePrivateERC20 = async (wallet, Token) => {
  try {
    // key = EncodePrivateKey(key)
    const rpcurl = CHAIN_INFO.filter(item => item.currency == wallet.currency)?.pop()?.rpc
    const web3 = useWeb3WithRPC(rpcurl)
    const ABI = [
      {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{ "name": "", "type": "string" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          { "name": "guy", "type": "address" },
          { "name": "wad", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "name": "", "type": "bool" }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{ "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          { "name": "src", "type": "address" },
          { "name": "dst", "type": "address" },
          { "name": "wad", "type": "uint256" }
        ],
        "name": "transferFrom",
        "outputs": [{ "name": "", "type": "bool" }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [{ "name": "wad", "type": "uint256" }],
        "name": "withdraw",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "name": "", "type": "uint8" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{ "name": "", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{ "name": "", "type": "string" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          { "name": "dst", "type": "address" },
          { "name": "wad", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "name": "", "type": "bool" }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          { "name": "", "type": "address" },
          { "name": "", "type": "address" }
        ],
        "name": "allowance",
        "outputs": [{ "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      { "payable": true, "stateMutability": "payable", "type": "fallback" },
      {
        "anonymous": false,
        "inputs": [
          { "indexed": true, "name": "src", "type": "address" },
          { "indexed": true, "name": "guy", "type": "address" },
          { "indexed": false, "name": "wad", "type": "uint256" }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          { "indexed": true, "name": "src", "type": "address" },
          { "indexed": true, "name": "dst", "type": "address" },
          { "indexed": false, "name": "wad", "type": "uint256" }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          { "indexed": true, "name": "dst", "type": "address" },
          { "indexed": false, "name": "wad", "type": "uint256" }
        ],
        "name": "Deposit",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          { "indexed": true, "name": "src", "type": "address" },
          { "indexed": false, "name": "wad", "type": "uint256" }
        ],
        "name": "Withdrawal",
        "type": "event"
      }
    ]

    const contract = new web3.eth.Contract(ABI, Token);
    return contract;
  } catch (e) {
    console.error("private contract", e);
    return false;
  }
};


// export const _rejectsession = async (id, topic, val) => {
//   console.log("id,topic,id,topic", id, topic)
//   try {
//     // if(topic) await connector.respondSessionRequest({topic,respose:id})
//     //  else 
//     await val ?? connector.rejectSession(id);
//     Toastfn("User Rejected")
//     return true
//   }
//   catch (E) {
//     console.log("e", E)
//     return false
//   }
// };

export const _rejectsession = async (id, topic, val) => {
  console.log("id,topic,id,topic", id, topic)
  try {
    // if(topic) await connector.respondSessionRequest({topic,respose:id})
    //  else 
    //  await val ?? connector.rejectSession(id);
    //  var reson = await getSdkError("USER_REJECTED_METHODS").message
    await val ?? connector.respondSessionRequest({
      topic,
      response: { "error": { "code": -32000, "message": id.reason.message }, "id": id.id, "jsonrpc": "2.0" },
    });
    Toastfn("User Rejected")
    return true
  }
  catch (E) {
    console.log("e", E)
    return false
  }
};


// // if(connector){
// connector?.on('session_proposal',(proposal)=>{
//   console.log("Youre the ceo",proposal)
// })
// }