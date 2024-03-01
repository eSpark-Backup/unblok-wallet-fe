// import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
// import {
//   Text,
//   View,
//   SafeAreaView,
//   StyleSheet,
//   FlatList,
//   BackHandler,
//   TouchableOpacity,
//   AppState,
//   RefreshControl,
//   Dimensions,
//   ToastAndroid
// } from "react-native";
// import themeContext from "../../utils/themeContext";
// import getRealm from "../../localDb/RealmConfig";
// import Header from "../../Components/Header";
// import ItemBox from "../../Components/ItemBox";
// import { Colors } from "../../utils/Colors";
// import SegmentedControl from "../../Components/SegmentedControl";
// import { Fonts } from "../../utils/Fonts";
// import { Icon as Icn, Image, Switch } from "react-native-elements";
// import { useDispatch, useSelector } from "react-redux";
// import { useFocusEffect } from "@react-navigation/native";
// import isEmpty from "../../utils/isEmpty";
// import { getSdkError } from "@walletconnect/utils";
// import { GetWalletType, connect_Wallet_WC1 } from "../walletConnect/WC1";
// import { EIP155_SIGNING_METHODS, EIP155_SIGNING_METHODS_Name } from "../../api/ApiConstants";
// const WalletConnect = (props) => {
//   //theme config
//   const theme = useContext(themeContext);
//   const style = styles(theme);
//   const [pushcheck, setPushCheck] = useState(false);
//   const windowWidth = Dimensions.get('window').width;
//   const windowHeight = Dimensions.get('window').height;


//   const [uri, seturi] = useState(undefined);
//   const [Wallet, SetWallet] = useState({});
//   // const { wallet, index } = useSelector((state) => state.fiatDataReducer);
//   const wallet = useSelector(
//     (state) => state.selectedCurrencyListReducer.selectedList
//   );

//   const { Connected, Session, page, type, payload } = useSelector((state) => state.wcreducer);
//   //////walledasdasdt("Session", JSON.stringify(Session, null, 2));
//   console.log("walletxxxxxx", wallet);
//   const Approve = props?.route?.params?.Approve;
//   useFocusEffect(
//     useCallback(() => {
//       if (props?.route?.params?.data) {
//         seturi(props?.route?.params?.data);
//       }
//     }, [props?.route?.params?.data])
//   );
//   console.log("Session",Session);
//   // //walledasdasdt("SetWallet(val);",uri)
//   console.log("urlll", uri);
//   // useFocusEffect(
//   useEffect(() => {
//     try {

//       getRealm()
//         .then(async (realm) => {
//           // var WC_Connect = realm.objects("WC");


//           var WC_Connect = realm.objects("WC");
//           // //walledasdasdt("wc_connect",WC_Connect)
//           // WC_Connect.map((itm) => {
//           //   realm.write(() => {
//           //     realm.delete(itm);
//           //   });
//           // })
//           if (
//             // false
//             (WC_Connect.length > 0 && WC_Connect[0]?.WC)
//           ) {
//             var exist = JSON.parse(WC_Connect[0].WC)?.Wallet;
//             var val = await connect_Wallet_WC1({
//               clientMeta: exist._clientMeta,
//               bridge: exist._bridge,
//               // session: {
//               //   accounts: exist._accounts,
//               //   chainId: parseInt(exist._chainId, 10),
//               //   ...JSON.parse(WC_Connect[0].WC)?.params[0],
//               // },
//             });

//             // //console.log("come if", JSON.stringify(val,null,2))


//             val.createSession()
//             val.updateSession({
//               accounts: val.accounts,
//               chainId: parseInt(val.chainId, 10),
//             });
//             SetWallet(val);

