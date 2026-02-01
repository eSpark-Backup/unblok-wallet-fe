import React, { useContext, useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Pressable,
} from "react-native";
import themeContext from "../../utils/themeContext";
import { Surface } from "react-native-paper";
import { Colors } from "../../utils/Colors";
import { Fonts } from "../../utils/Fonts";
import Web3Provider from "../../utils/Web3Provider";
import { useDispatch, useSelector } from "react-redux";
import { dappWeb } from "../../Redux/Actions/dappWebAction";
import { Icon as Icn } from "react-native-elements";
import { Images } from "../../utils/Images";
import { Searchbar } from "react-native-paper";
import Modal from "react-native-modal";
import WebView from "react-native-webview";
import { dappsProvider } from "./Dappprovider";

const DappWeb = () => {
  console.log("dappewbview");
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);

  //for search bar
  const onChangeSearch = (query) => setSearchQuery(query);

  //for search function
  const [searchQuery, setSearchQuery] = useState("");
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

  var ethRpc = "https://mainnet.infura.io/v3/";
  var ethChainId = 1;

  var bscRpc = "https://bsc-dataseed.binance.org";
  var bscChainId = 56;

  //redux
  const dispatch = useDispatch();
  const selectedWallet = useSelector(
    (state) => state.selectedCurrencyListReducer.selectedList
  );

  const dappStatusFromRedux = useSelector(
    (state) => state.DappWebReducer.dappWeb
  );
