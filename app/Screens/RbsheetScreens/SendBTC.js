import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ToastAndroid,
  BackHandler,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Fonts } from "../../utils/Fonts";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { addTransactionData } from "../../Redux/Actions/transactionAction";
import { addScanDetails } from "../../Redux/Actions/scanDetailsAction";
import { sendData } from "../../Redux/Actions/walletSendAction";
import { fetchCopiedText, sendFunc } from "./common/Send_BTC";
import getRealm from "../../localDb/RealmConfig";
import {
  borderRadius,
  windowWidth,
  windowheight,
} from "../../utils/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
// import Header2 from "../../Components/Header2";
import { Images } from "../../utils/Images";

export default function SendBTC(props) {
  const theme = useContext(themeContext);
  const style = styles(theme);

  const dispatch = useDispatch();
  const setTransactionData = (item) => dispatch(addTransactionData(item));
  const setScanDetails = (item) => dispatch(addScanDetails(item));
  const setSendData = (item) => dispatch(sendData(item));

  const [toAddress, setToaddress] = useState("");
  const [toAddressErr, setToaddressErr] = useState(false);

  const [amount, setAmount] = useState("");
  const [amountErr, setAmountErr] = useState(false);
  const [convertBalance, setConvertBalance] = useState(0);
  const [fiatAmount, setFiatAmount] = useState(0);
  const [fiatStatus, setFiatStatus] = useState(false);
  const [convertSymbol, setConvertSymbol] = useState("");
  const [fiatCurrency, setCurrency] = useState("");

  //redux
  const walletDetailsFromRedux = useSelector(
    (state) => state.walletDetailReducer.currencyList
  );
  const scanDetailFromRedux = useSelector(
    (state) => state.scanDataReducer.scanData
  );

  // console.log("walletDetailsFromRedux", walletDetailsFromRedux);
  console.log('walletDetailsFromRedux', JSON.stringify(walletDetailsFromRedux, null, 2))
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        props.navigation.goBack()
        return true
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

  useEffect(() => {
    setScanDetails("");
  }, []);

  useEffect(() => {
    convertbalFunc();
  }, [fiatCurrency, fiatStatus, amount, convertBalance])

  useEffect(() => {
    calculateFiatAmount();
  }, [amount]);

  const convertbalFunc = async () => {
    if (fiatStatus == false) {
      setConvertBalance(walletDetailsFromRedux.singleValue);
      setConvertSymbol(fiatCurrency);
    } else {
      setConvertBalance(amount / walletDetailsFromRedux.singleValue);
      setFiatAmount(Number(amount / walletDetailsFromRedux.singleValue));
      setConvertSymbol(walletDetailsFromRedux.currency);
    }
  }

  const calculateFiatAmount = () => {
    const val = (parseFloat(amount) * convertBalance).toFixed(6);
    setFiatAmount(val);
    if (fiatStatus == true) {
      setSendData(val);
    } else {
      setSendData(amount);
    }
  };

  var QRcodeAddress = scanDetailFromRedux;

  useFocusEffect(
    React.useCallback(() => {
      // Add Event Listener for hardwareBackPress
      getDefaultCurrency();
      fetchScan();
      return () => {
        // Once the Screen gets blur Remove Event Listener
      };
    }, [QRcodeAddress])
  );

  useFocusEffect(
    React.useCallback(() => {
      // Add Event Listener for hardwareBackPress
      setAmount("");
      setConvertSymbol("");
      setFiatStatus(false);
      setFiatAmount(0);
      setToaddress("");
      return () => {
        // Once the Screen gets blur Remove Event Listener
      };
    }, [])
  );

  const fetchScan = async () => {
    if (QRcodeAddress != "Noaddress") {
      if (QRcodeAddress.length == 51) {
        var covert = await QRcodeAddress.replace("ethereum:", "");
        setToaddress(covert);
      } else {
        setToaddress(QRcodeAddress);
      }
    }
  }

  //get DefaultCurrency from db
  const getDefaultCurrency = () => {
    getRealm()
      .then((realm) => {
        var defaultCurrencyVal = realm.objects("defaultCurrency");
        if (defaultCurrencyVal.length == 0) {
          setCurrency("USD");
        } else {
          setCurrency(defaultCurrencyVal[0].defaultCurrency);
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "defaultCurrency err from localDb");
      });
  };

  const addressValidateApi = async () => {
    console.log("addressValidateApi");
    if (amount > walletDetailsFromRedux.balance) {
      return setAmountErr(true);
    }
    if (walletDetailsFromRedux.walletaddress == toAddress) {
      ToastAndroid.showWithGravityAndOffset(
        "Addresses Must Be Different",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      setToaddressErr(true);
    } else {
      if (toAddress != "") {
        let params = {
          toaddress: toAddress,
          privKey: walletDetailsFromRedux.privKey,
          tokentype:
            walletDetailsFromRedux.tokenType != undefined
              ? walletDetailsFromRedux.tokenType
              : "",
          currencySymbol: walletDetailsFromRedux.currency,
        };
        console.log("address validation params", params);
        await sendFunc(params)
          .then(function (res) {
            console.log("rtrjbrhfg", res.data)
            if (res.data.status == false) {
              setToaddressErr(true);
              ToastAndroid.showWithGravityAndOffset(
                "Invalid Address",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );
            } else {
              setToaddressErr(false);
              setTransactionData({
                toAddress: toAddress,
                amount: amount,
                item: walletDetailsFromRedux,
              });
              if (amount > walletDetailsFromRedux.balance == false) {
                props.navigation.navigate("ConfirmSend");
              }
            }
          })
          .catch(function (err) {
            console.log("addressValidate api err", err);
          });
      }
    }
  };

  return (
    <>
     <StatusBar barStyle={theme.theme == "light" ? "dark-content" : "light-content"} backgroundColor={theme.theme==="dark"?"rgb(25,14,47)":"#ffffff"} />
      <SafeAreaView style={style.container}>
        <ImageBackground
          source={theme.theme === "light" ?Images.backgroundWhite : Images.background}
          style={{
            width: windowWidth,
            height: windowheight,
            paddingTop: StatusBar.windowheight,
          }}
          resizeMode="cover"
        >
          <Header
            name={`${walletDetailsFromRedux.currencyName}`}
            leftImage={"back"}
            rightImage={"CONTINUE"}
          />
          <View style={{ width: "90%", alignSelf: "center" }}>
            <View style={{ marginTop: "15%" }}>
              <Text style={style.title_text}>Address</Text>
              <View
                style={{
                  backgroundColor: "rgba(155, 124, 220, 0.15)",
                  borderRadius: 5,
                  margin: "2.5%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: "2%",
                  height: windowheight * 0.075,
                  borderWidth: 1,
                  borderColor: "rgba(162, 121, 250, 0.30)",
                }}
              >
                <TextInput
                  placeholder={"Enter Address"}
                  style={{
                    width: "85%",
                    color: theme.theme == "light" ? "#000" : "#fff",
                    fontFamily: Fonts.Regular,
                    paddingLeft: 10,
                    fontSize: RFPercentage(1.9),
                  }}
                  placeholderTextColor="#A279FA"
                  // selectionColor={theme.text}
                  selectionColor={"#9370DB"}
                  value={toAddress.toString()}
                  onChangeText={(toAddress) => {
                    setToaddress(toAddress);
                  }}
                />
                <>
                  <TouchableOpacity
                    onPress={async () => {
                      var seting = await fetchCopiedText();
                      setToaddress(seting);
                    }}
                  >
                    {theme.theme == "light" ? (
                      <Image
                        source={require("../../assets/img/paste.png")}
                        style={{ width: 15, height: 15, resizeMode: "contain" }}
                      />
                    ) : (
                      <Image
                        source={require("../../assets/img/paste.png")}
                        style={{ width: 15, height: 15, resizeMode: "contain" }}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate("ScanAddress");
                    }}
                  >
                    {theme.theme == "light" ? (
                      <Image
                        source={require("../../assets/img/qr-scanner.png")}
                        style={{ width: 15, height: 15, resizeMode: "contain" }}
                      />
                    ) : (
                      <Image
                        source={require("../../assets/img/qr-scanner.png")}
                        style={{ width: 15, height: 15, resizeMode: "contain" }}
                      />
                    )}
                  </TouchableOpacity>
                </>
              </View>
            </View>
            <View style={{ marginTop: "6%" }}>
              <Text style={style.title_text}>Amount</Text>
              <View
                style={{
                  backgroundColor: "rgba(155, 124, 220, 0.15)",
                  borderRadius: 5,
                  margin: "2.5%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderColor: "rgba(162, 121, 250, 0.30)",
                  height: windowheight * 0.075,
                }}
              >
                <TextInput
                  placeholder={"Enter Amount"}
                  style={{
                    width: "100%",
                    color: theme.theme == "light" ? "#000" : "#fff",
                    fontFamily: Fonts.Regular,
                    paddingLeft: 10,
                    fontSize: RFPercentage(1.9),
                  }}
                  placeholderTextColor="#A279FA"
                  // selectionColor={theme.text}
                  selectionColor={"#9370DB"}
                  value={amount}
                  keyboardType="number-pad"
                  error={amountErr}
                  onChangeText={(amount) => {
                    setAmountErr(false);
                    if (amount.includes(" ")) {
                      if (/^\d*\.?\d*$/.test(amount)) {
                        setAmount(
                          amount.trim().replace(/[- #*;,<>\{\}\[\]\\\/]/gi, "")
                        );
                      }
                    } else {
                      if (/^\d*\.?\d*$/.test(amount)) {
                        setAmount(
                          amount.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, "")
                        );
                      }
                    }
                  }}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: "3%",
              }}
            >
              <View>
                {amountErr == true && amountErr.length != 0 && (
                  <Text style={{ color: "red", fontFamily: Fonts.Medium }}>
                    Low Balance
                  </Text>
                )}
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                {fiatStatus != true && (
                  <TouchableOpacity
                    onPress={() => {
                      setAmount(walletDetailsFromRedux.balance.toString());
                    }}
                  >
                    <Text
                      style={{
                        color: "#A279FA",
                        fontFamily: Fonts.Medium,
                        fontSize: RFPercentage(1.8),
                        fontWeight:"bold",
                      }}
                    >
                      MAX
                    </Text>
                  </TouchableOpacity>
                )}
                {walletDetailsFromRedux.type == "Crypto" ? (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        if (fiatStatus == false) {
                          setCurrency(fiatCurrency);
                          setFiatStatus(true);
                          setAmount("");
                        } else {
                          setCurrency(fiatCurrency);
                          setFiatStatus(false);
                          setAmount("");
                        }
                      }}
                    >
                      <Text
                        style={{
                          color: theme.theme === "dark" ? "white" : "black",
                          fontFamily: Fonts.Regular,
                          fontSize: RFPercentage(1.8),
                          marginLeft: 10,
                          fontWeight:"bold",
                        }}
                      >
                        {fiatCurrency}
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        color: theme.theme === "dark" ? "white" : "black",
                        fontFamily: Fonts.Regular,
                        fontSize: RFPercentage(1.8),
                        marginLeft: 10,
                        fontWeight:"bold",
                      }}
                    >
                      USD
                    </Text>
                  </>
                )}
              </View>
            </View>
          <Image
            style={{ width: "100%",height:1, marginBottom: 10,marginTop:"10%" }}
            source={require("../../assets/img/deviderPNG.png")}
            resizeMode="cover"
          />
          </View>
          {walletDetailsFromRedux.type != "Token" && fiatAmount != "NaN" ? (
            <View style={{width:"85%",alignSelf:"center"}}>
            <Text
              style={{
                color: theme.theme==="dark"?"white":"black",
                fontSize: RFPercentage(3.5),
                fontFamily: Fonts.Bold,
                marginLeft: "2%",
                marginTop: "5%",
                fontWeight:"bold",
              }}
            >
              {fiatAmount == 0 ? "0.00" : parseFloat(fiatAmount).toFixed(6)}{" "}
              {convertSymbol}
            </Text>
            </View>
          ) : (
            <></>
          )}

          {walletDetailsFromRedux == 0 ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "20%",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#9e9999",
                    borderWidth: 1,
                    borderColor: "gray",
                    padding: "5%",
                    width: "80%",
                    borderRadius: 5,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        width: "100%",
                        textAlign: "center",
                        fontSize: RFPercentage(2),
                        color: "#3b3b3b",
                      }}
                    >
                      Balance is Low
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              {toAddress.length != 0 && amount.length != 0 ? (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "20%",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: theme.theme==="dark"?"#FFF600":"#612CD2",
                        borderWidth: 1,
                        borderColor: theme.theme==="dark"?"#FFF600":"#612CD2",
                        padding: "5%",
                        width: "80%",
                        borderRadius: 5,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          addressValidateApi();
                        }}
                      >
                        <Text
                          style={{
                            width: "100%",
                            textAlign: "center",
                            fontSize: RFPercentage(2),
                            color: theme.theme==="dark"?"#000000":"#ffffff",
                          }}
                        >
                          Send {walletDetailsFromRedux.currency}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </ImageBackground>
      </SafeAreaView>
    </>
  );
}
const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    custsearch: {
      borderRadius: 5,
      backgroundColor: theme.background,
      margin: 15,
      shadowOffset: 0,
      fontFamily: Fonts.Bold,
    },
    container2: {
      backgroundColor: theme.background,
      padding: 16,
    },
    seperatorLine: {
      height: 0.5,
      backgroundColor: "grey",
    },
    title_text: {
      fontFamily: Fonts.Medium,
      fontSize: RFPercentage(1.9),
      color: theme.theme === "dark" ? "#fff" : "black",
      marginLeft: "5%",
    },
  });