//             // await val.restoreSession();
//             Update_walet({
//               Connected: true,
//               Session: JSON.parse(WC_Connect[0].WC),
//             });
//             // //walledasdasdt("exist",exist)
//           } else {
//             //walledasdasdt("uri")
//             if (uri) {
//               if (uri?.toLowerCase()?.includes("relay")) {
//               } else {
//                 var val = await connect_Wallet_WC1({
//                   uri: uri,
//                   clientMeta: {
//                     description: "YUSE wallet",
//                     url: "https://yustoken.io",
//                     icons: [
//                       "https://imagedelivery.net/_aTEfDRm7z3tKgu9JhfeKA/4ca6cbac-48a2-4dc9-0712-0c75cd12c300/lg",
//                     ],
//                     name: "Yuse Wallet",
//                   },
//                 });
//                 //walledasdasdt("val.accounts", val.accounts);
//                 console.log("vallllllll", val);
//                 SetWallet(val);
//               }
//             }
//           }
//         })
//         .catch((err) => {
//           ToastAndroid.showWithGravityAndOffset(
//             `${err.toString().split('Error:')[1]}`,
//             ToastAndroid.LONG,
//             ToastAndroid.BOTTOM,
//             25,
//             50
//           );
//           getRealm()
//             .then(async (realm) => {
//               var WC_Connect = realm.objects("WC");

//               WC_Connect.map((itm) => {
//                 realm.write(() => {
//                   realm.delete(itm);
//                 });
//               })
//             })
//             .catch(e => console.log("e", e))
//           //console.error("e in usefeedf",WC_Connect);
//         });
//     } catch (e) {
//       console.error("e in usefeedf", e);
//     }
//   }, [uri])
//   // );

//   const dispatch = useDispatch();

//   const Update_walet = (data) => {
//     // //walledasdasdt("data",JSON.stringify(data,null,2))
//     dispatch({
//       type: "Session",
//       data: data
//     });
//   };

//   useFocusEffect(
//     useCallback(() => {
//       console.log("Walletfghf", Wallet);
//       if (!isEmpty(Wallet)) {
//         Wallet.on("session_request", (error, payload) => {
//           console.log("walledasdasdt", JSON.stringify(payload, null, 2));

//           if (error) {
//             throw error;
//           }
//           const { accounts, chainId } = payload.params[0];
//           var isChaindHere = wallet.filter(
//             (it) => it.currency == GetWalletType(chainId)
//           );
//           console.log("isChaindHere", isChaindHere);
//           if (isChaindHere.length > 0) {
//             // //console.log("isChaindHere",isChaindHere)
//             var outt = {
//               Session: {
//                 lp: isChaindHere?.pop(),
//                 autoSign: false,
//                 connector: Wallet,
//                 walletaddress: isChaindHere?.pop()?.walletaddress,
//                 Wallet: Wallet,
//                 payload: payload,
//               }
//             }
//             console.log("outt", JSON.stringify(outt, null, 2))
//             Update_walet(outt);
//             getRealm()
//               .then((realm) => {
//                 if (Wallet.accounts.length > 0) {
//                   realm.write(() => {
//                     realm.create("WC", { WC: JSON.stringify(outt) });
//                   });
//                 }
//               })
//             props.navigation.navigate("ApprovePage");
//           } else {
//             _rejectsession(payload.id, GetWalletType(chainId));
//           }
//         });
//         Wallet.on("session_delete", () => {
//           //////walledasdasdt("user disconnected the session from their wallet");
//         });
//         Wallet.on("session_update", () => {
//           //console.log("user disconnected the session from their wallet");
//         });
//         Wallet.on("call_request", async (error, payload) => {
//           const { request, chainId } = payload;
//           console.log("raja", payload)
//           if (error) {
//             throw error;
//           }
//           //  if (payload.method) {
//           //     //WalletconnectStore.setTransactionData(payload);
//           //     if (payload.method === "eth_sendTransaction") {
//           //       //////walledasdasdt("-----eth_sendTransaction----");
//           //       //WalletconnectStore.setStatus(WALLETCONNECT_STATUS.SEND_TRANSACTION);
//           //     } else if (payload.method === "eth_sign") {
//           //       //WalletconnectStore.setStatus(WALLETCONNECT_STATUS.SIGN_TRANSACTION);
//           //       //////walledasdasdt("-----ETH SIGN----");
//           //     } else if (payload.method === "personal_sign") {
//           //       // //WalletconnectStore.setStatus(
//           //       //   WALLETCONNECT_STATUS.SIGN_PERSONAL_MESSAGE

