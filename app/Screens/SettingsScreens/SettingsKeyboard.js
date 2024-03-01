import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Pressable,
  Animated,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Image } from "react-native-elements";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { Colors } from "../../utils/Colors";
import { Fonts } from "../../utils/Fonts";
import getRealm from "../../localDb/RealmConfig";
import { useFocusEffect } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import VoiceTypeLight from "../../assets/icons/lighttheme/Voice Typing.svg";
import VoiceTypeDark from "../../assets/icons/darktheme/Voice Typing.svg";
import Dapplight from "../../assets/icons/lighttheme/DApps.svg";
import DappDark from "../../assets/icons/darktheme/DApps.svg";
// import Walletlight from "../../assets/icons/lighttheme/WalletConnect.svg";
// import WalletDark from "../../assets/icons/darktheme/WalletConnect.svg";
import Walletlight from "../../assets/icons/lighttheme/Import Wallet.svg";
import WalletDark from "../../assets/icons/darktheme/Import Wallet.svg";
import WordPrdictionlight from "../../assets/icons/lighttheme/Word Prediction.svg";
import WordPrdictionDark from "../../assets/icons/darktheme/Word Prediction.svg";
import Clipboardlight from "../../assets/icons/lighttheme/Clipboard.svg";
import ClipboardDark from "../../assets/icons/darktheme/Clipboard.svg";
import LanguageDark from "../../assets/icons/darktheme/Language White.svg";
import LanguageLight from "../../assets/icons/lighttheme/Language Black.svg";
import ThemeDark from "../../assets/icons/darktheme/Theme White.svg";
import ThemeLight from "../../assets/icons/lighttheme/Theme Black.svg";
import Backlight from "../../assets/icons/lighttheme/Back arrow.svg";
import BackDark from "../../assets/icons/darktheme/Back arrow.svg";

