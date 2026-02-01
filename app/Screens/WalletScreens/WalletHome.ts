import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  BackHandler,
  Image,
  TouchableOpacity,
  AppState,
  TouchableHighlight,
  RefreshControl,
  ImageBackground,
  Dimensions,
  ScrollView,
  Pressable,
  NativeModules,
  StatusBar,
} from "react-native";
import themeContext from "../../utils/themeContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Colors } from "../../utils/Colors";
import SegmentedControl from "../../Components/SegmentedControl";
import { Fonts } from "../../utils/Fonts";
import { Icon as Icn } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { addCurrencyDetails } from "../../Redux/Actions/walletDetailsAction";
import { selectedCurrencyList } from "../../Redux/Actions/selectedcurrencyListAction";
import { selectedTokenList } from "../../Redux/Actions/tokenListAction";
import { fiatData } from "../../Redux/Actions/fiatDataAction";
import { Images } from "../../utils/Images";
import Modal from "react-native-modal";
import { transparent } from "react-native-paper/lib/typescript/styles/colors";
import Close from "../../assets/img/close_icon.svg";
import Buylight from "../../assets/icons/lighttheme/Buy.svg";
import BuyDark from "../../assets/icons/darktheme/Buy.svg";
import Sendlight from "../../assets/icons/lighttheme/Send.svg";
import SendDark from "../../assets/icons/darktheme/Send.svg";
import Receivelight from "../../assets/icons/lighttheme/Receive.svg";
import ReceiveDark from "../../assets/icons/darktheme/Receive.svg";
import WalletLight from "../../assets/icons/lighttheme/Wallet.svg";
import WalletDark from "../../assets/icons/darktheme/Wallet.svg";
import ArrowLight from "../../assets/icons/lighttheme/arrow.png";
import ArrowDark from "../../assets/icons/darktheme/arrow.png";

import Earningslight from "../../assets/icons/lighttheme/earning_light.svg";
import EarningsDark from "../../assets/icons/darktheme/earning_dark.svg";

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  assets_update_function,
  graphData,
  tokenAssetUpdateFunc,
} from "./common/Wallet_Home";
import getRealm from "../../localDb/RealmConfig";
import { ActivityIndicator } from "react-native-paper";
import { addAllcurrency } from "../../Redux/Actions/AllcurrencyAction";
import isEmpty from "../../utils/isEmpty";
import { showImage } from "../../utils/showImage";
import {
  borderRadius,
  borderWidth,
  windowWidth,
  windowheight,
} from "../../utils/Dimensions";
import { Line, Path, SvgUri } from "react-native-svg";
import Preferencelight from "../../assets/icons/lighttheme/Preference 1.svg";
import Preferencedark from "../../assets/icons/darktheme/Preference white.svg";
import Skeletonhome from "../Skeleton/skeletonhome";
import SellLight from "../../assets/icons/lighttheme/Sell Black.svg";
import SellDark from "../../assets/icons/darktheme/Sell White.svg";
import GraphGreen from "../../assets/img/GraphGreen.svg";
import GraphRed from "../../assets/img/GraphRed.svg";
import Backlight from "../../assets/img/arrow-down-crypto.svg";
import BackDark from "../../assets/img/arrow-down-srypto-white.svg";
import Ethereum from "../../assets/icons/darktheme/Ethereum.svg";
import deviderPNG from "../../assets/img/deviderPNG.png";
import Header from "../../Components/Header";
import { AreaChart, Grid } from "react-native-svg-charts";
import TokenClient from "../../api/TokenClient";
import { ApiConstants } from "../../api/ApiConstants";

const _ = require("lodash");

