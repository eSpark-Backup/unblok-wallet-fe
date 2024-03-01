import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
  } from "react";
  import { WebView } from "react-native-webview";
  import {
    Dimensions,
    Text,
    View,
    Image,
    ScrollView,
    TextInput,
    Pressable,
    Animated,
    NativeModules,
    ActivityIndicator,
    ToastAndroid,
    AppState,
    SafeAreaView,
    ImageBackground,
    StatusBar,
    StyleSheet,
  } from "react-native";
  import { windowheight, windowWidth } from "../../utils/Dimensions";
  import { Fonts } from "../../utils/Fonts";
  import { RFValue } from "react-native-responsive-fontsize";
  import themeContext from "../../utils/themeContext";
  import { Switch } from "react-native-switch";
  import Header from "../../Components/Header";
  import EthLogo from "../../assets/img/Ethereum.svg";
  import axios from "axios";
  import { ApiConstants, envname } from "../../api/ApiConstants";
  import { useFocusEffect } from "@react-navigation/native";
  import ApiClient from "../../api/ApiClient";
  import getRealm from "../../localDb/RealmConfig";
  import { getProfileFunc } from "../OtherPages/common/Edit_Profile";
  import { useSelector } from "react-redux";
  import TokenClient from "../../api/TokenClient";
  import { Images } from "../../utils/Images";
  
  const Earnscreen = () => {
    const theme = useContext(themeContext);
    const { ApiModule } = NativeModules;
    const [claimAmount, setClaimAmount] = useState(0);
    const [rewartData, setRewardData] = useState([]);
    const [walletData, setWalletData] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const [mail, setMail] = useState("");
    const [load, setLoad] = useState(false);
    const [transactionList, seTransactionList] = useState([]);
    const style = styles(theme);
    const wallet = useSelector(
      (state) => state.selectedCurrencyListReducer.selectedList
    );
  
    // useFocusEffect(
    //     useCallback(() => {
    //         getAllTransactios()
    //     }, [])
    // )
  
    // useEffect(() => {
    //     getRewardDetails()
    // }, [])
  
    // useFocusEffect(
    useEffect(() => {
      getRealm()
        .then((realm) => {
          var getMail = realm.objects("loginStatus")
          var walletData = realm.objects("Wallet_array");
  
          setWalletData(walletData)
          setMail(getMail[0].mail)
          getRewardDetails(getMail[0].mail)
          getAllTransactios(getMail[0].mail)
  
          getProfileFunc(getMail[0].mail)
            .then((val) => {
              setUserDetails(val.data.data)
            })
            .catch((err) => {
              console.log("errro on use", err);
            })
        })
        .catch((err) => {
          console.log("error on getRealm daopp", err);
        })
    }, [])
    //   )
  
    // console.log('walletwallet', JSON.stringify(wallet, null, 2))
    const getRewardDetails = async (mail) => {
      try {
        // var url = envname === "local" ? `http://200.140.70.44:2002/v1/user/getRewardDetails` : "https://nftdemo3.maticz.com/api/v1/getRewardDetails";
        // console.log("url", url);
        var resp = await axios.get(getRewardDetailsUrl, { params: { gmail: mail } });
console.log('resp.data', JSON.stringify(resp.data, null, 2))
  
        if (resp.data.success) {
          setRewardData(resp.data.data)
          var respp = resp.data.data
          var amount = 0

                var retVal = respp.map((val) => {
          
                    var input = val.rewardAmtcredit
                    // var input = web3utils.fromWei(val.rewardAmtcredit);
          console.log("input", input);
          amount = amount + parseFloat(input)
          })
          setClaimAmount(convert(amount) ?? 0)
          console.log("amount", convert(amount));
        }
        console.log("resssssss", resp.data);
      } catch (error) {
        console.log("ererer on getRewardDetails", error);
      }
    
    }
  
    const [tabs, setTabs] = useState({
      enable: true,
      transaction: false,
    })
    const {
        enable,
        transaction
    } = tabs
    const [keyboard, setKeyboard] = useState(false)
    const [crptoearn, setCrptoearn] = useState(false)
    const [appState, setAppState] = useState("")
    const enblefn = (value) => {
      if (value != "enable") {
        setTabs((prevstate) => ({
          ...prevstate,
          ["enable"]: false,
          ["transaction"]: true
        }))
        console.log("Disabled")
        }
        else {
        console.log("Enabled")
        setTabs((prevstate) => ({
          ...prevstate,
          ["enable"]: true,
          ["transaction"]: false
        }))
      }
    
    }
  
    useFocusEffect(
      useCallback(() => {
        ApiModule.isKeyboardEnabled(enabled => {
          setKeyboard(enabled)
          // ApiModule.openInputMethodPickerAndNavigate();
        });
      }, [appState])
    )
  
    const _handleAppStateChange = (nextAppState) => {
      console.log("nextAppState", nextAppState);
      setAppState(nextAppState)
    };
  
    //for handling app state
    useEffect(() => {
      AppState.addEventListener("change", _handleAppStateChange);
      return () => {
        AppState.removeEventListener("change", _handleAppStateChange);
      };
    }, []);
  
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  
    const onClaimClick = async () => {
      setLoad(true)
      var findWallet = walletData.find((val) => val.wallets[0].walletaddress == userDetails.primaryWallet)
      console.log('findWallet', JSON.stringify(findWallet, null, 2))
      try {
        var params = {
          walletaddress: findWallet.wallets[0].walletaddress ?? wallet[0].walletaddress,
          privKey: findWallet.wallets[0].privKey ?? wallet[0].privKey,
          amount: claimAmount,
          rewardAddress: findWallet.wallets[0].walletaddress ?? wallet[0].walletaddress,
          gmail: mail
            }
        console.log("params", params);
        var resp = await TokenClient.post(ApiConstants.claimReward, params)
        if (resp.data?.data == "confirm") onSuccesClaim();
        else {
          setLoad(false)
          ToastAndroid.showWithGravityAndOffset(
            "Error on contract",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        }
        console.log("resssssssss", resp.data);
      } catch (error) {
        console.log("errrrrrrr on onclice claim", error);
      }
    }
  
    const onSuccesClaim = async () => {
      try {
        var url = envname === "local" ? `http://200.140.70.44:2002/v1/user/ ` : "https://nftdemo4.maticz.com/api/v1/setRewardAmountAfterClaim";
        console.log("url", url);
        var resp = await axios.post(setRewardAmountAfterClaim, { rewardDatas: rewartData });
console.log("resprespresp", resp);
        if (resp.data.data == "success") {
          setLoad(false); getRewardDetails(); getAllTransactios();
        ToastAndroid.showWithGravityAndOffset(
                    "Claimed successfully",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
            }
            else {
          setLoad(false)
          ToastAndroid.showWithGravityAndOffset(
            "Claimed but Got error on show",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        }
      } catch (error) {
        console.log("ererer on getRewardDetails", error);
      }
    }
  
    const getAllTransactios = async (mailAddress) => {
      var params = { gmail: mailAddress ?? mail }
      var resp = await TokenClient.get(ApiConstants.getAllTranscations, { params })
      // console.log('resp.datafAsfas', JSON.stringify(resp.data, null, 2))
      seTransactionList(resp.data?.data)
    }
  
    // console.log('userDetails', JSON.stringify(userDetails, null, 2))
    // console.log('wallettetetedata', JSON.stringify(walletData, null, 2))
  
    return (
      <SafeAreaView style={style.container}>

            <View style={{ justifyContent: "flex-start" }}>
              <ImageBackground
                source={theme.theme === "dark" ? Images.background : Images.backgroundWhite}
                style={{
                  width: windowWidth,
                  height: windowheight,
                  paddingTop: StatusBar.windowheight,
                }}
                resizeMode="cover"
              >
                {/* <Header name={`Earn Crypto`} leftImage={"customBack"} /> */}
  
                <Header name={`Earn Crypto`} leftImage={"back"} />
  
              <View
                  style={{ height: "25%", alignItems: "center",}}
                >
                  <View
                    style={{
                      width: "85%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderColor: "rgba(162, 121, 250, 0.30)",
                      borderWidth: 2,
                      borderRadius: 5,
                      backgroundColor: "rgba(155, 124, 220, 0.15)",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.SemiBold,
                        fontSize: RFValue(22),
                        color:  theme.theme === "dark" ? "#fff" : "#000000",
                        marginTop: "5%",
                        textAlign: "center",
                        fontWeight:"bold"
                      }}
                    >
                      {claimAmount == 0 ? "$0.00" : claimAmount}{" "}
                      {/* {rewartData[0]?.CoinName ?? "USD"} */}
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.Regular,
                        fontSize: RFValue(16),
                        color: "#A279FA",
                        marginBottom: "7%",
                        textAlign: "center",
                        marginTop: "2%",
                      }}
                    >
                      Earning Balance
                    </Text>
                  </View>
  
                  <View
                    style={{
                      width: "85%",
                      alignSelf: "center",
                      marginTop: "7.5%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent:"space-between"
                    }}
                  >
                    <View style={{}}>
                      <EthLogo
                        height={35}
                        width={35}
                        style={{ alignSelf: "center" }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "85%",
                      }}
                    >
                      <View style={{}}>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFValue(12),
                            color: theme.theme === "dark" ? "#fff" : "#000000",
                            fontWeight:"bold"
                          }}
                        >
                          Wrapped Ethereum
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFValue(12),
                            color: "gray",
                          }}
                        >
                          WETH
                        </Text>
                      </View>
                      <View style={{ justifyContent: "center" }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFValue(12),
                            color: "gray",
                          }}
                        >
                          {claimAmount}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
