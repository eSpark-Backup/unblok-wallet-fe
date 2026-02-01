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
  } from "react-native";
  
  import { WebView } from "react-native-webview";
  import Modal from "react-native-modal";
  import { CHAINS, CHAIN_INFO, useWeb3WithRPC } from "./useWeb3";
  import { Web3File } from "./DappWeb3";
  import MessageModal from "./DappModal";
  import { Icon as Icn } from "react-native-elements";
  import { Images } from "../../utils/Images";
  import { Searchbar, TextInput } from "react-native-paper";
  import getRealm from "../../localDb/RealmConfig";
  
  import Searchlight from "../../assets/icons/lighttheme/Search.svg";
  import Searchdark from "../../assets/icons/darktheme/Search.svg";
  import URL from 'url-parse';
  
  import themeContext from "../../utils/themeContext";
  import { useDispatch, useSelector } from "react-redux";
  import { dappWeb, webtabs } from "../../Redux/Actions/dappWebAction";
  import { Fonts } from "../../utils/Fonts";
  import { EncodePrivateKey } from "../../utils/common";
  import { useFocusEffect } from "@react-navigation/native";
  import { ApiConstants } from "../../api/ApiConstants";
  import { RFPercentage } from "react-native-responsive-fontsize";
  import theme from "../../utils/theme";
  import { windowWidth, windowheight } from "../../utils/Dimensions";
  import TokenClient from "../../api/TokenClient";
  import SearchableDropdown from 'react-native-searchable-dropdown';
  import SelectDropdown from 'react-native-select-dropdown'
  import CloseIcon from '../../assets/img/close_icon.svg'
  import Backlight from '../../assets/icons/lighttheme/Back arrow.svg'
  import BackDark from '../../assets/icons/darktheme/Back arrow.svg'
  import { FavDappApi, addFavDappApi, removeFavDappApi } from "./common/D_app";
  import SearchIcon from '../../assets/icons/darktheme/Search.svg'
  var walletConnectStatus = false;
  
  const DappWeb = (props) => {
    // console.log("props", props.navigation);
    const theme = useContext(themeContext);
  
    //for search bar
    const onChangeSearch = (query) => setSearchQuery(query);
  
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
        //console.log("itemitemitem", item.currency.currencyName);
        const itemData = item.currency.toUpperCase();
        // console.log(itemData);
        const textData = searchQuery.toUpperCase();
        return itemData.indexOf(textData) > -1;
      })
      : data; // on on text, u can return all data
  
    //redux
    const dispatch = useDispatch();
    const selectedWallet = useSelector(
      (state) => state.selectedCurrencyListReducer.selectedList
    );
  
    const setNewTabs = (item) => dispatch(webtabs(item))
  
    const dappStatusFromRedux = useSelector(
      (state) => state.DappWebReducer.dappWeb
    )
    const url = dappStatusFromRedux.item.url;
    console.log("url", url);
    const [imageUrl, setImageUrl] = useState("ETH");
    const [ImageLabel, setImageLabel] = useState("");
  
    const setDappStatus = (item) => dispatch(dappWeb(item));
  
    const dappTabs = useSelector(
      (state) => state.DappWebReducer.webTabs
    )
  
    // console.log("fffffffffffff", dappTabs);
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
  
    const [networkInfo, setNetworkInfo] = useState({
      chainId: 56,
      rpcUrl: "https://bsc-dataseed1.binance.org/"
    });
    // getRealm()
    //   .then((realm) => {
    //     var walletData = realm.objects("Wallet_array");
    //     console.log("walletData", JSON.stringify(walletData, null, 2));
    //     var arr = walletData.filter((item, index) => {
    //       return item.selected == "true"
    //     });
    //     console.log("walletDergergtreata", JSON.stringify(arr, null, 2));
  
    //     setPrivatekey(EncodePrivateKey(arr[0].wallets[0].privKey))
    //     setAddress(arr[0].wallets[0].walletaddress)
    //   })
    const [currentUrl, setCurrentUrl] = useState({});
    const [privateKey, setPrivatekey] = useState("");
    const [address, setAddress] = useState("");
    const [show, setShow] = useState(false)
  
    const [connectWalletUrl, setConnectWalletUrl] = useState(false);
    const [approveModalVisible, setApproveModalVisible] = useState(false);
    const [approvalDetails, setApprovalDetails] = useState(null);
    const [modalView, setModalView] = useState(null);
    const searchBarRef = useRef(null)
    // console.log("searchBarRef", searchBarRef);
  
    const [showSearch, setShowSearch] = useState(false)
    // var address = "0xADE2daaDa0d35Fc86d913aa1f243347e184903ec";
    // var networkId = 97;
    // var privateKey = "3556b023212c3f6ac5c2d9b263b235647a28cfb51d48fd0a2171de036e433dfc";
    // var rpcUrl = "https://bsc-dataseed1.binance.org/";
  
    const web3 = useWeb3WithRPC(networkInfo.rpcUrl)
    const walletDetails = useSelector(
      (state) => state.allCurrrencyReducer.Allcurrency
    );
    // console.log("walletDetails", walletDetails);
    useFocusEffect(useCallback(() => {
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
      // console.log("typesssss", type);
      setNetwork(type)
    }, []))
  
  
    useEffect(() => {
      getRealm()
        .then((realm) => {
          var getMail = realm.objects("loginStatus")
          // console.log("getMail", getMail);
          setMailaddress(getMail[0].mail)
          show_favourite_list(getMail[0].mail)
        })
        .catch((err) => {
          console.log("error on getRealm daopp", err);
        })
    }, [])
  
  
    const add_favourite = async (data) => {
      var findHost = await findHostNameWithUrl(data)
  
      let params = {
        mailAddress: mailAddress,
        from: "web",
        hostName: findHost.hostname,
        URL: data
      };
      addFavDappApi(params)
        .then(function (res) {
          // console.log("ressssss", res.data);
          show_favourite_list();
        })
        .catch(function (err) {
          console.log("add_fav_dapp err", err);
        });
    };
  
    //for remove favourite
    const remove_favourite = (data) => {
  
      var findId = myfav.filter((val) => {
        return val.title == webUrl[selectedIndex].hostName
      })
      // console.log("findId", findId);
      let params = {
        mailAddress: mailAddress,
        dappId: findId[0]._id,
        from: "web"
      };
      console.log("paraaaaa", params);
      removeFavDappApi(params)
        .then(function (res) {
          // console.log("res.data", res.data);
          show_favourite_list();
        })
        .catch(function (err) {
          console.log("remove_fav_dapp err", err);
        });
    };
  
    const show_favourite_list = (mail) => {
      let params = {
        mailAddress: mail ?? mailAddress,
      };
      FavDappApi(params)
        .then(function (response) {
          // console.log("resssssssssssss", response.data);
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
      setUrl(url);
      setUrlForSearch(url)
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
  
    const [webUrl, setWebUrl] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [tabLength, setTabLength] = useState(1)
    const [refs, setRefs] = useState([])
    const findHostNameWithUrl = async (uri) => {
      var findHost = new URL(uri)
      // console.log("findHost", findHost);
      return findHost
    }
  
    useFocusEffect(
      useCallback(() => {
        urlPush()
      }, [urlForSearch, selectedIndex])
    )
  
    const urlPush = async () => {
      if (urlForSearch != "") {
        var findHost = await findHostNameWithUrl(urlForSearch)
        if (webUrl.length == 0) webUrl.push({ URL: urlForSearch, hostName: findHost.hostname })
        else {
          var newOne = webUrl.map((val, i) => {
            return selectedIndex == i ? val = { URL: urlForSearch, hostName: findHost.hostname } : val
          })
          setWebUrl(newOne)
        }
      }
    }
  
    const elRefs = React.useRef([]);
  
    useFocusEffect(
      useCallback(() => {
        console.log("00000000000000", elRefs.current[selectedIndex]?.current);
        if (elRefs.current[selectedIndex]) {
          // if (elRefs.current[selectedIndex]?.current != null) {
          if (refs.length == 0 || refs.length != tabLength) {
            console.log("jjjjjjjjjjjjjjj",elRefs.current[selectedIndex]);
            refs.push(elRefs.current[selectedIndex])
          }
          else {
            console.log("kkkkkkkkkkkkkkk1111",elRefs.current[selectedIndex]);
            refs.map((val, i) => {
              return selectedIndex == i ? val = elRefs.current[selectedIndex].current ? elRefs.current[selectedIndex].current : val : val
            })
            setRefs(refs)
            // }
          }
  
          // setRefs([...refs, elRefs.current[selectedIndex]])
        }
  
      }, [elRefs.current[selectedIndex]])
    )
    console.log("refssssssssssssssss", refs);
  
    useFocusEffect(
      useCallback(() => {
        // console.log("hllllllllo");
        if (elRefs.current.length !== tabLength) {
          // add or remove refs
          // console.log("elslslslslsls", elRefs.current);
          elRefs.current = Array(tabLength)
            .fill()
            .map((_, i) => elRefs.current[i] || createRef());
        }
      }, [tabLength])
    )
  
  
    console.log("webUrl", webUrl);
    console.log("elRefs", elRefs);
    const handleWeb = () => {
      setIsMoving(!isMoving);
    }
  
    const onMessage = async (event) => {
      // console.log("eventeventeventevent 182839", event);
      let data = JSON.parse(event.nativeEvent.data);
      // console.log("nativeEvent  datadatadata", data);
      const payload = data;
      // console.log("payloadpayload", payload);
      const { method, id } = payload;
  
      // console.log("method 12389++++++++++", method);
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
              // console.log("payload.params[0].chainId", payload);
              var BN = web3.utils.BN;
              var chainId = new BN(payload.params[0].chainId).toString();
              var rpc = CHAINS[chainId];
              // console.log("wallet_switchEthereumChain : ", chainId, rpc)
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
              console.log("Error wallet_switchEthereumChain : ", e)
            }
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
  
    const handleSwitchChain = (chainId) => {
      try {
        // console.log("Modal chain check", chainId);
        setIsSwitched(true);
        var index = CHAIN_INFO.map((el) => el.chainId).indexOf(chainId);
        // console.log("index checking", index);
        setNetwork(chainId);
        var rpc = CHAINS[chainId];
        setNetworkInfo({
          rpcUrl: rpc,
          chainId: chainId
        })
        // console.log("rpc checking", rpc);
        const result = {
          switchChain: true, config: {
            chainId: chainId,
            rpcUrl: rpc
          }
        };
        // console.log("result checking", result);
        postMessageToWebView(result);
      }
      catch (e) {
        console.log("chasin catch", e);
      }
    }
  
    //supported functions
    const postMessageToWebView = (result) => {
      if (elRefs.current[selectedIndex] && elRefs.current[selectedIndex].current) {
        elRefs.current[selectedIndex].current.postMessage(JSON.stringify(result));
      }
    };
  
    //web3 function lists starts here
  
    const handleEthGasPrice = async (payload) => {
      try {
        const { id } = payload;
        const res = await web3.eth.getGasPrice();
        const result = { id, result: res };
        // console.log("handleEthgas price result", result);
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
  
        // console.log("resresresres getBlockNumber", res);
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
  
      console.log("handleEthSendTransaction", id, txData);
      try {
        const accountInfo = web3.eth.accounts.privateKeyToAccount(privateKey);
        if (accountInfo.address != "") {
          const signedTransaction = await accountInfo.signTransaction(txData);
          const { rawTransaction } = signedTransaction;
  
          await web3.eth
            .sendSignedTransaction(rawTransaction)
            .on("transactionHash", async (hash) => {
              console.log("hashhashhash", hash);
              //  const res = await hasTxlogs(hash);
              //  console.log("sendSignedTransaction res : ",res)
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
              console.log("sendSignedTransaction error: ", error);
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
  console.log("Buzxwe@792%",myUrl);
    const popupContractModal = async (id, txData, formatedInputData) => {
      try {
        // alert("popupContractModal call")
        console.log("popupContractModal called", id, txData, formatedInputData);
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
        console.log("Error Popup : ", e)
      }
    };
  
    const popupNormalTransactionModal = async (id, txData) => {
      console.log("popupNormalTransactionModal called", id, txData);
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
      let gasLimit = parseInt(gas * 1.5, 10);
  
      const result = { id, result: gasLimit };
      postMessageToWebView(result);
  
    }
    const popupTransactionModal = async (payload) => {
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
      setCurrentUrl(url)
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
    }, [network])
  
    const getJsCode = (address, networkId, rpcUrl) => {
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
              console.log('listener message err: ', err);
            }
          })
        
          communicateWithRN = (payload) => {
            return new Promise((resolve, reject) => {
              // alert("postMessage"+JSON.stringify(payload))
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
                  //  alert("signedTx : > "+signedTx)
                  try{
                       var hashResp = "";
  
                       hashResp =await web33.eth.sendSignedTransaction(signedTx.rawTransaction);
  
                       console.log(hashResp,'hashResp');
                      //  alert("hashResp : "+hashResp)
  
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
                      console.log('contract method: ', method);
                      contract.methods[method](params).call({ from: address }, cb);
                    };
                  } else {
                    contract[method] = (params, cb) => {
                      alert('contract method: '+ method)
                      console.log('contract method: ', method);
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
              console.log('payload: from sendAsync +++++', payload);
             
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
  
                    console.log('blockNumberIs121212121:',blockNumberIs);
                    console.log('blockNumberIs:',blockNumberIs.number);
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
        
          if(localStorage.getItem("configData")){
            var config = JSON.parse(localStorage.getItem("configData"));
          initWeb3('${address}',config.chainId,config.rpcUrl);
          }else{
          initWeb3('${address}','${networkInfo.chainId}','${networkInfo.rpcUrl}');
  
          }
         
         
        }) ();
      
    `;
    };
  
    const injectJavaScriptdata = (_chainId) => {
      if (_chainId === '0x1') {
        // initWeb3(address,1,'https://mainnet.infura.io/v3/be5bdb23c61c4b92b174cb569e57f7b2');
        var jsCode = getJsCode(address, 1, 'https://mainnet.infura.io/v3/be5bdb23c61c4b92b174cb569e57f7b2');
      }
      else if (_chainId === '0x38') {
        // initWeb3(address,56,'https://bsc-dataseed1.binance.org/');
        var jsCode = getJsCode(address, 56, 'https://bsc-dataseed1.binance.org/');
      }
      else {
        var jsCode = getJsCode(address, networkInfo.chainId, rpcUrl);
  
      }
      return jsCode;
  
    }
  
    const switchInjectedData = (_address = address, _chainId = networkInfo.chainId, _rpc = networkInfo.rpcUrl) => {
      // web3 decode response
      console.log("switchInjectedData caleed : ")
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
  
  
    const redirecttoBrowser = () => {
      setShow(false)
      if (isEmpty(urlForSearch)) return ToastAndroid.showWithGravityAndOffset(
        "URL required",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      console.log("urlForSearch", urlForSearch);
      if (urlForSearch.trim().slice(0, 8) == "https://") return setUrl(urlForSearch)
      if (urlForSearch.trim().slice(-4) != ".com") return setUrl(`https://www.google.com/search?q=${urlForSearch}`)
      else setUrl(urlForSearch)
    };
  
    const searchCategory = async (key) => {
      setUrlForSearch(key)
      var searchResult = await TokenClient.post(ApiConstants.searchCategory, { key })
      // console.log("searchResult", searchResult.data.data);
      setSearchValues(searchResult.data.data)
    }
  
    const pressTab = async (i) => {
      setSelectedIndex(i);
      setUrl(webUrl[i].URL);
      setEnabled(true)
    }
  
    const deleteTab = async (i) => {
      webUrl.splice(i, 1)
      elRefs.current.splice(i, 1)
      setTabLength(tabLength - 1);
    }
  
    const CreateTab = async () => {
      setTabLength(tabLength + 1);
      setSelectedIndex(selectedIndex + 1)
      setWebUrl(([...webUrl, { URL: "https://www.google.com/", hostName: new URL("https://www.google.com/").hostname }]));
      setUrlForSearch("https://www.google.com/")
      setUrl("https://www.google.com/")
  
    }
  
  
    // const handleSearchButtonPress = (value) => {
    //   setShowSearch(value)
    //   if (value) {
    //     if (searchBarRef.current) {
    //       searchBarRef.current.focus();
    //     }
    //   } else {
    //     if (searchBarRef.current) {
    //       searchBarRef.current.clear();
    //       searchBarRef.current.blur();
    //     }
    //   }
  
    // };
  
    const handleSearchButtonPress = () => {
      if (searchBarRef.current) {
        searchBarRef.current.focus();
      }
    };
  
  
    const handleCancelButtonPress = () => {
      if (searchBarRef.current) {
        searchBarRef.current.clear();
        searchBarRef.current.blur();
      }
    };
  
    return (
      (isMoving && privateKey != "" && address != "") ?
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
                      // borderBottomColor: `${index == network ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.2)"}`, borderBottomWidth: 1,borderBottomStartRadius:20,borderBottomEndRadius:20,
                      padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "flex-start"
                    }}
                      onPress={() => {
                        handleSwitchChain(item.chainId);
                        setChainModal(false);
                      }}
                      key={Math.random()}
                    >
                      {/* <Image style={{ height: 30, width: 30 }} source={item.img} /> */}
                      {item.img}
                      <Text style={{ fontFamily: index == network ? Fonts.Bold : Fonts.Regular, fontSize: 13, marginLeft: 20, color: "#000" }}>{item.name}</Text>
                    </TouchableOpacity>)
                  }
                </View>
              </View>
            </View>
          </Modal>
          {/* { network && console.log("Network Changed >>>>>>>> ",isSwitched) } */}
          <View style={{ alignItems: "center", justifyContent: "space-around", width: "100%", paddingVertical: 10, backgroundColor: "#323234" }}>
            <Searchbar
              style={styles.custsearch}
              inputStyle={{ color: "#fff", fontFamily: Fonts.Regular, fontSize: RFPercentage(2) }}
              value={urlForSearch}
              onChangeText={(redirecturl) => searchCategory(redirecturl)}
              placeholder="Search or Type web address"
              placeholderTextColor={"#fff"}
              ref={searchBarRef}
              // iconColor={"#fff"}
              onFocus={() => setShow(true)}
              // onBlur={() => setShow(false)}
              clearIcon={() => { return <Image source={{uri:Images.close}} style={{ width: windowWidth * 0.075, height: windowheight * 0.028, alignSelf: "center", resizeMode: "contain", tintColor: "#fff" }} /> }}
              icon={() => { return <Icn name="home" type="ionicons" style={{ marginLeft: 10 }} color={"#fff"} /> }}
              onIconPress={() => props.navigation.navigate("WalletHome")}
              // onSubmitEditing={redirecttoBrowser}
              // onClearIconPress={() => setUrlForSearch(url)}
              onBlur={() => {
                setTimeout(() => {
                  setShow(false)
                  setSearchValues([])
                }, 1000)
                if (urlForSearch?.length == 0) { setUrlForSearch(url), setSearchValues([]) }
              }}
            />
  
          </View>
          {show && (
            <>
              {urlForSearch?.length == 0 ?
                (<></>) :
                (<>
                  {searchValues.length == 0 ?
                    (<>
                      <View style={{ position: 'absolute', zIndex: 999, top: 50, left: 0, right: 0, borderWidth: 1, backgroundColor: "#323234" }}>
                        <TouchableOpacity onPress={() => { setShow(false), redirecttoBrowser(urlForSearch) }}>
                          <Text style={{ padding: 10, color: "#fff" }}>{urlForSearch}</Text>
                        </TouchableOpacity>
                      </View>
                    </>) :
                    (<>
                      <View style={{ position: 'absolute', zIndex: 999, top: 50, left: 0, right: 0, borderWidth: 1, backgroundColor: "#323234", height: "50%" }}>
                        {/* <ScrollView style={{position: 'absolute', zIndex: 999, top: 50, left: 0, right: 0, borderWidth: 1, backgroundColor: "#323234" }}> */}
                        <ScrollView>
                          {searchValues.map((option) => (
                            <TouchableOpacity key={Math.random()} style={{ flexDirection: "row", padding: 10, justifyContent: "space-between", alignItems: "center" }} onPress={() => { setShow(false), setUrl(option.url), setUrlForSearch(option.url), setSearchValues([]) }}>
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
                              {console.log("inside map value",option)}
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
  
          {/* <View style={{ width: "100%", paddingVertical: 10, backgroundColor: "#323234"}}>
  
          </View> */}
          {(enabled && elRefs?.current[selectedIndex]) ?
            <WebView
              ref={elRefs.current[selectedIndex]}
              source={{ uri: myUrl }}
              mixedContentMode={"compatibility"}
              setSupportMultipleWindows={connectWalletUrl}
              onShouldStartLoadWithRequest={handleNavigation}
              originWhitelist={["*"]}
              javaScriptEnabled
              domStorageEnabled={true}
              javaScriptEnabledAndroid
              automaticallyAdjustContentInsets={false}
              // injectedJavaScript={injectJavaScriptdata()} 
              injectedJavaScriptBeforeContentLoaded={switchInjectedData()}
              onLoadProgress={(e) => {
                const state = e.nativeEvent;
                console.log("onLoadProgress :", state)
                setCanGoBack(state.canGoBack);
                setUrlForSearch(state.url)
              }}
              onLoadStart={() => setLoad(true)}
              onLoadEnd={() => setLoad(false)}
              onMessage={(event) => onMessage(event)}
              style={styles.video}
              renderError={() => {
                console.log('loaded');
                return (<View></View>)
              }}
            />
            :
            <>
  
              <View style={{
                backgroundColor: "#323234",
                maxHeight: Dimensions.get('window').height,
                width: Dimensions.get('window').width,
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
                // height: "100%"
              }}>
                <ScrollView>
  
                  {Array(tabLength)?.fill()?.map((val, i) => {
                    return (
                      <View key={Math.random()} style={{ backgroundColor: "white", height: windowWidth * 0.4, width: windowWidth * 0.85, margin: 5, borderColor: "#fff", borderWidth: 2, borderRadius: 5 }}>
                        <View style={{ backgroundColor: "#323234", height: "35%", width: "100%", justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                          <Text style={{ color: "#fff", textAlign: "center", left: 10 }}>{webUrl[i].hostName}</Text>
                          <TouchableOpacity onPress={() => deleteTab(i)} style={{ right: 5 }}>
                            <Image source={require("../../assets/img/close_white.png")} style={{ height: 25, width: 25, tintColor: "#fff" }} />
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => pressTab(i)}>
                          <View style={{ backgroundColor: "transparent", height: "65%", width: "100%" }}>
                            <WebView source={{ uri: webUrl[i].URL }} scrollEnabled={false} scalesPageToFit={true} style={{ overflow: "hidden" }} />
                          </View>
                        </TouchableOpacity>
                      </View>
                    )
                  })}
                </ScrollView>
  
                <View style={{
                  backgroundColor: "transparent", height: 50, width: "100%", flexDirection: 'row', justifyContent: "space-around", alignItems: "center",
                  borderBottomColor: "grey", borderBottomWidth: 1, borderTopColor: "grey", borderTopWidth: 1
                }}>
                  <TouchableOpacity onPress={() => { props.navigation.navigate("WalletHome") }}>
                    <Text style={{ color: "#2d7feb", fontFamily: Fonts.Bold }}>Close All</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    onPress={() => CreateTab()}
                    style={{ marginRight: 10 }}
                  >
                    <Icn name="add-circle-outline" size={40} type="ionicons" color={"#fff"} />
                  </TouchableOpacity> */}
                  <TouchableOpacity onPress={() => setEnabled(true)}>
                    <Text style={{ color: "#2d7feb", fontFamily: Fonts.Bold }}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
  
            </>}
  
          {enabled && <View style={{
            backgroundColor: "#323234", height: 50, width: "100%", flexDirection: 'row', justifyContent: "space-around", alignItems: "center",
            borderBottomColor: "grey", borderBottomWidth: 1, borderTopColor: "grey", borderTopWidth: 1
          }}>
            <TouchableOpacity
              onPress={() => { props.navigation.navigate("WalletHome") }}
              style={{ alignSelf: "center" }}
            >
              <Icn name="home" size={30} type="ionicons" color={"#fff"} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { handleSearchButtonPress() }}
            >
              <SearchIcon width={windowWidth * 0.075} height={windowWidth * 0.075} style={{ resizeMode: "contain" }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChainModal(!chainModal)}>
              {CHAIN_INFO?.filter(item => item.chainId == network)[0]?.img}
            </TouchableOpacity>
          </View>}
  
          {load ? (
            <ActivityIndicator
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                jusityContent: "space-around",
                flexWrap: "wrap",
                alignContent: "center",
              }}
              size="large"
              color={"#000"}
            />
          ) : null
          }
          <View>
            {/* <View style={{
              flexDirection: "row", alignItems: "center", justifyContent: "space-around", width: "100%",
              paddingVertical: 10, backgroundColor: "rgba(255,255,255,0.1)"
            }}> */}
  
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", width: "100%", paddingVertical: 10, backgroundColor: "#323234" }}>
              <TouchableOpacity
                // style={{
                //   borderWidth: 1,
                //   borderColor: 'rgba(255,255,255,0.5)',
                //   alignItems: 'center',
                //   justifyContent: 'center',
                //   width: 45,
                //   // position: 'absolute',
                //   // bottom: 10,
                //   // right: 10,
                //   height: 45,
                //   // backgroundColor: '#fff',
                //   borderRadius: 100,
                // }}
                onPress={() => { console.log("goBcak "); elRefs.current[selectedIndex].current.goBack() }}
              >
                {/* <Text> BACK </Text> */}
                {/* <Icn name="arrow-back" type="ionicons" color={"#fff"} /> */}
                <BackDark width={windowWidth * 0.093} height={windowWidth * 0.093} style={{ resizeMode: "contain" }} />
              </TouchableOpacity>
  
              <TouchableOpacity
                style={{
                  // borderWidth: 1,
                  // borderColor: 'rgba(255,255,255,0.5)',
                  // alignItems: 'center',
                  // justifyContent: 'center',
                  // width: 45,
                  // // position: 'absolute',
                  // // bottom: 10,
                  // // right: 10,
                  // height: 45,
                  // // backgroundColor: '#fff',
                  // borderRadius: 100,
                }}
                onPress={() => { console.log("goBcak "); elRefs.current[selectedIndex].current.goForward() }}
              >
                {/* <Icn name="arrow-forward" type="ionicons" color={"#fff"} /> */}
                <BackDark width={windowWidth * 0.093} height={windowWidth * 0.093} style={{ resizeMode: "contain", transform: [{ rotate: "180deg" }] }} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => CreateTab()}
                style={{ marginRight: 10 }}
              >
                <Icn name="add-circle-outline" size={35} type="ionicons" color={"#fff"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 28,
                  // position: 'absolute',
                  // bottom: 10,
                  // right: 10,
                  height: 28,
                  // backgroundColor: '#fff',
                  borderRadius: 10,
                }}
                onPress={() => { console.log("goBcak "); setEnabled(!enabled) }}
              >
                {/* <Icn name="document" size={25} type="ionicons" color={"#fff"} /> */}
                <Text style={{ color: "#fff" }}>{tabLength}</Text>
              </TouchableOpacity>
              {myfav?.find(
                (na) => na?.title == webUrl[selectedIndex]?.hostName
              ) ?
                (<>
                  <TouchableOpacity onPress={() => remove_favourite()}>
                    {/* <Image source={Images.acivestar} style={{ width: windowWidth * 0.075, height: windowheight * 0.028, alignSelf: "center", resizeMode: "contain", }} /> */}
                  </TouchableOpacity>
                </>) :
                (<>
                  <TouchableOpacity onPress={() => add_favourite(urlForSearch)}>
                    {/* <Image source={Images.inacivestar} style={{ width: windowWidth * 0.075, height: windowheight * 0.028, alignSelf: "center", resizeMode: "contain", tintColor: "#fff" }} /> */}
                  </TouchableOpacity>
                </>)
              }
  
            </View>
          </View>
        </View >
        : <View>
          <Text>
            {console.log("privateKey ", privateKey)}</Text>
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
      alignItems: 'center',
      justifyContent: 'space-between',
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
    custsearch: {
      borderRadius: 5,
      backgroundColor: "#323234",
      borderColor: theme.phrase1,
      borderWidth: 1,
      margin: -8,
      fontFamily: Fonts.Bold,
      elevation: 0,
      fontSize: RFPercentage(2)
    },
  });