console.log("dappStatusFromRedux",dappStatusFromRedux);
  const url = dappStatusFromRedux.item.url;
  const [myUrl, setUrl] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const [imageUrl, setImageUrl] = useState("ETH");
  const [ImageLabel, setImageLabel] = useState("");

  const openModel = () => {
    setModalVisible(true);
  };
  const closeModel = () => {
    setModalVisible(false);
  };

  const setDappStatus = (item) => dispatch(dappWeb(item));

  useEffect(() => {
    var arr = [];
    setImageLabel(selectedWallet[0].currency);
    selectedWallet.map((item, index) => {
      if (item.currency != "TRX" && item.currency != "BTC") {
        arr.push(item);
      }
    });
    setState({ data: arr, loading: false });
    if (
      new RegExp(
        "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
      ).test(url)
    ) {
      setUrl(url);
    } else {
      setUrl("https://www.google.com/search?q=" + url);
    }
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

  const setImage = (imageName) => {
    if (imageName == "ETH") {
      return <Images.EthLogo width={35} height={35} />;
    } else if (imageName == "BNB") {
      return <Images.BNB width={35} height={35} />;
    } else if (imageName == "TRX") {
      return <Images.TrxLogo width={35} height={35} />;
    }
  };

  const renderImage = (image1) => {
    return image1 ? setImage(image1) : <View />;
  };

  const showImage = (item) => {
    if (item.currency.toLowerCase() == "ETH".toLowerCase()) {
      return <Images.EthLogo width={35} height={35} />;
    } else if (item.currency.toLowerCase() == "BNB".toLowerCase()) {
      return <Images.BNB width={35} height={35} />;
    } else if (item.currency.toLowerCase() == "TRX".toLowerCase()) {
      return <Images.TrxLogo width={35} height={35} />;
    } else if (item.currency.toLowerCase() == "Avax".toLowerCase()) {
      return <Images.Avax width={35} height={35} />;
    }
  };



  const webViewRef = useRef()
//   useEffect(() => {
//     if (webViewRef.current) {
//         // view.webviewRef = webViewRef.current
//     }
// }, [ webViewRef.current ])

// const navChanged=(nav)=>{
//  backEnabled = nav.canGoBack
//   forwardEnabled = nav.canGoForward
//  url = nav.url
//  title = nav.title
//  storedTab.setUrl(nav.url)
//   getBrowserStore().saveTabs()
// }

const   onMessage=async({ nativeEvent })=> {
  let data = nativeEvent.data
  console.log("data coming here",data)
  try {
      data = typeof data === 'string' ? JSON.parse(data) : data
      if (!data || !data.type) {
          return
      }
      if (data.type === 'history-state-changed') {
          this.url = data.navState.url
          this.title = data.navState.title
          this.icon = data.navState.icon.replace("svg", "png")
          this.storedTab.setIcon(this.icon)
          this.storedTab.setTittle(this.title)
          getBrowserStore().addToBrowserHistory(new HistoryItem({
              url: this.url,
              tittle: this.title,
              icon: this.icon
          }))
          getBrowserStore().saveTabs()
      }
      if (data.permission === "web3") {
          const selectedAddress = getWalletStore().selectedWallet?.address
          if (this.getAccounts(data.params?.url).length > 0) {
              this.postMessage({
                  messageId: data.messageId,
                  type: "api-response",
                  permission: 'web3',
                  data: [ selectedAddress ],
                  isAllowed: true
              })
          } else {
              if (this.approvalDialog.display) return
              this.approvalDialog.display = true
              this.approvalDialog.hostName = new URL(data.params?.url).hostname || this.url

              const approved = await new Promise((resolve, reject) => {
                  this.approvalDialog.approvalRequest = { resolve, reject }
              })

              if (approved) {
                  this.approvedHosts.add(new URL(data.params?.url).hostname)
                  this.postMessage({
                      messageId: data.messageId,
                      type: "api-response",
                      permission: 'web3',
                      data: [ selectedAddress ],
                      isAllowed: true
                  })
              } else {
                  this.postMessage({
                      messageId: data.messageId,
                      type: "api-response",
                      permission: 'web3',
                      isAllowed: false
                  })
              }
          }
      }

      if (data.type === "web3-send-async-read-only") {
          switch (data.payload.method) {
              case 'eth_blockNumber':
                  this.postAsyncCallbackMessage({
                      result: await getEVMProvider().jsonRPCProvider.getBlockNumber(),
                      data
                  })
                  break
              case 'eth_call':
                  this.postAsyncCallbackMessage({
                      result: await getEVMProvider().jsonRPCProvider.call(data.payload.params[0]),
                      data
                  })
                  break
              case 'eth_accounts':
              case 'eth_coinbase':
                  this.postAsyncCallbackMessage({
                      result: this.getAccounts(),
                      data
                  })
                  break
              case 'wallet_requestPermissions':
                  this.postAsyncCallbackMessage({
                      result: [ {
                          parentCapability: 'eth_accounts',
                          caveats: [
                              {
                                  type: 'filterResponse',
                                  value: this.getAccounts(),
                              }
                          ]
                      } ],
                      data
                  })
                  break
              case 'eth_chainId':
                  this.postAsyncCallbackMessage({
                      result: `0x${ Number(getEVMProvider().currentNetwork.networkID).toString(16) }`,
                      data
                  })
                  break
              case 'net_version':
                  this.postAsyncCallbackMessage({
                      result: getEVMProvider().currentNetwork.networkID,
                      data
                  })
                  break
              case 'eth_sendTransaction': {
                  if (this.sendTransactionDialog.display) return
                  await this.sendTransactionDialog.init(data.payload.params[0], data.meta)

                  try {
                      const approved = await new Promise((resolve, reject) => {
                          this.sendTransactionDialog.approvalRequest = {
                              resolve,
                              reject
                          }
                      })

                      this.sendTransactionDialog.display = false
                      setPendingAppToast(t("sendTransactionDialog.transactionSending"), TOAST_POSITION.UNDER_TAB_BAR)
                      InteractionManager.runAfterInteractions(async () => {
                          // @ts-ignore
                          const tx = new NativeTransaction(approved.tx)
                          const result = await tx.sendTransaction()
                          if (!result) {
                              this.postAsyncCallbackMessage({
                                  data,
                                  error: "Error send transaction"
                              })
                          }
                          closeToast()
                          this.postAsyncCallbackMessage({
                              result: tx.hash,
                              data
                          })
                          tx.applyToWallet()
                          setTimeout(async () => {
                              await tx.waitTransaction()
                          }, 10)
                      })
                  } catch (e) {
                      this.postAsyncCallbackMessage({
                          data,
                          error: { code: 4001, message: "user rejected request" }
                      })
                  }
                  break
              }
              case 'eth_sign': {
                  const pageMeta = {
                      meta: {
                          url: this.url,
                          title: this.title,
                          icon: this.icon
                      }
                  }
                  this.postAsyncCallbackMessage({
                      result: await getAppStore().messageManager.addUnapprovedMessageAsync({
                          data: data.payload.params[1],
                          from: data.payload.params[0],
                          ...pageMeta
                      }),
                      data
                  })
                  break
              }
              case 'personal_sign': {
                  const firstParam = data.payload.params[0]
                  const secondParam = data.payload.params[1]
                  const params = {
                      data: firstParam,
                      from: secondParam
                  }

                  if (resemblesAddress(firstParam) && !resemblesAddress(secondParam)) {
                      params.data = secondParam
                      params.from = firstParam
                  }

                  const pageMeta = {
                      meta: {
                          url: this.url,
                          title: this.title,
                          icon: this.icon
                      }
                  }
                  this.postAsyncCallbackMessage({
                      result: await getAppStore().personalMessageManager.addUnapprovedMessageAsync({
                          ...params,
                          ...pageMeta
                      }),
                      data
                  })
                  break
              }
              case "eth_signTypedData": {

                  const firstParam = data.payload.params[0]
                  const secondParam = data.payload.params[1]
                  const params = {
                      data: firstParam,
                      from: secondParam
                  }

                  if (resemblesAddress(firstParam) && !resemblesAddress(secondParam)) {
                      params.data = secondParam
                      params.from = firstParam
                  }

                  const pageMeta = {
                      meta: {
                          url: this.url,
                          title: this.title,
                          icon: this.icon
                      }
                  }

                  this.postAsyncCallbackMessage({
                      result: await getAppStore().typedMessageManager.addUnapprovedMessageAsync(
                          {
                              ...params,
                              ...pageMeta
                          },
                          'V1'
                      ),
                      data
                  })
                  break
              }
              case 'eth_signTypedData_v3': {
                  const params = {
                      from: data.payload.params[0],
                      data: JSON.parse(data.payload.params[1])
                  }

                  const pageMeta = {
                      meta: {
                          url: this.url,
                          title: this.title,
                          icon: this.icon
                      }
                  }

                  const chainId = params.data.domain.chainId
                  const activeChainId = getEVMProvider().currentNetwork.chainID

                  if (chainId && chainId !== activeChainId) {
                      this.postAsyncCallbackMessage({
                          result: ethErrors.rpc.invalidRequest(
                              `Provided chainId (${ chainId }) must match the active chainId (${ activeChainId })`
                          ),
                          data
                      })
                  }

                  this.postAsyncCallbackMessage({
                      result: await getAppStore().typedMessageManager.addUnapprovedMessageAsync(
                          {
                              ...params,
                              ...pageMeta
                          },
                          'V3'
                      ),
                      data
                  })
                  break
              }
              case 'eth_signTypedData_v4': {
                  const params = {
                      from: data.payload.params[0],
                      data: JSON.parse(data.payload.params[1])
                  }

                  const pageMeta = {
                      meta: {
                          url: this.url,
                          title: this.title,
                          icon: this.icon
                      }
                  }

                  const chainId = params.data.domain.chainId
                  const activeChainId = getEVMProvider().currentNetwork.chainID

                  if (chainId && chainId !== activeChainId) {
                      this.postAsyncCallbackMessage({
                          result: ethErrors.rpc.invalidRequest(
                              `Provided chainId (${ chainId }) must match the active chainId (${ activeChainId })`
                          ),
                          data
                      })
                  }

                  this.postAsyncCallbackMessage({
                      result: await getAppStore().typedMessageManager.addUnapprovedMessageAsync(
                          {
                              ...params,
                              ...pageMeta
                          },
                          'V4'
                      ),
                      data
                  })
                  break
              }
              default:
                  this.postAsyncCallbackMessage({
                      result: await getEVMProvider().jsonRPCProvider.send(data.payload.method, data.payload.params),
                      data
                  })
          }
      }
  } catch (e) {
      console.log("message error", e.message)
      this.postAsyncCallbackMessage({
          data,
          error: { code: 4001, message: e.message }
      })
  }
}


  return (
    <SafeAreaView style={style.container} backgroundColor={"#AD68A6"}>
      <StatusBar barStyle={"light-content"} backgroundColor={"#AD68A6"} />
      <Surface style={style.headerStyle} >
        <View style={style.leftImgView} backgroundColor={"#AD68A6"}>
          <Pressable
            onPress={() => {
              console.log("vfbdfjdfj b");
              setDappStatus({ status: "false", item: "item" });
            }}
          >
            <Icn
              name="chevron-left"
              type="evilicons"
              style={{
                alignSelf: "center",
              }}
              color={Colors.WHITE}
              size={30}
            />
          </Pressable>
          <Text style={style.largeFont}>{dappStatusFromRedux.item.url}</Text>
          <View style={style.rightImgView}>
            <Pressable onPress={() => openModel()}>
              {renderImage(ImageLabel)}
            </Pressable>
          </View>
        </View>
      </Surface>
     {/* <Web3Provider
        style={{ flex: 1 }}
        DAPP_URL={"https://rarible.com/"}
        CHAIN_ID={imageUrl == "ETH" ? ethChainId : bscChainId}
        RPC_URL={imageUrl == "ETH" ? ethRpc : bscRpc}
        PRIVATE_KEY={selectedWallet[0]?.privKey ?? ""}
      /> */}
         { console.log("dapppppurl",myUrl)}           
                     
<WebView  
 ref={ webViewRef }
 javaScriptEnabled
 bounces={ false }
//  source={ { uri:"https://rarible.com/" } }
source={{uri:`${myUrl}`}}
 renderLoading={ () => (
    <View>
            <ActivityIndicator size="large" color="#000"  />
          </View>
) }
localStorageEnabled
setSupportMultipleWindows={ false }
// onNavigationStateChange={ navChanged }
onPermissionRequest={ (req) => console.log("PERM", req) }
// onMessage={ onMessage }
onLoad={ (v) => console.log("LOADING-STARTED1") }
// onLoadEnd={ view.onLoadEnd }
// onLoadProgress={ view.onProgress }
// onShouldStartLoadWithRequest={ view.onShouldStartLoadWithRequest }
// injectedJavaScriptBeforeContentLoaded={  dappsProvider.get() }
// source={ { uri:"https://rarible.com/" } }
// onError={ view.onError }
// renderError={ () => <CustomFallback/> }


/>

      <Modal
        isVisible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        onBackdropPress={() => {
          setModalVisible(false);
        }}
        backdropPressToClose={true}
      >
        <ScrollView>
          <View
            style={{
              alignSelf: "center",
              padding: 20,
              borderWidth: 0.4,
              borderColor: Colors.PRIMARY,
              backgroundColor: Colors.WHITE,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          >
            
            <View style={{marginHorizontal:20}}>
            <Searchbar
              placeholder="Search Network"
              style={{
                backgroundColor: "#FFFFFF",
                alignSelf: "center",
              }}
              iconColor={Colors.grey}
              placeholderTextColor={Colors.grey}
              inputStyle={{ color: Colors.grey,fontFamily:Fonts.Regular,paddingLeft:20}}
              onChangeText={onChangeSearch}
              value={searchQuery}
            />
            </View>
            {filterdData.length != 0 ? (
              <FlatList
                data={filterdData}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setImageUrl(item.currency);
                      setImageLabel(item.currency);
                      closeModel();
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        padding: "5%",
                      }}
                    >
                      {showImage(item)}
                      <View style={{ marginHorizontal: 20 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: Fonts.Bold,
                            color: theme.text,
                          }}
                        >
                          {item.currency}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  alignSelf: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.Bold,
                    color: theme.text,
                  }}
                >
                  No Data Found!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
};
export default DappWeb;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    headerStyle: {
      height: 55,
      elevation: 4,
      borderBottomWidth: 0.2,
      justifyContent: "center",
      // backgroundColor: Colors.PRIMARY,
      backgroundColor: "#AD68A6"
    },
    largeFont: {
      color: Colors.WHITE,
      fontFamily: Fonts.Bold,
      fontSize: 12,
      flex: 1,
      textAlign: "center",
    },
    leftImgView: {
      flexDirection: "row",
      marginHorizontal: 20,
      justifyContent: "space-between",
    },
    rightImgView: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