<View style={{alignSelf:"center",width: "85%",}}>
{load ? (
                    <Pressable>
                      <View
                        style={{
                          marginTop: "5%",
                          height: 49,
                          width: "100%",
                          backgroundColor:
                          theme.theme === "dark" ? "yellow" : "#612CD2",
                          alignContent: "center",
                          alignItems: "center",
                          justifyContent: "center",
                          border: 1,
                          borderRadius: 1.76,
                          marginBottom: 10,
                        }}
                      >
                        {/* <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(12), color: theme.text, textAlign: "center" }}>Collect</Text> */}
                        <ActivityIndicator
                          size={"small"}
                          color={theme.theme==="dark"?"black":"white"}
                          style={{ alignSelf: "center" }}
                        />
                      </View>
                    </Pressable>
                  ) : (
                    <Pressable onPress={() => onClaimClick()}>
                      <View
                        style={{
                          marginTop: "5%",
                          width: "100%",
                          height: 49,
                          backgroundColor:
                            theme.theme === "dark" ? "yellow" : "#612CD2",
                          // alignContent: "center",
                          // alignItems: "center",
                          justifyContent: "center",
                          border: 1,
                          borderRadius: 2,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Fonts.Bold,
                            fontSize: RFValue(16),
                            color: theme.theme === "light" ? "#fff" : "#000000",
                            textAlign: "center",
                          }}
                        >
                          Collect
                        </Text>
                      </View>
                    </Pressable>
                  )}
