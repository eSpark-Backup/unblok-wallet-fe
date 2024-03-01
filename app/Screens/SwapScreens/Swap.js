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
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Alert,
  ActivityIndicator,
  ImageBackground,
  TextInput,
  Image,
  Dimensions,
  Keyboard,
  ToastAndroid,
  StatusBar
} from "react-native";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { Colors } from "../../utils/Colors";
import { Fonts } from "../../utils/Fonts";
import { Icon as Icn, Button, Input } from "react-native-elements";
import { useSelector } from "react-redux";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import isEmpty from "../../utils/isEmpty";
import { useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { swapData } from "../../Redux/Actions/fiatDataAction";
import {
  selectedFun,
  IconShowing,
  getAmountInFun,
  getAmountOutFun,
} from "./common/Swap_ ";
import NewSwapArrLight from "../../assets/icons/lighttheme/exchange solid black.svg";
import NewSwapArrDark from "../../assets/icons/darktheme/Swap Duotune.svg";
import web3utils from "web3-utils";
import { Images } from "../../utils/Images";
import { windowheight } from "../../utils/Dimensions";
import Dropdown from "../../assets/img/dropdown.svg";
import DropdownLight from "../../assets/img/dropdownLight.svg";
const Swap = (props) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);

  const [refreshing, setRefreshing] = useState(false);
  const [approveStatus, setApprovestatus] = useState();

  const [outputamout, setOutputamount] = useState("");
  const [inputamout, setInputamount] = useState("");
  const [singleVal2, setsingleVal2] = useState(0);
  const [percentage, setPercentage] = useState(25);

  const selectedWallet = useSelector(
    (state) => state.selectedCurrencyListReducer.selectedList
  );

  const walletDataList = selectedWallet;
 
  // console.log("walletDataList", walletDataList);
  const selectedItem = (inputamout, item) => {
    console.log("SLefijsoidefjsoif");
    console.log("inputamout0000000", inputamout);
    if (inputamout > 0) {
      var params = {
        walletaddress: Getneeddata()?.walletaddress,
        privateKey: Getneeddata()?.privKey,
        currency: item.currencySymbol,
        amount1: parseFloat(inputamout) * 1000000000000000000,
                tokenType: item.tokenType,
      };
      selectedFun(params)
        .then((response) => {
          console.log("response aapprovecjheck", response.data);
          setApprovestatus(response.data.approve_status);
        })
        .catch((e) => { console.log("erro r on  approvecheck", e); });
    }

  };

  const dispatch = useDispatch();
  const setSwapdatas = (item) => dispatch(swapData(item));
  const clearSwapdatas = (item) => dispatch(clearswapData(item));
  const {
    youpaytoken,
    yougettoken,
    youpay,
    youget,
    youget18,
    youpay18,
    walletaddress,
    privKey,
    tokenBalancePay,
    tokenBalanceGet,
    TokenTypes,
  } = useSelector((state) => state.fiatDataReducer.swapdata);
  const [change, setchange] = useState("in");
  const [load, setload] = useState(false);

  // console.log("tokenBalancePaytokenBalancePa", tokenBalancePay);



  useEffect(() => {
    console.log("inside of inputamount");
    selectedItem(inputamout, youpaytoken)
  }, [inputamout, outputamout])
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     selectedItem(youpaytoken);
  //     if (change == "in")
  //       onChangeInputAmount(inputamout, youpaytoken, yougettoken, 0);
  //     if (change == "out")
  //       onChangeInputAmount(0, youpaytoken, yougettoken, outputamout);
  //   }, [inputamout, outputamout])
  // );

  // const[TokenTypes,SetTokenTypes] = useState([])
  // console.log("props.route.params", props.route.params)

  useFocusEffect(
    useCallback(() => {
      if (props.route.params?.forPay) {
        // get_token_bal(props.route.params?.forPay ?? youpaytoken, "pay");
        onChangeInputAmount(
          youpay,
          props.route.params?.forPay,
          yougettoken,
          youget
        );
        setSwapdatas({
          tokenBalancePay: props.route.params?.forPay?.fee,
          youpaytoken: props.route.params?.forPay ?? youpaytoken,
        });
      }
      if (props.route.params?.forGet) {
        onChangeInputAmount(
          youpay,
          youpaytoken,
          props.route.params?.forGet,
          youget
        );
        // get_token_bal(
        //   props.route.params?.forGet ?? yougettoken,
        //   "get"
        // );
        setSwapdatas({
          tokenBalanceGet: props.route.params?.forGet?.fee,
          yougettoken: props.route.params?.forGet ?? yougettoken,
        });
      }

      if (youpay) setInputamount(youpay);
      if (youget) setOutputamount(youget);

      
      if (walletDataList.length > 0) {
        var data = walletDataList.map((data, index) => { return data.tokenType })
        // SetTokenTypes(data)
        setSwapdatas({
          TokenTypes: data
        })
      }
    }, [props.route.params?.forPay, props.route.params?.forGet, walletDataList])

  );





  const Getneeddata = () => {
    var data = walletDataList.filter((data, index) => {
      if (
        ["erc20", "bep20", "mat20"].includes(
          data?.tokenType?.toString()?.toLowerCase()
        )
      ) {
        return data;
      }
    })[0];
    setSwapdatas({
      walletaddress: data?.walletaddress,
      privKey: data?.privKey,
      balance: data?.balance,
    });
    return data;
  };

  // //getting token balance
  // const get_token_bal = (item, type) => {
  //   var privatekey = Getneeddata()?.walletaddress;

  //   let params = {
  //     currency: item.currencySymbol,
  //     tokenType: item.tokenType,
  //     walletaddress: privatekey,
  //   };
  //   var balance;
  //   TokenClient.post(ApiConstants.token_balance, params)
  //     .then(function (res) {
  //       balance = res.data.data;
  //       if (type == "pay") {
  //         setSwapdatas({ tokenBalancePay: res.data.data });
  //       } else if (type == "get") {
  //         setSwapdatas({ tokenBalanceGet: res.data.data });
  //       }
  //     })
  //     .catch(function (err) { });
  //   return balance;
  // };

  const clearData = () => {
    setSwapdatas({
      yougettoken: '',
      youpaytoken: '',
      youget: '',
      youpay: '',
      youpay18: '',
      youget18: '',
      tokenBalanceGet: "",
      tokenBalancePay: "",
    });
    setInputamount("");
    setOutputamount("");
    setRefreshing(true);
    setApprovestatus();
    setTimeout(() => {

      setRefreshing(false);
      props.navigation.navigate('Swap')
    }, 1000);
  };

  const onChangeInputAmount = async (inputamout, pay, get, out, from) => {
    // setOutputamount(0);
    // console.log("hhhhhhhhhhhhhhhhhh",inputamout, pay,"lllllllllllllll",get, out, from);
    setTimeout(() => {
      setload(true);
      if (from) {

        // var params = {
        //   walletaddress: walletDataList[0]?.walletaddress,
        //   privateKey: walletDataList[0]?.privKey,
        //   firstcurrency: get.currencySymbol,
        //   secondcurrency: pay.currencySymbol,
        //   amount: inputamout,
        //   tokenType: get.tokenType,
        // };
        // getAmountInFun(params)
        //   .then((response) => {
        //     console.log("response of getamounts in ", response.data.data);
        // setload(false);
        // // var input = response.data.data[0] / 1000000000000000000;
        // setSwapdatas({
        //   youpaytoken: get,
        //   yougettoken: pay,
        //   youget: inputamout,
        //   youpay: out,
        //   // youpay18: response.data.data[0],
        //   // youget18: response.data.data[1],
        // });
        // setOutputamount(out);
        // setInputamount(inputamout);
        // })
        // .catch((e) => {
        //   setload(false);
        // });

        setload(false);
        setSwapdatas({
          youpaytoken: pay,
          yougettoken: get,
          youpay: "0",
          youget: "0",
          tokenBalanceGet: tokenBalancePay,
          tokenBalancePay: tokenBalanceGet,
        });
        //console.log("inputamout", outputamout, inputamout);
        setInputamount("")
        setOutputamount("")

      } else if (pay && get && inputamout) {
        var params = {
          walletaddress: walletDataList[0]?.walletaddress,
          privateKey: walletDataList[0]?.privKey,
          firstcurrency: pay.currencySymbol,
          secondcurrency: get.currencySymbol,
          amount: inputamout,
          tokenType: pay.tokenType,
        };
        getAmountOutFun(params)
          .then((response) => {
            console.log("response of getamountout ", response.data);
            setload(false);
            var input = web3utils.fromWei(response.data.data[1]);
            console.log("input", input);
            setsingleVal2(response.data.singleValue.second)
            setOutputamount(input);
// get_token_bal(pay, "pay");
            // get_token_bal(get, "get");
            setSwapdatas({
// youpaytoken: pay,
              // yougettoken: get,
              youget: isNaN(input) ? 0 : input,
              youpay: inputamout,
              youpay18: response.data.data[0],
              youget18: response.data.data[1],
            });
          })
          .catch((e) => { });
      } else if (out && get && pay) {
        var params = {
          walletaddress: walletDataList[0]?.walletaddress,
          privateKey: walletDataList[0].privKey,
          firstcurrency: get.currencySymbol,
          secondcurrency: pay.currencySymbol,
          amount: out,
          tokenType: get.tokenType,
        };
        getAmountInFun(params)
          .then((response) => {
            setload(false);
            var input = web3utils.fromWei(response.data.data[0]);
            setSwapdatas({
              youpaytoken: pay,
              yougettoken: get,
              youget: out,
              youpay: isNaN(input) ? 0 : input,
              youpay18: response.data.data[0],
              youget18: response.data.data[1],
            });
            setInputamount(isNaN(input) ? 0 : input);
          })
          .catch((e) => { });
      } else if (pay && inputamout) {
        setload(false)
        setSwapdatas({
          youpay: inputamout,
        });
      }
      else if (get && out) {
        setload(false)
        setSwapdatas({
          youget: out,
        });
      } else {
        setload(false);
      }
    }, 500);
  };


  // const OnChangefun = async () => {
  //   onChangeInputAmount(outputamout, youpaytoken, yougettoken, 0, "change");

  // };

  
  useEffect(
    () => {
// console.log("dsahdjasjhdhaskhd dhakshdakjshd")
    if (!isKeyboardVisible) {
      onChangeInputAmount(inputamout, youpaytoken, yougettoken, outputamout)
    }
  }, [isKeyboardVisible])


  const OnChangefun = async () => {
    // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa",yougettoken,youpaytoken,"rrrrrrrrrrrrrrrr",youpay,youget);
    if (youpaytoken && isEmpty(yougettoken) && isEmpty(youpay) && isEmpty(youget)) onChangeInputAmount(inputamout, '', youpaytoken, outputamout, "change");
    else if (yougettoken && isEmpty(youpaytoken) && isEmpty(youpay) && isEmpty(youget)) onChangeInputAmount(inputamout, yougettoken, '', outputamout, "change");
    else if (youpaytoken && yougettoken && isEmpty(youpay) && isEmpty(youget)) onChangeInputAmount(inputamout, yougettoken, youpaytoken, outputamout, "change");
    else if (youpaytoken && (yougettoken) && (youpay) && (youget)) onChangeInputAmount(outputamout, yougettoken, youpaytoken, inputamout, "change");
    else ToastAndroid.showWithGravityAndOffset(
        `Select Token To Swap`,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
  };

  return (
    <SafeAreaView style={style.container}>
      <ImageBackground
        source={theme.theme === "dark" ? Images.background : Images.backgroundWhite}
        style={{
          width: windowWidth,
          height: windowheight,
          paddingTop: StatusBar.windowheight,
        }}
        resizeMode="cover"
      >
        {/* <Header name={"Swap"} leftImage={"settingBack"} /> */}
        <Header name={"Swap"} />
        {/* <View style={{ width: "100%", height: windowHeight * 0.1, justifyContent: "center" }} >
        <Text
          style={{ marginLeft: "4.5%", fontSize: RFPercentage(3), color: theme.text, fontFamily: Fonts.Regular, fontSize: RFPercentage(2.75), }}
        >Swap</Text>
      </View> */}
        <View style={{ width: "100%", height: "90%",position:"relative" }}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={clearData} />
            }
            keyboardDismissMode
          >
            <View style={{ width: "85%", alignSelf: "center" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: windowHeight * 0.075,
                }}
              >
                <View style={{ width: "25%" }}>
                  <Text
                    style={{
                      color: theme.theme === "dark" ? "white" : "black",
                      fontSize: RFPercentage(2.1),
                      fontFamily: Fonts.Medium,
                    }}
                  >
                    Pay
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ width: "60%", alignItems: "flex-end" }}
                  onPress={() => props.navigation.navigate("YouPay")}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    
                    {!isEmpty(youpaytoken.currencyimage) ? (
                      <Image
                        source={{
                          uri:
                            "http:/192.53.121.26:8096/images/" +
                            youpaytoken.currencyimage,
                        }}
                        style={{ width: 40, height: 40 }}
                      />
                    ) : (
                      IconShowing(youpaytoken && youpaytoken.tokenType)
                    )}
                    <Text
                      textBreakStrategy="simple"
                      style={{
                        color: theme.theme === "dark" ? "white" : "black",
                        fontSize: RFPercentage(1.8),
                        marginLeft: 5,
                      }}
                    >
                      {!isEmpty(youpaytoken)
                        ? youpaytoken?.currencySymbol
                        : "Select"}
                      {"  "}{" "}
                    </Text>
                    {theme.theme === "dark" ? (
                                <Dropdown
                                  style={{
                                    alignSelf: "center",
                                    aspectRatio: 1,
                                    marginRight: 5,
                                  }}
                                  width={windowWidth * 0.03}
                                  height={windowWidth * 0.03}
                                />
                              ) : (
                                <DropdownLight
                                  style={{
                                    alignSelf: "center",
                                    aspectRatio: 1,
                                    marginRight: 5,
                                  }}
                                  width={windowWidth * 0.03}
                                  height={windowWidth * 0.03}
                                />
                              )}
                    {/* <Image
                      source={require("../../assets/img/angle-up.png")}
                      style={{ width: 18, height: 18, marginLeft: 10 }}
                    /> */}
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderColor: "rgba(162, 121, 250, 0.30)",
                  borderWidth: 2,
                  marginBottom: 20,
                  borderRadius: 5,
                  padding: 5,
                  backgroundColor: "rgba(155, 124, 220, 0.15)",
                }}
              >
                <TextInput
                  placeholder={"0"}
                  placeholderTextColor={
                    theme.theme === "dark" ? "white" : "black"
                  }
                  style={{
                    fontFamily: Fonts.Regular,
                    color: theme.theme === "dark" ? "white" : "black",
                    paddingLeft: 10,
                    fontSize: RFPercentage(1.9),
                  }}
                  keyboardType="numeric"
                  // selectionColor={theme.text}
                  value={inputamout.toString()}
                  onChangeText={(inputamout) => {
                    if (inputamout.toString() == "0" || inputamout == "") {
                      setOutputamount("0");
                    }
                    if (/^\d*\.?\d*$/.test(inputamout)) {
                      setSwapdatas({ youpay: inputamout });
                      setInputamount(inputamout);
                      setOutputamount("");
                    }
                  }}
                />
              </View>

              {/* {load ?
              (<>
                <View>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center", justifyContent: "center", paddingBottom: 8 }}>
                    <ActivityIndicator size={"large"} />
                    
                  </TouchableOpacity>
                </View>

              </>)
              :
              (<> */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  // transform: [{ rotate: "90deg" }],
                  position:"absolute",
                  left:"-10%",
                  top:"6%"
                }}
              >
                <TouchableOpacity onPress={() => OnChangefun()}>
                  {theme.theme == "light" ? (
                    <NewSwapArrLight
                      width={windowWidth * 0.1}
                      height={windowHeight * 0.2}
                      style={{ resizeMode: "contain" }}
                    />
                  ) : (
                    <NewSwapArrDark
                      width={windowWidth * 0.1}
                      height={windowHeight * 0.2}
                      style={{ resizeMode: "contain" }}
                    />
                  )}
                </TouchableOpacity>
              </View>
              {/* </>)} */}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: windowHeight * 0.075,
                  marginTop: "2.5%",
                }}
              >
                <Text
                  style={{
                    color: theme.theme === "dark" ? "white" : "black",
                    fontSize: RFPercentage(2),
                    fontFamily: Fonts.Medium,
                    marginBottom: 10,
                  }}
                >
                  Receive
                </Text>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate("YouGet")}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* {!isEmpty(yougettoken) && IconShowing(yougettoken && yougettoken.tokenType)} */}
                    {!isEmpty(yougettoken.currencyimage) ? (
                      <Image
                        source={{
                          uri:
                            "http:/192.53.121.26:8096/images/" +
                            yougettoken.currencyimage,
                        }}
                        style={{ width: 40, height: 40 }}
                      />
                    ) : (
                      IconShowing(yougettoken && yougettoken.tokenType)
                    )}
                    <Text
                      textBreakStrategy="simple"
                      style={{
                        color: theme.theme === "dark" ? "white" : "black",
                        fontSize: RFPercentage(1.8),
                        marginLeft: 5,
                      }}
                    >
                      {!isEmpty(yougettoken)
                        ? yougettoken?.currencySymbol
                        : "Select"}
                      {"  "}{" "}
                    </Text>
                    {theme.theme === "dark" ? (
                                <Dropdown
                                  style={{
                                    alignSelf: "center",
                                    aspectRatio: 1,
                                    marginRight: 5,
                                  }}
                                  width={windowWidth * 0.03}
                                  height={windowWidth * 0.03}
                                />
                              ) : (
                                <DropdownLight
                                  style={{
                                    alignSelf: "center",
                                    aspectRatio: 1,
                                    marginRight: 5,
                                  }}
                                  width={windowWidth * 0.03}
                                  height={windowWidth * 0.03}
                                />
                              )}
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row', alignItems: "center", justifyContent: "space-between",
              borderColor: "rgba(162, 121, 250, 0.30)", borderWidth: 2,
              borderRadius: 5, padding: 5,
              backgroundColor:"rgba(155, 124, 220, 0.15)"
                }}
              >
                <TextInput
                  placeholder={"0"}
                  placeholderTextColor={theme.theme === "dark" ? "white" : "black"}
                  // selectionColor={theme.text}
                  style={{
                    fontFamily: Fonts.Regular,
                    color: theme.theme === "dark" ? "white" : "black",
                    paddingLeft: 10,
                    fontSize: RFPercentage(1.9),
                  }}
                  keyboardType="numeric"
                  value={outputamout.toString()}
                  // editable={!load}
                  onChangeText={(outputamout) => {
                    if (outputamout.toString() == "0") setInputamount("0");
                    if (/^\d*\.?\d*$/.test(outputamout)) {
                      setchange("out");
                      // setSwapdatas({ youget: outputamout });
                      setOutputamount(outputamout);
                      setInputamount("");
                    }
                  }}
                  underlineColorAndroid="transparent"
                />
              </View>
              <Image
              style={{ width: "90%", marginVertical:"10%",alignSelf:"center" }}
              source={require("../../assets/img/deviderPNG.png")}
              resizeMode="cover"
            />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                  marginBottom: 25,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor:percentage===25? theme.theme==="dark"?"transparent":"#612CD2":"transparent",
                    borderRadius: 5,
                    paddingVertical: 6,
                    borderWidth: 1,
                    borderColor:percentage===25?"#A279FA": theme.theme==="light"?"#A279FA":"white",
                    width:"22%"
                  }}
                  onPress={() => {
                    setPercentage(25)
                    setInputamount(((tokenBalancePay * 25) / 100).toString());
                    onChangeInputAmount(
                      (tokenBalancePay * 25) / 100,
                      youpaytoken,
                      yougettoken
                    );
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.Medium,
                      color:percentage===25? theme.theme === "dark" ? "#A279FA" : "white":  theme.theme === "dark" ? "white" : "black",
                      fontSize: RFPercentage(1.6),
                      textAlign: "center",
                    }}
                  >
                    25%
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor:percentage===50? theme.theme==="dark"?"transparent":"#612CD2":"transparent",
                    borderRadius: 5,
                    paddingVertical: 6,
                    borderWidth: 1,
                    borderColor:percentage===50?"#A279FA": theme.theme==="light"?"#A279FA":"white",
                    width:"22%"
                  }}
                  onPress={() => {
                    setPercentage(50)
                    setInputamount(((tokenBalancePay * 50) / 100).toString());
                    onChangeInputAmount(
                      (tokenBalancePay * 50) / 100,
                      youpaytoken,
                      yougettoken
                    );
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.Medium,
                      color: percentage===50? theme.theme === "dark" ? "#A279FA" : "white":  theme.theme === "dark" ? "white" : "black",
                      fontSize: RFPercentage(1.6),
                      textAlign: "center",
                    }}
                  >
                    50%
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor:percentage===75? theme.theme==="dark"?"transparent":"#612CD2":"transparent",
                    borderRadius: 5,
                    paddingVertical: 6,
                    borderWidth: 1,
                    borderColor:percentage===75?"#A279FA": theme.theme==="light"?"#A279FA":"white",
                    width:"22%"
                  }}
                  onPress={() => {
                    setPercentage(75)
                    onChangeInputAmount(
                      (tokenBalancePay * 75) / 100,
                      youpaytoken,
                      yougettoken
                    );
                    setInputamount(((tokenBalancePay * 75) / 100).toString());
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.Medium,
                      color: percentage===75? theme.theme === "dark" ? "#A279FA" : "white":  theme.theme === "dark" ? "white" : "black",
                      fontSize: RFPercentage(1.6),
                      textAlign: "center",
                    }}
                  >
                    75%
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor:percentage===100? theme.theme==="dark"?"transparent":"#612CD2":"transparent",
                    borderRadius: 5,
                    paddingVertical: 6,
                    borderWidth: 1,
                    borderColor:percentage===100?"#A279FA": theme.theme==="light"?"#A279FA":"white",
                    width:"22%"
                  }}
                  onPress={() => {
                    setPercentage(100)
                    onChangeInputAmount(
                      (tokenBalancePay * 100) / 100,
                      youpaytoken,
                      yougettoken
                    );
                    setInputamount(((tokenBalancePay * 100) / 100).toString());
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.Medium,
                      color: percentage===100? theme.theme === "dark" ? "#A279FA" : "white":  theme.theme === "dark" ? "white" : "black",
                      fontSize: RFPercentage(1.6),
                      textAlign: "center",
                    }}
                  >
                    100%
                  </Text>
                </TouchableOpacity>
              </View>
              {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            {!isEmpty(youpaytoken) ? (
              <Text
                style={{
                  color: theme.text,
                  fontSize: RFPercentage(2),
                  fontFamily: Fonts.Regular,
                  textAlign: "center",
                  marginTop: "8%",
                }}
              >
                {tokenBalancePay ?
                  ` Available Balance =  ${Number(tokenBalancePay?.toFixed(8))} ${youpaytoken.currencySymbol
                  }` : 0}
              </Text>
            ) : null}
          </View>
          {!isEmpty(youpaytoken) &&
            !isEmpty(yougettoken) &&
            !isEmpty(youget18) ? (
            <Text
              style={{
                color: theme.text,
                fontSize: RFPercentage(2),
                fontFamily: Fonts.Regular,
                textAlign: "center",
                marginTop: "8%",
                marginLeft: 10
              }}
            >
              {`1 ${youpaytoken?.currencySymbol} = ${singleVal2} ${yougettoken.currencySymbol}`}
            </Text>
          ) : null} */}

              {!isEmpty(youpaytoken) ? (
                <>
                  <Text
                    style={{
                      color: theme.theme == "light" ? "#000" : "#fff",
                      fontSize: RFPercentage(1.9),
                      fontFamily: Fonts.Bold,
                      textAlign: "center",
                      marginTop: "2%",
                    }}
                  >
                    Available Balance
                    {/* {console.log("afafafafaafafafa", tokenBalancePay, tokenBalanceGet, inputamout,(Number(tokenBalancePay) < Number(inputamout)),)} */}
                    {/* {` Available Balance =  ${!isEmpty(tokenBalancePay) ? Number(tokenBalancePay)?.toFixed(8) : tokenBalancePay} ${youpaytoken.currencySymbol}   
                                      ${!isEmpty(tokenBalanceGet) ? "" + Number(tokenBalanceGet)?.toFixed(8) : ""}  ${!isEmpty(tokenBalanceGet) ? yougettoken.currencySymbol : ""}`} */}
                  </Text>

                  <Text
                    style={{
                      color: theme.theme == "light" ? "#000" : "#fff",
                      fontSize: RFPercentage(1.9),
                      fontFamily: Fonts.Bold,
                      textAlign: "center",
                      marginTop: "2%",
                    }}
                  >
                    {!isEmpty(tokenBalancePay)
                      ? Number(tokenBalancePay)?.toFixed(8)
                      : tokenBalancePay}{" "}
                    {youpaytoken.currencySymbol}
                  </Text>
                  <Text
                    style={{
                      color: theme.theme == "light" ? "#000" : "#fff",
                      fontSize: RFPercentage(1.9),
                      fontFamily: Fonts.Bold,
                      textAlign: "center",
                      marginTop: "2%",
                    }}
                  >
                    {!isEmpty(tokenBalanceGet)
                      ? "" + Number(tokenBalanceGet)?.toFixed(8)
                      : ""}{" "}
                    {!isEmpty(tokenBalanceGet)
                      ? yougettoken.currencySymbol
                      : ""}
                  </Text>
                </>
              ) : null}
              {!isEmpty(youpaytoken) &&
              !isEmpty(yougettoken) &&
              !isEmpty(youget18) ? (
                <Text
                  style={{
                    color: theme.theme == "light" ? "#000" : "#fff",
                    fontSize: RFPercentage(1.9),
                    fontFamily: Fonts.Bold,
                    textAlign: "center",
                    marginTop: "8%",
                  }}
                >
                  {isEmpty(youpaytoken) && isEmpty(yougettoken)
                    ? ""
                    : `1 ${youpaytoken?.currencySymbol} = ${singleVal2} ${yougettoken.currencySymbol}`}
                </Text>
              ) : null}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                  marginTop: 30,
                }}
              >
                <View style={{ width: 150 }}>
                  {approveStatus &&
                    !isEmpty(yougettoken) &&
                    approveStatus === "Not Apporved" &&
                    inputamout != 0 &&
                    !isEmpty(tokenBalancePay) &&
                    tokenBalancePay >= inputamout && (
                      <TouchableOpacity
                        style={{
                          marginTop: "10%",
                          width: windowWidth * 0.8,
                          height: 49,
                          backgroundColor:
                            theme.theme === "dark" ? "yellow" : "#612CD2",
                          
                          justifyContent: "center",
                          alignSelf:"center",
                          border: 1,
                          borderRadius: 2,
                        }}
                        onPress={() => props.navigation.navigate("Approve")}
                      >
                        <Text
                          style={{
                            fontFamily: Fonts.Medium,
                            fontSize: RFValue(16),
                            color: theme.theme === "light" ? "#fff" : "#000000",
                            textAlign: "center",
                          }}
                        >
                          Approve
                        </Text>
                      </TouchableOpacity>
                    )}

                  {(isEmpty(tokenBalancePay) ||
                    Number(tokenBalancePay) < Number(inputamout)) &&
                    !isEmpty(yougettoken) && (
                      <TouchableOpacity
                        disabled={true}
                        style={{
                          marginTop: "10%",
                          width: windowWidth * 0.8,
                          height: 49,
                          backgroundColor:
                            theme.theme === "dark" ? "yellow" : "#612CD2",
                          
                          justifyContent: "center",
                          alignSelf:"center",
                          border: 1,
                          borderRadius: 2,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Fonts.Medium,
                            fontSize: RFValue(16),
                            color: theme.theme === "light" ? "#fff" : "#000000",
                            textAlign: "center",
                          }}
                        >
                          Insufficient Balance
                        </Text>
                      </TouchableOpacity>
                    )}

                  {(!isEmpty(inputamout) || !isEmpty(youpay)) &&
                    (!isEmpty(outputamout) || !isEmpty(youget)) &&
                    approveStatus === "Approved" &&
                    !isEmpty(yougettoken) &&
                    inputamout <= tokenBalancePay && (
                      <TouchableOpacity
                        style={{
                          marginTop: "10%",
                          width: windowWidth * 0.8,
                          height: 49,
                          backgroundColor:
                            theme.theme === "dark" ? "yellow" : "#612CD2",
                          
                          justifyContent: "center",
                          alignSelf:"center",
                          border: 1,
                          borderRadius: 2,
                        }}
                        onPress={() => props.navigation.navigate("ConfirmSwap")}
                      >
                        <Text
                          style={{
                            fontFamily: Fonts.Medium,
                            fontSize: RFValue(16),
                            color: theme.theme === "light" ? "#fff" : "#000000",
                            textAlign: "center",
                          }}
                        >
                          Confirm Swap
                        </Text>
                      </TouchableOpacity>
                    )}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default Swap;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.background,
    },
    seperatorLine: {
      height: 0.5,
      backgroundColor: "grey",
    },
    Text1: {
      fontSize: RFPercentage(2.5),
      fontWeight: "bold",
      color: "#787878",
    },
    Text2: {
      fontSize: RFPercentage(2),
      fontWeight: "bold",
      color: "#787878",
      //marginLeft: "20%",
    },
    Text3: {
      fontSize: RFPercentage(2),
      fontWeight: "bold",
      color: "#3443ce",
      marginLeft: "1%",
    },
    Text4: {
      fontSize: RFPercentage(2),
      fontWeight: "bold",
      color: "#787878",
      marginLeft: "1%",
    },
    plceimg: {
      alignItems: "center",
      marginTop: "8%",
    },
    btn: {
      height: 35,
      width: 60,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      margin: 10,
      backgroundColor: "#F6921E",
      borderColor: "#787878",
      borderRadius: 10,
    },
    centericon: {
      //height: 40,
      // width: 60,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      marginLeft: "5%",
      //borderColor: "#787878",
      //borderWidth: 1,
      backgroundColor: "transparent",
      width: 50,
      height: 50,
      borderRadius: 60 / 2,
    },
    btntxt: {
      fontSize: RFPercentage(2),
      color: theme.buttonclr,
      alignSelf: "center",
      fontFamily: Fonts.Medium,
      justifyContent: "center",
    },
    Text5: {
      fontSize: RFPercentage(2.5),
      fontFamily: Fonts.Medium,
      textAlign: "center",
      marginTop: "3%",
    },
    loginStyle: {
      shadowRadius: 6,
      shadowOpacity: 0.26,
      elevation: 8,
      backgroundColor: "#3443ce",
      width: 160,
      height: 40,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      marginTop: "5%",
    },
    logintextstyle: {
      color: "white",
      fontSize: RFPercentage(2.5),
      fontFamily: Fonts.Bold,
      alignSelf: "center",
      marginTop: "4%",
    },
    firstCurrency: {
      width: "40%",
      borderBottomColor: "gray",
      // borderBottomWidth: 0.5,
      marginTop: "-19%",
      marginLeft: "55%",
      marginRight: "10%",
    },
    modalfirstCurrency: {
      width: "40%",

      borderBottomColor: "gray",
      // borderBottomWidth: 0.5,
      marginTop: "-19%",
      marginLeft: "55%",
      marginRight: "10%",
    },
    firstCurrency2: {
      backgroundColor: "white",
      borderColor: "gray",
      borderWidth: 0.5,
      marginTop: 20,
      padding: 8,
    },
    icon: {
      marginRight: 5,
      width: 18,
      height: 18,
    },
    icon1: {
      marginLeft: "15%",
      marginRight: "5%",
      marginTop: "3%",
    },
    modalicon: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: "3%",
    },
    icon2: {
      marginLeft: "15%",
      marginRight: "5%",
    },
    item: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginRight: "5%",
    },
    textItem: {
      flex: 1,
      fontSize: RFPercentage(3),
      color: "#3443ce",
      alignItems: "center",
      marginLeft: 5,
    },
  });
