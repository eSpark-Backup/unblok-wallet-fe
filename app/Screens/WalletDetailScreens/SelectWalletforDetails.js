import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  ScrollView,
  BackHandler,
  ImageBackground,
  StatusBar
} from "react-native";
import themeContext from "../../utils/themeContext";
import getRealm from "../../localDb/RealmConfig";
import Header from "../../Components/Header";
import { Fonts } from "../../utils/Fonts";
import { Images } from "../../utils/Images";
import { Colors } from "../../utils/Colors";
import { RadioButton, Searchbar } from "react-native-paper";
import { Icon as Icn, Button } from "react-native-elements";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addWalletName } from "../../Redux/Actions/walletNameEditAction";
import LinearGradient from 'react-native-linear-gradient';
import ThreeDots from "../../assets/img/three-dots.svg";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { showImage } from "../../utils/showImage";
import isEmpty from "../../utils/isEmpty";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import WalletLight from '../../assets/icons/lighttheme/Wallet.svg'
import WalletDark from '../../assets/icons/darktheme/Wallet1.svg'
import { SvgUri } from 'react-native-svg';
import { GetChainid } from "../../api/common";

const _ = require("lodash");


const SelectWalletforDetails = (props) => {

  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);

  const selectedWalletNameDetails = useSelector(
    (state) => state.walletNameEditReducer.walletName
  );

  const selectedType = useSelector(
    (state) => state.walletNameEditReducer.showingType
  );

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        props.navigation.goBack()
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  var defaultCurrency = ["ETH", "BNB", "MAT", "BTC"]

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
      <Header name={"Select Network"} leftImage={"customBack"}
      />

      <View style={{ height: "82.5%", marginTop: "5%", }} >
        <ScrollView>
          {selectedWalletNameDetails && _.map(selectedWalletNameDetails.item.wallets, (item, index) => (
            defaultCurrency.includes(item.currency) ?
             <View
              key={Math.random()}
            >
              <View
                style={{
                  borderColor:"rgba(162, 121, 250, 0.30)",
                borderWidth:2,
                backgroundColor:"rgba(155, 124, 220, 0.10)",
                borderRadius:5,
                width:"85%",
                padding:10,
                alignSelf:"center",
                paddingVertical:"3%",
                marginBottom:"3%",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    // marginTop: "5%",
                  }}
                >
                  {!isEmpty(item.currencyimage)
                    ?
                    <SvgUri
                      width={40}
                      height={40}
                      uri={`http:/192.53.121.26:8096/images/${item.currencyimage}`}
                    />
                    : showImage(item.tokenType, "walletlist")}
                  <View style={{ marginHorizontal: 10 }}>
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate(selectedType,item.currency);
                      }}>
                      <Text
                        style={{
                          color: theme.theme==="dark"?"white":"black",
                          fontFamily: Fonts.SemiBold,
                          fontSize: 18,
                          marginLeft: 5
                        }}
                      >
                        {item?.currencyName} - {item.currency}
                      </Text>
                      <Text
                      numberOfLines={1}
                        style={{
                          color: theme.theme==="dark"?"#696969":"#696969",
                          fontFamily: Fonts.Regular,
                          fontSize: 10,
                          marginLeft: 5,
                          width:"95%"
                        }}
                      >
                        {item.walletaddress}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View> : <></>
          ))}
        </ScrollView>
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default SelectWalletforDetails;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    seperatorLine: {
      height: 1,
      backgroundColor: "black",
    },
    customTokenTxt: {
      fontSize: RFPercentage(2.5),
      color: "#00B0FF",
      fontFamily: Fonts.Medium,
    },
    multiTxt: {
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(2.2),
      marginHorizontal: 10,
      // alignSelf: "center",
      color: theme.text,
    },
    flex: {
      flexDirection: "row",
    },
    IcnView: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: "2%",
      marginHorizontal: 5,
    },
    custsearch: {
      borderRadius: 10,
      backgroundColor: theme.background,
      borderColor: theme.search,
      borderWidth: 1,
      margin: 15,
      elevation: 0,
      fontFamily: Fonts.Bold,
      color: theme.text
    },
  });
