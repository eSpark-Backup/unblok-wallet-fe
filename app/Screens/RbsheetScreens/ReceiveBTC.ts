import React, { useContext, useRef, useState } from "react";
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
  Dimensions,
  BackHandler,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Fonts } from "../../utils/Fonts";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { Searchbar } from "react-native-paper";
import { Images } from "../../utils/Images";
import { Colors } from "../../utils/Colors";
import ReactNativePinView from "react-native-pin-view";
import { useSelector } from "react-redux";
import Clipboard from "@react-native-community/clipboard";
import QRCode from "react-native-qrcode-svg";
import { CopyAddress, myCustomShare } from "./common/Receive_BTC";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Icon as Icn, Switch, Card } from "react-native-elements";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { useFocusEffect } from "@react-navigation/native";
export default function ReceiveBTC(props) {
  const theme = useContext(themeContext);
  const style = styles(theme);

  const walletDetailsFromRedux = useSelector(
    (state) => state.walletDetailReducer.currencyList
  );
  const { width, height } = Dimensions.get("window");
  const isPhone = width < 600;

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        props.navigation.goBack();
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

  return (
    <>
        <StatusBar barStyle={theme.theme == "light" ? "dark-content" : "light-content"} backgroundColor={theme.theme==="dark"?"rgb(25,14,47)":"#ffffff"} />
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
          <Header
            name={"Receive" + " " + walletDetailsFromRedux.currency}
            leftImage={"back"}
            rightImage={"CONTINUE"}
          />

          <View>
            {/* <View style={{
            flexDirection: "column", alignItems: 'center', justifyContent: "space-around", marginTop: "10%",
            backgroundColor: "#fff", height: 200, padding: 10, marginLeft: "auto", marginRight: "auto", borderRadius: 20, width: isPhone ? "50%" : "40%",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.00,

            elevation: 24,
          }}>
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "center", }}>

              <QRCode color={"#000"} value={walletDetailsFromRedux.walletaddress} size={120} />

            </View>
            <Text
              style={{
                color: theme.theme == "light" ? "#000" : "#000",
                textAlign: "center",
                fontFamily: Fonts.SemiBold,
                marginTop: "5%",
                fontSize: isPhone ? RFPercentage(1.8) : RFPercentage(1.5)
              }}
            >
              {walletDetailsFromRedux.walletaddress}
            </Text>
          </View> */}

            <Card
              containerStyle={{
                borderRadius: 2,
                elevation: 0,
                alignSelf: "center",
                borderColor: theme.theme==="dark"? "white":"transparent",
                backgroundColor:theme.theme==="dark"? "white":"transparent",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                padding: "6%",
                marginTop: "10%",
              }}
            >
              <View style={{ alignSelf: "center", alignItems: "center" }}>
                <QRCode
                  color={"#000"}
                  value={walletDetailsFromRedux.walletaddress}
                  size={120}
                />
              </View>
            </Card>

            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "5%",
                padding: "3%",
                width: "85%",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: theme.theme === "dark" ? "white" : "black",
                  fontSize: RFPercentage(1.6),
                  fontFamily: Fonts.Regular,
                  width: "80%",
                  textAlign: "center",
                  marginHorizontal: 20,
                }}
              >
                Send only {walletDetailsFromRedux.currencyName} -{" "}
                {walletDetailsFromRedux.currency} to this address. Sending any
                other coins may result in permanent loss.
              </Text>
              <Image
                style={{
                  width: "100%",
                  height: 1.5,
                  marginBottom: 10,
                  marginTop: "12%",
                }}
                source={require("../../assets/img/devider.png")}
                resizeMode="cover"
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "5%",
                width: "90%",
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  width: "75%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderColor: "rgba(162, 121, 250, 0.30)",
                  borderWidth: 2,
                  backgroundColor: "rgba(155, 124, 220, 0.15)",
                  padding: 8,
                  borderRadius: 5,
                  height: 50,
                  marginRight: "2%",
                }}
              >
                <Text
                numberOfLines={1}
                  style={{
                    color: theme.theme === "dark" ? "#A279FA" : "#A279FA",
                    fontSize: RFPercentage(1.8),
                    fontFamily: Fonts.Regular,
                    width: "75%",
                    marginLeft:10
                  }}
                >
                  {walletDetailsFromRedux.walletaddress}
                  {/* 21568842385744xz84c5 */}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    CopyAddress(walletDetailsFromRedux.walletaddress);
                  }}
                >
                   <Icn
                    name="content-copy"
                    type="MaterialIcons"
                    style={{
                      alignSelf: "center",
                      transform: [{ scaleX: -1 }],
                    }}
                    color="#A279FA"
                    size={22}
                  />
                  {/* <Image
                    source={require("../../assets/img/paste.png")}
                    style={{ width: 20, height: 18, resizeMode: "contain" }}
                  /> */}
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderColor: "rgba(162, 121, 250, 0.30)",
                  borderWidth: 2,
                  backgroundColor: "rgba(155, 124, 220, 0.15)",
                  padding: 12,
                  borderRadius: 5,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    myCustomShare(walletDetailsFromRedux.walletaddress);
                  }}
                >
                  {/* <Image source={Images.share} style={{ width: 40, height: 40, resizeMode: "contain" }} /> */}
                  <Icn
                    name="share"
                    type="entypo"
                    style={{
                      alignSelf: "center",
                    }}
                    color="#A279FA"
                    size={22}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
      borderRadius: 30,
      backgroundColor: "#fff",
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
  });
