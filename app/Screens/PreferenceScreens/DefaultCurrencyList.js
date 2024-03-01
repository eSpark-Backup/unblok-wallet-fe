import React, { useContext, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import themeContext from "../../utils/themeContext";
import getRealm from "../../localDb/RealmConfig";
import Header from "../../Components/Header";
import { Colors } from "../../utils/Colors";
import { Images } from "../../utils/Images";
import { Fonts } from "../../utils/Fonts";
import { RadioButton } from "react-native-paper";
import ApiClient from "../../api/ApiClient";
import { ApiConstants } from "../../api/ApiConstants";
import LinearGradient from "react-native-linear-gradient";
import TokenClient from "../../api/TokenClient";
import { RFPercentage } from "react-native-responsive-fontsize";
import { windowWidth, windowheight } from "../../utils/Dimensions";
const DefaultCurrencyList = (props) => {
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [defaultCurrency, setDefaultCurrency] = React.useState("");
  const [fiatData, setFiatData] = React.useState("");

  useEffect(() => {
    get_fiat_api();
  }, []);

  const get_fiat_api = () => {
    TokenClient.get(ApiConstants.fiatcurrency)
      .then(function (res) {
        // console.log("fiatcurrency api res", res.data.data);
        setFiatData(res.data.data);
      })
      .catch(function (err) {
        console.log("fiatcurrency api err", err);
      });
  };

  useEffect(() => {
    getDefaultCurrency();
  }, []);

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
        console.log(err, "pushNotificationStatus err from localDb");
      });
  };

  //local db to save defaultCurrency status
  const savedefaultCurrency = (value) => {
    setDefaultCurrency(value)
    // console.log("value", value);
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
        <Header name={"Currency"} leftImage={"back"} />
        <View style={{ marginTop: 20, width: "85%", alignSelf: "center" }}>
          {fiatData.length != 0 ? (
            <>
              {fiatData.map((item, index) => {
                return (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 20,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* <TouchableOpacity onPress={() => props.navigation.navigate("Currency")}> */}
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(1.9),
                            textAlign: "center",
                            color: theme.theme == "light" ? "#000" : "#fff",
                          }}
                        >
                          {item.symbol} - {item.Name}
                        </Text>
                        {/* </TouchableOpacity> */}
                      </View>
                      <TouchableOpacity
                        style={{
                          width: 20,
                          height: 20,
                          borderColor:
                            defaultCurrency === item.symbol
                              ? "rgba(162, 121, 250, 0.30)"
                              : theme.theme == "light"
                              ? "#000"
                              : "#fff",
                          borderWidth:
                            defaultCurrency === item.symbol ? 0 : 0.5,
                          borderRadius: 2,
                        }}
                        onPress={() => savedefaultCurrency(item.symbol)}
                      >
                        {defaultCurrency == item.symbol ? (
                          <Text
                            style={{
                              backgroundColor: "#612CD2",
                              borderColor: "rgba(162, 121, 250, 0.30)",
                              borderRadius: 0.5,
                              width: 20,
                              height: 20,
                              position: "relative",
                            }}
                          ></Text>
                        ) : (
                          <></>
                        )}
                      </TouchableOpacity>
                    </View>
                    {index !== fiatData.length - 1 && (
                      <Image
                        style={{ width: "100%", height: 1 }}
                        source={require("../../assets/img/deviderPNG.png")}
                        resizeMode="cover"
                      />
                    )}
                  </>
                );
              })}
            </>
          ) : (
            <></>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default DefaultCurrencyList;

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
  });