</View>
<Image
            style={{
              width: "100%",
             marginVertical:"5%",
              alignSelf: "center",
            }}
            source={require("../../assets/img/devider.png")}
            resizeMode="contain"
          />      
                  
                 
                
                <View style={{ height: "65%" }}>
                  {/* <View style={{ width: "90%", alignSelf: "center", flexDirection: "row", justifyContent: "space-around" }} >
  
                      <Pressable onPress={() => enblefn("enable")} style={{ width: "40%", }} >
                          <Text style={{ fontFamily: enable ? Fonts.Medium : Fonts.Regular, fontSize: RFValue(13), color: theme.text, textAlign: "center", paddingVertical: "8%" }}>Enable</Text>
                          {enable &&
                              <View style={{ width: "100%", height: 2, backgroundColor: theme.text }} />}
                      </Pressable>
  
                      <Pressable onPress={() => enblefn("transaction")} style={{ width: "40%", }} >
                          <Text style={{ fontFamily: transaction ? Fonts.Medium : Fonts.Regular, fontSize: RFValue(13), color: theme.text, textAlign: "center", paddingVertical: "8%" }}>Transactions</Text>
                          {transaction &&
                              <View style={{ width: "100%", height: 2, backgroundColor: theme.text }} />}
                      </Pressable>
                  </View> */}


                  <View
                    style={{
                      width: "85%",
                      alignSelf: "center",
                      justifyContent: "space-around",
                      flexDirection: "row",
                      flexDirection:"column"
                    }}
                  >
                    
          <View style={{flexDirection:"row", width: "100%",
                      alignSelf: "center",
                      justifyContent: "space-around",}}>
                    <Pressable
                      onPress={() => {
                        enblefn("enable")
                      }}
                      key={Math.random()}
                      style={{
                        width: "48%",
                        backgroundColor:
                        enable
                            ? "#612CD2"
                            : theme.theme == "dark"
                            ? "rgba(226, 226, 226, 0.15)"
                            : "rgba(226,226, 226, 0.15)",
                        paddingVertical: "3.5%",
                        justifyContent: "center",
                        borderRadius: 5,
                        borderColor:  enable
                        ? "rgba(162, 121, 250, 0.30)"
                        : theme.theme == "dark"
                        ? "rgba(226, 226, 226, 0.30)"
                        : "rgba(197, 197, 197, 0.30)",
                        borderWidth: 2,
                      }}
                    >
                      <Text
                        style={{
                          color:enable
                          ? "white": theme.theme == "dark" ? "#696969" : "#696969",
                          textAlign: "center",
                          fontFamily:
                          enable ? Fonts.Regular : Fonts.Regular,
                          fontSize: RFValue(12),
                        }}
                      >
                        Enable
                      </Text>
                    </Pressable>
  
                    <Pressable
                      onPress={() => {
                        enblefn("transaction")
                      }}
                    
                      key={Math.random()}
                      style={{
                        width: "48%",
                        backgroundColor:
                        transaction
                            ? "#612CD2"
                            : theme.theme == "dark"
                            ? "rgba(226, 226, 226, 0.15)"
                            : "rgba(226,226, 226, 0.15)",
                        paddingVertical: "3.5%",
                        justifyContent: "center",
                        borderRadius: 5,
                        borderColor: transaction
                        ? "rgba(162, 121, 250, 0.30)"
                        : theme.theme == "dark"
                        ?  "rgba(226, 226, 226, 0.30)"
                        : "rgba(197, 197, 197, 0.30)",
                        borderWidth: 2,
                      }}
                    >
                      <Text
                        style={{
                          color: transaction
                          ? "white": theme.theme == "dark" ? "#696969" : "#696969",
                          textAlign: "center",
                          fontFamily:
                          transaction ? Fonts.Regular : Fonts.Regular,
                          fontSize: RFValue(12),
                        }}
                      >
                        Transactions
                      </Text>
                    </Pressable>
                  </View>
