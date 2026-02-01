import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  Image,
  TextInput
} from "react-native";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import ApiClient from "../../api/ApiClient";
import { ApiConstants } from "../../api/ApiConstants";
import { Colors } from "../../utils/Colors";
import { Fonts } from "../../utils/Fonts";
import { Icon as Icn, Button, Card } from "react-native-elements";
// import { TextInput } from "react-native-paper";
import Clipboard from "@react-native-community/clipboard";
import { useSelector, useDispatch } from "react-redux";
import { addTransactionData } from "../../Redux/Actions/transactionAction";
import { sendData } from "../../Redux/Actions/walletSendAction";
import { useFocusEffect } from "@react-navigation/native";
import { addScanDetails } from "../../Redux/Actions/scanDetailsAction";
import getRealm from "../../localDb/RealmConfig";
import { Images } from "../../utils/Images";
import LinearGradient from "react-native-linear-gradient";
const WalletSend = (props) => {
  //redux
  //redux
  const dispatch = useDispatch();
  const setTransactionData = (item) => dispatch(addTransactionData(item));
  const setScanDetails = (item) => dispatch(addScanDetails(item));
  const setSendData = (item) => dispatch(sendData(item));

  const walletDetailsFromRedux = useSelector(
    (state) => state.walletDetailReducer.currencyList
  );
  const scanDetailFromRedux = useSelector(
    (state) => state.scanDataReducer.scanData
  );

  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);

  const [toAddress, setToaddress] = useState("");
  const [toAddressErr, setToaddressErr] = useState(false);

  const [amount, setAmount] = useState("");
  const [amountErr, setAmountErr] = useState(false);
  const [convertBalance, setConvertBalance] = useState(0);
  const [fiatAmount, setFiatAmount] = useState(0);
  const [fiatStatus, setFiatStatus] = useState(false);
  const [convertSymbol, setConvertSymbol] = useState("");

  const [selectedCurrency, setCurrency] = useState("");

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setToaddress(text);
  };

  useEffect(() => {
    setScanDetails("");
  }, []);

  useEffect(() => {
    if (toAddress.length == 0) {
      setToaddressErr(false);
    }
    if (amount.length == 0) {
      setAmountErr(false);
    }
  }, [toAddress, amount]);

  var QRcodeAddress = scanDetailFromRedux;

  useFocusEffect(
    React.useCallback(() => {
      // Add Event Listener for hardwareBackPress
      getDefaultCurrency();
      if (QRcodeAddress != "Noaddress") {
        if (QRcodeAddress.length == 51) {
          var covert = QRcodeAddress.replace("ethereum:", "");
          setToaddress(covert);
        } else {
          setToaddress(QRcodeAddress);
        }
      }
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
      setFiatAmount("");
      setToaddress("");
      return () => {
        // Once the Screen gets blur Remove Event Listener
      };
    }, [])
  );

  //addressValidate api
  const addressValidateApi = () => {
    if (amount > walletDetailsFromRedux.balance) {
      setAmountErr(true);
    }
    if (walletDetailsFromRedux.walletaddress == toAddress) {
      ToastAndroid.showWithGravityAndOffset(
        "Invalid Address",
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
        //console.log("address validation params", params);
        ApiClient.post(ApiConstants.addressValidate, params)
          .then(function (res) {
            if (res.data.status == false) {
              setToaddressErr(true);
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

  useEffect(() => {
    getcoinmarketsymbol();
  }, [selectedCurrency, fiatStatus, amount]);

  useEffect(() => {
    calculateFiatAmount();
  }, [amount]);

  const calculateFiatAmount = () => {
    const val = (parseFloat(amount) * convertBalance).toFixed(6);
    setFiatAmount(val);
    if (fiatStatus == true) {
      setSendData(val);
    } else {
      setSendData(amount);
    }
  };

  const getcoinmarketsymbol = () => {
    let params = {
      Symbol: walletDetailsFromRedux.currency,
      convertSymbol: selectedCurrency,
    };
    ApiClient.post(ApiConstants.coinmarketcap_bysymbol, params)
      .then(function (res) {
        if (fiatStatus == false) {
          setConvertBalance(res.data.data);
          setConvertSymbol(selectedCurrency);
        } else {
          setConvertBalance(amount / res.data.data);
          setFiatAmount(amount / res.data.data);
        }
      })
      .catch(function (err) {
        console.log("coinmarketcap_bysymbol err", err);
      });
  };

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

  return (
    <SafeAreaView style={style.container}>
      <LinearGradient colors={theme.theme == 'light' ? ['#fff','#fff']: ['#151918','#171515']}
          useAngle={true}
          angle={170}
          style={{width:"100%",height:"100%"}}
        >
          <Header
        name={"Send" + " " + walletDetailsFromRedux.currency}
        leftImage={"back"}
      />
      <ScrollView>
        <Image
          source={Images.chiptoss}
          style={{
            alignSelf: "center",
            width: "100%",
            height: 80,
            resizeMode:"contain",
            marginTop: "5%",
            marginBottom:30
          }}
        />
        <Card
          containerStyle={{
            borderRadius: 15,
            elevation: 0,
            width: "90%",
            bottom: 20,
            marginTop: "10%",
            alignSelf: "center",
            borderColor: theme.cardbg,
            backgroundColor: theme.input1,
          }}
        >
          <View
            style={{
              marginTop: "10%",
                        }}
          >
            <View style={{flexDirection:"row",
              alignItems:'center',
              justifyContent:"space-between",backgroundColor:theme.input,borderRadius:10,paddingLeft:10}}>
            <TextInput
              // label="To Address:"
              value={toAddress}
              placeholder="Address"
              placeholderTextColor={"#fff"}
              error={toAddressErr}
              selectionColor={theme.text}
              onChangeText={(toAddress) => {
                setToaddress(toAddress);
              }}
              style={{fontFamily:Fonts.Regular,color:"#fff",fontSize:16,
              borderColor:"transparent",width:"80%"}}
              theme={{
                colors: {
                  text: theme.text,
                  accent: theme.background,
                  primary: Colors.PRIMARY,
                  placeholder: "#40A5A3",
                  background: "transparent",
                },
              }}
            />
            {toAddressErr == true && toAddress.length != 0 && (
              <Text style={style.invalidPhraseTxt}>Invalid Address</Text>
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: "2%",
              }}
            >
              <View style={{ left: -10,flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  fetchCopiedText();
                }}
                style={{marginRight:10}}
              >
                <Icn
                  name="scan1"
                  type="antdesign"
                  color={"#fff"}
                  size={23}
                  onPress={() => {
                    props.navigation.navigate("ScanAddress");
                  }}
                />
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => {
                  fetchCopiedText();
                }}
              >
                <Icn
                  name="copy1"
                  type="antdesign"
                  color={"#fff"}
                  size={23}
                  onPress={() => {
                    props.navigation.navigate("ScanAddress");
                  }}
                />
                </TouchableOpacity>
              </View>
              
                {/* <Text
                  style={{
                    color: "#CC9E52",
                    fontFamily: Fonts.Bold,
                    fontSize: 14,
                  }}
                >
                  PASTE
                </Text>
              </TouchableOpacity> */}
            </View>
            </View>
            <View style={{ marginTop: "6%" }} />
            <View style={{backgroundColor:theme.input,borderRadius:10}}>
            <TextInput
            style={{fontFamily:Fonts.Regular,color:"#fff",fontSize:16,paddingLeft:10,
            borderColor:"transparent"}}
              // label={
              //   fiatStatus == true
              //     ? "Amount " + selectedCurrency
              //     : "Amount " + walletDetailsFromRedux.currency
              // }
              value={amount}
              selectionColor={theme.text}
              keyboardType="number-pad"
              placeholder={"Amount"+ selectedCurrency}
              error={amountErr}
              placeholderTextColor={"#fff"}
              
              onChangeText={(amount) => {
                if (amount.includes(" ")) {
                  setAmount(
                    amount.trim().replace(/[- #*;,<>\{\}\[\]\\\/]/gi, "")
                  );
                } else {
                  setAmount(amount.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, ""));
                }
              }}
              theme={{
                colors: {
                  text: theme.text,
                  accent: theme.background,
                  primary: Colors.PRIMARY,
                  placeholder: "transparent",
                  background: "transparent",
                },
              }}
            />
            </View>
            {amountErr == true && amountErr.length != 0 && (
              <Text style={style.invalidPhraseTxt}>Low Balance</Text>
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: "2%",
              }}
            >
              {fiatStatus != true && (
                <TouchableOpacity
                  onPress={() => {
                    setAmount(walletDetailsFromRedux.balance.toString());
                  }}
                >
                  <Text
                    style={{
                      color: "#CC9E52",
                      fontFamily: Fonts.Bold,
                      fontSize: 14,
                      left: -10,
                    }}
                  > 
                    MAX
                  </Text>
                </TouchableOpacity>
              )}
              {walletDetailsFromRedux.currency == "TRX" ||
              walletDetailsFromRedux.currency == "ETH" ||
              walletDetailsFromRedux.currency == "BTC" ||
              walletDetailsFromRedux.currency == "BNB" ? (
                <TouchableOpacity
                  onPress={() => {
                    if (fiatStatus == false) {
                      setCurrency(selectedCurrency);
                      setFiatStatus(true);
                      setAmount("");
                    } else {
                      setCurrency(selectedCurrency);
                      setFiatStatus(false);
                      setAmount("");
                    }
                  }}
                >
                  <Text
                    style={{
                      color: "#CC9E52",
                      fontSize: 14,
                      fontFamily: Fonts.Bold,
                    }}
                  >
                    {selectedCurrency}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text
                  style={{
                    color: Colors.PRIMARY,
                    fontSize: 14,
                    fontFamily: Fonts.Bold,
                  }}
                >
                  token
                </Text>
              )}
            </View>
          </View>

          {walletDetailsFromRedux.currency == "TRX" ||
          walletDetailsFromRedux.currency == "ETH" ||
          walletDetailsFromRedux.currency == "BTC" ||
          walletDetailsFromRedux.currency == "BNB" ? (
            <>
              {fiatAmount != "NaN" && (
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 14,
                    fontFamily: Fonts.Bold,
                  }}
                >
                  {parseFloat(fiatAmount).toFixed(6)} {convertSymbol}
                </Text>
              )}
            </>
          ) : (
            <View />
          )}

          {walletDetailsFromRedux.balance == 0 ||
          walletDetailsFromRedux.balance == "0" ? (
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:20,marginBottom:30}}>
            <LinearGradient colors={['#FFF229','#518D56']}
            useAngle={true}
            angle={170}
            style={{width:200,borderRadius:10}}
          >
            <Button
              title={walletDetailsFromRedux.currency + " Balance is low"}
              disabled={true}
              buttonStyle={{
                borderRadius: 5,
                // height: 45,
                width: "100%",
                alignSelf: "center",
                // marginTop: 20,
                padding:10,
                backgroundColor: "transparent",
              }}
              titleStyle={{ fontFamily: Fonts.Bold, color:"#000" }}
            />
            </LinearGradient>
            </View>
          ) : (
            <>
              {toAddress.length != 0 && amount.length != 0 ? (
                <Button
                  title="Continue"
                  buttonStyle={{
                    borderRadius: 5,
                    height: 45,
                    width: "90%",
                    alignSelf: "center",
                    marginTop: 20,
                    backgroundColor:theme.buttonbg,
                  }}
                  titleStyle={{ fontFamily: Fonts.Bold, color:theme.buttonclr }}
                  onPress={() => {
                    addressValidateApi();
                  }}
                />
              ) : (
                <Button
                  title="Continue"
                  disabled={true}
                  buttonStyle={{
                    borderRadius: 5,
                    height: 45,
                    width: "90%",
                    alignSelf: "center",
                    marginTop: 20,
                    backgroundColor: Colors.PRIMARY,
                  }}
                  titleStyle={{ fontFamily: Fonts.Bold }}
                />
              )}
            </>
          )}
        </Card>
      </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
export default WalletSend;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    invalidPhraseTxt: {
      fontFamily: Fonts.Medium,
      fontSize: 12,
      color: "red",
      alignSelf: "flex-start",
      // marginLeft:30
    },
  });
