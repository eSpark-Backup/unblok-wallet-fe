import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import ApiClient from "../../api/ApiClient";
import { ApiConstants } from "../../api/ApiConstants";
import { Colors } from "../../utils/Colors";
import { Fonts } from "../../utils/Fonts";
import { Icon as Icn, Button, Card } from "react-native-elements";
import getRealm from "../../localDb/RealmConfig";
import { useSelector } from "react-redux";
import { showNotification } from "../../utils/PushNotificationConfig";
import LinearGradient from "react-native-linear-gradient";
import TokenClient from "../../api/TokenClient";
const ConfirmSend = (props) => {
  //redux
  const transactionDataFromRedux = useSelector(
    (state) => state.transactionDataReducer.transactionData
  );
  const amountToBeSend = useSelector(
    (state) => state.walletSendDataReducer.sendData
  );

  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [isLoading, loader] = useState(false);
  const [pushNotificationStatus, setPushNotificationStatus] = useState("");
  const [defaultCurrency, setDefaultCurrency] = useState("");
  const [totalConvertedVal, setTotalConvertedVal] = useState("");
  const [convertValForEnteredAmount, setConvertValForEnteredAmount] =
    useState("");
  const [convertValForTotalBal, setConvertValForTotalBal] = useState("");

  //addressValidate api
  const withdrawApiCall = () => {
    loader(true);
    let params = {
      walletaddress: transactionDataFromRedux.item.walletaddress,
      currencySymbol: transactionDataFromRedux.item.currency,
      amount: amountToBeSend,
      toaddress: transactionDataFromRedux.toAddress,
      privKey: transactionDataFromRedux.item.privKey,
      currency: transactionDataFromRedux.item.currency,
      contractAddress: transactionDataFromRedux.item.contractAddress,
      tokenType: transactionDataFromRedux.item.tokenType
    };
    TokenClient.post(ApiConstants.withdraw, params)
      .then(function (res) {
        loader(false);
        console.log("res",res.data);
        if (res.data.status != false) {
          ToastAndroid.showWithGravityAndOffset(
            res.data.message,
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25,
            50
          );
          nav(res.data.message);
        } else if (res.data.message == "Invalid Address") {
          ToastAndroid.showWithGravityAndOffset(
            "Invalid Address",
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25,
            50
          );
          nav(res.data.message);
        } else if (res.data.message == "Insuffient funds") {
          ToastAndroid.showWithGravityAndOffset(
            "Insuffient funds",
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25,
            50
          );
          nav(res.data.message);
        } else {
          ToastAndroid.showWithGravityAndOffset(
            "Error On Transaction",
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25,
            50
          );
          nav("Error On Transaction");
        }
      })
      .catch(function (err) {
        loader(false);
        console.log("withdraw api err", err);
      });
  };

  useEffect(() => {
    getNotificationStatus();
    getDefaultCurrency();
  }, []);

  useEffect(() => {
    setTotalConvertedVal(transactionDataFromRedux.item.singleValue)
  }, [defaultCurrency]);

  //get Notification status from db
  const getNotificationStatus = (value) => {
    getRealm()
      .then((realm) => {
        var pushNotificationVal = realm.objects("pushNotificationStatus");
        if (pushNotificationVal.length != 0) {
          setPushNotificationStatus(pushNotificationVal[0].notificationStatus);
        } else {
          setPushNotificationStatus("false");
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "pushNotificationStatus err from localDb");
      });
  };

  const nav = (msg) => {
    if (pushNotificationStatus == "true") {
      showNotification(
        "Send",
        transactionDataFromRedux.amount +
        transactionDataFromRedux.item.currency +
        " " +
        msg
      );
    }

    props.navigation.navigate("WalletHome");
  };

  //get DefaultCurrency from db
  const getDefaultCurrency = () => {
    getRealm()
      .then((realm) => {
        var defaultCurrencyVal = realm.objects("defaultCurrency");
        if (defaultCurrencyVal.length == 0) {
          setDefaultCurrency("USD");
        } else {
          setDefaultCurrency(defaultCurrencyVal[0].defaultCurrency);
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "defaultCurrency err from localDb");
      });
  };


  useEffect(() => {
    getConvertedValueForSendAmount();
    getConvertedValueForTotalBal();
  }, [amountToBeSend, totalConvertedVal]);

  const getConvertedValueForSendAmount = () => {
    const val = (parseFloat(amountToBeSend) * totalConvertedVal).toFixed(6);
    setConvertValForEnteredAmount(val);
  };

  const getConvertedValueForTotalBal = () => {
    const val = (
      parseFloat(transactionDataFromRedux.item.balance) * totalConvertedVal
    ).toFixed(6);
    setConvertValForTotalBal(val);
  };
  return (
    <SafeAreaView style={style.container}>
      {/* <LinearGradient colors={theme.theme == 'light' ? ['#fff', '#fff'] : ['#151918', '#171515']}
        useAngle={true}
        angle={170}
        style={{ width: "100%", height: "100%" }}
      > */}
        <Header
          name={"Transfer" + " " + transactionDataFromRedux.item.currency}
          leftImage={"back"}
        />
        <ScrollView>
          {/* total balance details */}
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginTop: "10%",
            }}
          >
            <Text
              style={{
                color:theme.text,
                fontFamily: Fonts.Bold,
                fontSize: 20,
              }}
            >
              Total Balance:
            </Text>
            <Text
              style={{
                color: theme.text,
                fontFamily: Fonts.Regular,
                fontSize: 30,
              }}
            >
              {transactionDataFromRedux.item.balance.toFixed(6)}{" "}
              {transactionDataFromRedux.item.currency}
            </Text>

            <Text
              style={{
                color: "grey",
                fontFamily: Fonts.Bold,
                fontSize: 14,
              }}
            >
              {(defaultCurrency == "USD" && "$") ||
                (defaultCurrency == "GBP" && "£") ||
                (defaultCurrency == "EUR" && "€")}{" "}
              {convertValForTotalBal}
            </Text>
          </View>

          {/* amount to be send details */}
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginTop: "10%",
            }}
          >
            <Text
              style={{
                color:theme.text,
                fontFamily: Fonts.Bold,
                fontSize: 20,
              }}
            >
              Amount to be Send:
            </Text>
            <Text
              style={{
                color: theme.text,
                fontFamily: Fonts.Regular,
                fontSize: 30,
              }}
            >
              {amountToBeSend} {transactionDataFromRedux.item.currency}
            </Text>

            <Text
              style={{
                color: "grey",
                fontFamily: Fonts.Bold,
                fontSize: 14,
              }}
            >
              {(defaultCurrency == "USD" && "$") ||
                (defaultCurrency == "GBP" && "£") ||
                (defaultCurrency == "EUR" && "€")}{" "}
              {convertValForEnteredAmount}
            </Text>
          </View>

          <Card
            containerStyle={{
              borderRadius: 10,
              elevation: 5,
              width: "90%",
              alignSelf: "center",
              borderColor: theme.cardBackground,
              backgroundColor: theme.cardBackground,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <Text
                style={{
                  color: theme.text,
                  fontFamily: Fonts.Bold,
                  fontSize: 14,
                }}
              >
                Asset:
              </Text>

              <Text
                style={{
                  color: "grey",
                  fontFamily: Fonts.Bold,
                  fontSize: 14,
                }}
              >
                {transactionDataFromRedux.item.currencyName}{" "}
                {transactionDataFromRedux.item.currency}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <Text
                style={{
                  color: theme.text,
                  fontFamily: Fonts.Bold,
                  fontSize: 14,
                }}
              >
                From:
              </Text>

              <Text
                style={{
                  color: "grey",
                  fontFamily: Fonts.Bold,
                  fontSize: 14,
                }}
              >
                {transactionDataFromRedux.item.walletaddress.substring(0, 10)}....
                {transactionDataFromRedux.item.walletaddress.substring(32, 42)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <Text
                style={{
                  color: theme.text,
                  fontFamily: Fonts.Bold,
                  fontSize: 14,
                }}
              >
                To:
              </Text>

              <Text
                style={{
                  color: "grey",
                  fontFamily: Fonts.Bold,
                  fontSize: 14,
                }}
              >
                {transactionDataFromRedux.toAddress.substring(0, 10)}....
                {transactionDataFromRedux.toAddress.substring(32, 42)}
              </Text>
            </View>
          </Card>
          {isLoading == true ? (
            <Button
              loading
              buttonStyle={{
                borderRadius: 2,
                height: 45,
                width: "90%",
                alignSelf: "center",
                marginTop: 20,
                backgroundColor:theme.cardBackground,
                elevation:0.5,
                borderColor: theme.cardBackground,
              }}
              titleStyle={{ fontFamily: Fonts.Bold }}
            />
          ) : (
            <Button
              title={"Transfer"}
              buttonStyle={{
                borderRadius: 2,
                height: 45,
                width: "90%",
                alignSelf: "center",
                marginTop: 20,
                backgroundColor:theme.cardBackground,
                elevation:0.5,
                borderColor: theme.cardBackground,
              }}
              color={theme.text}
              titleStyle={{ fontFamily: Fonts.Bold ,color:theme.text}}
              onPress={() => {
                withdrawApiCall();
              }}
            />
          )}
        </ScrollView>
      {/* </LinearGradient> */}
    </SafeAreaView>
  );
};
export default ConfirmSend;

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
    },
  });
