
import React, {
  useEffect,
  useState,
  createRef,
  useRef,
  useContext,
  useCallback,
} from "react";
import LinearGradient from 'react-native-linear-gradient';
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
  ToastAndroid,
  Animated,
} from "react-native";

import { WebView } from "react-native-webview";
import Modal from "react-native-modal";
import { CHAINS, CHAIN_INFO, useWeb3WithRPC } from "./useWeb3";
import { Web3File } from "./DappWeb3";
import MessageModal from "./DappModal";
import { Icon as Icn } from "react-native-elements";
import { Card, Searchbar, TextInput } from "react-native-paper";
import getRealm from "../../localDb/RealmConfig";

import URL from 'url-parse';

import themeContext from "../../utils/themeContext";
import { useDispatch, useSelector } from "react-redux";
import { dappWeb, webref, webtabs } from "../../Redux/Actions/dappWebAction";
import { Fonts } from "../../utils/Fonts";
import { EncodePrivateKey, findCommonObjectsById, findHostNameWithUrl } from "../../utils/common";
import { useFocusEffect } from "@react-navigation/native";
import { ApiConstants } from "../../api/ApiConstants";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import theme from "../../utils/theme";
import { borderRadius, windowWidth, windowheight } from "../../utils/Dimensions";
import TokenClient from "../../api/TokenClient";
import DappIcon from '../../assets/icons/darktheme/DApps.svg'
import DappIconLight from '../../assets/icons/lighttheme/DApps.svg'

import PlusIcon from '../../assets/icons/darktheme/plus_white.svg'
import PlusIconLight from '../../assets/icons/lighttheme/plus_black.svg'


import BackDark from '../../assets/icons/darktheme/Back arrow.svg'
import BackLight from '../../assets/icons/lighttheme/Back arrow.svg'

import { FavDappApi, addFavDappApi, getDapphistory, removeFavDappApi, setDapphistory } from "./common/D_app";
import WalletDark from '../../assets/icons/darktheme/Wallet.svg';
import WalletLight from '../../assets/icons/lighttheme/Wallet.svg';

import WebviewComp from "./WebviewComp";
import SearchiconDark from '../../assets/icons/darktheme/Security.svg'
import SearchiconLight from '../../assets/icons/lighttheme/Security.svg'

import Historylight from '../../assets/icons/lighttheme/Browser History Black.svg'
import Historydark from '../../assets/icons/darktheme/Browser History White.svg'

import Activefavlight from '../../assets/icons/darktheme/active_star_dark.svg'
import Activefavdark from '../../assets/icons/lighttheme/active_star_light.svg'
import InActivefavlight from '../../assets/icons/lighttheme/inactive_star_light.svg'
import InActivefavDark from '../../assets/icons/darktheme/inactive_star_dark.svg'

import Sendlight from '../../assets/icons/lighttheme/Send.svg';
import SendDark from '../../assets/icons/darktheme/Send.svg';
import Receivelight from '../../assets/icons/lighttheme/Receive.svg';
import ReceiveDark from '../../assets/icons/darktheme/Receive.svg';
import Collapsible from 'react-native-collapsible';
import HistoryComp from '../testscreen';
import { Images } from "../../utils/Images";
import { Toastfn } from "../../utils/toast";
import { setActiveTabId } from "../../Redux/Actions/DapplatetsActions";
var walletConnectStatus = false;