//           //       //////walledasdasdt("-----personal_sign----");
//           //     } else if (payload.method && payload.method === "eth_signTypedData") {
//           //       //WalletconnectStore.setStatus(WALLETCONNECT_STATUS.SIGN_TYPED_DATA);
//           //       //////walledasdasdt("-----eth_signTypedData----");
//           //     }
//           //   }
//           //////walledasdasdt("payload>>?>>",payload)

//           if (payload.method) {
//             switch (payload.method) {
//               case EIP155_SIGNING_METHODS.ETH_SIGN:
//               case EIP155_SIGNING_METHODS.PERSONAL_SIGN: {
//                 dispatch({
//                   type: "page",
//                   data: {
//                     page: EIP155_SIGNING_METHODS.PERSONAL_SIGN,
//                     type: EIP155_SIGNING_METHODS_Name[
//                       EIP155_SIGNING_METHODS.PERSONAL_SIGN
//                     ],
//                     payload: payload,
//                   },
//                 });
//                 props.navigation.navigate("SignPage");
//                 return;
//               }
//               case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
//                 dispatch({
//                   type: "page",
//                   data: {
//                     page: EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION,
//                     type: EIP155_SIGNING_METHODS_Name[
//                       EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION
//                     ],
//                     payload: payload,
//                   },
//                 });
//                 props.navigation.navigate("SignPage");
//                 return;

//               case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
//               case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
//               case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
//                 setRequestSession(requestSessionData);
//                 setRequestEventData(requestEvent);
//                 setSignTypedDataModal(true);
//                 return;

//             }
//           }
//         });
//         Wallet.on("disconnect", (error, payload) => {
//           if (error) {
//             throw error;
//           } else {
//             Logout();
//           }
//         });
//       }
//     }, [Wallet])
//   );
//   // //console.log("Secio",JSON.stringify(Session,null,2
//   // ))
//   const _rejectsession = async (id, Network) => {
//     await Wallet.rejectSession({
//       id,
//       reason: getSdkError("UNSUPPORTED_CHAINS"),
//     });
//     ToastAndroid.showWithGravityAndOffset(
//       `Switch ${Network} Wallet to Connect The DAPP`,
//       ToastAndroid.LONG,
//       ToastAndroid.BOTTOM,
//       25,
//       50
//     );
//   };
//   console.log("come", page, type, Session?.payload.id);

//   const Logout = async () => {
//     // //////walledasdasdt("cane");
//     try {
//       if (!isEmpty(Session?.connector) || !isEmpty(Wallet)) {
//         // //walledasdasdt("calnt logout")

//         (Session?.connector || Wallet).killSession();
//         dispatch({
//           type: "initial",
//         });
//       } else {
//         //walledasdasdt("calnt logout");
//       }
//     } catch (e) {
//       //console.error("edsahdaskdas", e);
//     }
//   };
//   useEffect(() => {
//     // if (!isEmpty(Session?.connector)) {
//     //   Logout();
//     // }
//   }, []);

//   // useFocusEffect(useCallback(()=>{

//   // },[]))
//   // //walledasdasdt("walledasdasdt",JSON.stringify(Session,null,2),Wallet)

//   return (
//     <SafeAreaView style={style.container}>
//       <Header name={"WalletConnect"} leftImage={"back"} />
//       {!Connected ? (<View>
//         <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 20 }}>
//           <Text style={{
//             color: theme.text, fontFamily: Fonts.Regular,
//             width: windowWidth - 100, textAlign: "center", marginTop: 20
//           }}>Connect your wallet with WalletConnect to make transaction</Text>
//         </View>
//         <View style={{
//           flexDirection: "row", alignItems: "center", justifyContent: "center",
//           marginTop: 30
//         }}>
//           <TouchableOpacity style={{
//             backgroundColor: theme.background, borderRadius: 100,
//             padding: 10, paddingVertical: 15, width: 200, borderWidth: 1, borderColor: theme.text
//           }} onPress={() => {
//             props.navigation.navigate("ScanAddress", {
//               path: "WalletConnect",
//             });
//           }}>
//             <Text style={{
//               color: theme.text, fontFamily: Fonts.Regular,
//               width: "100%", textAlign: "center"
//             }}> New Connection</Text>
//           </TouchableOpacity>
//         </View>
//       </View>) : (<><View>
//         <View style={{ marginVertical: 20 ,alignItems:"center"}}>
//           <Image
//             source={{ uri: Session?.payload?.params[0]?.peerMeta?.icons[0] }}
//             style={{ height: 40, width: 40 }}
//           />
//           <Text
//             style={{
//               color: "gray",
//               fontFamily: Fonts.Medium,
//               width: "100%",
//               textAlign: "center",
//             }}
//           >
//             {Session?.payload?.params[0]?.peerMeta?.name} -{" "}
//             {Session?.payload?.params[0]?.peerMeta?.description}
//           </Text>