</View>
  
                  <View style={{ height: "70%", marginVertical: "2.5%",marginTop:"10%" }}>
                    {enable && (
                      <>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: "82%",
                            alignSelf: "center",
                            justifyContent: "space-between",
                            marginTop: "5%",
                          }}
                        >
                          <View
                            style={{
                              justifyContent: "center",
                              alignSelf: "center",
                              // paddingHorizontal: "5%",
                              paddingVertical: "2.5%",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: Fonts.Regular,
                                fontSize: RFValue(13),
                                color:  theme.theme === "dark" ? "#fff" : "#000000",
                                textAlign: "center",
                              }}
                            >
                              Keyboard 3.0
                            </Text>
                          </View>
                          <Switch
                            onValueChange={(val) => {
                              setKeyboard(val);
                              ApiModule.openInputMethodPickerAndNavigate();
                            }}
                            value={keyboard}
                            disabled={false}
                            activeText={"On"}
                            inActiveText={"Off"}
                            circleSize={20}
                            barHeight={15}
                            circleBorderWidth={0}
                          
                            backgroundActive={theme.theme === "dark" ? "#fff" : "#c5acfa"}
                            backgroundInactive={theme.theme === "dark" ? "#fff" : "#c5acfa"}
                            circleActiveColor={"#612CD2"}
                            circleInActiveColor={"#612CD2"}
                            changeValueImmediately={true}
                            innerCircleStyle={{
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            renderActiveText={false}
                            renderInActiveText={false}
                            switchLeftPx={2.5}
                            switchRightPx={2.5}
                            switchWidthMultiplier={1.5}
                            switchBorderRadius={30}
                          />
                        </View>
                        <Image
            style={{
              width: "85%",
              // height: 1.5,
              marginTop:"2%",
              marginLeft:"3%",
              alignSelf: "center",
            }}
            source={require("../../assets/img/deviderPNG.png")}
            resizeMode="contain"
          />
                        <View
                          style={{
                            flexDirection: "column",
                            alignItems: "center",
                            width: "82%",
                            alignSelf: "center",
                            paddingVertical: "2.5%",
                            justifyContent: "space-between",
                            marginVertical: "2%",
                            
                          }}
                        >
                          <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%',marginBottom:"5%"}}>
                          <View
                            style={{
                              justifyContent: "center",
                              alignSelf: "center",
                              // paddingHorizontal: "5%",
                              // paddingVertical: "2.5%",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: Fonts.Regular,
                                fontSize: RFValue(13),
                                color:keyboard===false?"gray":  theme.theme === "dark" ? "#fff" : "#000000",
                                textAlign: "center",
                              }}
                            >
                              Exchange Data for Crypto
                            </Text>
                          </View>
                          <Switch
                            onValueChange={(val) => {
                              setCrptoearn(!crptoearn); // Update the state
                              if (val) {
                                ApiModule.sendKeyword(val);
                              } else {
                                ApiModule.sendKeyword(val);
                              }
                            }}
                            value={crptoearn}
                            disabled={keyboard===false?true:false}
                            activeText={"On"}
                            inActiveText={"Off"}
                            circleSize={20}
                            barHeight={15}
                            circleBorderWidth={0}
                            backgroundActive={keyboard===false?"gray": theme.theme === "dark" ? "#fff" : "#c5acfa"}
                            backgroundInactive={keyboard===false?"gray": theme.theme === "dark" ? "#fff" : "#c5acfa"}
                            circleActiveColor={keyboard===false?"gray": "#612CD2"}
                            circleInActiveColor={keyboard===false?"#272138": "#612CD2"}
                            changeValueImmediately={true}
                            innerCircleStyle={{
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            renderActiveText={false}
                            renderInActiveText={false}
                            switchLeftPx={2.5}
                            switchRightPx={2.5}
                            switchWidthMultiplier={1.5}
                            switchBorderRadius={30}
                          />
                          </View>
                          <View style={{width:'100%'}}>
                       <Image
            style={{
              width: "100%",
              height: 2.09,
              marginTop:"2%",
              
            }}
            source={require("../../assets/img/deviderPNG.png")}
            resizeMode="contain"
          />
                       </View>
                        </View>
                      
                      </>
                    )}
  
                    {transaction && (
                      <>
                        {transactionList.length != 0 ? (
                          <ScrollView showsVerticalScrollIndicator={false}>
                            {transactionList.map((e) => (
                              <View
                                style={{
                                  width: "87.5%",
                                  alignSelf: "center",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingVertical: "2%",
                                  marginVertical: "3%",
                                }}
                              >
                                <View style={{ width: "15%" }}>
                                  <Image
                                    source={require("../../assets/img/nft4.jpg")}
                                    style={{
                                      width: 35,
                                      height: 35,
                                      alignSelf: "center",
                                      borderRadius: 999,
                                    }}
                                  />
                                  {/* <EthLogo height={35} width={35} style={{ alignSelf: "center" }} /> */}
                                </View>
                                <View style={{ width: "60%" }}>
                                  <Text
                                    style={{
                                      fontFamily: Fonts.Regular,
                                      fontSize: RFValue(12),
                                      color: theme.text,
                                      marginLeft: "2%",
                                    }}
                                    numberOfLines={1}
                                  >
                                    {e.transactionHash}
                                  </Text>
                                  <Text
                                    style={{
                                      fontFamily: Fonts.Regular,
                                      fontSize: RFValue(11),
                                      color: "gray",
                                      marginLeft: "2%",
                                      marginTop: "2%",
                                    }}
                                  >
                                    {new Date(e.createdAt).toUTCString()}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    width: "25%",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontFamily: Fonts.Regular,
                                      fontSize: RFValue(12),
                                      color: "gray",
                                      textAlign: "right",
                                    }}
                                  >
                                    as
                                  </Text>
                                </View>
                              </View>
                            ))}
                          </ScrollView>
                        ) : (
                          <View
                            style={{
                              height: "100%",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{ color: theme.text, fontSize: RFValue(13) }}
                            >
                              You have no transactions!{" "}
                            </Text>
                          </View>
                        )}
                      </>
                    )}
                  </View>
                </View>
              </ImageBackground>
            </View>
        
      </SafeAreaView>
    );
  };
  
  export default Earnscreen;
  const styles = (theme) =>
    StyleSheet.create({
      container: {
        width: "100%",
        height: "100%",
        backgroundColor: theme.background,
      },
      seperatorLine: {
        marginTop: "3%",
      },
      dapp: {
        resizeMode: "contain",
        height: windowheight * 0.0625,
        width: windowWidth * 0.0625,
        aspectRatio: 0.65,
      },
      voice: {
        resizeMode: "contain",
        height: windowheight * 0.0435,
        width: windowWidth * 0.0435,
        aspectRatio: 0.65,
      },
      wallet: {
        resizeMode: "contain",
        height: windowheight * 0.06,
        width: windowWidth * 0.06,
        aspectRatio: 0.65,
      },
      word: {
        resizeMode: "contain",
        height: windowheight * 0.06,
        width: windowWidth * 0.06,
        aspectRatio: 0.65,
      },
      clipboard: {
        resizeMode: "contain",
        height: windowheight * 0.06,
        width: windowWidth * 0.06,
        aspectRatio: 0.65,
      },
      theme: {
        resizeMode: "contain",
        height: windowheight * 0.06,
        width: windowWidth * 0.06,
        aspectRatio: 0.65,
      },
      wallet1: {
        resizeMode: "contain",
        height: windowheight * 0.065,
        width: windowWidth * 0.065,
        aspectRatio: 0.65,
      },
      preference: {
        resizeMode: "contain",
        height: windowheight * 0.048,
        width: windowWidth * 0.048,
        aspectRatio: 0.65,
      },
      faq: {
        resizeMode: "contain",
        height: windowheight * 0.06,
        width: windowWidth * 0.06,
        aspectRatio: 0.65,
      },
      aboutus: {
        resizeMode: "contain",
        height: windowheight * 0.05,
        width: windowWidth * 0.05,
        aspectRatio: 0.65,
      },
      notification: {
        resizeMode: "contain",
        height: windowheight * 0.05,
        width: windowWidth * 0.05,
        aspectRatio: 0.65,
      },
      security: {
        resizeMode: "contain",
        height: windowheight * 0.05,
        width: windowWidth * 0.05,
        aspectRatio: 0.65,
      },
      importwallet: {
        resizeMode: "contain",
        height: windowheight * 0.05,
        width: windowWidth * 0.05,
        aspectRatio: 0.65,
      },
      logoutpopup_light: {
        // height:windowheight*0.3,
        alignSelf: "center",
        width: "80%",
        // backgroundColor: theme.blackandwhite,
        backgroundColor: theme.background,
        borderRadius: 10,
        padding: "5%",
      },
      logoutpopup_dark: {
        // height:windowheight*0.3,
        alignSelf: "center",
        width: "80%",
        // backgroundColor: theme.blackandwhite,
        backgroundColor: theme.background,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.texttheme,
        padding: "5%",
      },
    });
  