const WalletHome = (props) => {
  //redux

  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [tabs, setTabs] = useState("currencies");
  const [tableData, setTableData] = useState("1h");
  const [refreshing, setRefreshing] = React.useState(false);
  const [IsLoad, setIsLoad] = useState(true);
  const [modalMessage, setModalMessage] = useState("");
  const [modalMessage2, setModalMessage2] = useState("");
  const [walletDetails, setWalletDetails] = useState([]);
  const [tokenArr, setTokenArr] = useState([]);
  const [currencyArr, setCurrencyArr] = useState([]);
  const [defaultCurrency, setDefaultCurrency] = useState("");
  const [walletBal, setWalletBal] = useState(0);
  const [cryptoValue, setCryptoValue] = useState(0);
  const [cryptoPer, setCryptoPer] = useState(0);
  const [walletName, setWalletName] = useState("");
  const [walletCrypto, setWalletcrypto] = useState([]);
  const [walletToken, setWalletToken] = useState([]);
  const [tokenLength, setTokenLength] = useState(0);
  const [skip, setskip] = useState(6);
  const [limit, setLimit] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [skeleton, setSkeleton] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { ApiModule } = NativeModules;
  useEffect(() => {
    setTimeout(() => {
      setSkeleton(true)
    }, 3000)
  }, [])
  // console.log("tokenArr", tokenArr);
  //redux
  const dispatch = useDispatch();
  const setFiatData = (item) => dispatch(fiatData(item));
  const setSelectWalletCurrencies = (item) => dispatch(selectedCurrencyList(item));
  const setSelectWalletTokens = (item) => dispatch(selectedTokenList(item));
  const setWalletDetailsinRedux = (item) => dispatch(addCurrencyDetails(item));
  const setSelectedcurrecyinRedux = (item) => dispatch(addAllcurrency(item))
  const set_my_add = (item) => dispatch(my_add(item))
  const walletDetailsFromRedux = useSelector(
    (state) => state.walletDetailReducer.currencyList
  );
  const [symbol, setSymbol] = useState(walletDetailsFromRedux.currency)
  // console.log("walletDetailsFromRedux",walletDetailsFromRedux)
  const [fiatSymbol, setFiatSymbol] = useState(0);
  const navigation = useNavigation()
  const [ChangePer, setChangePer] = useState(0)
  const [dateList, setDateList] = useState([
    '08-31 15:09',
    '08-31 15:10',
    '08-31 15:11',
    '08-31 15:12',
    '08-31 15:13',
    '08-31 15:14',
    '08-31 15:15',
    '08-31 15:16',
    '08-31 15:17',
    '08-31 15:18',
    '08-31 15:19',
  ]);
  const [priceList, setPriceList] = useState([
    47022.9649875,
    47097.6349875,
    47132.3149875,
    47137.6449875,
    47164.9949875,
    47175.9949875,
    47180.9949875,
    47190.9949875,
    47200.9949875,
    47210.9949875,
    47225.9949875,
  ]);
  const size = useRef(dateList.length);
  // useEffect(() =>{
  //   ApiModule.openWallet(result => {
  //     console.log('Callback::',result)
  //     navigateSecurityPage("WalletHomeBottomTab")
  //         console.log('Callback :',result)
  //        }
  //   )
  //   // ApiModule.openDapp(result => {
  //   //   console.log('Callback::',result)
  //   //   props.navigation.navigate("Signin")
  //   //       console.log('Callback :',result)
  //   //      }
  //   // )
  // },[])
  // console.log("props",props);
  const navigateSecurityPage = async (item) => {
    try {
      getRealm()
        .then((realm) => {
          var passcodeVal = realm.objects("userPasscodeValue");
          var biometricVal = realm.objects("userBiometricStatus");
          // console.log("passcodeVal", passcodeVal);
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

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // BackHandler.goBack()
        navigation.navigate("DappBottomTab");
        return true;
      };
      // Add Event Listener for hardwareBackPress
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        // Once the Screen gets blur Remove Event Listener
        // getPasscodeStatus();
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      setIsLoad(true)
      getWalletData();
      setTabs("currencies")
    }, [])
  )

  // console.log("tokenArr", JSON.stringify(tokenArr, null, 2));
  const getWalletData = () => {
    setIsLoad(true)
    setRefreshing(true);
    // setWalletToken([])
    // setWalletcrypto([])
    getRealm()
      .then(async (realm) => {
        var walletData = realm.objects("Wallet_array");
        // console.log("walletData", JSON.stringify(walletData, null, 2));
        var defaultCurrencyVal = realm.objects("defaultCurrency");
// console.log("defaultCurrencyVal",defaultCurrencyVal)
        setRefreshing(false);

        if (defaultCurrencyVal.length == 0) {
          setDefaultCurrency("USD");
        } else {
          setDefaultCurrency(defaultCurrencyVal[0].defaultCurrency);
        }

        var arr = walletData.filter((item, index) => {
          return item.selected == "true"
        });

        global.walletName = arr[0].walletname
        setWalletDetailsinRedux(arr[0])
        setWalletDetails(arr[0]);
        setSelectedcurrecyinRedux(arr[0])
        setWalletcrypto(arr[0]);

        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        setIsLoad(false)
        setRefreshing(false);
        console.log(err, "wallet data list err from localDb");
      });
  };


  useFocusEffect(
    React.useCallback(() => {
      
      if (global.newWallet == "import") { setModalMessage("Successfully");setModalMessage("imported!"), setModalVisible(false); global.newWallet = "" }
      if (global.newWallet == "create") {  setModalMessage2("Successfully");setModalMessage2("Created!"), setModalVisible(false);  global.newWallet = "" }
    }, [global.newWallet])
  )


  // useFocusEffect(
  //   React.useCallback(() => {
  //     setIsLoad(true)
  //     if (!isEmpty(walletCrypto)) getTokenData();
  //     console.log("isem[ptyytyy", !isEmpty(walletCrypto));
  //   }, [walletCrypto])
  // )

  useEffect(() => {
    setIsLoad(true)
    if (isEmpty(walletCrypto)) getTokenData();
  }, [walletCrypto])

  // console.log("walletCrypto", JSON.stringify(walletCrypto, null, 2));

  const getTokenData = () => {
    getRealm()
      .then(async (realm) => {
      var tokenData = realm.objects("Token_array");
      // console.log("tokenData", JSON.stringify(tokenData, null, 2));
      // console.log("walletCrypto.uniqueKey", walletCrypto.uniqueKey);

      var findWalletArr = tokenData.filter((item) => {
        return item.uniqueKey == walletCrypto.uniqueKey
      })

      // console.log("findWalletArr", JSON.stringify(findWalletArr, null, 2));

      if (findWalletArr.length != 0) {
        setWalletToken(findWalletArr)
        setSelectWalletTokens(findWalletArr);
      } else {
        setWalletToken([])
        setSelectWalletTokens([])
      }
    })
  }

  useFocusEffect(
    React.useCallback(() => {

      if (tabs == "currencies") {
        if (walletCrypto && defaultCurrency) assest_function(walletCrypto);
      } else if (tabs == "tokens") {
        if (walletToken.length > 0 && defaultCurrency) assest_function(walletToken);
      }
      return () => { };
    }, [tabs, walletCrypto, walletToken])
  )

  const assest_function = async (data) => {
    // setIsLoad(true)
    let paramss = {
      walletArr: data,
      defaultCurrency: defaultCurrency
    }
    if (tabs == "currencies") {
      var response_assest = await assets_update_function(paramss);
      setWalletBal(response_assest.totalConvertedValue)
      setWalletName(data.walletname)
      setSelectWalletCurrencies(response_assest.currencies)
      const getGraphData = await graphData(response_assest.currencies)
      setCurrencyArr(getGraphData)
      setIsLoad(false)
    }
    const filteredCurrency = response_assest.currencies.find(
      (currency) => currency.currency === "BTC"
    );
    if (filteredCurrency) {
      const closePrice = filteredCurrency.closePrice;
      const perPrice = filteredCurrency.changePer;
      setCryptoValue(closePrice)
      setCryptoPer(perPrice)
    } else {
      console.log(`Currency ${defaultCurrency} not found in the response.`);
    }
    if (tabs == "tokens") {
      var arrlength = data[0].Tokens.length
      setTokenLength(arrlength);
      // console.log("datatta",data);
      var cutarr = data[0].Tokens.slice(limit, skip)
      // console.log("surtttwtwes",cutarr);
      let params = {
        defaultCurrency: defaultCurrency,
        Tokens: cutarr,
        walletDetails: walletDetails
      }
      // console.log("paramsss", params);
      var token_res = await tokenAssetUpdateFunc(params)
      // console.log("token_res", token_res.data);
      const getGraphData = await graphData(token_res.data.tokens)
      isEmpty(tokenArr) ? setTokenArr(getGraphData ?? []) : setTokenArr(tokenArr.concat(getGraphData ?? []));
      setIsLoad(false)
      setskip(skip + 3)
      setLimit(skip)
    }
  }
  const formattedPrice=(cryptoPrice) => cryptoPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  useEffect(() => {
    getGraphDatas()
  }, [tableData])

  const getGraphDatas = async () => {
    try {
      var getDatas = await TokenClient.get(ApiConstants.getGraphValue, { params: { Symbol: `${symbol}USDT`, interval: tableData, limit: 100 } })
      console.log("getDatas", getDatas.data);
      if (getDatas.data?.success) {
        setDateList(getDatas.data.data.dateArr)
        setPriceList(getDatas.data.data.priceArr)
        setChangePer(getDatas.data.data.changePercentage ?? 0.000)
      }
    } catch (error) {
      console.log("ereree", error);
      console.log("hi")
    }
  
  }
  const apx = (size = 0) => {
    let width = Dimensions.get('window').width;
    return (width / 750) * size;
  };
  const CustomLine = ({ line }) => (
    <Path
      key="line"
      d={line}
      stroke={(tableData == "1h" ? cryptoPer :ChangePer ) < 0 ? "#F45532"
      : "#08c708"}
      strokeWidth={apx(4)}
      fill="none"
    />
  );
  React.useEffect(() => {
    if (theme.theme === "light") {
      StatusBar.setBackgroundColor('#ffffff');
    } else{
      StatusBar.setBackgroundColor('rgb(25,14,47)');
    }
  }, [theme.theme]);
  return (
    <SafeAreaView style={style.container}>
      <ImageBackground
        source={theme.theme === "light" ? Images.backgroundWhite : Images.background}
        style={{
          width: windowWidth,
          height: windowheight,
          paddingTop: StatusBar.windowheight,
        }}
        resizeMode="cover"
      >
        {IsLoad ? (
          <Skeletonhome />
        ) : (
          <>
            {/* <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginLeft: 15,
                marginRight: 20,
                alignItems: "center",
              }}
            >
              <View>
                {theme.theme == "light" ? (
                  <Backlight
                    width={windowWidth * 0.07}
                    height={windowWidth * 0.06}
                    style={{ resizeMode: "contain" }}
                  />
                ) : (
                  <BackDark
                    width={windowWidth * 0.07}
                    height={windowWidth * 0.06}
                    style={{ resizeMode: "contain" }}
                  />
                )}
              </View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate("WalletList")}
              >
                <Text
                  style={{
                    fontSize: RFPercentage(3),
                    color: theme.theme === "dark" ? "#FFF" : "#612CD2",
                    fontFamily: Fonts.Medium,
                    fontWeight:"bold"
                  }}
                >
                  Crypto
                </Text>
              </TouchableOpacity>
             
              <View>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate("TokenList")}
                >
                  {theme.theme == "dark" ? (
                    <Preferencedark width={25} height={25}  />
                  ) : (
                    <Preferencelight width={25} height={25} />
                  )}
                </TouchableOpacity>
              </View>
            </View> */}
                  {/* <Header name={"Crypto"} leftImage={"back"}
        rightImage={"crypto"}
      /> */}
                  <Header name={"Crypto"}
        rightImage={"crypto"}
      />
            <View style={{
              flex: 1,
            }}>

           
            <ScrollView style={{
            // marginBottom:"20%"
          }}>
            <View
              style={{
                width: "90%",
                backgroundColor: "transparent",
                padding: "5%",
                alignSelf: "center",
                marginTop: "2.5%",
              }}
            >
              <View style={{ alignItems: "center", justifyContent: "center",alignSelf:"center" ,marginTop:-15}}>
                <Text
                  style={{
                    fontFamily: Fonts.Bold,
                    fontSize: RFPercentage(3.8),
                    color: theme.theme === "dark" ? "#FFF" : "black",
                    textAlign: "left",
                    fontWeight:"bold"
                  }}
                >
                  {/* {console.log("walletBalwalletBal", walletBal)} */}
                  {defaultCurrency == "USD"
                                        ? "$"
                                        : defaultCurrency == "EUR"
                                        ? "€"
                                        : "£"}
                  {walletBal === 0 ? "0.00" : walletBal?.toFixed(2)}
                </Text>

                {/* <Text style={{
            fontFamily: Fonts.Medium, position: "relative",
            top: -5, color: theme.theme == "light" ? "#8d8c8c" : "#e9e9e9", left: 5
          }}>{defaultCurrency}</Text> */}
                {/* <View style={{ width: "50%", justifyContent: "center", alignItems: "flex-end" }} > */}
                {walletName !== "" ? (
                  <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => props.navigation.navigate("WalletList")}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.Bold,
                        fontSize: RFPercentage(2),
                        color: theme.theme === "dark" ? "#FFF" : "black",
                        marginTop: 5,
                        fontWeight:"bold"
                      }}
                    >
                      {walletName}
                      {/* Main Wallet */}
                      {" "}
                    </Text>
                    {theme.theme == "light" ? (
                  <Backlight
                    width={windowWidth * 0.03}
                    height={windowWidth * 0.025}
                    style={{ resizeMode: "contain",marginTop:"2.5%", fontWeight:"bold", }}
                  />
                ) : (
                  <BackDark
                  width={windowWidth * 0.03}
                  height={windowWidth * 0.025}
                    style={{ resizeMode: "contain",marginTop:"2.5%", fontWeight:"bold",}}
                  />
                )}
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
              </View>
              <View
                  style={{
                    // position: "absolute",
                    // top: 8,
                 alignSelf: "center",
                    padding:8,
                    // borderWidth: 1,
                    borderRadius: 5,
                    // borderColor: "rgba(162, 121, 250, 0.30)",
                    // backgroundColor:theme.theme==="dark"? "rgba(155, 124, 220, 0.15)":"transparent",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    // borderWidth:1
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFPercentage(1.8),
                      color: (tableData == "1h"
                      ? cryptoPer
                      : ChangePer) < 0
                      ? "#F45532"
                      : "#08c708",
                      fontFamily: Fonts.Bold,
                      fontWeight:"bold"
                    }}
                  >
                    
                    {defaultCurrency == "USD"
                                        ? "$"
                                        : defaultCurrency == "EUR"
                                        ? "€"
                                        : "£"}
                     
                {formattedPrice(cryptoValue.toFixed(2))}{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: RFPercentage(1.8),
                      color:
                      (tableData == "1h"
                        ? cryptoPer
                        : ChangePer) < 0
                        ? "#F45532"
                        : "#08c708",
                        fontFamily: Fonts.Bold,
                        fontWeight:"bold"
                    }}
                  >
                    ({tableData == "1h"
                  ? formattedPrice(cryptoPer?.toFixed(2))
                  : formattedPrice(ChangePer?.toFixed(2))}
                %)
                    {/* ({cryptoPer.toFixed(2)}%) */}
                  </Text>
                </View>
              <View
                style={{
                  width: windowWidth * 1.1,
                  marginLeft: windowWidth * -0.2,
                  position: "relative",
                }}
              >
                {/* {theme.theme === "dark" ? (
                  <Image
                    style={{ width: "100%", marginBottom: 20 }}
                    source={require("../../assets/img/graphImage.png")}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    style={{ width: "100%", marginBottom: 20 }}
                    source={require("../../assets/img/graphImage.png")}
                    resizeMode="cover"
                  />
                )} */}
                 <AreaChart
                  style={{ height: 120, position: "relative",}}
                  data={priceList}
                  gridMin={-100}
                  gridMax={120}
                  start={-100}
                  contentInset={{ top: 30, bottom: 30 }}
                  svg={{ fill: "transparent" }}
                >
                  <CustomLine />
                  <Line />
                </AreaChart>
               
              </View>
              <Image
                style={{ width: "100%", marginBottom: 2 }}
                source={require("../../assets/img/devider.png")}
                resizeMode="cover"
              />
              <View
                style={{
                  width: "90%",
                  paddingVertical: "2%",
                  alignSelf: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Pressable
                  onPress={() => setTableData("1h")}
                  style={{
                    paddingVertical: "3.5%",
                    justifyContent: "center",
                    borderRadius: 100,
                  }}
                >
                  <Text
                    style={{
                      color:
                        tableData == "1h"
                          ? "#A279FA"
                          : theme.theme == "dark"
                          ? "#fff"
                          : "#000",
                      textAlign: "center",
                      fontFamily:
                        tableData == "1h" ? Fonts.Medium : Fonts.Regular,
                      fontSize: RFValue(12),
                    }}
                  >
                    1H
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setTableData("1d");
                  }}
                  style={{
                    paddingVertical: "3.5%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color:
                        tableData == "1d"
                          ? "#A279FA"
                          : theme.theme == "dark"
                          ? "#fff"
                          : "#000",
                      textAlign: "center",
                      fontFamily:
                        tableData == "1d" ? Fonts.Medium : Fonts.Regular,
                      fontSize: RFValue(12),
                    }}
                  >
                    1D
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setTableData("1w");
                  }}
                  style={{
                    paddingVertical: "3.5%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color:
                        tableData == "1w"
                          ? "#A279FA"
                          : theme.theme == "dark"
                          ? "#fff"
                          : "#000",
                      textAlign: "center",
                      fontFamily:
                        tableData == "1w" ? Fonts.Medium : Fonts.Regular,
                      fontSize: RFValue(12),
                    }}
                  >
                    1W
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setTableData("1m");
                  }}
                  style={{
                    paddingVertical: "3.5%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color:
                        tableData == "1m"
                          ? "#A279FA"
                          : theme.theme == "dark"
                          ? "#fff"
                          : "#000",
                      textAlign: "center",
                      fontFamily:
                        tableData == "1m" ? Fonts.Medium : Fonts.Regular,
                      fontSize: RFValue(12),
                    }}
                  >
                    1M
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setTableData("all");
                  }}
                  style={{
                    paddingVertical: "3.5%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color:
                        tableData == "all"
                          ? "#A279FA"
                          : theme.theme == "dark"
                          ? "#fff"
                          : "#000",
                      textAlign: "center",
                      fontFamily:
                        tableData == "all" ? Fonts.Medium : Fonts.Regular,
                      fontSize: RFValue(12),
                    }}
                  >
                    All
                  </Text>
                </Pressable>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: "5%",
                  width: "100%",
                  alignSelf: "center",
                  justifyContent: "space-evenly",
                  padding: "2%",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate(
                      "commonRbSheet",
                      (params = "Send")
                    )
                  }
                  style={{
                    width: "30%",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 45,
                      height: 45,
                      borderWidth: 2,
                      borderRadius: 5,
                      borderColor: "rgba(162, 121, 250, 0.30)",
                      backgroundColor: "rgba(155, 124, 220, 0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {theme.theme == "dark" ? (
                      <SendDark
                        width={windowWidth * 0.04}
                        height={windowWidth * 0.04}
                        style={{ resizeMode: "contain" }}
                      />
                    ) : (
                      <Sendlight
                        width={windowWidth * 0.04}
                        height={windowWidth * 0.04}
                        style={{ resizeMode: "contain" }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      fontFamily: Fonts.Regular,
                      fontSize: RFPercentage(2),
                      color: theme.theme == "dark" ? "#fff" : "#000",
                      textAlign: "center",
                      marginTop: "10%",
                    }}
                  >
                    Send
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate(
                      "commonRbSheet",
                      (params = "Receive")
                    )
                  }
                  style={{
                    width: "30%",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 45,
                      height: 45,
                      borderWidth: 2,
                      borderRadius: 5,
                      borderColor: "rgba(162, 121, 250, 0.30)",
                      backgroundColor: "rgba(155, 124, 220, 0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {theme.theme == "light" ? (
                      <Receivelight
                        width={windowWidth * 0.04}
                        height={windowWidth * 0.04}
                        style={{ resizeMode: "contain" }}
                      />
                    ) : (
                      <ReceiveDark
                        width={windowWidth * 0.04}
                        height={windowWidth * 0.04}
                        style={{ resizeMode: "contain" }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      fontFamily: Fonts.Regular,
                      fontSize: RFPercentage(2),
                      color: theme.theme == "dark" ? "#fff" : "#000",
                      textAlign: "center",
                      marginTop: "10%",
                    }}
                  >
                    Receive
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate("commonRbSheet", (params = "Buy"))
                  }
                  style={{
                    width: "30%",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 45,
                      height: 45,
                      borderWidth: 2,
                      borderRadius: 5,
                      borderColor: "rgba(162, 121, 250, 0.30)",
                      backgroundColor: "rgba(155, 124, 220, 0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {theme.theme == "light" ? (
                      <Buylight
                        width={windowWidth * 0.04}
                        height={windowWidth * 0.04}
                        style={{ resizeMode: "contain" }}
                      />
                    ) : (
                      <BuyDark
                        width={windowWidth * 0.04}
                        height={windowWidth * 0.04}
                        style={{ resizeMode: "contain" }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      fontFamily: Fonts.Regular,
                      fontSize: RFPercentage(2),
                      color: theme.theme == "dark" ? "#fff" : "#000",
                      textAlign: "center",
                      marginTop: "10%",
                    }}
                  >
                    Buy
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate(
                      "commonRbSheet",
                      (params = "Sell")
                    )
                  }
                  style={{
                    width: "30%",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 45,
                      height: 45,
                      borderWidth: 2,
                      borderRadius: 5,
                      borderColor: "rgba(162, 121, 250, 0.30)",
                      backgroundColor: "rgba(155, 124, 220, 0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {theme.theme == "light" ? (
                      <SellLight
                        width={windowWidth * 0.04}
                        height={windowWidth * 0.04}
                        style={{ resizeMode: "contain" }}
                      />
                    ) : (
                      <SellDark
                        width={windowWidth * 0.04}
                        height={windowWidth * 0.04}
                        style={{ resizeMode: "contain" }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      fontFamily: Fonts.Regular,
                      fontSize: RFPercentage(2),
                      color: theme.theme == "dark" ? "#fff" : "#000",
                      textAlign: "center",
                      marginTop: "10%",
                    }}
                  >
                    Sell
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => props.navigation.navigate("Earnscreen")}
                  style={{
                    width: "30%",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 45,
                      height: 45,
                      borderWidth: 2,
                      borderRadius: 5,
                      borderColor: "rgba(162, 121, 250, 0.30)",
                      backgroundColor: "rgba(155, 124, 220, 0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {theme.theme == "light" ? (
                      <Earningslight
                        width={windowWidth * 0.05}
                        height={windowWidth * 0.05}
                        style={{ resizeMode: "contain" }}
                      />
                    ) : (
                      <EarningsDark
                        width={windowWidth * 0.05}
                        height={windowWidth * 0.05}
                        style={{ resizeMode: "contain" }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      fontFamily: Fonts.Regular,
                      fontSize: RFPercentage(2),
                      color: theme.theme == "dark" ? "#fff" : "#000",
                      textAlign: "center",
                      marginTop: "10%",
                    }}
                  >
                    Earn
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Image
              style={{ width: "90%", marginBottom: 10, marginTop: 5 }}
              source={require("../../assets/img/devider.png")}
              resizeMode="cover"
            />
            {/* <View style={{
        flexDirection: "row", justifyContent: "space-between", marginLeft: 40, marginRight: 40
        , marginTop: 20
      }}>
        <Text style={{ color: theme.text, fontFamily: Fonts.Medium, fontSize: RFPercentage(2) }}>Activity</Text>
        <TouchableOpacity onPress={() => navigation.navigate("TokenList")}>
          <Text style={{ backgroundColor: "transparent", borderColor: "#65656538", borderWidth: 1, borderRadius: 2 }}>
            <Icn
              name="sound-mix"
              type="entypo"
              style={{
                alignSelf: "center",
                transform: [{ rotate: "90deg" }], padding: 5
              }}
              color={theme.text}
              size={15}
            />
          </Text>
        </TouchableOpacity>

      </View> */}

            <View style={{ flex: 2 }}>
              <View
                style={{
                  alignSelf: "center",
                  justifyContent: "center",
                  paddingHorizontal: 5,
                  borderRadius: 10,
                  backgroundColor: theme.background,
                  // borderWidth: 1, borderColor: theme.phrase,
                  width: "85%",
                  // margin: 10
                }}
              >
                {/* <SegmentedControl
            tabs={["Tokens", "Currencies"]}
            currentIndex={tabIndex}
            onChange={handleTabsChange}
            segmentedControlBackgroundColor={theme.background}
            activeSegmentBackgroundColor={theme.background}
            activeTextColor={"#00B0FF"}
            textColor={theme.text}
            // paddingVertical={12}
            // paddingHorizontal={12}
          /> */}
              </View>

              {/* <View
             style={{
              flexDirection: "row", alignItems: "center", justifyContent: "space-around",
              // borderWidth: 1, borderColor: "#65656538", borderRadius: 5,
              padding: "1.5%", width: "90%", alignSelf: "center"
            }}
            >
              <Pressable style={tabs == "currencies" ? (theme.theme == "light" ? { borderBottomWidth: 2, borderBottomColor: "black", borderRadius: 0 } : { borderBottomWidth: 2, borderColor: "white", borderRadius: 0 }) :
                { borderBottomWidth: 2, borderColor: "transparent", borderRadius: 5 }} onPress={() => setTabs("currencies")}>
                <Text style={{
                  fontFamily: Fonts.Regular, fontSize: RFPercentage(2.1), padding: "2.5%",
                  width: width / 2.5, textAlign: "center", color: tabs == "currencies" ? (theme.theme == "light" ? "black" : "white") : theme.search
                }}>Currencies</Text>
              </Pressable>

              <Pressable style={tabs == "tokens" ? (theme.theme == "light" ? { borderBottomWidth: 2, borderBottomColor: "black", borderRadius: 0 } : { borderBottomWidth: 2, borderColor: "white", borderRadius: 0 }) :
                { borderWidth: 2, borderColor: "transparent", borderRadius: 0 }}
                onPress={() => {
                  setskip(6)
                  setLimit(0)
                  setTokenArr([])
                  setTabs("tokens")
                }}>
                <Text style={{
                  fontFamily: Fonts.Regular, fontSize: RFPercentage(2.1), padding: "2.5%",
                  width: width / 2.5, textAlign: "center", color: tabs == "tokens" ? (theme.theme == "light" ? "black" : "white") : theme.search
                }}>Tokens</Text>
              </Pressable>
            </View> */}

              <View
                style={{
                  width: "85%",
                  paddingVertical: "2%",
                  alignSelf: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  paddingBottom:"4%"
                }}
              >
                <Pressable
                  onPress={() => setTabs("currencies")}
                  style={{
                    width: "49%",
                    backgroundColor:
                      tabs == "currencies"
                        ? theme.theme == "dark"
                          ? "#612CD2"
                          : "#612CD2"
                        :theme.theme==="dark"? "rgba(226, 226, 226, 0.15)":"rgba(155, 124, 220, 0.15)",
                    borderColor:
                      tabs == "currencies"
                        ? theme.theme == "dark"
                          ? "#612CD2"
                          : "#612CD2"
                        : theme.theme==="dark"? "rgba(226, 226, 226, 0.30)":"rgba(155, 124, 220, 0.30)",
                    borderWidth: 2,
                    paddingVertical: "2.5%",
                    justifyContent: "center",
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      color:
                        tabs == "currencies"
                          ? "#ffffff"
                          : theme.theme == "dark"
                          ? "#696969"
                          : "#612CD2",
                      textAlign: "center",
                      fontFamily:
                        tabs == "currencies" ? Fonts.Regular : Fonts.Regular,
                      fontSize: RFValue(12),
                    }}
                  >
                    Currencies
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setskip(6);
                    setLimit(0);
                    setTokenArr([]);
                    setTabs("tokens");
                  }}
                  style={{
                    width: "49%",
                    backgroundColor:
                      tabs == "tokens"
                        ? theme.theme == "dark"
                          ? "#612CD2"
                          : "#612CD2"
                        : theme.theme==="dark"? "rgba(226, 226, 226, 0.15)":"rgba(155, 124, 220, 0.15)",
                    borderColor:
                      tabs == "tokens"
                        ? theme.theme == "dark"
                          ? "#612CD2"
                          : "#612CD2"
                        :theme.theme==="dark"? "rgba(226, 226, 226, 0.30)":"rgba(155, 124, 220, 0.30)",
                    borderWidth: 2,
                    paddingVertical: "2.5%",
                    justifyContent: "center",
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      color:
                        tabs == "tokens"
                          ? "#ffffff"
                          : theme.theme == "dark"
                          ? "#696969"
                          : "#612CD2",
                      textAlign: "center",
                      fontFamily: tabs == "tokens" ? Fonts.Regular : Fonts.Regular,
                      fontSize: RFValue(12),
                    }}
                  >
                    Tokens
                  </Text>
                </Pressable>
              </View>

              {tabs == "currencies" ? (
                <>
                  {IsLoad ? (
                    <>
                      <View>
                        <ActivityIndicator
                          size="small"
                          color={theme.theme == "light" ? "#000" : "#fff"}
                        />
                      </View>
                    </>
                  ) : (
                    <>
                      <View
                        style={{
                          backgroundColor: "white",
                          borderRadius: 12,
                          alignItems: "center",
                          paddingTop: 20,
                          paddingBottom:"30%"
                        }}
                      >
                        {currencyArr?.length !== 0 ? (
                          <>
                            <ScrollView
                              refreshControl={
                                <RefreshControl
                                  refreshing={refreshing}
                                  onRefresh={getWalletData}
                                  style={{ fontFamily: Fonts.Regular }}
                                />
                              }
                              style={{ height: "90%", width: "90%",alignSelf:"center"}}
                            >
                              {/* {currencyArr?.map((val, i) => ( */}
                              {_.map(currencyArr, (val, i) => (
                                
                                <>
                                
                              <TouchableOpacity
                                key={Math.random()}
                                onPress={() => {
                                  setWalletDetailsinRedux(val);
                                  props.navigation.navigate("WalletHistory");
                                }}
                              >
                                <View
                                  style={{
                                    marginVertical:"5%" ,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent:"space-around"
                                  }}
                                >
                                  <View style={{width:"45%",flexDirection:"row",justifyContent:"space-between"}}>

                                  <View
                                    style={{
                                      // width: "12%",
                                      height: windowheight * 0.05,
                                      justifyContent: "center",
                                 
                                     
                                    }}
                                  >
                                    {!isEmpty(val.currencyimage) ? (
                                        <SvgUri
                                          width={30}
                                          height={30}
                                          uri={`http:/192.53.121.26:8096/images/${val.currencyimage}`}
                                        />
                                      ) : (
                                        showImage(val.tokenType, "wallethome")
                                      )}
                                  </View>
                                  <View
                                    style={{
                                      width: "70%",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      paddingLeft:"2%",
                                      // borderWidth:0.5
                                      
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: "#000000",
                                        fontFamily: Fonts.Medium,
                                        fontSize: RFPercentage(1.9),
                                        width: "100%",
                                      }}
                                    >
                                      {val.currencyName}
                                      {/* Ethereum */}
                                    </Text>
                                    <Text
                                      style={{
                                        color: theme.search,
                                        fontSize: RFPercentage(1.9),
                                        width: "100%",
                                      }}
                                      key={i}
                                    >
                                      {val.balance === 0
                                          ? "0"
                                          : val.balance.toFixed(2)}{" "}
                                        {val.currency}
                                      {/* 0 ETH */}
                                    </Text>
                                  </View>
                                  </View>
                                  <View
                                    style={{
                                      width: "20%",
                                      alignItems: "center",
                                      justifyContent: "center",
                                     
                                    }}
                                  >
                                    {/* {console.log("val Price",val)} */}
                                    {val.changePer != 0 ?
                                        (val.changePer <0 ? (
                                          <GraphRed
                                          resizeMode="contain"
                                          // height={50}
                                          width={"100%"}
                                        />
                                    ) : (
                                      <GraphGreen
                                      resizeMode="contain"
                                      // height={50}
                                      width={"100%"}
                                    />
                                        )): <GraphGreen
                                        resizeMode="contain"
                                        // height={50}
                                        width={"100%"}
                                      />}
                                  </View>
                                  <View style={{ width: "33%", }}>
                                    <Text
                                      style={{
                                        color: val.changePer < 0
                                        ? "#F45532" : "#08c708",
                                        fontFamily: Fonts.Regular,
                                        textAlign: "right",
                                        fontSize: RFPercentage(1.9),
                                        width: "90%",
                                      }}
                                    >
                                      {defaultCurrency == "USD"
                                        ? "$"
                                        : defaultCurrency == "EUR"
                                        ? "€"
                                        : "£"}

                                      {formattedPrice(parseFloat(val.singleValue).toFixed(2))}
                                      {/* $2290.88 */}
                                    </Text>
                                    {val.changePer != 0 ? (
                                    <Text
                                      style={{
                                        color:
                                          val.changePer < 0
                                          ? "#F45532" : "#08c708",
                                        fontFamily: Fonts.Regular,
                                        textAlign: "right",
                                        fontSize: RFPercentage(1.9),
                                        width: "90%",
                                      }}
                                    >
                                      {val.changePer.toFixed(2)}%
                                      {/* -0.421% */}
                                    </Text>
                                    ): <Text
                                    style={{
                                      color:
                                        val.changePer < 0
                                        ? "#F45532" : "#08c708",
                                      fontFamily: Fonts.Regular,
                                      textAlign: "right",
                                      fontSize: RFPercentage(1.9),
                                      width: "90%",
                                    }}
                                  >
                                    0.00%
                                    {/* -0.421% */}
                                  </Text>}
                                  </View>
                                </View>
                              </TouchableOpacity>
                              <Image
                                style={{ width: "100%",}}
                                source={require("../../assets/img/deviderPNG.png")}
                                resizeMode="cover"
                              />
                              </>
                              ))}
                            </ScrollView>
                          </>
                        ) : (
                          <>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <View>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minHeight: "55%",
                                  }}
                                >
                                  <Image
                                    // source={{ uri: Images.nodata }}
                                    source={require("../../assets/img/noCruncy.png")}
                                    style={{
                                      width: 60,
                                      height: 60,
                                      resizeMode: "contain",
                                    }}
                                  />
                                </View>
                                <View>
                                  <Text
                                    style={{
                                      fontFamily: Fonts.Regular,
                                      fontSize: RFPercentage(1.8),
                                      width: "100%",
                                      textAlign: "center",
                                      color: "black",
                                    }}
                                  >
                                    No Currencies Found!
                                  </Text>
                                  <Text
                                    style={{
                                      fontFamily: Fonts.Regular,
                                      fontSize: RFPercentage(3.5),
                                      marginTop: 20,
                                      color: "black",
                                      width: "100%",
                                      textAlign: "center",
                                    }}
                                  >
                                    <Text>Receive</Text>
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </>
                        )}
                      </View>
                    </>
                  )}
                </>
              ) : (
                <>
                  {IsLoad ? (
                    <>
                      <View>
                        <ActivityIndicator
                          size="small"
                          color={theme.theme == "light" ? "#000" : "#fff"}
                        />
                      </View>
                    </>
                  ) : (
                    <>
                      <ScrollView
                        refreshControl={
                          <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                              setskip(6);
                              setLimit(0);
                              setTokenArr([]);
                              setTabs("currencies");
                              getWalletData();
                            }}
                            style={{ fontFamily: Fonts.Regular }}
                          />
                        }
                        onMomentumScrollEnd={() => {
                          if (tokenArr.length != tokenLength)
                            getTokenData(walletToken);
                        }}
                        style={{ height: "90%" }}
                      >
                        {tokenArr?.length == 0 ? (
                          <>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                height: windowheight * 0.5,
                              }}
                            >
                              {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <Image source={{ uri: Images.nodata }} style={{ width: 240, height: 240, resizeMode: "contain" }} />
                          </View> */}
                              <View>
                                {/* <Text style={{
                              fontFamily: Fonts.Regular, fontSize: 14,
                              width: "100%", textAlign: "center", color: theme.text
                            }}>No Assets Found!</Text> */}
                                <TouchableOpacity
                                  onPress={() =>
                                    props.navigation.navigate("TokenList")
                                  }
                                >
                                  <Text
                                    style={{
                                      fontFamily: Fonts.Regular,
                                      fontSize: RFPercentage(2.2),
                                      marginTop: 5,
                                      color: theme.text,
                                      width: "100%",
                                      textAlign: "center",
                                    }}
                                  >
                                    Add Tokens
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </>
                        ) : (
                          <>
                            {/* {tokenArr && tokenArr?.map((item, i) => ( */}
                            {tokenArr &&
                              _.map(tokenArr, (item, i) => (
                                <TouchableOpacity
                                  onPress={() => {
                                    setWalletDetailsinRedux(item);
                                    props.navigation.navigate("WalletHistory");
                                  }}
                                  key={Math.random()}
                                >
                                  <View
                                    style={{
                                      padding: "3%",
                                      flexDirection: "row",
                                      borderBottomColor: theme.phrase1,
                                      borderBottomWidth: 1,
                                      alignItems: "center",
                                      justifyContent:"space-between"
                                    }}
                                  >
                                    {/* <View
                                      style={{
                                        width: "13%",
                                        height: windowheight * 0.06,
                                        justifyContent: "center",
                                      }}
                                    >
                                      {!isEmpty(item.currencyimage) ? (
                                        <Image
                                          source={{
                                            uri:
                                              "http:/192.53.121.26:8096/images/" +
                                              item.currencyimage,
                                          }}
                                          style={{
                                            resizeMode: "contain",
                                            width: "85%",
                                            height: "85%",
                                          }}
                                        />
                                      ) : (
                                        showImage(item.tokenType)
                                      )}
                                    </View> */}
                                    <View style={{ width: "34%" }}>
                                      <Text
                                        style={{
                                          color:"#000000",
                                          fontFamily: Fonts.Regular,
                                          // marginLeft: "5%",
                                          fontSize: RFPercentage(1.9),
                                          width: "90%",
                                        }}
                                      >
                                        {item.currencyName}
                                      </Text>
                                      <Text
                                        style={{
                                          color: theme.search,
                                          marginLeft: "5%",
                                          fontSize: RFPercentage(1.9),
                                          width: "90%",
                                        }}
                                        key={i}
                                      >
                                        {item.balance == 0
                                          ? "0"
                                          : item.balance.toFixed(2)}{" "}
                                        {item.currency}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        width: "25%",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      {item.changePer != 0 &&
                                        (item.changePer > 0 ? (
                                          <GraphGreen
                                            resizeMode="contain"
                                            height={50}
                                            width={100}
                                          />
                                        ) : (
                                          <GraphRed
                                            resizeMode="contain"
                                            height={50}
                                            width={100}
                                          />
                                        ))}
                                    </View>
                                    <View style={{ width: "28%" }}>
                                      <Text
                                        style={{
                                          color: item.changePer < 0
                                          ? "#F45532" : "#08c708",
                                          fontFamily: Fonts.Regular,
                                          textAlign: "right",
                                          fontSize: RFPercentage(1.9),
                                          width: "90%",
                                        }}
                                      >
                                        {defaultCurrency == "USD"
                                          ? "$"
                                          : defaultCurrency == "EUR"
                                          ? "€"
                                          : "£"}
                                        {formattedPrice(parseFloat(item.singleValue).toFixed(2))}
                                      </Text>
                                      {item.changePer != 0 && (
                                        <Text
                                          style={{
                                            color:
                                              item.changePer < 0
                                              ? "#F45532" : "#08c708",
                                            fontFamily: Fonts.Regular,
                                            textAlign: "right",
                                            fontSize: RFPercentage(1.9),
                                            width: "90%",
                                          }}
                                        >
                                          {item.changePer.toFixed(2)}%
                                        </Text>
                                      )}
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              ))}
                          </>
                        )}
                      </ScrollView>
                    </>
                  )}
                </>
              )}
            </View>
            </ScrollView>
            </View>
            {/* <Modal
              isVisible={isModalVisible}
              entry="bottom"
              backdropPressToClose={true}
              visible={isModalVisible}
              backdropColor={"#989898"}
            >
              <Pressable
                onPress={() => {
                  setIsModalVisible(
                    (prevIsModalVisible) => !prevIsModalVisible
                  );
                }}
              >
                <View
                  style={{
                    height: windowheight * 0.3,
                    alignSelf: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "80%",
                    backgroundColor: theme.blackandwhite,
                    borderRadius: 10,
                    paddingBottom: 20,
                  }}
                >
                  <Pressable
                    style={{
                      padding: 10,
                      alignItems: "flex-end",
                      position: "absolute",
                      right: 10,
                      top: 10,
                    }}
                    onPress={() => {
                      setIsModalVisible(
                        (prevIsModalVisible) => !prevIsModalVisible
                      );
                    }}
                  >
                    <View>
                      {theme.theme == "light" ? (
                        <Close fill="#000" width={20} height={20} />
                      ) : (
                        <Close fill="#fff" width={20} height={20} />
                      )}
                    </View>
                  </Pressable>
                  <View style={{ alignItems: "center" }}>
                    <Image
                      source={{
                        uri:
                          theme.theme == "light"
                            ? Images.rightDark
                            : Images.rightLight,
                      }}
                      style={{
                        width: windowWidth * 0.135,
                        height: windowheight * 0.08,
                        resizeMode: "contain",
                        aspectRatio: 1,
                      }}
                    />
                    <Text
                      style={{
                        color: theme.text,
                        fontFamily: Fonts.Medium,
                        fontSize: RFPercentage(2.5),
                        marginTop: "6%",
                        alignSelf: "center",
                        textAlign: "center",
                      }}
                    >
                      {modalMessage}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Modal> */}
                  {modalVisible && (
          <ImageBackground
            source={theme.theme === "light" ? Images.backgroundWhite : Images.background}
            style={{
              width: windowWidth,
              height: windowheight,
              paddingTop: StatusBar.windowheight,
              position: "absolute",
              backgroundColor:
                theme.theme === "light"
                  ? "rgba(68, 68, 68, 0.95)"
                  : "transparent",
            }}
            resizeMode="cover"
          >
            <View style={style.modelContainer}>
              <View style={style.centeredView}>
                <TouchableOpacity
                  style={style.buttonClose}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={style.createTextX}>X</Text>
                </TouchableOpacity>
                <View style={style.modalView}>
                  {theme.theme === "dark" ? (
                    <Image
                      style={{ width: "100%", marginBottom: 20 }}
                      source={require("../../assets/img/model_image.png")}
                      resizeMode="contain"
                    />
                  ) : (
                    <Image
                      style={{ width: "100%", marginBottom: 20 }}
                      source={require("../../assets/img/model_image_light.png")}
                      resizeMode="contain"
                    />
                  )}

                  <Text style={style.createText}>{modalMessage}</Text>
                  <Text style={style.modelText}>{modalMessage2}</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        )}
          </>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};
