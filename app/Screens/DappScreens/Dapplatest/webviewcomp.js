import React, { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Dimensions, Modal, Platform, View } from "react-native";
import WebView from "react-native-webview";
import Dappheader from "./Dappheader";
import Networklist from "./networklist";
import { useDispatch, useSelector } from "react-redux";
import { EncodePrivateKey, findHostNameWithUrl } from "../../../utils/common";
import { ApiConstants } from "../../../api/ApiConstants";
import { Web3File } from "../DappWeb3";
import { getJsCode } from "./WebviewFunc/getJsCode";
import { CHAINS, CHAIN_INFO, useWeb3WithRPC } from "../useWeb3";
import MessageModal from "../DappModal";
import { dappWeb } from "../../../Redux/Actions/dappWebAction";
import { Text } from "react-native";
import theme from "../../../utils/theme";
import { CurrenTabId, Getmultitabs, UpdateTab, setImageUrl, setNavigateAction } from "../../../Redux/Actions/DapplatetsActions";
import getRealm from "../../../localDb/RealmConfig";
import { setDapphistory } from "../common/D_app";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { captureScreen } from 'react-native-view-shot';
import axios from "axios";

var walletConnectStatus = false;

const height = Dimensions.get("window").height
const margin = 16;
const THUMB_WIDTH = Dimensions.get('window').width / 2 - margin * 2;
const THUMB_HEIGHT = Platform.OS === 'ios' ? THUMB_WIDTH * 1.81 : THUMB_WIDTH * 1.48;