import { Switch } from "react-native-switch";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { Images } from "../../utils/Images";
const SettingsKeyboard = (props) => {
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [mode, setMode] = useState(
    global.themeData != null &&
      (global.themeData == "true" || global.themeData == true)
      ? true
      : false
  );
  const [walletName, setWalletName] = useState("")
  const [isEnabled, setIsEnabled] = useState(false);
  const [keySpecs, setKeySpecs] = useState(JSON.parse(global.keyboardSettings))

  const { width, height } = Dimensions.get('window');
  const isPhone = width < 600;

  useFocusEffect(
    React.useCallback(() => {
      // getWalletName()
      setWalletName(global.walletName)
    }, [global.walletName])
  )

  const [settingsdata, setSettingsdata] = useState([
    {
      // iconlight: require("../../assets/img/footeri3.png"),
      // icondark: require("../../assets/img/footerd3.png"),
      iconlight: (
        <Dapplight
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      icondark: (
        <DappDark
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      active: keySpecs?.Dapp == "true" ? true : false,
      title: "DApp Browser",
      key: "Dapp",
    },
    {
      iconlight: (
        <VoiceTypeLight
          width={windowWidth * 0.06}
          height={windowWidth * 0.06}
          style={{ resizeMode: "contain" }}
        />
      ),
      icondark: (
        <VoiceTypeDark
          width={windowWidth * 0.06}
          height={windowWidth * 0.06}
          style={{ resizeMode: "contain" }}
        />
      ),
      active: keySpecs?.voice == "true" ? true : false,
      title: "Voice Typing",
      key: "voice",
    },
    {
      iconlight: (
        <Walletlight
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      icondark: (
        <WalletDark
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      active: keySpecs?.translate == "true" ? true : false,
      title: "Wallet",
      key: "translate",
    },
    {
      iconlight: (
        <WordPrdictionlight
          width={windowWidth * 0.08}
          height={windowWidth * 0.08}
          style={{ resizeMode: "contain" }}
        />
      ),
      icondark: (
        <WordPrdictionDark
          width={windowWidth * 0.08}
          height={windowWidth * 0.08}
          style={{ resizeMode: "contain" }}
        />
      ),
      active: keySpecs?.wordPrediction == "true" ? true : false,
      title: "Word Prediction",
      key: "wordPrediction",
    },
    {
      iconlight: (
        <Clipboardlight
          width={windowWidth * 0.06}
          height={windowWidth * 0.06}
          style={{ resizeMode: "contain" }}
        />
      ),
      icondark: (
        <ClipboardDark
          width={windowWidth * 0.06}
          height={windowWidth * 0.06}
          style={{ resizeMode: "contain" }}
        />
      ),
      active: false,
      title: "Clipboard",
      key: "Clipboard",
    },
    {
      iconlight: (
        <LanguageLight
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      icondark: (
        <LanguageDark
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      active: false,
      title: "Language",
      key: "Language",
    },
    {
      iconlight: (
        <ThemeLight
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      icondark: (
        <ThemeDark
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      active: false,
      title: "Theme",
      key: "Theme",
    },
  ]);

  const onChangeFunction = async (text, val, index) => {
    keySpecs[text] = `${val}`
    global.keyboardSettings = JSON.stringify(keySpecs)
    getRealm()
      .then((realm) => {
        var keyboardSpecs = realm.objects("keyboardSpecs")
        console.log("keyboardSpeceifrjs", keyboardSpecs);
        realm.write(() => {
          realm.delete(keyboardSpecs[0])
          realm.create("keyboardSpecs", { ...keySpecs })
        })
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log("errro on onchange function", err);
      })
    var data = [...settingsdata]
    data[index].active = !data[index].active
    setSettingsdata(data)

    }

  return (
    <SafeAreaView style={style.container}>
      <ImageBackground
        source={theme.theme==="dark"?Images.background:Images.backgroundWhite}
        style={{
          width: windowWidth,
          height: windowheight,
          paddingTop: StatusBar.windowheight,
        }}
        resizeMode="cover"
      >

          <>
              {/* <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: 15,
                  marginRight: 20,
                  marginTop: 30,
                  alignItems: "center",
                  marginBottom: 25,
                }}
              >
                <View>
                  <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    {theme.theme == "light" ? (
                      <Backlight
                        width={windowWidth * 0.1}
                        height={windowWidth * 0.1}
                        style={{ resizeMode: "contain" }}
                      />
                    ) : (
                      <BackDark
                        width={windowWidth * 0.08}
                        height={windowWidth * 0.08}
                        style={{ resizeMode: "contain" }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate("WalletList")}
                >
                  <Text
                    style={{
                      fontSize: RFPercentage(3),
                      color: theme.theme === "dark" ? "#FFF" : "#612CD2",
                      fontFamily: Fonts.Medium,
                    }}
                  >
                    Keyboard Settings
                  </Text>
                </TouchableOpacity>

                <View></View>
              </View> */}
              <Header name={"Keyboard Settings"} leftImage={"back"} />

              <View
                style={{
                  width: "100%",
                  height: "3%",
                  justifyContent: "center",
                }}
              >
                {/* <Text style={{ marginLeft: "7.5%", fontSize: RFPercentage(3), color: theme.text, fontFamily: Fonts.Regular, fontSize: RFPercentage(2.75), }} >keyboard Settings</Text> */}
              </View>
              <View style={{ width: "100%", height: "90%" }}>
                <ScrollView>
                  <View style={{ width: "90%", alignSelf: "center" }}>
                    {settingsdata.map((e, i) => (
                      <>
                        <View
                          style={{
                            flexDirection: "row",
                            width: "90%",
                            alignSelf: "center",
                            alignItems: "center",
                            height: windowheight * 0.075,
                            marginTop: "1%",
                          }}
                        >
                          <View
                            style={{
                              width: "13%",
                              height: "60%",
                              justifyContent: "center",
                            }}
                          >
                            {/* <Image source={theme.theme == "light" ? e.iconlight : e.icondark}
                    style={i == 0 ? style.dapp :
                      i == 1 ? style.voice :
                        i == 2 ? style.wallet :
                          i == 3 ? style.word :
                            i == 4 ? style.clipboard :
                              style.theme} /> */}
                            {theme.theme == "light" ? e.iconlight : e.icondark}
                          </View>
                          <View style={{ width: "72%" }}>
                            <Text
                              style={{
                                fontFamily: Fonts.Regular,
                                fontSize: RFPercentage(1.95),
                                color:theme.theme==="dark"? "#fff":"black",
                              }}
                            >
                              {e.title}
                            </Text>
                          </View>
                          <View style={{ width: "15%", alignItems: "center" }}>
                            <Switch
                              onValueChange={(val) => {
                                onChangeFunction(e.key, val, i);
                              }}
                              value={e.active}
                              disabled={false}
                              activeText={"On"}
                              inActiveText={"Off"}
                              circleSize={20}
                              barHeight={15}
                              circleBorderWidth={0}
                              backgroundActive={
                                theme.theme === "dark" ? "#612CD2" : "#612CD2"
                              }
                              backgroundInactive={
                                theme.theme === "dark" ? "#612CD2" : "#612CD2"
                              }
                              circleActiveColor={theme.theme==="dark"?"#FFFFFF":"#c3acf3"}
                              circleInActiveColor={theme.theme==="dark"?"#FFFFFF":"#c3acf3"}
                              changeValueImmediately={true}
                              innerCircleStyle={{
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              outerCircleStyle={{}} 
                              renderActiveText={false}
                              renderInActiveText={false}
                              switchLeftPx={2.5}
                              switchRightPx={2.5}
                              switchWidthMultiplier={1.5}
                              switchBorderRadius={30}
                            />
                          </View>
                        </View>
                        {i !== settingsdata.length - 0 && (
                          <React.Fragment>
                            <Image
                              style={{ width: "100%", height: 1 }}
                              source={require("../../assets/img/deviderPNG.png")}
                              resizeMode="cover"
                            />
                          </React.Fragment>
                        )}
                      </>
                    
                    ))}
                  </View>
                </ScrollView>
              </View>
          </>
        
            </ImageBackground>
    </SafeAreaView>
  );
};
export default SettingsKeyboard;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.background,
      flex:1,
    },
    seperatorLine: {
      marginTop: "3%",
    },
    dapp: {
      resizeMode: "contain",
      height: windowheight * 0.0625,
      width: windowWidth * 0.0625,
      aspectRatio: 0.65,
    },
    voice: {
      resizeMode: "contain",
      height: windowheight * 0.0435,
      width: windowWidth * 0.0435,
      aspectRatio: 0.65,
    },
    wallet: {
      resizeMode: "contain",
      height: windowheight * 0.06,
      width: windowWidth * 0.06,
      aspectRatio: 0.65,
    },
    word: {
      resizeMode: "contain",
      height: windowheight * 0.06,
      width: windowWidth * 0.06,
      aspectRatio: 0.65,
    },
    clipboard: {
      resizeMode: "contain",
      height: windowheight * 0.06,
      width: windowWidth * 0.06,
      aspectRatio: 0.65,
    },
    theme: {
      resizeMode: "contain",
      height: windowheight * 0.06,
      width: windowWidth * 0.06,
      aspectRatio: 0.65,
    },
    wallet1: {
      resizeMode: "contain",
      height: windowheight * 0.065,
      width: windowWidth * 0.065,
      aspectRatio: 0.65,
    },
    preference: {
      resizeMode: "contain",
      height: windowheight * 0.048,
      width: windowWidth * 0.048,
      aspectRatio: 0.65,
    },
    faq: {
      resizeMode: "contain",
      height: windowheight * 0.06,
      width: windowWidth * 0.06,
      aspectRatio: 0.65,
    },
    aboutus: {
      resizeMode: "contain",
      height: windowheight * 0.05,
      width: windowWidth * 0.05,
      aspectRatio: 0.65,
    },
    notification: {
      resizeMode: "contain",
      height: windowheight * 0.05,
      width: windowWidth * 0.05,
      aspectRatio: 0.65,
    },
    security: {
      resizeMode: "contain",
      height: windowheight * 0.05,
      width: windowWidth * 0.05,
      aspectRatio: 0.65,
    },
    importwallet: {
      resizeMode: "contain",
      height: windowheight * 0.05,
      width: windowWidth * 0.05,
      aspectRatio: 0.65,
    },
  });
