import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Fonts } from "../utils/Fonts";
import { Images } from "../utils/Images";
import themeContext from "../utils/themeContext";
import { useFocusEffect } from "@react-navigation/native";
import getRealm from "../localDb/RealmConfig";
import { useDispatch, useSelector } from "react-redux";
import { showImage } from '../utils/showImage';

const ItemBox = (props) => {
  //redux

  const fiatDatafromredux = useSelector(
    (state) => state.fiatDataReducer.fiatData
  );

  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  //for getting default currency
  const [defaultCurrency, setDefaultCurrency] = React.useState("");
  const [totalBalance, setTotalBalance] = React.useState("");

  useFocusEffect(
    React.useCallback(() => {
      getDefaultCurrency();
      getTotalBalance();
      return () => { };
    }, [])
  );

  //get total balance from db
  const getTotalBalance = () => {
    getRealm()
      .then((realm) => {
        var totalBalanceVal = realm.objects("totalBalance");

        if (totalBalanceVal.length == 0) {
          saveTotalBalance("0");
        } else {
          setTotalBalance(totalBalanceVal[0].totalBalance);
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "totalBalance err from localDb");
      });
  };

  //save total balance
  const saveTotalBalance = (value) => {
    getRealm()
      .then((realm) => {
        var totalBalanceVal = realm.objects("totalBalance");

        if (totalBalanceVal.length == 0) {
          //for create totalBalance status first time
          let initialVal;
          realm.write(() => {
            initialVal = realm.create("totalBalance", {
              totalBalance: value,
            });
          });
        } else {
          //for update totalBalance value
          realm.write(() => {
            totalBalanceVal[0].totalBalance = value;
          });
        }
        setTotalBalance(totalBalanceVal[0].totalBalance);
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "totalBalance err from localDb");
      });
  };

  //get DefaultCurrency from db
  const getDefaultCurrency = () => {
    getRealm()
      .then((realm) => {
        var defaultCurrencyVal = realm.objects("defaultCurrency");
        if (defaultCurrencyVal.length == 0) {
          savedefaultCurrency("USD");
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

  //local db to save defaultCurrency status
  const savedefaultCurrency = (value) => {
    getRealm()
      .then((realm) => {
        var defaultCurrencyVal = realm.objects("defaultCurrency");

        if (defaultCurrencyVal.length == 0) {
          //for create defaultCurrency status first time
          let initialVal;
          realm.write(() => {
            initialVal = realm.create("defaultCurrency", {
              defaultCurrency: value.toString(),
            });
          });
        } else {
          //for update defaultCurrency value
          realm.write(() => {
            defaultCurrencyVal[0].defaultCurrency = value.toString();
          });
        }
        setDefaultCurrency(defaultCurrencyVal[0].defaultCurrency);
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "defaultCurrency err from localDb");
      });
  };

  const rightSwipe = () => {
    return (
      <TouchableOpacity onPress={props.handleDelete} activeOpacity={0.6}>
        <View style={style.deleteBox}>
          <Text
            style={{
              fontFamily: Fonts.Bold,
              textAlign: "center",
              color: theme.text,
            }}
          >
            Hide Now
          </Text>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <Swipeable renderRightActions={rightSwipe}>
      <View style={style.container}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ alignSelf: "center" }}>{showImage(props.data)}</View>
            <View style={{ flexDirection: "column", marginHorizontal: 10 }}>
              <Text
                style={{
                  fontFamily: Fonts.Bold,
                  fontSize: 14,
                  color: theme.text,
                }}
              >
                {props.data.currencyName}
              </Text>

              <View style={{ flexDirection: "row" }}>
                {props.data.currency == "ETH" &&
                  fiatDatafromredux.length != 0 &&
                  fiatDatafromredux[0].eth != undefined && (
                    <Text
                      style={{
                        fontFamily: Fonts.Regular,
                        fontSize: 14,
                        color: theme.text,
                      }}
                    >
                      {(defaultCurrency == "USD" && "$") ||
                        (defaultCurrency == "GBP" && "£") ||
                        (defaultCurrency == "EUR" && "€")}{" "}
                      {fiatDatafromredux[0].eth.toFixed(2)}
                    </Text>
                  )}
                {props.data.currency == "BNB" &&
                  fiatDatafromredux.length != 0 &&
                  fiatDatafromredux[1].bnb != undefined && (
                    <Text
                      style={{
                        fontFamily: Fonts.Regular,
                        fontSize: 14,
                        color: theme.text,
                      }}
                    >
                      {(defaultCurrency == "USD" && "$") ||
                        (defaultCurrency == "GBP" && "£") ||
                        (defaultCurrency == "EUR" && "€")}{" "}
                      {fiatDatafromredux[1].bnb.toFixed(2)}
                    </Text>
                  )}
                {props.data.currency == "TRX" &&
                  fiatDatafromredux.length != 0 &&
                  fiatDatafromredux[2].trx != undefined && (
                    <Text
                      style={{
                        fontFamily: Fonts.Regular,
                        fontSize: 14,
                        color: theme.text,
                      }}
                    >
                      {(defaultCurrency == "USD" && "$") ||
                        (defaultCurrency == "GBP" && "£") ||
                        (defaultCurrency == "EUR" && "€")}{" "}
                      {fiatDatafromredux[2].trx.toFixed(2)}
                    </Text>
                  )}
                {props.data.currency == "BTC" &&
                  fiatDatafromredux.length != 0 &&
                  fiatDatafromredux[3].btc != undefined && (
                    <Text
                      style={{
                        fontFamily: Fonts.Regular,
                        fontSize: 14,
                        color: theme.text,
                      }}
                    >
                      {(defaultCurrency == "USD" && "$") ||
                        (defaultCurrency == "GBP" && "£") ||
                        (defaultCurrency == "EUR" && "€")}{" "}
                      {fiatDatafromredux[3].btc.toFixed(2)}
                    </Text>
                  )}
                {/* <Text
                  style={{
                    fontFamily: Fonts.Bold,
                    fontSize: 14,
                    color: "grey",
                  }}
                >
                  {" "}
                  ${props.data.usdamount.toFixed(2)}
                </Text> */}
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text
              style={{ fontFamily: Fonts.Normal, fontSize: 14, color: theme.text }}
            >
              {props.data.balance.toFixed(6)}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.Bold,
                fontSize: 14,
                color: theme.text,
              }}
            >
              {" "}
              {props.data.currency}
            </Text>
          </View>
        </View>
      </View>
    </Swipeable>
  );
};

export default ItemBox;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      padding: 16,
    },
    deleteBox: {
      backgroundColor: theme.tabbg,
      justifyContent: "center",
      alignItems: "center",
      width: 100,
      height: 60,
    },
  });