const Dappwebviewcomp = ({ webRef, postMessageToWebView, sethandlescroll, onProgress, setLoad, height, onWebViewMessage, injectedjs }) => {

    const [connectWalletUrl, setConnectWalletUrl] = useState(false);
    const [address, setAddress] = useState("");
    const [privateKey, setPrivatekey] = useState("");
    const [network, setNetwork] = useState("");
    const [web3JsContent, setWeb3JsContent] = useState("");
    const [isMoving, setIsMoving] = useState(false);
    const [urlForSearch, setUrlForSearch] = useState("")
    const [modalView, setModalView] = useState(null);
    // const [currentTabId, setCurrentTabId] = useState("")
    const [ethersJsContent, setEtherJsContent] = useState("");
    const [networkInfo, setNetworkInfo] = useState({
        chainId: 56,
        rpcUrl: "https://bsc-dataseed1.binance.org/"
    });
    const web3 = useWeb3WithRPC(networkInfo.rpcUrl)
    // const webRef = useRef(null)

    const navigation = useNavigation()
    const dispatch = useDispatch();
    const setDappStatus = (item) => dispatch(dappWeb(item));
    const updateTab = (item) => dispatch(UpdateTab(item));
    const setCurrentTabId = (item) => dispatch(CurrenTabId(item));
    const Multitabsdata = (item) => dispatch(Getmultitabs(item));
    const setimageUrl = (item) => dispatch(setImageUrl(item));
    const setnavigateAction = (item) => dispatch(setNavigateAction(item));

    const walletDetails = useSelector(
        (state) => state.allCurrrencyReducer.Allcurrency
    );

    const { weburl, selectedTab, multitabs, currenttabId, Maddress, ActiveTabId, navigateAction, privateMode } = useSelector(state => ({
        weburl: state.DapplatestReducer.weburl,
        selectedTab: state.DapplatestReducer.selectedTab,
        multitabs: state.DapplatestReducer.multitabs,
        currenttabId: state.DapplatestReducer.currenttabId,
        Maddress: state.DapplatestReducer.Maddress,
        ActiveTabId: state.DapplatestReducer.ActiveTabId,
        navigateAction: state.DapplatestReducer.navigateAction,
        privateMode: state.DapplatestReducer.privateMode
    }));

    useEffect(() => {
        if (web3JsContent === "") {
            Web3File().then((data) => {
                // //console.log("Data return  1 >>>>>>> : ",data.data)
                setWeb3JsContent(data.data);
                setIsMoving(true)
            })
        }
    }, [network])

    useFocusEffect(
        useCallback(() => {
            if (privateMode == false) saveDappHistory();
        }, [urlForSearch])
    )
    useEffect(() => {
        setPrivatekey(EncodePrivateKey(walletDetails.wallets[0].privKey))
        setAddress(walletDetails.wallets[0].walletaddress)

        var type = walletDetails.wallets[0].tokenType.includes('ERC')
            ? ApiConstants.eth_chainId
            : walletDetails.wallets[0].tokenType.includes('BEP')
                ? ApiConstants.bnb_chainId
                :
                walletDetails.wallets[0].tokenType.includes('WRC')
                    ? ApiConstants.wan_chainId
                    : walletDetails.wallets[0].tokenType.includes('XRC')
                        ? ApiConstants.xdc_chainId
                        : ApiConstants.polygon_chainId
        setNetwork(type)
    }, [])

    // useEffect(() => {
    //     const backAction = () => {
    //         setDappStatus({ status: "false", item: "item" });
    //         return true;
    //     };
    //     const backHandler = BackHandler.addEventListener(
    //         "hardwareBackPress",
    //         backAction
    //     );
    //     return () => backHandler.remove();
    // }, []);

    const navigateSecurityPage = (item) => {
        try {
            getRealm()
                .then((realm) => {
                    var passcodeVal = realm.objects("userPasscodeValue");
                    var biometricVal = realm.objects("userBiometricStatus");
                    console.log("passcodeVal", passcodeVal);
                    if (passcodeVal.length == 0 && global.biometricStatus == 0) {
                        navigation.navigate(item);
                    } else if (
                        (global.passcodeStatus == 1 || global.passcodeStatus == 0) &&
                        global.biometricStatus != 0
                    ) {
                        global.bioPage = "EnterPasscode"
                        navigation.push("CheckBiometric", item);
                    } else if (passcodeVal.length == 1 || global.biometricStatus == 0) {
                        navigation.navigate("EnterPasscode", item);
                    }

                })
                .catch((err) => {
                    console.log("errror on navigagtet", err);
                })


        } catch (error) {
            console.log("errror on navigatepage", error);
        }
    }


    const handleNavigation = (navigationEvent) => {
        const { url } = navigationEvent;
        if (url.slice(0, 2) == "wc") {
            setConnectWalletUrl(true);
            walletConnectStatus = true;

            if (global?.initialEnter == undefined) {
                navigateSecurityPage(url)
            } else {
                dispatch({
                    type: "Session",
                    data: {
                        url: url, StopAction: true, Loader: true,
                        from: urlForSearch
                    }
                })
            }
            return false; // block navigation to other domains
        } else {
            setConnectWalletUrl(false);
            walletConnectStatus = false;
            return true; // allow navigation
        }
    };

    const switchInjectedData = (_address = address, _chainId = networkInfo.chainId, _rpc = networkInfo.rpcUrl) => {
        // web3 decode response
        //console.log("switchInjectedData caleed : ")
        var jsCode = getJsCode(_address, _chainId, _rpc, privateKey, ethersJsContent, web3JsContent);
        return jsCode;
    }




    const estimateGas = async (payload) => {
        //console.log("popupTransactionModal called", payload);
        // alert("popup call")
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
                    //console.log("getGasPrice error: ", err);
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
                    //console.log("estimateGas error: ", err);
                    gas = "0x927c0";
                });
        }
        let gasLimit = parseInt(gas * 1.5, 10);

        const result = { id, result: gasLimit };
        postMessageToWebView(result);

    }

    const handleEthGasPrice = async (payload) => {
        try {
            const { id } = payload;
            const res = await web3.eth.getGasPrice();
            const result = { id, result: res };
            // //console.log("handleEthgas price result", result);
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
            //console.log("handleEthCall err", err);
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
            // //console.log("Gas Fee Block : ",res)
            postMessageToWebView(result);
        } catch (err) {
            //console.log("handleEthGetBlockByNumber err", err);
        }
    };

    const handleEthGetBlockNumber = async (payload) => {
        try {
            const { id } = payload;
            const res = await web3.eth.getBlockNumber();

            // //console.log("resresresres getBlockNumber", res);
            const result = { id, result: res };
            postMessageToWebView(result);
        } catch (err) {
            //console.log("handleEthGetBlockNumber err", err);
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
            //console.log("personal_sign err: ", err);
            handleReject(id, err.message);
        }
    };

    const handleReject = async (id, message) => {
        setModalView(null);
        postMessageToWebView({ id, error: 1, message });
    };

    const popupMessageModal = async (payload) => {
        // //console.log("popupMessageModal called", payload);
        const { id, params } = payload;
        const message = params[0].startsWith("0x")
            ? web3.utils.hexToAscii(params[0])
            : params[0];

        setModalView(
            <MessageModal
                title={"Personal Sign"}
                dappUrl={weburl}
                address={address}
                confirmPress={async () => {
                    setModalView(null);
                    await handlePersonalSign(id, message);
                }}
                cancelPress={() => handleReject(id)}
                message={message}
            />
        );
    };

    async function checkIsContractAddress(address) {
        const code = await web3.eth.getCode(address);
        return (code == "0x") ? false : true;
    }

    const handleEthSendTransaction = async (id, txData) => {

        console.log("handleEthSendTransaction", id, txData);
        try {
            const accountInfo = web3.eth.accounts.privateKeyToAccount(privateKey);
            console.log("accountInfo", accountInfo);
            if (accountInfo.address != "") {
                const signedTransaction = await accountInfo.signTransaction(txData);
                const { rawTransaction } = signedTransaction;

                await web3.eth
                    .sendSignedTransaction(rawTransaction)
                    .on("transactionHash", async (hash) => {
                        //console.log("hashhashhash", hash);
                        //  const res = await hasTxlogs(hash);
                        //  //console.log("sendSignedTransaction res : ",res)
                        const result = { id, result: hash };
                        //postMessageToWebView(result);
                        postMessageToWebView(result);

                        // Alert.alert("Success", "Transaction Completed.", [
                        //   {
                        //     text: "OK",
                        //     onPress: () => {
                        //       // webview.current.reload();
                        //       // webview.current.injectJavaScript(jsCode);
                        //       postMessageToWebView(result);
                        //     },
                        //   },
                        // ]);
                    })
                    .on("error", (error) => {
                        //console.log("sendSignedTransaction error: ", error);
                        const result = { id, result: error };
                        //postMessageToWebView(result);
                        postMessageToWebView(result);
                        handleReject(id, error.message);
                    });
            }
        } catch (err) {
            console.log("eth_sendTransaction err: ", err);
            handleReject(id, err.message);
        }
    };

    const popupContractModal = async (id, txData, formatedInputData) => {
        try {
            // alert("popupContractModal call")
            //console.log("popupContractModal called", id, txData, formatedInputData);
            const network = "Mainnet";
            const from = web3.utils.toChecksumAddress(address, networkInfo.chainId);
            const to = web3.utils.toChecksumAddress(txData.to, networkInfo.chainId);
            setModalView(
                <MessageModal
                    title={"Contract Interaction"}
                    dappUrl={weburl}
                    address={address}
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
            //console.log("Error Popup : ", e)
        }
    };

    const popupNormalTransactionModal = async (id, txData) => {
        //console.log("popupNormalTransactionModal called", id, txData);
        const network = "Mainnet";
        const from = web3.utils.toChecksumAddress(address, networkInfo.chainId);
        const to = web3.utils.toChecksumAddress(txData.to, networkInfo.chainId);

        setModalView(
            <MessageModal
                title={"Transfer"}
                dappUrl={weburl}
                address={address}
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
        //console.log("handleEthGetTransactionReceipt resultttt", result);
        postMessageToWebView(result);
    };

    const popupTransactionModal = async (payload) => {
        try {
            console.log("popupTransactionModal called", payload);
            // alert("popup call")
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
                        //console.log("getGasPrice error: ", err);
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
                        //console.log("estimateGas error: ", err);
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
            console.log("toAddress", toAddress);
            const isContractAddress = await checkIsContractAddress(
                toAddress
            );
            console.log("isContractAddress", isContractAddress);
            if (isContractAddress) {
                // popup default contract modal
                popupContractModal(id, txData);
            } else {
                // popup normal transaction modal
                popupNormalTransactionModal(id, txData);
            }
        } catch (error) {
            console.log("errr on popupTransactionModal", error);
        }

    };


    const handleEthGetTransactionByHash = async (payload) => {
        const { id, params } = payload;
        const res = await web3.eth.getTransaction(params[0]);
        const result = { id, result: res };
        postMessageToWebView(result);
    };

    const handleDefault = async (payload) => {
        try {
            // console.log("handle Default called : ", payload)
            const { id, method, params } = payload;
            await web3.currentProvider.send({
                method: method,
                params: params,
                jsonrpc: '2.0',
                id: id,
            }, (error, result) => {
                if (error) {
                    console.error('Error:', error);
                } else {
                    // console.log('Resultzfwfwaw:', result);
                    postMessageToWebView(result);
                }
            })
        } catch (err) {
            console.log("handleDefault err", err);
        }
    };


    const onMessage = async (event) => {
        let data = JSON.parse(event.nativeEvent.data);
        // console.log("data", data);
        const payload = data;
        const { method, id } = payload;
        // console.log("method", method, id);
        onWebViewMessage(event)
        try {
            switch (method) {
                case "eth_requestAccounts": {
                    //   setApproveModalVisible(true);
                    //   setApprovalDetails(event.nativeEvent);
                    break;
                }
                case "eth_estimateGas": {
                    await estimateGas(payload);
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

                case "wallet_switchEthereumChain": {
                    try {
                        // //console.log("payload.params[0].chainId", payload);
                        var BN = web3.utils.BN;
                        var chainId = new BN(payload.params[0].chainId).toString();
                        var rpc = CHAINS[chainId];
                        // //console.log("wallet_switchEthereumChain : ", chainId, rpc)
                        var index = CHAIN_INFO.map((el) => el.chainId).indexOf(chainId);
                        setNetwork(chainId);
                        // setIsSwitched(true);
                        setNetworkInfo({
                            rpcUrl: rpc,
                            chainId: chainId
                        })
                        var index = CHAIN_INFO.map((el) => el.chainId).indexOf(chainId);
                        setNetwork(chainId);
                        const result = {
                            id: payload.id, result: true, switchChain: true, config: {
                                chainId: chainId,
                                rpcUrl: rpc
                            }
                        };
                        postMessageToWebView(result);

                    }
                    catch (e) {
                        //console.log("Error wallet_switchEthereumChain : ", e)
                    }
                }

                default: {
                    await handleDefault(payload);
                    break;
                }

            }
        } catch (err) {
            if (err && err.code) {
            } else {
            }
            handleReject(id, err.message);
        }
    };

    // console.log("wbeebebeb", JSON.stringify(multitabs, null, 2), selectedTab, currenttabId);

    const setImageOnLocal = async (Url, TabID) => {
        console.log("awfawdawdadawdawdaw", Url, TabID);
        getRealm()
            .then((realm) => {
                var dappVal1 = realm.objects("dappTabs");
                // console.log("dappppvall", JSON.stringify(dappVal1, null, 2));
                // console.log("Url,TabID", Url, TabID);
                setimageUrl(Url)
                var findTab = dappVal1.filter(val => val.TabId == TabID)
                realm.write(() => {
                    findTab[0].ImageUrl = Url
                })
                console.log("findAndChanged", JSON.stringify(dappVal1, null, 2));
            })
            .catch((e) => {
                console.log("errror on save screen shot", e);
            })
    }

    {/** Taking screen shot and store for multitab */ }
    const takeScreenshot = () => {
        console.log("errrororor");
        try {
            new Promise((resolve, reject) => {
                captureScreen({
                    format: 'jpg',
                    quality: 0.2,
                    THUMB_WIDTH,
                    THUMB_HEIGHT,
                }).then(
                    async (uri) => {
                        console.log("----------->uri", uri, ActiveTabId);

                        var TabIds = multitabs.map(item => item.TabId)
                        console.log("TabIds", TabIds);
                        var imageName = `${String(Date.now())}.jpg`
                        var formData = new FormData()
                        formData.append("dappImage", {
                            uri: `${uri}`,
                            name: `${imageName}`,
                            type: 'image/jpg',
                        })
                        formData.append("mailAddress", Maddress)
                        formData.append("TabId", ActiveTabId)
                        formData.append("AllTabs", JSON.stringify(TabIds))

                        var chk = await axios({
                            method: "POST",
                            url: ApiConstants.TOKEN_URL + ApiConstants.saveDappimage,
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'multipart/form-data',
                                "Authorization": "Bearer " + global.token
                            },
                            data: formData,
                        })
                        console.log("chkchkchkchk", chk.data);
                        setImageOnLocal(imageName, ActiveTabId)
                        resolve(true)
                    },
                    (error) => {
                        console.log("loaoaoaooaoaae erroror", error);
                        reject(error);
                    },
                );
            });
        } catch (error) {
            console.log("errror", error);
        }

    }

    console.log("navigateAction", navigateAction);
    const onUrlChange = async (url) => {
        try {
            console.log('multitabs[selectedTab].TAB---------->', JSON.stringify(multitabs[selectedTab].TAB, null, 2), currenttabId)
            if ((multitabs[selectedTab].TAB[multitabs[selectedTab]?.TAB?.length - 1].URL != url) && (navigateAction == "")) {

                if (currenttabId + 1 < multitabs[selectedTab].TAB.length) {
                    var cutingTab = multitabs[selectedTab].TAB
                    var cutted = cutingTab.splice(currenttabId + 1, cutingTab.length - (currenttabId + 1))
                }

                //Store in redux
                var findHost = await findHostNameWithUrl(url)
                var setObj = { URL: url, hostName: findHost.hostname, id: String(multitabs[selectedTab].TAB.length) }
                updateTab(setObj)

                //store in realm(local storage)
                getRealm()
                    .then(async (realm) => {
                        var dappVal1 = realm.objects("dappTabs");

                        if (cutingTab) {
                            realm.write(() => {
                                dappVal1[selectedTab].TAB = multitabs[selectedTab].TAB
                                dappVal1[selectedTab].TAB.push(setObj)
                            });
                        } else {
                            realm.write(() => {
                                dappVal1[selectedTab].TAB.push(setObj)
                            });
                        }

                    })
                    .catch((err) => {
                        console.error("errro  iopn aadad savedapp realm", err);
                    })

                setCurrentTabId(setObj.id)
            }

        } catch (error) {
            console.log("error on urlchange", error);
        }

    }

    {/**This function saves the dapp history on database */ }
    const saveDappHistory = async () => {
        try {
            if (urlForSearch) {
                var findHost = await findHostNameWithUrl(urlForSearch ?? weburl)
                var sendData = { URL: urlForSearch ?? weburl, hostName: findHost.hostname, mailAddress: Maddress }
                // console.log("sendDatasendData", sendData);
                setDapphistory(sendData)
                    .then((val) => {
                        // console.log("zafawfawsd", val.data);
                        // getHistoryFunc()
                    })
                    .catch((err) => {
                        console.log("errerrrr ", err);
                    })
            }
        } catch (error) {
            console.log("eerroor", error);
        }


    }


    console.log("webRef.current", webRef.current);
    return (
        <>
            {console.log("weburl in webciew", weburl)}
            {
                (isMoving && privateKey != "" && address != "") ?
                    <WebView
                        source={{ uri: weburl }}
                        onScroll={sethandlescroll}
                        scrollEventThrottle={1}
                        mixedContentMode={"compatibility"}
                        setSupportMultipleWindows={connectWalletUrl}
                        originWhitelist={["*"]}
                        javaScriptEnabled
                        domStorageEnabled={true}
                        javaScriptEnabledAndroid
                        cacheEnabled
                        automaticallyAdjustContentInsets={false}
                        canGoBack={true}
                        renderError={() => {
                            return (<View></View>)
                        }}
                        incognito={privateMode}
                        allowsFullscreenVideo
                        allow
                        themeColor="#007AFF"
                        onLoadStart={() => setLoad(true)}
                        onLoadProgress={(e) => {
                            onProgress(e);
                            console.log("----------------->", e.nativeEvent.progress);
                            if (e.nativeEvent.progress > 0.7) { onUrlChange(e.nativeEvent.url); setUrlForSearch(e.nativeEvent.url); }
                        }}
                        onLoadEnd={(e) => {
                            const state = e.nativeEvent;
                            takeScreenshot();
                            if (!state.loading) {
                                if (navigateAction != "") setnavigateAction("");
                                setLoad(false)
                            }

                        }}
                        ref={webRef}
                        injectedJavaScriptBeforeContentLoaded={switchInjectedData()}
                        onShouldStartLoadWithRequest={handleNavigation}
                        onMessage={(event) => onMessage(event)}
                        sendCookies
                        javascriptEnabled
                        allowsInlineMediaPlayback
                        allowFileAccess
                        useWebkit
                        testID={'browser-webview'}
                        applicationNameForUserAgent={'WebView MetaMaskMobile'}
                        scalesPageToFit={true}
                        style={{ width: "100%", height: height, flex:1 }}
                        injectedJavaScript={injectedjs}


                    />
                    : <View>
                        <Text>
                            {/* {console.log("privateKey ", privateKey)} */}
                        </Text>
                    </View>
            }

            <Modal
                animationType="slide"
                visible={modalView !== null}
            >
                {modalView}
            </Modal>
        </>

    )
}

export default Dappwebviewcomp;