//           <Text
//             style={{
//               color: "gray",
//               fontFamily: Fonts.Medium,
//               width: "100%",
//               textAlign: "center",
//             }}
//           >
//             {Session?.walletaddress}
//           </Text>
//         </View>
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <TouchableOpacity
//             style={{
//               backgroundColor: "gray",
//               borderRadius: 100,
//               padding: 10,
//               width: 200,
//             }}
//             onPress={() => {
//               Logout();
//             }}
//           >
//             <Text
//               style={{
//                 color: "#fff",
//                 fontFamily: Fonts.Bold,
//                 width: "100%",
//                 textAlign: "center",
//               }}
//             >
//               {" "}
//               {"Logout"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View></>)}
//     </SafeAreaView>
//   );
// };
// export default WalletConnect;

// const styles = (theme) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: theme.background,
//     },
//     seperatorLine: {
//       height: 0.5,
//       backgroundColor: "grey",
//     },
//   });








import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  Pressable,
  BackHandler,
  ImageBackground,
} from "react-native";
// import Tvicon from "../../assets/img/tvicon.svg";

import { Icon, Image } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header";
import configureStore from "../../Redux/store";
import { Fonts } from "../../utils/Fonts";
import isEmpty from "../../utils/isEmpty";
import theme from "../../utils/theme";
// import { GetWalletType } from "../WC/WC1";
import { getSdkError } from "@walletconnect/utils";
import {
  EIP155_SIGNING_METHODS,
  EIP155_SIGNING_METHODS_Name,
} from "../../../app/api/ApiConstants";
import themeContext from "../../utils/themeContext";
import { CHAIN_INFO } from "../DappScreens/useWeb3";
import { timeAgo, dateepoch, timeformat } from "../../api/common";
import { connector, connect_Wallet_WC2, getcurrensession_WC2, pair } from "../walletConnect/WC2";
import { TextInput } from "react-native-gesture-handler";
import { Card } from "react-native-shadow-cards";
import { Toastfn } from "../../utils/toast";
import { Colors } from "../../utils/Colors";
import { Surface } from "react-native-paper";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Images } from "../../utils/Images";
import { windowWidth, windowheight } from "../../utils/Dimensions";

