import React, { useEffect, useContext, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Icon as Icn } from "react-native-elements";
import themeContext from "../../utils/themeContext";
import { Card, Divider } from "react-native-elements";
import Header from "../../Components/Header";
import { Fonts } from "../../utils/Fonts";
import { useDispatch } from "react-redux";
import { importWallet } from "../../Redux/Actions/importWalletAction";
import { getTokenList, IconShowing } from './common/Import_Wallet';
import { showImage } from "../../utils/showImage";
import isEmpty from "../../utils/isEmpty";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import WalletLight from '../../assets/icons/lighttheme/Wallet.svg'
import WalletDark from '../../assets/icons/darktheme/Import Wallet.svg'
import { SvgUri } from 'react-native-svg';
import { Images } from "../../utils/Images";
import { RFPercentage } from "react-native-responsive-fontsize";
const _ = require("lodash");


const ImportWalletAfterCreate = (props) => {
  //redux
  const dispatch = useDispatch();
  const setImportDetailsRedux = (item) => dispatch(importWallet(item));

  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [tokenList, setTokenList] = useState([]);

  useEffect(() => {
    getTokenListFun()
  }, [getTokenListFun]);


  const getTokenListFun = async () => {
    var tokenList = await getTokenList();
    if (tokenList) {
      console.log("tokenList", tokenList);
      setTokenList(tokenList.data)
    } else {
      console.log("hellllo", tokenList);
    }
  }


  const nav = (tokenType, currencySymbol) => {
    setImportDetailsRedux({
      currency: currencySymbol,
      tokenType: tokenType,
    });
    if (tokenType != "MultiCoinToken") {
      props.navigation.navigate("ImportWalletTabAfterCreate");
    } else {
      props.navigation.navigate("ImportMultiCoinAfterCreate");
    }
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
      <Header name={"Import Wallet"} leftImage={"importWalletBack"} />
      <TouchableWithoutFeedback
        onPress={() => {
          nav("MultiCoinToken", "MultiCoin");
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 30,
            borderColor: "rgba(162, 121, 250, 0.30)",
            borderRadius: 5,
            borderWidth: 2,
            backgroundColor: "rgba(155, 124, 220, 0.10)",
            paddingHorizontal: 10,
            paddingVertical: 8,
            width: "85%",
            alignSelf: "center",
          }}
        >
          <View style={style.flex}>
            {/* <Image source={theme.theme == "light" ?  require('../../assets/img/walletimportd1.png'):require('../../assets/img/walletimportl1.png') } style={{ width: windowWidth * 0.08, height: windowheight * 0.05, resizeMode: "contain",aspectRatio:1 }} /> */}
            {theme.theme == "light" ? (
              <WalletLight width={40} height={40} fill={"#000"} />
            ) : (
              <WalletDark width={40} height={40} fill={"#fff"} />
            )}
            <Text style={style.multiTxt}>MultiCoin Wallet</Text>
          </View>
          {/* <View style={{ marginLeft: 135 }}>
          {theme.theme == 'light' ?
            (
              <Image source={require("../../assets/img/lthree-vertical.png")} />
            ) :
            (
              <Image source={require("../../assets/img/dthree-vertical.png")} />
            )
          }
        </View> */}
        </View>
      </TouchableWithoutFeedback>

      {tokenList.length == 0 ? (
        <View
          style={{
            flex: 0.8,
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator
            size="large"
            color={theme.theme == "light" ? "#000" : "#fff"}
          />
          <Text
            style={{
              fontFamily: Fonts.Bold,
              fontSize: 16,
              color: theme.theme == "light" ? "#000" : "#fff",
            }}
          >
            Please Wait...
          </Text>
        </View>
      ) : (
        <Card containerStyle={style.cardContainer}>
          {_.map(tokenList, (item, i) => {
            return (
              <TouchableWithoutFeedback
                key={item._id}
                onPress={() => {
                  nav(item.tokenType, item.currencySymbol);
                }}
              >
                <View style={{ marginHorizontal: 0 }}>
                  <View style={style.cardView}>
                  <View style={{ width: "12.5%", height: 40 }} >
                        {/* {!isEmpty(item.currencyimage)
                          ?
                      

                          <SvgUri
                            width={40}
                            height={40}
                            uri={`http:/192.53.121.26:8096/images/${item.currencyimage}`}

                          />
                          : showImage(item.tokenType)} */}
                      </View>
                    <Text style={style.currencyName}>
                      {item.currencyName}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </Card>
      )}
    </ImageBackground>
  </SafeAreaView>
  );
};

export default ImportWalletAfterCreate;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    multiTxt: {
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(2),
      marginHorizontal: 20,
      alignSelf: "center",
      color: theme.theme === "dark" ? "white" : "black",
    },
    cardView: {
      flexDirection: "row",
      marginTop: "2.5%",
      borderColor: "rgba(162, 121, 250, 0.30)",
      borderRadius: 5,
      borderWidth: 2,
      backgroundColor: "rgba(155, 124, 220, 0.10)",
      paddingHorizontal: 10,
      paddingVertical: 8,
      width: "92%",
      alignSelf: "center",
    },
    currencyName: {
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(2),
      alignSelf: "center",
      marginHorizontal: 20,
      color: theme.theme === "dark" ? "white" : "black",
    },
    flex: {
      flexDirection: "row",
    },
    logoStyle: {
      width: 30,
      height: 30,
      borderRadius: 20,
    },
    cardContainer: {
      width: "100%",
      alignSelf: "center",
      backgroundColor: "transparent",
      borderColor: "transparent",
      marginTop: 0,
      shadowColor: "transparent",
      paddingTop: 0,
    },
    cardContainer1: {
      width: "100%",
      alignSelf: "center",
      backgroundColor: "transparent",
      borderColor: "transparent",
      marginBottom: 0,
      paddingBottom: 0,
    },
  });
