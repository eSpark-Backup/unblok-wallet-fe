
import React, {
  useEffect,
  useState,
  createRef,
  useRef,
  useContext,
  useCallback,
} from "react";

import {
  View,
  Modal as ModalReact,
  Platform,
  Dimensions,
  Linking,
  StyleSheet,
  Image,
  Pressable,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  BackHandler,
} from "react-native";
import { WebView } from "react-native-webview";
import Modal from "react-native-modal";
import { useWeb3WithRPC } from "./useWeb3";
import { Web3File } from "./DappWeb3";
import MessageModal from "./DappModal";
import { Core } from '@walletconnect/core'
import { Web3Wallet } from '@walletconnect/web3wallet'


import { Core } from '@walletconnect/core'
import { Web3Wallet } from '@walletconnect/web3wallet'

const core = new Core({
  projectId: "f598d10de4a56c1b5e6ffb3d606f2c75"
})

const web3wallet = await Web3Wallet.init({
  core, // <- pass the shared `core` instance
  metadata: {
    name: 'Demo app',
    description: 'Demo Client as Wallet/Peer',
    url: 'www.walletconnect.com',
    icons: []
  }
})
var walletConnectStatus = false;

const Test = () => {
  const [enabled, setEnabled] = useState(false);
  const [myUrl, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [distances, setDistances] = useState(0);
  const [pathDistance, setpathDistance] = useState(0);
  const [odoMeter, SetOdoMeter] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  const [connectWalletUrl, setConnectWalletUrl] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [approvalDetails, setApprovalDetails] = useState(null);
  const [modalView, setModalView] = useState(null);
  connectWalletUrl
  let address = "0x025c1667471685c323808647299e5DbF9d6AdcC9";
  let networkId = 5;
  let privateKey = "6c87e33bfbb2ac40989d20ee5e6580fa30b9b9b06506e5923b5836d7e96247e3";
  const rpcUrl = "https://goerli.infura.io/v3/9271ff953d0b4affaa0640445a7d9c11";

  const web3 = useWeb3WithRPC(rpcUrl)


  const webview = useRef();

  const handleWeb = () => {
    setIsMoving(!isMoving);
  }



  const onMessage = async (event) => {
    console.log("eventeventeventevent 182839", event);
    let data = JSON.parse(event.nativeEvent.data);
    console.log("nativeEvent  datadatadata", data);
    const payload = data;
    console.log("payloadpayload", payload);
    const { method, id } = payload;

    console.log("method 12389++++++++++", method);
    try {
      switch (method) {
        case "eth_requestAccounts": {
          setApproveModalVisible(true);
          setApprovalDetails(event.nativeEvent);
          break;
        }
        case "eth_estimateGas": {
          await popupTransactionModal(payload);
          break;
        }
        case "eth_gasPrice": {
          await handleEthGasPrice(payload);
          break;
        }
        case "eth_call": {
          await handleEthCall(payload);
          break;
        }

        case "eth_getBlockByNumber": {
          await handleEthGetBlockByNumber(payload);
          break;
        }

        case "eth_blockNumber": {
          await handleEthGetBlockNumber(payload);
          break;
        }

        case "personal_sign": {
          await popupMessageModal(payload);
          break;
        }

        case "eth_signTypedData_v4": {
          await popupMessageModal(payload);
          break;
        }

        case "eth_sendTransaction": {
          await popupTransactionModal(payload);
          break;
        }

        case "eth_getTransactionReceipt": {
          await handleEthGetTransactionReceipt(payload);
          break;
        }

        case "eth_getTransactionByHash": {
          await handleEthGetTransactionByHash(payload);
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.log("onMessage error: ", err);

      if (err && err.code) {
        console.log("err.code", err);
      } else {
        console.log("else notification err comes");
      }

      handleReject(id, err.message);
    }
  };

  //supported functions
  const postMessageToWebView = (result) => {
    if (webview && webview.current) {
      webview.current.postMessage(JSON.stringify(result));
    }
  };

  //web3 function lists starts here

  const handleEthGasPrice = async (payload) => {
    try {
      const { id } = payload;
      const res = await web3.eth.getGasPrice();
      const result = { id, result: res };
      console.log("handleEthgas price result", result);
      postMessageToWebView(result);
    } catch (err) {
      console.log("handleEthGasPrice err", err);
    }
  };

  const handleEthCall = async (payload) => {
    try {
      const { id, params } = payload;
      const res = await web3.eth.call(params[0], params[1]);
      const result = { id, result: res };
      postMessageToWebView(result);
    } catch (err) {
      console.log("handleEthCall err", err);
    }
  };

  function isEmpty(strIn) {
    if (strIn === undefined) {
      return true;
    }
    else if (strIn == null) {
      return true;
    }
    else if (strIn == "") {
      return true;
    }
    else {
      return false;
    }
  }

  const handleEthGetBlockByNumber = async (payload) => {
    try {
      const { id, params } = payload;
      let res = 0;
      // Get latest block info when passed block number is 0.
      const blockNumber =
        isEmpty(params) || (params[0] && params[0] === "0x0")
          ? "latest"
          : params[0];
      res = await web3.eth.getBlock(blockNumber);
      const result = { id, result: res };
      // console.log("Gas Fee Block : ",res)
      postMessageToWebView(result);
    } catch (err) {
      console.log("handleEthGetBlockByNumber err", err);
    }
  };

  const handleEthGetBlockNumber = async (payload) => {
    try {
      const { id } = payload;
      const res = await web3.eth.getBlockNumber();

      console.log("resresresres getBlockNumber", res);
      const result = { id, result: res };
      postMessageToWebView(result);
    } catch (err) {
      console.log("handleEthGetBlockNumber err", err);
    }
  };

  const handlePersonalSign = async (id, message) => {
    try {
      const accountInfo = web3.eth.accounts.privateKeyToAccount(
        privateKey
      );
      const signature = accountInfo.sign(message, privateKey);
      const result = { id, result: signature.signature };
      postMessageToWebView(result);
    } catch (err) {
      console.log("personal_sign err: ", err);
      handleReject(id, err.message);
    }
  };

  const handleEthSendTransaction = async (id, txData) => {
    console.log("handleEthSendTransaction", id, txData);
    try {
      const accountInfo = web3.eth.accounts.privateKeyToAccount(privateKey);
      if (accountInfo.address != "") {
        const signedTransaction = await accountInfo.signTransaction(txData);
        const { rawTransaction } = signedTransaction;

        await web3.eth
          .sendSignedTransaction(rawTransaction)
          .on("transactionHash", (hash) => {
            // console.log("hashhashhash", hash);
            const result = { id, result: hash };
            //postMessageToWebView(result);

            Alert.alert("Success", "Transaction Completed.", [
              {
                text: "OK",
                onPress: () => {
                  // webview.current.reload();
                  // webview.current.injectJavaScript(jsCode);
                  postMessageToWebView(result);
                },
              },
            ]);
          })
          .on("error", (error) => {
            console.log("sendSignedTransaction error: ", error);
            handleReject(id, error.message);
          });
      }
    } catch (err) {
      console.log("eth_sendTransaction err: ", err);
      handleReject(id, err.message);
    }
  };

  const handleEthGetTransactionReceipt = async (payload) => {
    const { id, params } = payload;
    let res = await web3.eth.getTransactionReceipt(params[0]);
    if (!res) {
      res = "";
    } else {
      // RNS and tRif faucet's transaction status judge condition: parseInt(status, 16) === 1, so need set true to 1 and false to 0
      res.status = res.status ? 1 : 0;
    }
    const result = { id, result: res };
    console.log("handleEthGetTransactionReceipt resultttt", result);
    postMessageToWebView(result);
  };

  const handleEthGetTransactionReceiptOwn = async (payload) => {
    let res = await web3.eth.getTransactionReceipt(payload.result);
    console.log("handleEthGetTransactionReceiptOwn res", res);
    if (!res) {
      res = "";
    } else {
      // RNS and tRif faucet's transaction status judge condition: parseInt(status, 16) === 1, so need set true to 1 and false to 0
      res.status = res.status ? 1 : 0;
    }
    const result = { result: res };
    postMessageToWebView(result);
  };

  const handleEthGetTransactionByHash = async (payload) => {
    const { id, params } = payload;
    const res = await web3.eth.getTransaction(params[0]);
    const result = { id, result: res };
    postMessageToWebView(result);
  };

  const handleReject = async (id, message) => {
    setModalView(null);
    postMessageToWebView({ id, error: 1, message });
  };
  //-----web3 functions ends here-----

  //---popup displays start here----//

  const popupMessageModal = async (payload) => {
    // console.log("popupMessageModal called", payload);
    const { id, params } = payload;
    const message = params[0].startsWith("0x")
      ? web3.utils.hexToAscii(params[0])
      : params[0];

    setModalView(
      <MessageModal
        dappUrl={myUrl}
        confirmPress={async () => {
          setModalView(null);
          await handlePersonalSign(id, message);
        }}
        cancelPress={() => handleReject(id)}
        message={message}
      />
    );
  };

  const popupContractModal = async (id, txData, formatedInputData) => {
    try {
      console.log("popupContractModal called", id, txData, formatedInputData);
      const network = "Mainnet";
      const from = web3.utils.toChecksumAddress(address, networkId);
      const to = web3.utils.toChecksumAddress(txData.to, networkId);
      setModalView(
        <MessageModal
          dappUrl={myUrl}
          confirmPress={async () => {
            setModalView(null);
            await handleEthSendTransaction(id, txData);
          }}
          cancelPress={() => handleReject(id)}
          txData={{
            ...txData,
            from,
            to,
            network,
          }}
          abiInputData={formatedInputData}
        />
      );
    } catch (e) {
      console.log("Error Popup : ", e)
    }
  };

  const popupNormalTransactionModal = async (id, txData) => {
    console.log("popupNormalTransactionModal called", id, txData);
    const network = "Mainnet";
    const from = web3.utils.toChecksumAddress(address, networkId);
    const to = web3.utils.toChecksumAddress(txData.to, networkId);

    setModalView(
      <MessageModal
        dappUrl={myUrl}
        confirmPress={async () => {
          setModalView(null);
          await handleEthSendTransaction(id, txData);
        }}
        cancelPress={() => handleReject(id)}
        txData={{
          ...txData,
          from,
          to,
          gasLimit: String(txData.gasLimit),
          network,
        }}
      />
    );
  };

  async function checkIsContractAddress(address) {
    const code = await web3.eth.getCode(address);
    return (code == "0x") ? false : true;
  }

  const popupTransactionModal = async (payload) => {
    console.log("popupTransactionModal called", payload);
    const id = payload.id;
    const { params } = payload;
    let { nonce, gasPrice, gas, value } = params[0];
    const { to, data } = params[0];

    // When value is undefiend, set to default value.
    if (!value) {
      value = "0x0";
    }

    // Calculate nonce from blockchain when nonce is null
    if (!nonce) {
      nonce = await web3.eth.getTransactionCount(address, "pending");
    }

    // Get current gasPrice from blockchain when gasPrice is null
    if (!gasPrice) {
      await web3.eth
        .getGasPrice()
        .then((latestGasPrice) => {
          gasPrice = latestGasPrice;
        })
        .catch((err) => {
          console.log("getGasPrice error: ", err);
          gasPrice = "0x47868C00";
        });
    }

    // Estimate gas with { to, data } when gas is null
    if (!gas) {
      await web3.eth
        .estimateGas({
          from: address,
          to,
          data,
          value,
        })
        .then((latestGas) => {
          gas = latestGas;
        })
        .catch((err) => {
          console.log("estimateGas error: ", err);
          gas = "0x927c0";
        });
    }

    const txData = {
      nonce,
      data,
      // gas * 1.5 to ensure gas limit is enough
      gasLimit: parseInt(gas * 1.5, 10),
      gasPrice,
      to,
      value,
    };
    const toAddress = to.toLowerCase();

    const isContractAddress = await checkIsContractAddress(
      toAddress
    );

    if (isContractAddress) {
      // popup default contract modal
      popupContractModal(id, txData);
    } else {
      // popup normal transaction modal
      popupNormalTransactionModal(id, txData);
    }
  };

  const handleNavigation = (navigationEvent) => {
    const { url } = navigationEvent;
    if (url.slice(0, 2) == "wc") {
      setConnectWalletUrl(true);
      walletConnectStatus = true;
      console.log("calleddd");
      return false; // block navigation to other domains
    } else {
      setConnectWalletUrl(false);
      walletConnectStatus = false;
      return true; // allow navigation
    }
  };


  const [web3JsContent, setWeb3JsContent] = useState("");
  const [ethersJsContent, setEtherJsContent] = useState("");

  useEffect(() => {
    if (web3JsContent === "") {
      Web3File().then((data) => {
        // console.log("Data return  1 >>>>>>> : ",data.data)
        setWeb3JsContent(data.data);
        setIsMoving(true)
      })
    }
  }, [])



  const getJsCode = (address, networkId) => {
    const dappName = "";

    return `
   
      ${ethersJsContent}
      ${web3JsContent}
        (function() {
          var web33 = "";
          let resolver = {};
          let rejecter = {};
         


          ${Platform.OS === "ios" ? "window" : "document"
      }.addEventListener("message", function(data) {
           
            try {
              const passData = data.data ? JSON.parse(data.data) : data.data;
              console.log("passDatapassDatapassData",passData)
              const { id, result } = passData;
              
              if (result && result.error && rejecter[id]) {
                rejecter[id](new Error(result.message));
                
              } else if (resolver[id]) {
                resolver[id](result);
                
              }
            } catch(err) {
              console.log('listener message err: ', err);
            }
          })
        
          communicateWithRN = (payload) => {
            return new Promise((resolve, reject) => {
              console.log('JSON.stringify(payload): ', JSON.stringify(payload));
              window.ReactNativeWebView.postMessage(JSON.stringify(payload));
              const { id } = payload;
              resolver[id] = resolve;
              rejecter[id] = reject;
            })
          }

          async function transactionInit(data,fromAddr,toAddr,value,gas,gasPrice)
          {
  
              const nonce = await web33.eth.getTransactionCount(fromAddr, 'pending');
  
             return new Promise(async(resolve, reject) => {

              const rawTransaction = {
                   "from": fromAddr,
                   "to": toAddr,
                   "value": value,
                   "gasPrice": gasPrice,
                   "gasLimit": gas,
                   "nonce": nonce,
                   "data":data
                  };
  
                  console.log('rawTransactionrawTransaction',rawTransaction);
                  const signedTx = await web33.eth.accounts.signTransaction(rawTransaction,'${privateKey}');
                  console.log('signedTxsignedTx12333333-----1',signedTx.rawTransaction);
                  alert("signedTx : > "+signedTx)
                  try{
                       var hashResp = "";

                       hashResp =await web33.eth.sendSignedTransaction(signedTx.rawTransaction);

                       console.log(hashResp,'hashResp');
                       alert("hashResp : "+hashResp)

                       let result = (hashResp && hashResp.transactionHash)?hashResp.transactionHash:"";

                       console.log('result is:',result);

                       resolve(result);
                   }catch(err)
                   {
                    alert("hashRes err: "+err)
                       console.log(err,'errerrerr');
                       reject(err);
                   }
              })
                  
          }

          function initNotification() {
            setInterval(() => {
              if (!window.Notification) {
                // Disable the web site notification
                const Notification = class {
                  constructor(title, options) {
                    this.title = title;
                    this.options = options;
                  }
      
                  // Override close function
                  close() {
                  }
      
                  // Override bind function
                  bind(notification) {
                  }
                }
      
                window.Notification = Notification;
              }
            }, 1000)
          }

          function initWeb3() {
            // Inject the web3 instance to web site
           try{
            const rskEndpoint = '${rpcUrl}';
          
            const provider = new Web3.providers.HttpProvider(rskEndpoint);
           // alert("RPC :"+provider)
           //  const web3Provider = new ethers.providers.Web3Provider(provider)
            
            const web3 = new Web3(provider);
            web33 = new Web3(provider);
            // When Dapp is "Money on Chain", webview uses Web3's Provider, others uses Ethers' Provider
            window.ethereum =provider;
          
            window.ethereum.selectedAddress = '${address}';

            alert("Window.etherum : "+window.ethereum.selectedAddress)
            window.address = '${address}';
            window.ethereum.networkVersion = ${networkId};
            window.ethereum.isTrust = true;
            window.ethereum.web3 = web3;
            window.web3 = web3;
            window.web3.eth.defaultAccount = '${address}'

            // Adapt web3 old version (new web3 version move toDecimal and toBigNumber to utils class).
            window.web3.toDecimal = window.web3.utils.toDecimal;
            window.web3.toBigNumber = window.web3.utils.toBN;
            
            const config = {
              isEnabled: true,
              isUnlocked: true,
              networkVersion: ${networkId},
              onboardingcomplete: true,
              selectedAddress: '${address}',
            }

            // Some web site using the config to check the window.ethereum is exist or not
            window.ethereum.publicConfigStore = {
              _state: {
                ...config,
              },
              getState: () => {
                return {
                  ...config,
                }
              }
            }

            window.web3.setProvider(window.ethereum);

            // Override enable function can return the current address to web site
            window.ethereum.enable = () => {
              return new Promise((resolve, reject) => {
                resolve(['${address}']);
              })
            }

            // Adapt web3 old version (new web3 version remove this function)
            window.web3.version = {
              api: '1.2.7',
              getNetwork: (cb) => { cb(null, ${networkId}) },
            }

            window.ethereum.on = (method, callback) => { if (method) {console.log(method); alert("methoda :L "+method) } }

            // Adapt web3 old version (need to override the abi's method).
            // web3 < 1.0 using const contract = web3.eth.contract(abi).at(address)
            // web3 >= 1.0 using const contract = new web3.eth.Contract()
            window.web3.eth.contract = (abi) => {
              const contract = new web3.eth.Contract(abi);
              contract.at = (address) => {
                contract.options.address = address;
                return contract;
              }

              const { _jsonInterface } = contract;
              _jsonInterface.forEach((item) => {
                if (item.name && item.stateMutability) {
                  const method = item.name;
                  if (item.stateMutability === 'pure' || item.stateMutability === 'view') {
                    contract[method] = (params, cb) => {
                      console.log('contract method: ', method);
                      contract.methods[method](params).call({ from: '${address}' }, cb);
                    };
                  } else {
                    contract[method] = (params, cb) => {
                      alert('contract method: '+ method)
                      console.log('contract method: ', method);
                      contract.methods[method](params).send({ from: '${address}' }, cb);
                    };
                  }
                }
              });

              return contract;
            }

           
            const sleep = ms => new Promise(r => setTimeout(r, ms));
            // Override the sendAsync function so we can listen the web site's call and do our things
            const sendAsync = async (payload, callback) => {
              let err, res = '', result = '';

              let unixTime = Math.floor(Date.now() / 1000);
              
              payload.id = unixTime;
              payload.jsonrpc = "2.0"
              
              const {method, params,id,jsonrpc} = payload;
             //  alert("payLoad : "+method);
             //await sleep(1000);
              console.log('payload: from sendAsync +++++', payload);
             
              try {
                if (method === 'net_version') {
                  result = ${networkId};
                } else if (method === 'eth_chainId') {
                  result = web3.utils.toHex(${networkId});
                } else if (method === 'eth_requestAccounts' || method === 'eth_accounts' || payload === 'eth_accounts') {
                  result = ['${address}'];
                } 
                
                else if (method === 'eth_estimateGas')
                {
                  alert("eth_estimateGas : ")
                    var fromAddr    = (params && params[0] && params[0].from)?params[0].from:"";
                    var toAddr      = (params && params[0] && params[0].to)?params[0].to:"";
                    var value       = (params && params[0] && params[0].value)?params[0].value:"";
                    var data        = (params && params[0] && params[0].data)?params[0].data:"";

                    let estGas = await web33.eth.estimateGas({
                    from:fromAddr,
                    value:value,
                    to: toAddr,
                    data: data})
                    alert("eth_estimateGas 1 : "+estGas)
                    result = estGas;
                }
                else if (method === 'eth_blockNumber')
                {
                    let blockNumberIs = await web33.eth.getBlock("latest");

                    console.log('blockNumberIs121212121:',blockNumberIs);
                    console.log('blockNumberIs:',blockNumberIs.number);
                    result = blockNumberIs.number;
                }
               
                else {
                  result = await communicateWithRN(payload);
                }
                console.log("resultresultresultresult",result)
                res = {id, jsonrpc, method, result};
              } catch(err) {
                err = err;
                console.log('sendAsync err: ', err);
                alert('sendAsync err: '+ err)
              }
              
              console.log('res: ', res);
              if (callback) {
                callback(err, res);
              } else {
                return res || err;
              }
            }

            // ensure window.ethereum.send and window.ethereum.sendAsync are not undefined
            setTimeout(() => {
              if (!window.ethereum.send) {
                window.ethereum.send = sendAsync;
              }
              if (!window.ethereum.sendAsync) {
                window.ethereum.sendAsync = sendAsync;
              }
              if (!window.ethereum.request) {
                window.ethereum.request = (payload) =>
                  new Promise((resolve, reject) =>
                    sendAsync(payload).then((response) =>
                      response.result
                        ? resolve(response.result)
                        : reject(new Error(response.message || 'provider error'))));
              }
            }, 1000)

          }catch(e){
           alert("Error : "+e)
          }
          }
          initNotification();
        

          initWeb3();
         
         
        }) ();
      
    `;
  };

  const injectJavaScriptdata = () => {
    const jsCode = getJsCode(address, networkId);
    return jsCode;

  }

  const injectwalletScriptdata = () => {

  }
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get(
        "REAL_WINDOW_HEIGHT"
      );

  return isMoving && (
    <View style={styles.container}>
      <Modal
        style={[styles.modal]}
        animationType="slide"
        visible={modalView !== null}
        deviceWidth={deviceWidth} deviceHeight={deviceHeight}
      // onRequestClose={() => {
      //   // Alert.alert("Modal has been closed.");
      //   setModalVisibleLocation(!modalVisibleLocation);
      // }}
      >
        {modalView}
      </Modal>
      <WebView
        ref={webview}
        source={{ uri: "https://testnets.opensea.io/" }}
        mixedContentMode={"compatibility"}
        setSupportMultipleWindows={connectWalletUrl}
        onShouldStartLoadWithRequest={handleNavigation}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled={true}
        javaScriptEnabledAndroid
        // injectedJavaScript={injectJavaScriptdata()} 
        injectedJavaScriptBeforeContentLoaded={injectJavaScriptdata()}
        onLoadProgress={(e) => {
          const state = e.nativeEvent;
          setCanGoBack(state.canGoBack);
        }}
        onMessage={(event) => onMessage(event)}
        style={styles.video}
      />
    </View>
  )






  //   return web3JsContent && (
  //     <>
  //     <Modal
  //       style={[styles.modal]}
  //         animationType="slide"        
  //         visible={modalView !== null}
  //         deviceWidth={deviceWidth} deviceHeight={deviceHeight}
  //         // onRequestClose={() => {
  //         //   // Alert.alert("Modal has been closed.");
  //         //   setModalVisibleLocation(!modalVisibleLocation);
  //         // }}
  //       >
  //           {modalView}
  //       </Modal>
  //     <WebView
  //             ref={webview}
  //             source={{ uri: "http://43.204.99.101:9000/sale/0x106DA86635F154d00A377E20E67800034c9bc373" }}
  //             mixedContentMode={"compatibility"}
  //              setSupportMultipleWindows={connectWalletUrl}
  //              onShouldStartLoadWithRequest={handleNavigation}
  //             originWhitelist={["*"]}
  //             javaScriptEnabled
  //             domStorageEnabled={true}
  //             javaScriptEnabledAndroid
  //            // injectedJavaScript={injectJavaScriptdata()} 
  //             injectedJavaScriptBeforeContentLoaded={injectJavaScriptdata()}
  //             onLoadProgress={(e) => {
  //               const state = e.nativeEvent;
  //                setCanGoBack(state.canGoBack);
  //             }}
  //             onMessage={(event) => onMessage(event)}
  //             style={styles.video}
  //           />
  // </>
  //   )
}

export default Test;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  video: {
    maxHeight: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    flex: 1
  },
  buttonStyle: {
    marginTop: 23,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: "30%",
    borderRadius: 10,
    borderColor: '#000',
    borderTopWidth: 1,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    backgroundColor: "#a3dff6",
    marginLeft: "auto",
    marginRight: "auto",
  },
  buttontext: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Roboto-Bold',
    fontStyle: 'italic',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  touchDivWidth: {
    height: "100%",
    width: "83%",
    marginLeft: "8.5%",
    marginRight: "8.5%",
    marginTop: -(Dimensions.get('window').height) * 0.15
  },
});