const WalletConnects = (props) => {
  const theme = useContext(themeContext);
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  // const { isDarkmode } = useSelector((state) => state.themeReducer);
  //theme config

  const appBarStyle = style(theme);
  const [Show, setShow] = useState({});
  const [All_data, setAll_data] = useState([]);
  const [Loading, setLoading] = useState(true);
  // console.log("showwww",JSON.stringify(Show,null,2));
  const [Wallet, SetWallet] = useState({});
  // const { wallet, index } = useSelector((state) => state.fiatDataReducer);
  const wallet = useSelector(
    (state) => state.selectedCurrencyListReducer.selectedList
  );
  const {
    WC_Connector,
    Loader,
    Connected,
    Session,
    page,
    type,
    payload,
    version,
    url,
    All_Session,
    time,
  } = useSelector((state) => state.wcreducer);

  useFocusEffect(
    useCallback(() => {
      dispatch({
        type: "Session",
        data: {
          Loader: false,
          StopAction: false,
        },
      });
      // }
    }, [])
  );
  // console.log("dsadpksajdhdjk ",Loader)

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        setShow({})
        props.navigation.goBack()
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  const dispatch = useDispatch();

  useFocusEffect(useCallback(() => {
    var data = getcurrensession_WC2()
    console.log('dataOngetcurrensession_WC2', JSON.stringify(data, null, 2))
    setAll_data(data)
    dispatch({
      type: "Session",
      data: {
        All_Session: data
      },
    });
    setTimeout(() => {
      setLoading(false)
    }, 2000);
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  }, [props?.route?.params?.from]))

  const Logout = async (val, bool) => {
    try {
      // setLoading(true)
      console.error("edsahdaskdas", Show.topic, connector);
      connector.disconnectSession({
        topic: Show.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
      setLoading(true)
      setTimeout(() => {
        props.navigation.navigate("WalletConnect", { from: "logout" });

      }, 2000);
      setShow({})

      Toastfn(
        `Session Disconnected`
      );
      // dispatch({
      //   type: "initial",
      // });
      // SetWallet({});
    } catch (e) {
      console.error("edsahdaskdas", Show.topic, e);
      connector.core.pairings.disconnect({
        topic: Show.topic
      })
    }
  };
  const Current_Network_detail = CHAIN_INFO.filter(
    (it) => it.currency == Session?.lp?.currency
  )?.pop();
  // console.log("!isEmpty(Connected)",Loader);
  const current_chain = (chainId) => CHAIN_INFO.filter(
    (it) => it.chainId == chainId
  )?.pop();

  const current_walletname = (walletaddress) => wallet.filter(it => it.walletaddress == walletaddress)?.pop()?.walletname


  return (
    isEmpty(Show) ?

      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
        }}
      >
        <ImageBackground
          source={theme.theme === "dark" ? Images.background :Images.backgroundWhite}
          style={{
            width: windowWidth,
            height: windowheight,
            
          }}
          resizeMode="cover"
        >
        <Header name={"WalletConnect"} leftImage={"customBack"} />
        <View>
          <View
            style={{ marginVertical: 20, width: "90%", alignSelf: "center" }}
          >
            <Text
              style={{
                color: theme.theme==="dark"?"white":"black",
                fontFamily: Fonts.Medium,
                width: "100%",
                textAlign: "center",
                marginTop: 20
              }}
            >
              Connect your wallet with WalletConnect to make traansaction
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                marginTop: "5%",
                            width: "80%",
                            height: 49,
                            backgroundColor:
                              theme.theme === "dark" ? "#FFF600" : "#612CD2",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            border: 2,
                            borderRadius: 2,
              }}
              onPress={() => {
                props.navigation.navigate("ScanAddress", {
                  path: "WalletConnect",
                });
              }}
            >
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontFamily: Fonts.Regular,
                  color:
                    theme.theme === "light"
                      ? "#ffffff"
                      : "black",
                  fontSize: RFPercentage(2),
                }}
              >
                {" "}
                {"Connect wallet"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={{ marginBottom: 20 }}>
          {Loading ? (
            <ActivityIndicator size={"small"} />
          ) : (

            All_data?.map((item, index) => {
              return (
                <>
                  <Card
                    style={{
                      width: "85%",
                      marginTop: "5%",
                      alignSelf: "center",
                      borderWidth: 2,
                      borderColor: "rgba(162, 121, 250, 0.30)",
                      paddingVertical: "1%",
                      borderRadius: 5,
                      justifyContent: "space-evenly",
                      paddingVertical: "5%",
                      marginBottom: 5,
                      backgroundColor: theme.theme == "dark" ? "rgba(155, 124, 220, 0.15)" : "rgba(155, 124, 220, 0.15)"
                    }}
                    key={Math.random()}
                  >
                    <View
                      style={{
                        //   width: "90%",
                        //   alignSelf: "center",
                        //   paddingVertical: "2.5%",
                        //   borderWidth: 1,
                        //   borderColor: "black",
                        //   borderRadius: 5,
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          width: 60,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          source={{
                            uri: item?.peer?.metadata?.icons[0],
                          }}
                          style={{ height: 40, width: 40 }}
                        />
                        {/* {Current_Network_detail?.img} */}
                        {/* style={{ width: 40, height: 40 }}
              /> */}
                      </View>
                      <View style={{ width: (Dimensions.get('window').width * 0.85) - 140, justifyContent: "center" }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Bold,
                            fontSize: 16,
                            color: theme.theme==="dark"?"white":"black",
                            marginLeft: 10,
                            marginRight: 10
                          }}
                        >
                          {item?.peer?.metadata?.name}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: 14,
                            color: "#612CD2",
                            marginLeft: "5%",
                            marginTop: "1%",
                            width: "90%",
                          }}
                        >
                          {(item?.namespaces?.eip155.accounts[0]?.split(':')[2]).substr(0, 20).concat('....')}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: 50,
                          // alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* <Image
                    source={{
                      uri: item?.peer?.metadata?.icons[0],
                    }}
                    style={{ height: 40, width: 40 }}
                  /> */}
                        {current_chain(item?.namespaces?.eip155.accounts[0]?.split(':')[1])?.img}

                      </View>
                      <TouchableOpacity onPress={() => setShow(item)}
                        style={{
                          width: 50,
                          // alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon
                          name="arrow-right"
                          type="entypo"
                          style={{
                            alignSelf: "center",
                          }}
                          color={theme.theme==="dark"?"white":"black"}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                  </Card>

                </>
              );
            })

          )}
        </ScrollView>
        </ImageBackground>
      </View>
      :
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={theme.theme === "dark" ? Images.background :Images.backgroundWhite}
          style={{
            width: windowWidth,
            height: windowheight,
            
          }}
          resizeMode="cover"
        >
        <Surface style={appBarStyle.headerStyle}>
          <View style={appBarStyle.leftImgView}>
            <TouchableOpacity onPress={() => setShow({})} style={{ padding: 8 }}>
              <Icon
                name="close"
                type="antDesign"
                style={{
                  alignSelf: "center"
                }}
                color={theme.theme==="dark"?"white":"black"}
                size={20}
              />
            </TouchableOpacity>

            <Text style={appBarStyle.largeFont}>{"WalletConnect"}</Text>


          </View>

        </Surface>
        <ScrollView>
          <Card
            style={{
              width: "85%",
              marginTop: "5%",
              alignSelf: "center",
              borderWidth: 2,
              borderColor: "rgba(162, 121, 250, 0.30)",
              flexDirection: "row",
              paddingVertical: "7%",
              borderRadius: 5,
              backgroundColor:  theme.theme == "dark" ? "rgba(155, 124, 220, 0.15)" : "rgba(155, 124, 220, 0.15)",

              // justifyContent: "center",
              // alignContents:'center',
              // alignItems:'center',

            }}
          >
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: '5%', marginVertical: '5%',
                // paddingVertical:'5%',
                // paddingHorizontal:'5%'

              }}
            >
              <Image
                source={{
                  uri:
                    Show?.peer?.metadata?.icons[0] ??
                    Show?.metadata?.icons[0],
                }}
                style={{ height: 40, width: 40 }}
              />
              {/* </View> */}

              {/* <View style={{ alignItems:'center',width:'90%'}}> */}
              <Text
                style={{
                  fontFamily: Fonts.Medium,
                  fontSize: 17,
                  color: theme.theme==="dark"?"white":"black",
                  marginTop: 20,
                  fontWeight:"bold"
                  // marginVertical:'3%'
                  // alignItems:'center'
                }}
              >
                {" "}
                {Show?.peer?.metadata?.name}{" "}
                {" "}
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.Medium,
                  fontSize: 14,
                  marginTop: 10,
                  color: "#612CD2",
                  // flexWrap:'wrap'
                }}
              >
                {" "}
                {Show.peer?.metadata?.description}
              </Text>
            </View>

          </Card>

          <Card
            style={{
              width: "85%",
              marginTop: "5%",
              alignSelf: "center",
              borderWidth: 0.5,
              borderColor: "rgba(162, 121, 250, 0.30)",
              paddingVertical: "1%",
              borderRadius: 5,
              justifyContent: "space-evenly",
              backgroundColor: theme.theme == "dark" ? "rgba(155, 124, 220, 0.15)" : "rgba(155, 124, 220, 0.15)"

            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                paddingHorizontal: "5%",
                paddingVertical: "5%",
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.Medium,
                  fontSize: 16,

                  color: theme.theme==="dark"?"white":"black",
                }}
              >
                Expiry In
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.Medium,
                  fontSize: 16,
                  color: "#612CD2"

                }}
              >
                {timeformat(
                  Number(Show?.expiry) * 1000
                )}
              </Text>
            </View>
            <Image
                    style={{
                      width: "100%",
                      height: 1,
                      marginBottom: 2,
                      marginTop: 2,
                      alignSelf: "center",
                    }}
                    source={require("../../assets/img/devider.png")}
                    resizeMode="cover"
                  />
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: "5%",
                width: "100%",
                paddingHorizontal: "5%",
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.Medium,
                  fontSize: 16,

                  color:  theme.theme==="dark"?"white":"black",
                }}
              >
                Wallet
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.Medium,
                  fontSize: 16,
                  color:  "#612CD2"
                }}
              >
                {current_walletname(Show?.namespaces?.eip155.accounts[0]?.split(':')[2])}
              </Text>
            </View>
          </Card>

          <Card
            style={{
              width: "85%",
              marginTop: "5%",
              alignSelf: "center",
              borderWidth: 0.5,
              borderColor: "rgba(162, 121, 250, 0.30)",
              paddingVertical: "1%",
              borderRadius: 5,
              justifyContent: "space-evenly",
              paddingVertical: "5%",
              backgroundColor:theme.theme == "dark" ? "rgba(155, 124, 220, 0.15)" : "rgba(155, 124, 220, 0.15)"

            }}
          >
            <View
              style={{
                width: "100%",
                alignSelf: "center",
                paddingVertical: "2.5%",
                borderRadius: 5,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: 60,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* <Image
         source= */}
                {current_chain(Show?.namespaces?.eip155.accounts[0]?.split(':')[1])?.img}
                {/* style={{ width: 40, height: 40 }}
       /> */}
              </View>
              <View style={{ width: (Dimensions.get('window').width * 0.90) - 70, justifyContent: "center" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Bold,
                    fontSize: 16,
                    color:   theme.theme==="dark"?"white":"black",
                    marginLeft: "5%",
                    fontWeight:"bold"
                  }}
                >
                  {current_chain(Show?.namespaces?.eip155.accounts[0]?.split(':')[1])?.currency}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: Fonts.Regular,
                    fontSize: 14,
                    color: "#612CD2",
                    marginLeft: "5%",
                    marginTop: "1%",
                    width: "90%",
                  }}
                >
                  {(Show?.namespaces?.eip155.accounts[0]?.split(':')[2])}

                </Text>
              </View>
            </View>
          </Card>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
            marginBottom: 20

          }}>
            <TouchableOpacity
              style={{
                marginTop: "5%",
                            width: "85%",
                            height: 49,
                            backgroundColor:
                              theme.theme === "dark" ? "#FFF600" : "#612CD2",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            border: 2,
                            borderRadius: 2,
              }}
              onPress={() => {
                Logout();
              }}
            >
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontFamily: Fonts.Regular,
                  color:
                    theme.theme === "light"
                      ? "#ffffff"
                      : "black",
                  fontSize: RFPercentage(2),
                }}
              >
                Disconnect
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </ImageBackground>
      </View>
  );
};
export default WalletConnects;