const DappWeb = (props) => {
  // console.log("propsqqqqq", props);

  const theme = useContext(themeContext);

  //for search bar
  const onChangeSearch = (query) => setSearchQuery(query);


  const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `


  //for search function
  const [searchQuery, setSearchQuery] = useState("");
  const [chainModal, setChainModal] = useState(false);
  const [state, setState] = useState({
    data: [],
    loading: false,
  }); // only one data source
  const { data, loading } = state;
  const filterdData = searchQuery // based on text, filter data and use filtered data
    ? data.filter((item) => {
      ////console.log("itemitemitem", item.currency.currencyName);
      const itemData = item.currency.toUpperCase();
      // //console.log(itemData);
      const textData = searchQuery.toUpperCase();
      return itemData.indexOf(textData) > -1;
    })
    : data; // on on text, u can return all data
  const [dummy, setDummy] = useState(false)

  //redux
  const dispatch = useDispatch();
  const selectedWallet = useSelector(
    (state) => state.selectedCurrencyListReducer.selectedList
  );
  // console.log("selectedWallet",selectedWallet);
  const setwebref = (item) => dispatch(webref(item))
  const setNewTabs = (item) => dispatch(webtabs(item))
  const setActivetabid = (item) => dispatch(setActiveTabId(item))


  const dappStatusFromRedux = useSelector(
    (state) => state.DappWebReducer.dappWeb
  )
  const url = dappStatusFromRedux?.item?.url;
  //console.log("url", url);
  const [imageUrl, setImageUrl] = useState("ETH");
  const [ImageLabel, setImageLabel] = useState("");

  const setDappStatus = (item) => dispatch(dappWeb(item));

  const dappTabs = useSelector(
    (state) => state.DappWebReducer.webTabs
  )

  const { webRef, current_ind } = useSelector(
    (state) => state.DappWebReducer
  )




  const [enabled, setEnabled] = useState(true);
  const [myUrl, setUrl] = useState('');
  const [urlForSearch, setUrlForSearch] = useState("")
  const [searchValues, setSearchValues] = useState([]);
  const [load, setLoad] = useState(false);
  const [pathDistance, setpathDistance] = useState(0);
  const [odoMeter, SetOdoMeter] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [network, setNetwork] = useState("");
  const [isSwitched, setIsSwitched] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [myfav, favdataList] = useState([]);
  const [mailAddress, setMailaddress] = useState("")
  const [currentTabId, setCurrentTabId] = useState("")

  const [networkInfo, setNetworkInfo] = useState({
    chainId: 56,
    rpcUrl: "https://bsc-dataseed1.binance.org/"
  });

  const [historyView, setHistory] = useState(false)
  const [currentUrl, setCurrentUrl] = useState({});
  const [privateKey, setPrivatekey] = useState("");
  const [address, setAddress] = useState("");
  const [show, setShow] = useState(false)
  const [historyData, setHistoryData] = useState([])
  const [connectWalletUrl, setConnectWalletUrl] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [approvalDetails, setApprovalDetails] = useState(null);
  const [modalView, setModalView] = useState(null);
  const web3 = useWeb3WithRPC(networkInfo.rpcUrl)
  const walletDetails = useSelector(
    (state) => state.allCurrrencyReducer.Allcurrency
  );


  useEffect(() => {
    setSearchValues([])
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

  useFocusEffect(
    useCallback(() => {
      getRealm()
        .then((realm) => {
          var getMail = realm.objects("loginStatus")
          // //console.log("getMail", getMail);
          setMailaddress(getMail[0].mail)
          show_favourite_list(getMail[0].mail)
          getHistoryFunc(getMail[0].mail)
        })
        .catch((err) => {
          //console.log("error on getRealm daopp", err);
        })
    }, [])
  )

  {/**Get history by mailAddress */ }
  const getHistoryFunc = async (data) => {
    getDapphistory({ mailAddress: data ?? mailAddress })
      .then((ress) => {
        // console.log("resslslls", JSON.stringify(ress.data.data, null, 2));
        ress?.data?.data?.map((val) => {
          return val.histories = val.histories.reverse();
        })
        setHistoryData(ress?.data?.data ?? [])
      })
      .catch((err) => {
        console.log("erroro on gethistory", err);
      })
  }

  {/**Add new favourite on database */ }
  const add_favourite = async (data) => {
    var findHostNa = await findHostNameWithUrl(data)
    // console.log('ererder');
    let params = {
      mailAddress: mailAddress,
      from: "web",
      hostName: findHostNa.hostname,
      URL: data
    };
    addFavDappApi(params)
      .then(function (res) {
        Toastfn("Bookmark Added")
        // //console.log("ressssss", res.data);
        show_favourite_list();
      })
      .catch(function (err) {
        //console.log("add_fav_dapp err", err);
      });
  };

  {/**Remove favourite function on databae */ }
  const remove_favourite = (data) => {

    var findId = myfav.filter((val) => {
      return val.title == webUrl[selectedIndex].hostName
    })
    let params = {
      mailAddress: mailAddress,
      dappId: findId[0]._id,
      from: "web"
    };
    removeFavDappApi(params)
      .then(function (res) {
        // //console.log("res.data", res.data);
        Toastfn("Bookmark Removed")
        show_favourite_list();
      })
      .catch(function (err) {
        console.log("remove_fav_dapp err", err);
      });
  };

  {/**get all the favorite list on database by mailaddress */ }
  const show_favourite_list = (mail) => {
    let params = {
      mailAddress: mail ?? mailAddress,
    };
    FavDappApi(params)
      .then(function (response) {
        const favData = response.data.data;
        // console.log("favData", favData);
        favdataList(favData ?? []);
      })
      .catch(function (err) {
        console.log("dapps_fav err", err);
      });
  };

  //from OLD code
  useEffect(() => {
    var arr = [];
    setImageLabel(selectedWallet[0].currency);
    selectedWallet.map((item, index) => {
      if (item.currency != "TRX" && item.currency != "BTC") {
        arr.push(item);
      }
    });
    setState({ data: arr, loading: false });
    // console.log("enabledenabled", enabled);
    // if (enabled) {
    //   setUrl(url);
    //   setUrlForSearch(url)
    // }
  }, []);

  useEffect(() => {
    const backAction = () => {
      setDappStatus({ status: "false", item: "item" });
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);
  //End Old Code

  var [webUrl, setWebUrl] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [tabLength, setTabLength] = useState(1)
  const [refs, setRefs] = useState([])

  {/** It's the common function for get current url hostname */ }
  // const findHostNameWithUrl = async (uri) => {
  //   var findHost = new URL(uri)
  //   // //console.log("findHost", findHost);
  //   return findHost
  // }

  useEffect(() => {
    setWebUrlFunc()
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (webUrl.length != 0) { saveDappRealm(); urlPush(); }
    }, [urlForSearch])
  )

  useFocusEffect(
    useCallback(() => {
      saveDappHistory();
    }, [urlForSearch, mailAddress])
  )

  useEffect(() => {
    // console.log("asfrasefaf", props?.route?.params?.isEnabled,enabled);
    if (props?.route?.params?.isEnabled == false) {
      setEnabled(false)
    }
  }, [props?.route?.params?.isEnabled])

  {/**This function saves the dapp history on database */ }
  const saveDappHistory = async (mail) => {
    var findHost = await findHostNameWithUrl(urlForSearch ?? myUrl)

    if (mailAddress && urlForSearch) {
      var sendData = { URL: urlForSearch ?? myUrl, hostName: findHost.hostname, mailAddress: mail ?? mailAddress }
      console.log("sendDatasendData", sendData);
      setDapphistory(sendData)
        .then((val) => {
          console.log("zafawfawsd", val.data);
          getHistoryFunc()
        })
        .catch((err) => {
          console.log("errerrrr ", err);
        })
    }


  }

  {/** This function triggers when the user clear purticular history or clear all the history on */ }
  const clearHistory = async (id, time, action) => {
    try {
      console.log("valaction", id, action);
      var data = {}
      data.mailAddress = mailAddress;
      data._id = id;
      data.Time = time;
      if (action) data.action = action;
      console.log("clrea data", data);
      var resp = await TokenClient.post(ApiConstants.clearDappHistory, data)
      console.log("ressssssppp", resp.data);
      if (resp?.data?.success) {
        getHistoryFunc()
        return true
      } else {
        Toastfn(resp?.data?.msg)
        return false
      }

    } catch (error) {
      console.log("erororo on clear history", error);
    }

  }


  {/**This function triggers when the url changes it saves the current url on local database */ }
  const saveDappRealm = async () => {
    getRealm()
      .then(async (realm) => {
        var findHost = await findHostNameWithUrl(urlForSearch)
        var setObj = { URL: urlForSearch, hostName: findHost.hostname, id: String(webUrl[selectedIndex].TAB.length) }

        var dappVal1 = realm.objects("dappTabs");
        if (dappVal1.length != tabLength) {
          if (urlForSearch != "") {
            realm.write(() => {
              realm.create("dappTabs", {
                TAB: [setObj]
              });
            });
          }
        } else {
          if (dappVal1[selectedIndex].TAB[dappVal1[selectedIndex].TAB.length - 1].URL != urlForSearch) {
            realm.write(() => {
              dappVal1[selectedIndex].TAB.push(setObj)
            });
          }

        }
      })
      .catch((err) => {
        console.log("errro  iopn aadad savedapp realm", err);
      })
  }

  {/** This function triggers intially the page renders */ }
  const setWebUrlFunc = async () => {
    getRealm()
      .then((realm) => {
        var dappVal1 = realm.objects("dappTabs");
        console.log("dappTabs11111", JSON.stringify(dappVal1, null, 2));
        var getUrl = dappVal1[dappVal1.length - 1]
        console.log("getete", JSON.stringify(getUrl, null, 2), getUrl.TAB[getUrl.TAB.length - 1].URL, dappVal1.length);
        // setEnabled(true)
        setWebUrl(dappVal1)
        setSelectedIndex(dappVal1.length - 1);
        setUrl(getUrl.TAB[getUrl.TAB.length - 1].URL)
        if (dappVal1.length != 0) { setTabLength(dappVal1.length) }
      })
      .catch((err) => {
        console.log("errro  iopn aadad setweburl", err);
      })

  }

  {/**This function triggers when whenever the url changes it saves the state */ }
  const urlPush = async () => {

    var findHost = await findHostNameWithUrl(urlForSearch)
    getRealm()
      .then((realm) => {
        var dappVal1 = realm.objects("dappTabs");
        if (urlForSearch != "" && dappVal1.length == tabLength) {
          console.log("==============>", JSON.stringify(webUrl, null, 2), selectedIndex);
          var setObj = { URL: urlForSearch, hostName: findHost.hostname, id: String(webUrl[selectedIndex].TAB.length) }

          try {
            if (webUrl[selectedIndex].TAB[webUrl[selectedIndex]?.TAB?.length - 1].URL != urlForSearch) {
              var helllo = webUrl;
              // console.log('sdhhgksgs',)
              helllo[selectedIndex].TAB.push(setObj)
              console.log("helelellelleel", JSON.stringify(helllo, null, 2));
              setWebUrl(helllo)
              setDummy(!dummy)
            }

          } catch (error) {
            console.log("erroro ", error);
          }

          setCurrentTabId(Number(setObj.id));
        }
      })
      .catch((err) => {
        console.log("errro oon url push", err);
      })

    console.log("weebbebbebebebebbebebebe", JSON.stringify(webUrl, null, 2));

  }

  const elRefs = React.useRef(null);

  const handleWeb = () => {
    setIsMoving(!isMoving);
  }

  const onMessage = async (event) => {
    let data = JSON.parse(event.nativeEvent.data);
    const payload = data;
    const { method, id } = payload;

    try {
      switch (method) {
        case "eth_requestAccounts": {
          setApproveModalVisible(true);
          setApprovalDetails(event.nativeEvent);
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
            setIsSwitched(true);
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

        default:
          break;
      }
    } catch (err) {
      //console.log("onMessage error: ", err);

      if (err && err.code) {
        //console.log("err.code", err);
      } else {
        //console.log("else notification err comes");
      }

      handleReject(id, err.message);
    }
  };

  const handleSwitchChain = (chainId) => {
    try {
      setIsSwitched(true);
      var index = CHAIN_INFO.map((el) => el.chainId).indexOf(chainId);
      setNetwork(chainId);
      var rpc = CHAINS[chainId];
      setNetworkInfo({
        rpcUrl: rpc,
        chainId: chainId
      })
      // //console.log("rpc checking", rpc);
      const result = {
        switchChain: true, config: {
          chainId: chainId,
          rpcUrl: rpc
        }
      };

      dispatch({
        type: "Session",
        data: {
          Type_Emit: 'chainChanged',
          chain: chainId
        },
      });
      // //console.log("result checking", result);
      postMessageToWebView(result);
    }
    catch (e) {
      //console.log("chasin catch", e);
    }
  }

  //supported functions
  const postMessageToWebView = (result) => {
    if (elRefs && elRefs.current) {
      elRefs.current.postMessage(JSON.stringify(result));
    }
  };

  //web3 function lists starts here

  const handleEthGasPrice = async (payload) => {
    try {
      const { id } = payload;
      const res = await web3.eth.getGasPrice();
      const result = { id, result: res };
      // //console.log("handleEthgas price result", result);
      postMessageToWebView(result);
    } catch (err) {
      //console.log("handleEthGasPrice err", err);
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

  const hasTxlogs = async (HASH) => {
    let res = null;
    do {
      res = await IsTransacted(HASH)
    } while (!res)
    return res;
  }

  const IsTransacted = async (HASH) => {
    const hashvalue = await web3.eth.getTransactionReceipt(HASH);
    return hashvalue;
  }

  const handleEthSendTransaction = async (id, txData) => {

    //console.log("handleEthSendTransaction", id, txData);
    try {
      const accountInfo = web3.eth.accounts.privateKeyToAccount(privateKey);
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
      //console.log("eth_sendTransaction err: ", err);
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
    //console.log("handleEthGetTransactionReceipt resultttt", result);
    postMessageToWebView(result);
  };

  const handleEthGetTransactionReceiptOwn = async (payload) => {
    let res = await web3.eth.getTransactionReceipt(payload.result);
    //console.log("handleEthGetTransactionReceiptOwn res", res);
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
    // //console.log("popupMessageModal called", payload);
    const { id, params } = payload;
    const message = params[0].startsWith("0x")
      ? web3.utils.hexToAscii(params[0])
      : params[0];

    setModalView(
      <MessageModal
        title={"Personal Sign"}
        dappUrl={myUrl}
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
  //console.log("Buzxwe@792%", myUrl);
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
          dappUrl={myUrl}
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
        dappUrl={myUrl}
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

  async function checkIsContractAddress(address) {
    const code = await web3.eth.getCode(address);
    return (code == "0x") ? false : true;
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
  const popupTransactionModal = async (payload) => {
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
    // console.log("navigationEvent", navigationEvent)
    setCurrentUrl(url)
    if (url.slice(0, 2) == "wc") {
      setConnectWalletUrl(true);
      walletConnectStatus = true;
      //console.log("calleddd");
      dispatch({
        type: "Session",
        data: {
          url: url, StopAction: true, Loader: true,
          from: urlForSearch
        }
      })
      return false; // block navigation to other domains
    } else {
      setConnectWalletUrl(false);
      walletConnectStatus = false;
      return true; // allow navigation
    }
  };

  const [issearchEnabled, setIssearhEnabled] = useState(false);

  const [web3JsContent, setWeb3JsContent] = useState("");
  const [ethersJsContent, setEtherJsContent] = useState("");
  const [tripledots, setTripledots] = useState(false)
  useEffect(() => {
    if (web3JsContent === "") {
      Web3File().then((data) => {
        // //console.log("Data return  1 >>>>>>> : ",data.data)
        setWeb3JsContent(data.data);
        setIsMoving(true)
      })
    }
  }, [network])

  const getJsCode = (address, networkId, rpcUrl) => {
    const dappName = "";
    return `
 
    ${webRef[selectedIndex]}
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
            //console.log("passDatapassDatapassData",passData)
            // alert("eth transaction"+data.data)
            const { id, result } = passData;
            
            if (result && result.error && rejecter[id]) {
              rejecter[id](new Error(result.message));
              
            } else if (resolver[id]) {
              
              resolver[id](result);
              
            }

            if(passData?.switchChain){
              try{
             // alert("Switched : ")
              const { config } = passData;
            //  initWeb3(address,config.chainId,config.rpcUrl);
              window.web3.eth.getChainId().then((data)=>{
               // alert("CHain ID : "+data)
              })
                
            // window.web3.eth.currentProvider.disconnect();
             localStorage.setItem("configData",JSON.stringify(config));
             window.location.reload();
              }catch(e){
                alert("passData Eror : "+e);
              }
            }
          } catch(err) {
            //console.log('listener message err: ', err);
          }
        })
      
        communicateWithRN = (payload) => {
          return new Promise((resolve, reject) => {
            // alert("postMessage"+JSON.stringify(payload))
            //console.log('JSON.stringify(payload): ', JSON.stringify(payload));
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

                //console.log('rawTransactionrawTransaction',rawTransaction);
                const signedTx = await web33.eth.accounts.signTransaction(rawTransaction,'${privateKey}');
                //console.log('signedTxsignedTx12333333-----1',signedTx.rawTransaction);
                //  alert("signedTx : > "+signedTx)
                try{
                     var hashResp = "";

                     hashResp =await web33.eth.sendSignedTransaction(signedTx.rawTransaction);

                     //console.log(hashResp,'hashResp');
                    //  alert("hashResp : "+hashResp)

                     let result = (hashResp && hashResp.transactionHash)?hashResp.transactionHash:"";

                     //console.log('result is:',result);

                     resolve(result);
                 }catch(err)
                 {
                   alert("hashRes err: "+err)
                     //console.log(err,'errerrerr');
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

        function initWeb3(address,networkId,rpcUrl) {
          // alert("initWeb3"+address+networkId+rpcUrl)
          // Inject the web3 instance to web site
         try{
          const rskEndpoint = rpcUrl;
        
          const provider = new Web3.providers.HttpProvider(rskEndpoint);
        // alert("RPC :"+provider)
         //  const web3Provider = new ethers.providers.Web3Provider(provider)
          
          const web3 = new Web3(provider);
          web33 = new Web3(provider);
          // When Dapp is "Money on Chain", webview uses Web3's Provider, others uses Ethers' Provider
          window.ethereum =provider;
        
          window.ethereum.selectedAddress = address;

         // alert("Window.etherum : "+window.ethereum.selectedAddress)
          window.address = address;
          window.ethereum.networkVersion = networkId;
          window.ethereum.isTrust = true;
          window.ethereum.web3 = web3;
          window.web3 = web3;
          window.web3.eth.defaultAccount = address
          // alert("Window.etherum1 : "+window.ethereum.selectedAddress)

          // Adapt web3 old version (new web3 version move toDecimal and toBigNumber to utils class).
          window.web3.toDecimal = window.web3.utils.toDecimal;
          window.web3.toBigNumber = window.web3.utils.toBN;
          
          const config = {
            isEnabled: true,
            isUnlocked: true,
            networkVersion: networkId,
            onboardingcomplete: true,
            selectedAddress: address,
          }
          // alert("Window.etherum2 : "+config)

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
          // alert("Window.etherum3 : ")

          window.web3.setProvider(window.ethereum);
          // alert("Window.etherum4 : ")

          // Override enable function can return the current address to web site
          window.ethereum.enable = () => {
          // alert("Window.etherum5 : ")
            return new Promise((resolve, reject) => {
              resolve([address]);
            })
          }
          // window.ethereum.enable()
          // alert("Window.etherum6 : ")
          // Adapt web3 old version (new web3 version remove this function)
          window.web3.version = {
            api: '1.2.7',
            getNetwork: (cb) => { cb(null, networkId) },
          }

          window.ethereum.on = (method, callback) => { if (method) { 
            //alert("Method : "+method) 
          } }
          // alert("Window.etherum7 : ")
          // Adapt web3 old version (need to override the abi's method).
          // web3 < 1.0 using const contract = web3.eth.contract(abi).at(address)
          // web3 >= 1.0 using const contract = new web3.eth.Contract()
          window.web3.eth.contract = (abi) => {
          // alert("Window.etherum8 : ")
            const contract = new web3.eth.Contract(abi);
            contract.at = (address) => {
              contract.options.address = address;
              return contract;
            }
            // alert("Window.etherum9 : ")
            const { _jsonInterface } = contract;
          // alert("Window.etherum10 : ")
            _jsonInterface.forEach((item) => {
          // alert("Window.etherum11 : ")
              if (item.name && item.stateMutability) {
                const method = item.name;
                if (item.stateMutability === 'pure' || item.stateMutability === 'view') {
                  contract[method] = (params, cb) => {
                    //console.log('contract method: ', method);
                    contract.methods[method](params).call({ from: address }, cb);
                  };
                } else {
                  contract[method] = (params, cb) => {
                    alert('contract method: '+ method)
                    //console.log('contract method: ', method);
                    contract.methods[method](params).send({ from: address }, cb);
                  };
                }
              }
            });

            return contract;
          }
          // alert("Window.etherum12 : ")

         
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
            //console.log('payload: from sendAsync +++++', payload);
           
            try {
          // alert("Window.etherum13 : ")
              if (method === 'net_version') {
                result = networkId;
              } else if (method === 'eth_chainId') {
                result = web3.utils.toHex(networkId);
              } else if (method === 'eth_requestAccounts' || method === 'eth_accounts' || payload === 'eth_accounts') {
                result = [address];
              }

              else if (method === 'eth_blockNumber')
              {
                  let blockNumberIs = await web33.eth.getBlock("latest");

                  //console.log('blockNumberIs121212121:',blockNumberIs);
                  //console.log('blockNumberIs:',blockNumberIs.number);
                  result = blockNumberIs.number;
              }
              // else if (method === 'eth_estimateGas')
              // {
              //   try{
              //   const gasPrice = await web33.eth.getGasPrice();
              //     var fromAddr    = (params && params[0] && params[0].from)?params[0].from:"";
              //     var toAddr      = (params && params[0] && params[0].to)?params[0].to:"";
              //     var value       = (params && params[0] && params[0].value)?params[0].value:"";
              //     var data        = (params && params[0] && params[0].data)?params[0].data:"";
              // //  alert("value checking"+fromAddr"+ "+toAddr+" "+value+" "+data)
              //     let estGas =  await web33.eth.estimateGas({
              //       from:fromAddr,
              //       to: toAddr,
              //       value:value,
              //       data: data,
              //       gasPrice: gasPrice
              //   })
              //       alert("eth_estimateGas : "+estGas)
              //   // const estGas1 = estGas * gasPrice;
              //     result = estGas;
              //   }
              //   catch(e){
              //     alert("eth_estimateGas catch error"+e)
              //   }
                  
              // }
              else {
              //  alert("communicateWithRN : "+JSON.stringify(payload));
                result = await communicateWithRN(payload);
              }
              //console.log("resultresultresultresult",result)
              res = {id, jsonrpc, method, result};
            } catch(err) {
              err = err;
              //console.log('sendAsync err: ', err);
               alert('sendAsync err: '+ err)
            }
            
            //console.log('res: ', res);
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
      
        if(localStorage.getItem("configData")){
          var config = JSON.parse(localStorage.getItem("configData"));
        initWeb3('${address}',config.chainId,config.rpcUrl);
        }else{
        initWeb3('${address}','${networkInfo.chainId}','${networkInfo.rpcUrl}');

        }
       
       
      }) ();
    
  `;
  };


  const switchInjectedData = (_address = address, _chainId = networkInfo.chainId, _rpc = networkInfo.rpcUrl) => {
    // web3 decode response
    //console.log("switchInjectedData caleed : ")
    var jsCode = getJsCode(_address, _chainId, _rpc);
    return jsCode;
  }
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get(
        "REAL_WINDOW_HEIGHT"
      );

  {/** This function trggers when the user search something on search bar and click the search icon */ }
  const redirecttoBrowser = () => {
    setShow(false)
    setIssearhEnabled(false)
    if (isEmpty(urlForSearch)) return ToastAndroid.showWithGravityAndOffset(
      "URL required",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
    //console.log("urlForSearch", urlForSearch);
    if (urlForSearch.trim().slice(0, 8) == "https://") return setUrl(urlForSearch)
    if (urlForSearch.trim().slice(-4) != ".com") return setUrl(`https://www.google.com/search?q=${urlForSearch}`)
    else setUrl(urlForSearch)
  };

  {/** This function triggers when user click one of the tabs in the tabs section */ }
  const pressTab = async (i) => {

    setSelectedIndex(i);
    setUrl(webUrl[i]?.TAB[webUrl[i]?.TAB?.length - 1]?.URL);
    setUrlForSearch(webUrl[i]?.TAB[webUrl[i]?.TAB?.length - 1]?.URL)
    setEnabled(true)
  }

  {/** This function triggers when user delete one of the tabs by clicking x icon in tab section*/ }
  const deleteTab = async (i) => {
    try {
      // console.log("aqwrawawed", i, typeof webUrl, Array.isArray(webUrl), webUrl);
      var removeUrl = webUrl.filter((item, ii) => i != ii);
      console.log("removeUrl", removeUrl);
      setWebUrl(removeUrl)
      // webUrl.splice(i, 1)
      // elRefs.current.splice(i, 1)
      setTabLength(tabLength - 1);

      getRealm()
        .then((realm) => {
          var dappVal1 = realm.objects("dappTabs");
          // console.log("affaaffafaaf", dappVal1);
          var deleteTab = dappVal1[i]
          // console.log("deleteTab", deleteTab);
          realm.write(() => {
            realm.delete(deleteTab)
          })

          // console.log("dappVal1selectedIndex", dappVal1);
        })
        .catch((err) => {
          console.log("errro  iopn aadad delete tab", err);
        })
    } catch (error) {
      console.log("ayuwrawsde", error);
    }

  }

  {/** This function triggers when user create new tab on + icon on header */ }
  const CreateTab = async () => {
    try {
      // var tab = tabLength
      setTabLength(tabLength + 1);
      var setObj = { URL: "https://www.google.com/", hostName: "www.google.com", id: "0" }
      console.log("create tab weburl", JSON.stringify(webUrl, null, 2));
      setWebUrl([...webUrl, { TAB: [setObj] }]);

      setUrlForSearch("https://www.google.com/")
      setUrl("https://www.google.com/")
      setSelectedIndex(tabLength)

      getRealm()
        .then((realm) => {
          var dappVal1 = realm.objects("dappTabs");
          console.log("--------------->", JSON.stringify(dappVal1, null, 2), selectedIndex, urlForSearch, webUrl);

          var TabID = String(Date.now())
          setActivetabid(TabID)
          realm.write(() => {
            realm.create("dappTabs", {
              ImageUrl: "",
              TabId: TabID,
              TAB: [setObj]
            });
          });

          // console.log("dappVal1selectedIndex", dappVal1);
        })
        .catch((err) => {
          console.log("errro  iopn aadad create tab", err);
        })
    } catch (error) {
      console.log("erorroorooorrrrrrr", error);
    }

  }

  {/** This function trggers when user click clear all word on tab section Footer */ }
  const closeallTab = async () => {
    getRealm()
      .then((realm) => {
        var dappTabs = realm.objects("dappTabs");
        // console.log("dappTabs", dappTabs);
        realm.write(() => {
          realm.delete(dappTabs)
        });
        setTimeout(() => {
          props.navigation.navigate("WalletHome")
          setEnabled(true)
        }, 1000)

      })
      .catch(() => {
        console.log("errro on cllose tab", err);
      })
  }



  {/** Main webview */ }
  const WebviewComp = ({ ref }) => {
    // console.log("ref,myUrl, connectWalletUrl, handleNavigation, switchInjectedData, setCanGoBack, setUrlForSearch, setLoad, onMessage,setwebref,selectedIndex ",ref,myUrl, connectWalletUrl, handleNavigation, switchInjectedData, setCanGoBack, setUrlForSearch, setLoad, onMessage,setwebref,selectedIndex )
    return (
      // [webRef[current_ind]].map(it=>{
      //   return(
      <Animated.View style={{ flex: 1 }} >
        <WebView
          ref={ref}
          // onScroll={handleScroll}
          source={{ uri: myUrl }}
          mixedContentMode={"compatibility"}
          setSupportMultipleWindows={connectWalletUrl}
          onShouldStartLoadWithRequest={handleNavigation}
          originWhitelist={["*"]}
          javaScriptEnabled
          domStorageEnabled={true}
          javaScriptEnabledAndroid
          cacheEnabled
          automaticallyAdjustContentInsets={false}
          // injectedJavaScript={INJECTEDJAVASCRIPT}
          injectedJavaScriptBeforeContentLoaded={switchInjectedData()}
          onLoadProgress={(e) => {
            const state = e.nativeEvent;
            // console.log("onLoadProgress :", state)
            setwebref({ webRef: state, current_ind: selectedIndex })
            setCanGoBack(state.canGoBack);
            setUrlForSearch(state.url)
          }}
          onLoadStart={(e) => { console.log("coming first or not chrcking", e.nativeEvent); setLoad(true) }}
          onLoadEnd={() => setLoad(false)}
          onMessage={(event) => onMessage(event)}
          canGoBack={true}
          style={{
            maxHeight: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
            flex: 1
          }}
          renderError={() => {
            // console.log('loaded');
            return (<View></View>)
          }}
          sendCookies
          javascriptEnabled
          allowsInlineMediaPlayback
          useWebkit
          testID={'browser-webview'}
          applicationNameForUserAgent={'WebView MetaMaskMobile'}
          scalesPageToFit={true}
        // onScroll={handleScroll}
        // setBuiltInZoomControls={false}

        />
      </Animated.View>
      // )})
    )
  }

  {/** This function triggers when user click back(<) button on header */ }
  const gobackFunction = async () => {

    try {
      // console.log("lllllllllllllllllllllllllllll", webUrl[selectedIndex]?.TAB[webUrl[selectedIndex]?.TAB?.length - 1]?.URL)
      // console.log("aaaaaaaaaaaaaaaa", JSON.stringify(webUrl[selectedIndex]?.TAB, null, 2));
      var val = webUrl[selectedIndex]?.TAB
      // console.log("val", JSON.stringify(val, null, 2),);
      // console.log("awdreed",val.slice(0).reverse());
      var returnVal = val.filter((int) => {
        var num = parseInt(currentTabId) - 1
        return int.id == (num == 0 ? 0 : num)
      })
      if (returnVal) {
        setUrl(returnVal[0].URL);
        setTimeout(() => {
          setCurrentTabId(Number(returnVal[0].id))
        }, 1500)

      }
      // console.log("returnVal", returnVal);
    } catch (error) {
      console.log("aaaaaaaaaaaaaa", error);
    }

  }

  {/** This function triggers when user click forword(>) button on header */ }
  const goForwordFunction = async () => {

    try {
      var val = webUrl[selectedIndex]?.TAB
      var returnVal = val.filter((int) => {
        var num = parseInt(currentTabId) + 1
        return int.id == (num == 0 ? 0 : num)
      })
      if (returnVal) {
        setUrl(returnVal[0].URL);
        setTimeout(() => {
          setCurrentTabId(Number(returnVal[0].id))
        }, 1500)

      }
      // console.log("returnVal", returnVal);
    } catch (error) {
      console.log("aaaaaaaaaaaaaa", error);
    }

  }

  const handleScroll = event => {
    // if (event.nativeEvent.contentOffset.y !== 0) {
    //    onMomentumScrollBegin()
    // } else {
    //   onMomentumScrollEnd()
    // }
    Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: false }
    )(event);
  };
  // console.log("global?.initialEnter", global?.initialEnter, global.biometricStatus, global.passcodeStatus);

  const navigateSecurityPage = async (item) => {
    try {
      getRealm()
        .then((realm) => {
          var passcodeVal = realm.objects("userPasscodeValue");
          var biometricVal = realm.objects("userBiometricStatus");
          console.log("passcodeVal", passcodeVal);
          if (passcodeVal.length == 0 && global.biometricStatus == 0) {
            props.navigation.navigate(item);
          } else if (
            (global.passcodeStatus == 1 || global.passcodeStatus == 0) &&
            global.biometricStatus != 0
          ) {
            global.bioPage = "EnterPasscode"
            props.navigation.push("CheckBiometric", item);
          } else if (passcodeVal.length == 1 || global.biometricStatus == 0) {
            props.navigation.navigate("EnterPasscode", item);
          }

        })
        .catch((err) => {
          console.log("errror on navigagtet", err);
        })


    } catch (error) {
      console.log("errror on navigatepage", error);
    }
  }





  return (
    (isMoving && privateKey != "" && address != "") ?

      <View style={styles.container}>

        {/* Wallet connect Modal view */}
        <Modal
          style={styles.modal}
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

        {/* Network Modal */}
        <Modal visible={chainModal} style={{
          position: "relative", zIndex: 999,
          borderRadius: 50
        }}
          deviceWidth={deviceWidth} deviceHeight={deviceHeight}>
          <View style={{ backgroundColor: "#f1f1f1", borderRadius: 50, paddingVertical: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginHorizontal: 20 }}>
              <TouchableOpacity onPress={() => setChainModal(false)}>
                <Icn name="close" type="fontisto" />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={{ fontSize: 16, fontFamily: Fonts.Bold, width: "100%", textAlign: "center", color: "#000" }}>Networks</Text>
              <View >
                {CHAIN_INFO.map((item, index) =>
                  <TouchableOpacity style={{
                    padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "flex-start"
                  }}
                    onPress={() => {
                      handleSwitchChain(item.chainId);
                      setChainModal(false);
                    }}
                    key={Math.random()}
                  >
                    {/* {console.log("iiiiiiiiiiiiiiirrrrrr",item.img)} */}
                    {item.img}
                    <Text style={{ fontFamily: index == network ? Fonts.Bold : Fonts.Regular, fontSize: 13, marginLeft: 20, color: "#000" }}>{item.name}</Text>
                  </TouchableOpacity>)
                }
              </View>
            </View>
          </View>
        </Modal>
        {/* Three Dots Modal */}
        <Modal visible={tripledots} style={{
          position: "relative", zIndex: 999,
          borderRadius: 50
        }}>
          <View onStartShouldSetResponder={() => setTripledots(false)} style={{ flex: 1, backgroundColor: 'transparent' }} >
            <View style={{ width: "50%", backgroundColor: theme.theme == "light" ? '#fff' : '#323234', position: "absolute", top: "4%", right: 0, paddingVertical: "5%", borderRadius: borderRadius * 1, borderWidth: 1, borderColor: theme.theme == "light" ? "#ccc" : "grey" }} >
              {/* <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 0.7, borderBottomColor: "gray", justifyContent: "space-around", paddingVertical: "4%" }}>
                <TouchableOpacity style={{ width: 32, height: 32, backgroundColor: "gray", borderRadius: borderRadius * 1, justifyContent: "center" }} >
                  <BackDark width={27} height={27} style={{ resizeMode: "contain", alignSelf: "center" }} />
                </TouchableOpacity>
                <TouchableOpacity style={{ width: 32, height: 32, backgroundColor: "gray", borderRadius: borderRadius * 1, justifyContent: "center" }} >
                  <BackDark width={27} height={27} style={{ resizeMode: "contain", alignSelf: "center", transform: [{ rotate: "180deg" }] }} />
                </TouchableOpacity>

                <TouchableOpacity style={{ width: 32, height: 32, backgroundColor: "gray", borderRadius: borderRadius * 1, justifyContent: "center" }} >
                  <Homeactive width={27} height={27} style={{ alignSelf: "center" }} />
                </TouchableOpacity>
              </View> */}
              <TouchableOpacity onPress={() => { setTripledots(!tripledots); setHistory(true) }} >
                <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 0.7, borderBottomColor: theme.theme == "light" ? "#ccc" : "gray", paddingVertical: "5%" }}>
                  <View style={{ width: "25%", }} >
                    {theme.theme == "light" ?
                      <Historylight width={22} height={22} style={{ alignSelf: "center", fill: theme.theme == "light" ? "#000" : "#fff", color: "#fff" }} />
                      :
                      <Historydark width={22} height={22} style={{ alignSelf: "center", fill: theme.theme == "light" ? "#000" : "#fff", color: "#fff" }} />
                    }
                  </View>
                  <View style={{ width: "75%", justifyContent: "center" }} >
                    <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >History</Text>

                  </View>
                </View>
              </TouchableOpacity>

              {/* <TouchableOpacity onPress={() => { props.navigation.navigate("WalletHome") }}> */}

              {/* {theme.theme == "light" ?
                      <Activefavlight width={27} height={27} style={{ alignSelf: "center" }} />
                      :
                      <Activefavdark width={27} height={27} style={{ alignSelf: "center" }} />
                    } */}
              {console.log("findCommonObjectsById", findCommonObjectsById(myfav, webUrl[selectedIndex]?.TAB))}

              {findCommonObjectsById(myfav, webUrl[selectedIndex]?.TAB)?.length != 0 ?
                (<>
                  <TouchableOpacity onPress={() => remove_favourite()}>
                    <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 0.7, borderBottomColor: theme.theme == "light" ? "#ccc" : "gray", paddingVertical: "5%" }}>
                      <View style={{ width: "25%", }} >

                        {/* <Image source={Images.acivestar} style={{ width: windowWidth * 0.09, height: windowheight * 0.035, alignSelf: "center", resizeMode: "contain", }} /> */}
                        {theme.theme != "light" ?
                          <Activefavlight width={23} height={23} style={{ alignSelf: "center" }} />
                          :
                          <Activefavdark width={23} height={23} style={{ alignSelf: "center" }} />
                        }

                      </View>
                      <View style={{ width: "75%", justifyContent: "center" }} >
                        <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Remove in Bookmarks</Text>

                      </View>
                    </View>
                  </TouchableOpacity>
                </>) :
                (<>
                  <TouchableOpacity onPress={() => add_favourite(urlForSearch)}>
                    <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 0.7, borderBottomColor: theme.theme == "light" ? "#ccc" : "gray", paddingVertical: "5%" }}>
                      <View style={{ width: "25%", }} >

                        {/* <Image source={Images.inacivestar} style={{ width: windowWidth * 0.09, height: windowheight * 0.035, alignSelf: "center", resizeMode: "contain", tintColor: "#fff" }} /> */}
                        {theme.theme == "light" ?
                          <InActivefavlight width={23} height={23} style={{ alignSelf: "center" }} />
                          :
                          <InActivefavDark width={23} height={23} style={{ alignSelf: "center" }} />}

                      </View>
                      <View style={{ width: "75%", justifyContent: "center" }} >
                        <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Add to Bookmarks</Text>

                      </View>
                    </View>
                  </TouchableOpacity>
                </>)
              }

              {/* </TouchableOpacity> */}

              <TouchableOpacity style={{ borderBottomWidth: 0.7, borderBottomColor: theme.theme == "light" ? "#ccc" : "gray" }} onPress={() => { setTripledots(!tripledots); global?.initialEnter == undefined ? navigateSecurityPage("Send") : props.navigation.navigate("commonRbSheet", params = "Send") }}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: "5%" }}>
                  <View style={{ width: "25%", }} >
                    {theme.theme == "light" ?
                      (<Sendlight width={25} height={25} style={{ alignSelf: "center" }} />)
                      : (<SendDark width={25} height={25} style={{ alignSelf: "center" }} />)
                    }
                  </View>
                  <View style={{ width: "75%", justifyContent: "center" }} >
                    <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Send Crypto</Text>

                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setTripledots(!tripledots); global?.initialEnter == undefined ? navigateSecurityPage("Receive") : props.navigation.navigate("commonRbSheet", params = "Receive") }}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: "5%" }}>
                  <View style={{ width: "25%", }} >
                    {theme.theme == "light" ?
                      (<Receivelight width={25} height={25} style={{ alignSelf: "center" }} />)
                      : (<ReceiveDark width={25} height={25} style={{ alignSelf: "center" }} />)
                    }
                  </View>
                  <View style={{ width: "75%", justifyContent: "center" }} >
                    <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Receive Crypto</Text>

                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal >

        {/* Search Values */}
        {show && (
          <>
            {urlForSearch?.length == 0 ?
              (<></>) :
              (<>
                {searchValues.length == 0 ?
                  (<>
                    {/* <View style={{ position: 'absolute', zIndex: 999, top: 50, left: 0, right: 0, borderWidth: 1, backgroundColor: "#404042" }}>
                      <TouchableOpacity onPress={() => { setShow(false), redirecttoBrowser(urlForSearch) }}>
                        <Text style={{ padding: 10, color: "#fff" }}>{urlForSearch}</Text>
                      </TouchableOpacity>
                    </View> */}
                  </>) :
                  (<>
                    <View style={{ position: 'absolute', zIndex: 999, top: 50, left: 0, right: 0, borderWidth: 1, backgroundColor: "#404042", height: "90%" }}>
                      {/* <ScrollView style={{position: 'absolute', zIndex: 999, top: 50, left: 0, right: 0, borderWidth: 1, backgroundColor: "#323234" }}> */}
                      <ScrollView>
                        {searchValues.map((option) => (
                          <TouchableOpacity key={Math.random()} style={{ flexDirection: "row", padding: 8, justifyContent: "space-between", alignItems: "center", borderBottomColor: "grey", borderBottomWidth: 0.5 }} onPress={() => { setShow(false), setUrl(option.url), setUrlForSearch(option.url), setSearchValues([]) }}>
                            <Text style={{ color: "#fff" }}>{option.url}</Text>
                            <Image source={{
                              uri:
                                "http:/192.53.121.26:8096/images/" +
                                option.appimage,
                            }} style={{ width: windowWidth * 0.08, height: windowheight * 0.05, resizeMode: "contain" }} />
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                      {/* </ScrollView> */}
                      {/* <FlatList
                        data={searchValues}
                        // keyExtractor={(item) => item}
                        renderItem={(option) => (
                          <TouchableOpacity style={{ flexDirection: "row", padding: 10, justifyContent: "space-between", alignItems: "center" }} onPress={() => { setShow(false), setUrl(option.url), setUrlForSearch(option.url), setSearchValues([]) }}>
                            {//console.log("inside map value",option)}
                            <Text style={{ color: "#fff" }}>{option.url}</Text>
                            <Image source={{
                              uri:
                                "http:/192.53.121.26:8096/images/" +
                                option.appimage,
                            }} style={{ width: windowWidth * 0.08, height: windowheight * 0.05, resizeMode: "contain" }} />
                          </TouchableOpacity>
                        )}
                      /> */}
                    </View>
                  </>)}

              </>)}


          </>
        )}

        {historyView == false ?
          <>
            {/* Top Bar */}
            {/* <Collapsible collapsed={!isHeaderVisible}> */}
            <View style={{ width: "100%", height: windowheight * 0.065, backgroundColor: theme.theme == "light" ? "#f1f1f1" : "#323234", flexDirection: "row", alignItems: "center" }} >
              {!issearchEnabled ?
                <>
                  <TouchableOpacity onPress={() => { gobackFunction() }}>
                    {theme.theme == "light" ?
                      <BackLight width={30} height={30} style={{ resizeMode: "contain" }} />

                      :
                      <BackDark width={30} height={30} style={{ resizeMode: "contain" }} />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { goForwordFunction() }}>
                    {theme.theme == "light" ?
                      <BackLight width={30} height={30} style={{ resizeMode: "contain", alignSelf: "center", transform: [{ rotate: "180deg" }] }} />
                      :
                      <BackDark width={30} height={30} style={{ resizeMode: "contain", alignSelf: "center", transform: [{ rotate: "180deg" }] }} />

                    }
                  </TouchableOpacity>
                </>
                :
                <></>
              }
              {/* SearchBar Start */}
              {issearchEnabled ?
                //search Bar on click
                <>
                  <TouchableOpacity onPress={() => {
                    // props.navigation.navigate("Dappsearch");
                    setIssearhEnabled(true)
                  }} elevation={1} style={{ borderWidth: 0, marginLeft: 10, paddingHorizontal: 10, width: "75%", height: "60%", backgroundColor: theme.theme == "light" ? "#fff" : "gray", borderRadius: borderRadius * 1, flexDirection: "row" }} >
                    <View style={{ width: "10%", height: "100%", justifyContent: "center", paddingHorizontal: 20, borderWidth: 0 }} >
                      {theme.theme == "light" ?
                        <SearchiconLight width={20} height={20} style={{ alignSelf: "center", resizeMode: "contain" }} />
                        :
                        <SearchiconDark width={20} height={20} style={{ alignSelf: "center", resizeMode: "contain" }} />
                      }
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", width: "85%", backgroundColor: "transparent", height: "100%", justifyContent: "center", borderWidth: 0, borderColor: "transparent", elevation: 0 }} >
                      <TextInput
                        theme={{ colors: { placeholder: theme.theme == "light" ? "#000" : "#fff", text: theme.theme == "light" ? "#000" : "#fff", primary: "transparent", underlineColor: 'transparent', } }}
                        text={theme.theme == "light" ? "#000" : "#fff"}
                        selectionColor={theme.theme == "light" ? "#000" : "#fff"}
                        underlineColor='transparent'
                        style={{ width: "90%", color: theme.theme == "light" ? "#000" : "#fff", backgroundColor: "transparent", height: 35, borderWidth: 0, borderRadius: 0, borderColor: "transparent", fontSize: 15 }}
                        placeholder="Search or type URL"
                        // onFocus={()=>{onFocus()}}
                        // onBlur={()=>{onBlur()}}
                        returnKeyType="search"
                        // value={search}
                        // ref={inputRef}
                        // onLayout={() => inputRef.current.focus()}
                        // onChangeText={(e) => setSearch(e)}
                        onSubmitEditing={() => { redirecttoBrowser() }}
                        value={urlForSearch}
                        onChangeText={(e) => { setUrlForSearch(e) }}
                        placeholderTextColor={theme.theme == "light" ? "#000" : "#fff"}
                      />
                      <Pressable style={{ marginLeft: 0 }}>
                        <Icn size={20} type="material" color={theme.theme == "light" ? "#000" : "#fff"} name="close" />
                      </Pressable>
                    </View>


                  </TouchableOpacity>
                  <Pressable onPress={() => setIssearhEnabled(false)} style={{ marginLeft: "5%" }} >
                    <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Cancel</Text>
                  </Pressable>
                </>
                :
                // Search Bar On Normal
                <TouchableOpacity onPress={() => {
                  // props.navigation.navigate("Dappsearch");
                  setIssearhEnabled(true)
                }} elevation={1} style={{ paddingHorizontal: 10, width: "38%", height: "60%", backgroundColor: theme.theme == "light" ? "#fff" : "gray", borderRadius: borderRadius * 1, flexDirection: "row", }} >
                  <View style={{ width: "18%", height: "100%", justifyContent: "center", paddingHorizontal: 20 }} >
                    {theme.theme == "light" ?
                      <SearchiconLight width={20} height={20} style={{ alignSelf: "center", resizeMode: "contain" }} />
                      :
                      <SearchiconDark width={20} height={20} style={{ alignSelf: "center", resizeMode: "contain" }} />
                    }
                  </View>
                  <View style={{ width: "100%", height: "100%", justifyContent: "center" }} >
                    <Text style={{ fontSize: RFValue(11), fontFamily: Fonts.Medium, color: theme.theme == "light" ? "#000" : "#fff" }} >{urlForSearch ? urlForSearch?.slice(0, 10) : "Search..."}</Text>
                  </View>


                </TouchableOpacity>
              }
              {/* On Search */}
              {!issearchEnabled ?
                <View style={{ width: "45%", height: "70%", flexDirection: "row", justifyContent: "space-around", alignItems: "center" }} >
                  <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => setChainModal(!chainModal)}>
                    {CHAIN_INFO?.filter(item => item.chainId == network)[0]?.img}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: theme.theme == "light" ? "#000" : "#fff",
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 25,
                      height: 25,
                      borderRadius: 8,
                    }}
                    onPress={() => { setEnabled(!enabled) }}
                  >

                    <Text style={{ color: theme.theme == "light" ? "#000" : "#fff" }}>{tabLength}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => CreateTab()}
                  >
                    {theme.theme == "light" ?
                      <PlusIconLight width={28} height={28} style={{ resizeMode: "contain" }} />
                      :

                      <PlusIcon width={28} height={28} style={{ resizeMode: "contain" }} />
                    }


                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate("WalletHome");
                      setDappStatus({
                        status: "true",
                        item: "",
                      });
                    }}
                    style={{ alignSelf: "center" }}
                  >
                    {theme.theme == "light" ?

                      <DappIconLight width={25} height={25} style={{ resizeMode: "contain" }} />
                      :
                      <DappIcon width={25} height={25} style={{ resizeMode: "contain" }} />

                    }
                  </TouchableOpacity>
                  <Pressable onPress={() => setTripledots(!tripledots)} style={{ marginLeft: 0 }}>
                    <Icn size={25} type="material" color={theme.theme == "light" ? "#000" : "#fff"} name="more-vert" />
                  </Pressable>
                </View>
                :
                <></>}
            </View>

            {/* </Collapsible> */}


            {/* Webview Start */}
            {/* {console.log("-------------------------------->",enabled && elRefs?.current[selectedIndex])} */}
            {(enabled && myUrl) ?
              <>
                {/* web view */}
                {WebviewComp(
                  {
                    ref: elRefs,
                    myUrl: myUrl
                  },
                  connectWalletUrl,
                  handleNavigation,
                  switchInjectedData,
                  setCanGoBack,
                  setUrlForSearch,
                  setLoad,
                  onMessage,
                  setwebref,
                  selectedIndex
                )}
              </>
              :
              <>
                {/* Tabs */}
                <View style={{
                  backgroundColor: theme.background,
                  maxHeight: Dimensions.get('window').height,
                  width: Dimensions.get('window').width,
                  flex: 1,
                  justifyContent: "space-between",
                  // alignItems: "center",
                  // height: "100%"
                }}>
                  <ScrollView>
                    <View style={{
                      flexDirection: "row", flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "flex-start", alignContent: "flex-start"
                    }}>

                      {Array(tabLength)?.fill()?.map((val, i) => {
                        return (
                          <>
                            {/* {console.log("sefefesf", webUrl[i]?.TAB[webUrl[i]?.TAB?.length - 1]?.hostName)} */}
                            <View key={Math.random()} style={{ backgroundColor: "white", height: windowWidth * 0.6, width: windowWidth * 0.46, margin: windowWidth * 0.020, borderColor: "#ffffff1a", borderWidth: 2, borderRadius: 5 }}>
                              <View style={{ backgroundColor: "#323234", height: "35%", width: "100%", justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ color: "#fff", textAlign: "left", left: 10, width: "70%" }}>{webUrl[i]?.TAB[webUrl[i]?.TAB?.length - 1]?.hostName}</Text>
                                <TouchableOpacity onPress={() => deleteTab(i)} style={{ right: 5 }}>
                                  <Image source={{ uri: Images.close }} style={{ height: 20, width: 20, marginTop: -10, tintColor: "#fff" }} />
                                </TouchableOpacity>
                              </View>
                              <TouchableOpacity onPress={() => pressTab(i)}>
                                <View style={{ backgroundColor: "transparent", height: "75%", width: "100%" }}>
                                  <WebView source={{ uri: webUrl[i]?.TAB[webUrl[i]?.TAB?.length - 1]?.URL }} scrollEnabled={false}
                                    // setBuiltInZoomControls={false}
                                    scalesPageToFit={false}
                                    automaticallyAdjustContentInsets={false}
                                    // injectedJavaScript={INJECTEDJAVASCRIPT}
                                    style={{ overflow: "hidden" }} />
                                </View>
                              </TouchableOpacity>
                            </View>


                          </>
                        )
                      })}
                    </View>

                  </ScrollView>

                  <View style={{
                    backgroundColor: "transparent", height: 50, width: "100%", flexDirection: 'row', justifyContent: "space-around", alignItems: "center",
                    borderBottomColor: "grey", borderBottomWidth: 1, borderTopColor: "grey", borderTopWidth: 1
                  }}>
                    <TouchableOpacity onPress={() => { closeallTab() }}>
                      <Text style={{ color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Medium }}>Close All</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                      setUrl(myUrl ? myUrl : webUrl[selectedIndex].TAB[webUrl[selectedIndex]?.TAB?.length - 1].URL);
                      setEnabled(true);
                    }}>
                      <Text style={{ color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Medium }}>Done</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            }
          </>
          :
          //History component
          <HistoryComp setHistory={setHistory} datas={historyData} clearHistory={clearHistory} />
        }

      </View >

      :
      <View>
        <Text>
          {/* {console.log("privateKey ", privateKey)} */}
        </Text>
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

export default DappWeb;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // position: 'relative'
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
    // marginLeft: "auto",
    // marginRight: "auto",
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
  custsearch: {
    borderRadius: 30,
    backgroundColor: "#000",
    borderColor: theme.phrase1,
    width: 100,
    fontFamily: Fonts.Bold,
    elevation: 0,
    fontSize: RFPercentage(2)
  },
});