export default WalletHome;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    seperatorLine: {
      height: 0.5,
      backgroundColor: "grey",
    },
    modelContainer: {
      position: "absolute",
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    centeredView: {
      position: "relative",
      width: "75%",
      height: "50%",
      borderRadius: 5,
      borderWidth: 2,
      borderColor: "rgba(162, 121, 250, 0.30)",
      backgroundColor:
        theme.theme === "light" ? "#EDEDED" : "rgba(155, 124, 220, 0.15)",
    },
    modalView: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    createText: {
      color: theme.theme === "dark" ? "white" : "#000000",
      textAlign: "center",
      fontSize: RFPercentage(3),
      fontFamily: Fonts.Bold,
      marginBottom: 5,
    },

    modelText: {
      color: theme.theme === "dark" ? "#FFF600" : "#612CD2",
      textAlign: "center",
      fontSize: RFPercentage(3),
      fontFamily: Fonts.Bold,
      textShadowColor: theme.theme === "light" ? "black" : "#612CD2",
      textShadowOffset: { width: -2, height: 1.5 },
      textShadowRadius: 1,
      // textShadowColor: theme.theme === "light" ? "black" : "#612CD2",
      // textShadowOffset: { width: -2, height: 2.5 },
      // textShadowRadius: 2,
    },
    createTextX: {
      color: theme.theme === "dark" ? "white" : "white",
      textAlign: "center",
      fontSize: RFPercentage(3),
      fontFamily: Fonts.Bold,
    },
    buttonClose: {
      position: "absolute",
      right: 5,
      top: 5,
      borderRadius: 2,
      borderWidth: 2,
      borderColor: "rgba(162, 121, 250, 0.30)",
      backgroundColor:
        theme.theme === "dark" ? "rgba(155, 124, 220, 0.15)" : "#612CD2",
      justifyContent: "center",
      textAlign: "center",
      width: 42,
      height: 42,
    },
  });