const style = (theme) =>
  StyleSheet.create({
    headerStyle: {
      height: 55,
      // elevation: 4,
      // borderBottomWidth: 0.2,
      // width:200,
      justifyContent: "space-between",
      alignItems: "center",
      // alignContent:'center',
      flexDirection: "row",
      backgroundColor:"transparent",
      boxShadow: 0,
      paddingTop: 20
    },
    largeFont: {
      color: theme.theme==="dark"?"white":"#612CD2",
      fontFamily: Fonts.Bold,
      fontSize: RFPercentage(2.75),
      flex: 1,
      textAlign: "center",
      marginLeft: -10,
      fontWeight:"bold"
    },
    leftImgView: {
      flexDirection: "row",
      marginHorizontal: 20,
      justifyContent: "space-between",
      alignItems: "center",
    },
    rightImgView: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    InrView: {
      backgroundColor: Colors.PRIMARY,
      width: 50,
      height: 30,
      alignSelf: "center",
      borderRadius: 5,
      justifyContent: "center",
    },
    InrTxt: {
      alignSelf: "center",
      color: Colors.primaryColor,
    },
    container: {
      flex: 1,
      backgroundColor: theme.theme == "dark" ? "#000" : "#fff",
    },
    seperatorLine: {
      height: 0.5,
      backgroundColor: "grey",
    },
  });
