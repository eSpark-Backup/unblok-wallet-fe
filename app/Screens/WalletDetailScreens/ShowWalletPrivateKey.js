import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  SafeAreaView,
  BackHandler,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
} from "react-native";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { Colors } from "../../utils/Colors";
import { Fonts } from "../../utils/Fonts";
import { Icon as Icn, Switch, Card } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import Share from "react-native-share";
import QRCode from "react-native-qrcode-svg";
import Clipboard from "@react-native-community/clipboard";
import { useFocusEffect } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { EncodePrivateKey } from "../../utils/common";
import { Images } from "../../utils/Images";
import { windowWidth, windowheight } from "../../utils/Dimensions";

const ShowWalletPrivateKey = (props) => {
  //redux
  const selectedWalletNameDetails = useSelector(
    (state) => state.walletNameEditReducer.walletName
  );

  console.log("apapwdawdawda", props.route.params);
  var para = props.route.params
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  var PrivKey = EncodePrivateKey(selectedWalletNameDetails.item.wallets[para == "BTC" ? 3 : 0].privKey)
  console.log('selectedWalletNameDetails', JSON.stringify(selectedWalletNameDetails, null, 2))
  const myCustomShare = async () => {
    // var PrivKey = EncodePrivateKey(selectedWalletNameDetails.item.wallets[0].privKey)

    const shareOptions = {
      message: PrivKey?.substring(0, 2) == "0x" ? PrivKey?.substring(2) : PrivKey,
    };
    try {
      const ShareResponse = await Share.open(shareOptions);
      //console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      //console.log('Error => ', error);
    }
  };
  console.log("selectedWalletNameDetails", JSON.stringify(selectedWalletNameDetails, null, 2));

  const CopyAddress = () => {
    // var PrivKey = EncodePrivateKey(selectedWalletNameDetails.item.wallets[0].privKey)

    ToastAndroid.showWithGravityAndOffset(
      "Address Copied!",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50
    );
    Clipboard.setString(PrivKey?.substring(0, 2) == "0x" ? PrivKey?.substring(2) : PrivKey);
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        props.navigation.navigate("ShowWalletDetails");
      };
      // Add Event Listener for hardwareBackPress
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        // Once the Screen gets blur Remove Event Listener
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

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
      <Header name={"View Private Key"} leftImage={"walletDetails"} />
      <ScrollView>
        <View>
          {/* <View style={{
            flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 50,
            marginBottom: 30
          }}>
            {theme.theme == "light" ?
                (<LLogo />)
                : (<DLogo />)
              }
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
                value={
                  PrivKey?.substring(0, 2) == "0x" ?
                    PrivKey?.substring(2) :
                    PrivKey}
                    size={120}
              />
            </View>
            {/* <Text
              style={{
                color: theme.text,
                textAlign: "center",
                fontFamily: Fonts.Regular,
                marginTop: "5%",
                fontSize: RFPercentage(1.8),

              }}
            >
              {
                PrivKey?.substring(0, 2) == "0x" ?
                  PrivKey?.substring(2) :
                  PrivKey}
            </Text> */}
          </Card>
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
                  { PrivKey?.substring(0, 2) == "0x" ?
                    PrivKey?.substring(2) :
                    PrivKey}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    CopyAddress();
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
                    myCustomShare();
                  }}
                >
                 
                  <Icn
                    name="share"
                    type="entypo"
                    style={{
                      alignSelf: "center",
                    }}
                    color="#612CD2"
                    size={22}
                  />
                </TouchableOpacity>
              </View>
            </View>
          
        </View>
      </ScrollView>

      <Card
        containerStyle={{
          elevation: 0,
            alignItems: "center",
            backgroundColor: "transparent",
            marginBottom: 10,
            marginTop: -20,
            borderColor: "transparent",
            width: "80%",
            alignSelf: "center",
        }}
      >
         <Image
            style={{
              width: "100%",
              height: 1,
              marginBottom: 20,
              marginTop: 20,
            }}
            source={require("../../assets/img/devider.png")}
            resizeMode="cover"
          />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                fontFamily: Fonts.Bold,
                fontSize: RFPercentage(1.8),
                color: "#A279FA",
                alignSelf: "center",
                marginBottom: 20,
                fontWeight:"bold"
              }}
            >
              Do not share your Private key!
            </Text>
            <Text
              style={{
                fontFamily: Fonts.Regular,
                  fontSize: RFPercentage(1.6),
                  alignSelf: "center",
                  color: theme.theme === "dark" ? "white" : "black",
                  textAlign: "center",
              }}
            >
              Warning: Never disclose this key. Anyone with your private keys can steal any assets held in your account.
            </Text>
          </View>
        </View>
      </Card>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default ShowWalletPrivateKey;

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
