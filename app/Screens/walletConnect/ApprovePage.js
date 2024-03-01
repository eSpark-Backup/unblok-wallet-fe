


import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Image,
  ImageBackground
} from "react-native";
// import { Image } from "react-native-elements";
import { Card } from "react-native-shadow-cards";

import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header";
import getRealm from "../../localDb/RealmConfig";
import { Fonts } from "../../utils/Fonts";
import themeContext from "../../utils/themeContext";
import { CHAIN_INFO } from "../DappScreens/useWeb3";

// import Logo from "../../assets/img/opeansea.svg";
import SheildLight from "../../assets/icons/lighttheme/Biometric Authentication.svg";
import WalletDarkk from "../../assets/icons/darktheme/Wallet.svg";
import WalletLight from "../../assets/icons/lighttheme/Wallet.svg";
import SheildDark from "../../assets/icons/darktheme/Biometric Authentication.svg";
import { Approvesession_WC2, connector } from "./WC2";
import { Toastfn } from "../../utils/toast";
import { Images } from "../../utils/Images";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
const ApprovePage = (props) => {
  const walletDetailsFromRedux = useSelector(
    (state) => state.walletDetailReducer.currencyList
  );
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // BackHandler.exitApp();
        //////console.log("come");
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        //  props?.navigation?.setParams({ data: null });
      };
    }, [])
  );
  const { Session, version, namespaces, payload, from, Site_Detail } = useSelector(
    (state) => state.wcreducer
  );
  console.log("session11111111", Session?.chainId)
  const dispatch = useDispatch();
  const Approve = async () => {
    try {

      var data = await Approvesession_WC2(
        // Session.connector,
        {
          id: Session?.payload?.id,
          relayProtocol: Session?.payload?.params?.relays[0].protocol,
          namespaces: Session?.namespaces,
        }
      );

      // console.log("Session>>>>.....",JSON.stringify(Session?.payload,null,2),JSON.stringify(data,null,2))
      dispatch({
        type: "Session",
        data: {
          Connected: true, Loader: false, time: new Date(), topic: data.topic,
          WC_Connector: connector, StopAction: false,
          url: null
        },
      });

      getRealm()
        .then((realm) => {
          var WC_Connect = realm.objects("WC");
          realm.write(() => {
            if (WC_Connect.length > 0) WC_Connect[0].WC = data.topic;
            else {
              realm.create("WC", { WC: data.topic });
            }
          });
        })
        .catch((e) => {
          console.error("Approve oage err", e);
        });
      console.log("props?.route?.params?.from", props?.route?.params?.from);
      if (props?.route?.params?.from) {
        props.navigation.navigate("Dapplatest", { Approve: true });
      }
      if (from) {
        dispatch({
          type: "url",
          data: from
        });
        props.navigation.navigate("Dapplatest");

      }
      else {
        props.navigation.navigate("WalletConnect", { Approve: true });
      }
      //////console.log("data", data);
    } catch (e) {
      console.error("data-error", e);
      Toastfn("Try Again")
      props.navigation.navigate("WalletConnect", { Approve: false });

    }
  };
  //console.log("Session?.payload2",Session)
  const current_chain = (chainId) => CHAIN_INFO.filter(
    (it) => it.chainId == chainId
  )?.pop();

  // const current_walletname = (walletaddress) => wallet.filter(it=>it.walletaddress == walletaddress)?.pop()?.walletname

  const theme = useContext(themeContext);
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const Current_Network_detail = CHAIN_INFO.filter(
    (it) => it.currency == Session?.lp?.currency
  )?.pop();
  // console.log(
  //   "Site_Detail?.icons",
  //   Session?.payload?.params?.proposer
  // )
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
       <ImageBackground
        source={theme.theme === "light" ? Images.backgroundWhite : Images.background}
        style={{
          width: windowWidth,
          height: windowheight,
        
        }}
        resizeMode="cover"
      >
      <View>
        <Header name={"New Connection"} leftImage={"back"} />

      </View>
      <ScrollView style={{ marginBottom: 20, marginTop: 50 }}>
        <View style={{ justifyContent: "center", alignContent: 'center', alignItems: 'center' }}>
          <Image
            source={{
              uri: Site_Detail?.icons[0] ??
                Site_Detail?.icons[0]
            }}

            // style={{ height: 40, width: 40 }
            // width={width * 0.15} height={width * 0.15}
            style={{ alignSelf: "center", resizeMode: "contain", alignItems: 'center', width: 50, height: 50, marginBottom: 20 }}
          />

          {/* <Logo width={width * 0.15} height={width * 0.15} style={{ alignSelf: "center", resizeMode: "contain", }} /> */}
          <View style={{ width: "70%", alignSelf: "center", marginTop: "2%" }}>
            <Text
              style={{
                color: theme.theme === "dark" ? "#fff" : "black",
                fontFamily: Fonts.Bold,
                fontSize: RFPercentage(2.3),
                fontWeight:"bold",
                textAlign: "center",
                marginBottom: 10
              }}
            >
              {Site_Detail?.name ??
                Site_Detail?.name}{" "}
              - wants to connect to your wallet
            </Text>
            <Text
              style={{
                fontFamily: Fonts.Medium,
                fontSize: RFPercentage(2),
                color: theme.theme === "dark" ? "#c9c9c9" : "gray",
                textAlign: "center",
                marginTop: "3%",
              }}
            >
              {/* {Site_Detail?.description ??
                Site_Detail?.description} */}
                UNBLOK Marketplace
            </Text>
          </View>
          <View style={{ width: "85%", alignSelf: "center", marginTop: "5%" }}>
            <Text
              style={{
                fontFamily: Fonts.Medium,
                fontSize: RFPercentage(2.1),
                color:  theme.theme === "dark" ? "#fff" : "black",
                textAlign: "center",
                marginTop: "3%",
              }}
            >
              {(current_chain(Session?.chainId)?.name)}

            </Text>

            <View
              style={{
                width: "100%",
                marginTop: "5%",
                alignSelf: "center",
                borderColor:"rgba(162, 121, 250, 0.30)",
                borderWidth: 2,
                paddingVertical: "1%",
                borderRadius: 5,
                justifyContent: "space-evenly",
                paddingVertical: "5%",
                flexDirection: "row",
                backgroundColor: theme.theme == "dark" ? "rgba(155, 124, 220, 0.15)" : "rgba(155, 124, 220, 0.15)",
minHeight:49
              }}
            >
              
              {current_chain(Session?.chainId)?.img &&
                <View
                  style={{
                    width: 60,
                    alignItems: "center",
                    justifyContent: "center",
                    // width: 40, height: 40
                  }}
                >
                  {/* <Image
                source={Current_Network_detail?.img}
                style={{ width: 40, height: 40 }}
              /> */}
                  {console.log("Session?.chainId", current_chain((Session?.chainId)))}
                  {current_chain(Session?.chainId)?.img}
                </View>}

              <View style={{ width: "85%", justifyContent: "center", }}>
                {current_chain(Session?.chainId)?.currency &&
                  <Text
                    style={{
                      fontFamily: Fonts.Bold,
                      fontSize: RFPercentage(2),
                      color:theme.theme === "dark" ? "#fff" : "black",
                      marginLeft: 10,
                    }}
                  >
                    {current_chain(Session?.chainId)?.currency}
                  </Text>
                   } 
                {Session?.lp?.walletaddress &&
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: Fonts.Regular,
                      fontSize:  RFPercentage(2),
                      color: theme.theme === "dark" ? "#fff" : "black",
                      marginLeft: 10,
                      marginTop: "1%",
                      width: "90%",
                    }}
                  >
                    {Session?.lp?.walletaddress}
                  </Text>
                  }
              </View>
            </View>


            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-start",
                width: "80%",
                marginTop: "10%",
                alignItems: "flex-start",
              }}
            >
              {theme.theme == "dark" ? (
                <WalletDarkk width={25} height={25} />
              ) : (
                <WalletLight width={25} height={25} />
              )}
              <Text
                style={{
                  fontFamily: Fonts.Medium,
                  fontSize: RFPercentage(1.9),
                  color:theme.theme === "dark" ? "#fff" : "black",
                  marginLeft: "5%",
                  marginTop: "1%",
                }}
              >
                View your wallet balance and activity
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-start",
                width: "80%",
                marginTop: "5%",
                alignItems: "flex-start",
              }}
            >
              {theme.theme == "light" ? (
                <SheildLight width={26} height={26} />
              ) : (
                <SheildDark width={26} height={26} />
              )}
              <Text
                style={{
                  fontFamily: Fonts.Medium,
                  fontSize: RFPercentage(2),
                  color:theme.theme === "dark" ? "#fff" : "black",
                  marginLeft: "5%",
                  marginTop: "1%",
                }}
              >
                Request approval for transactions
              </Text>
            </View>
          </View>
        </View>

        <View style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center", marginBottom: 20, marginTop: 20
        }}>
          <TouchableOpacity
            style={{
              marginTop: "5%",
                          width: "85%",
                          height: 49,
                          backgroundColor:
                            theme.theme === "dark" ? "yellow" : "#612CD2",
                          // alignContent: "center",
                          // alignItems: "center",
                          justifyContent: "center",
                          border: 1,
                          borderRadius: 2,
            }}
            onPress={() => {
              Approve();
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.Bold,
                fontSize: RFValue(16),
                color: theme.theme === "light" ? "#fff" : "#000000",
                textAlign: "center",
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default ApprovePage;

const style = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    seperatorLine: {
      height: 0.5,
      backgroundColor: "grey",
    },
  });
