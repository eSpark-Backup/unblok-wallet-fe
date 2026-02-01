import React, { useState, useContext, useEffect } from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  BackHandler,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon as Icn } from "react-native-elements";
import { Colors } from "../utils/Colors";
import { Surface } from "react-native-paper";
import { Fonts } from "../utils/Fonts";
import OfflineNotice from "../utils/OfflineNotice";
import themeContext from "../utils/themeContext";
import Lleft from "../assets/img/lleft.svg";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Backlight from "../assets/icons/lighttheme/Back arrow.svg";
import BackDark from "../assets/icons/darktheme/Back arrow.svg";
import Preferencelight from "../assets/icons/lighttheme/Preference 1.svg";
import Preferencedark from "../assets/icons/darktheme/Preference white.svg";
import { windowWidth } from "../utils/Dimensions";

const Header = (props) => {

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      if (e.data.state.isTransitioning) {
        console.log('Navigation is in progress');
      }
      if (e.data.state.isTransitioning === false && e.data.state.index === e.data.state.routeNames.length - 1) {
        console.log('Navigation completed');
      }
      if (e.data.state.isTransitioning === false && e.data.state.index !== e.data.state.routeNames.length - 1) {
        console.log('Navigation error');
      }
    });

    return unsubscribe;
  }, []);

  //theme config
  const theme = useContext(themeContext);
  const appBarStyle = styles(theme);
  const [disabled, pressButton] = useState(false);
  const navigation = useNavigation();

  const backFunc = () => {
    pressButton(true);
    setTimeout(() => {
      pressButton(false);
    }, 1500);

    const routes = navigation.getState()?.routes;

    var newRoute = routes[routes.length - 2];

    if (newRoute) return navigation.goBack();
    else return navigation.navigate("WalletHome");

  };

  var incLength = 2
  const CustomBackFunc = () => {
    const routes = navigation.getState()?.routes;
    var prevRoute
    if ((routes[routes.length - incLength].name == "EnterPasscode") ||
      (routes[routes.length - incLength].name == "CheckBiometric") ||
      (routes[routes.length - incLength].name == "ScanAddress")) {
      incLength = incLength + 1
      return CustomBackFunc();
    } else {
      prevRoute = routes[routes.length - incLength]
    }

    pressButton(true);
    setTimeout(() => {
      pressButton(false);
    }, 1500);
    navigation.navigate(prevRoute.name);
  };

  const goback = (imageName) => {
    if (imageName == "close") {
      backFunc();
    } else if (imageName == "back") {
      backFunc();
    } else if (imageName == "settingBack") {
      navigation.goBack()
    } else if (imageName == "customBack") {
      CustomBackFunc();
    } else if (imageName == "Wallet") {
      navigation.navigate("Wallet");
    }else if (imageName == "crypto") {
      navigation.navigate("TokenList");
    } else if (imageName == "scan") {
      navigation.navigate("ScanAddress");
    } else if (imageName == "toggle") {
      navigation.navigate("TokenList");
    } else if (imageName == "wallet") {
      navigation.navigate("WalletList");
    } else if (imageName == "add") {
      navigation.navigate("CreateWallet2");
    } else if (imageName == "walletDetails") {
      // navigation.navigate("ShowWalletDetails");
      CustomBackFunc()
    } else if (imageName == "privacyInfoBack") {
      navigation.navigate("CreateWallet");
    } else if (imageName == "importWalletBack") {
      navigation.navigate("CreateWallet");
    } else if (imageName == "DappBottomTab") {
      navigation.navigate("WalletHomeBottomTab");
    } else if (imageName == "exitApp") {
      BackHandler.exitApp();
    }
  };

  const setImage = (imageName) => {
    if (imageName == "close") {
      return (
        <Icn
          name="close"
          type="antDesign"
          style={{
            alignSelf: "center",
          }}
          color={theme.text}
          size={20}
        />
      );
    } else if (imageName == "back") {
      return (
        <View>
          {theme.theme == "light" ? (
            <Backlight
              width={windowWidth * 0.07}
              height={windowWidth * 0.07}
              style={{ resizeMode: "contain" }}
            />
          ) : (
            <BackDark
              width={windowWidth * 0.07}
              height={windowWidth * 0.07}
              style={{ resizeMode: "contain" }}
            />
          )}
        </View>
      );
    } else if (imageName == "settingBack") {
      return (
        <View>
          {theme.theme == "light" ? (
            <Backlight
              width={windowWidth * 0.07}
              height={windowWidth * 0.07}
              style={{ resizeMode: "contain" }}
            />
          ) : (
            <BackDark
              width={windowWidth * 0.07}
              height={windowWidth * 0.07}
              style={{ resizeMode: "contain" }}
            />
          )}
        </View>
      );
    } else if (imageName == "customBack") {
      return (
        // <Icn
        //   name="chevron-left"
        //   type="evilicons"
        //   style={{
        //     alignSelf: "center",
        //   }}
        //   color={theme.text}
        //   size={30}
        // />
        <View>
          {theme.theme == "light" ? (
            // <Image source={require('../assets/img/lleft.png')} />
            <Backlight
            width={windowWidth * 0.07}
            height={windowWidth * 0.06}
              style={{ resizeMode: "contain" }}
            />
          ) : (
            <BackDark
            width={windowWidth * 0.07}
                    height={windowWidth * 0.06}
              style={{ resizeMode: "contain" }}
            />
          )}
        </View>
      );
    } else if (imageName == "Wallet") {
      return (
        // <Icn
        //   name="chevron-left"
        //   type="evilicons"
        //   style={{
        //     alignSelf: "center",
        //   }}
        //   color={theme.text}
        //   size={30}
        // />
        <View>
          {theme.theme == "light" ? (
            // <Image source={require('../assets/img/lleft.png')} />
            <Backlight
            width={windowWidth * 0.07}
            height={windowWidth * 0.06}
              style={{ resizeMode: "contain" }}
            />
          ) : (
            <BackDark
            width={windowWidth * 0.07}
            height={windowWidth * 0.06}
              style={{ resizeMode: "contain" }}
            />
          )}
        </View>
      );
    } else if (imageName == "crypto") {
      return (
        <View>
           {theme.theme == "dark" ? (
                    <Preferencedark width={25} height={25}  />
                  ) : (
                    <Preferencelight width={25} height={25} />
                  )}
        </View>
      );
    } else if (imageName == "walletDetails") {
      return (
        <View>
          {theme.theme == "light" ? (
            // <Image source={require('../assets/img/lleft.png')} />
            <Backlight
            width={windowWidth * 0.07}
            height={windowWidth * 0.06}
              style={{ resizeMode: "contain" }}
            />
          ) : (
            <BackDark
              width={windowWidth * 0.08}
              height={windowWidth * 0.08}
              style={{ resizeMode: "contain" }}
            />
          )}
        </View>
      );
    } else if (imageName == "privacyInfoBack") {
      return (
        <View>
          {theme.theme == "light" ? (
            // <Image source={require('../assets/img/lleft.png')} />
            <Backlight
            width={windowWidth * 0.07}
            height={windowWidth * 0.06}
              style={{ resizeMode: "contain" }}
            />
          ) : (
            <BackDark
            width={windowWidth * 0.07}
            height={windowWidth * 0.06}
              style={{ resizeMode: "contain" }}
            />
          )}
        </View>
      );
    } else if (imageName == "importWalletBack") {
      return (
        <View>
          {theme.theme == "light" ? (
            // <Image source={require('../assets/img/lleft.png')} />
            <Backlight
            width={windowWidth * 0.07}
            height={windowWidth * 0.06}
              style={{ resizeMode: "contain" }}
            />
          ) : (
            <BackDark
            width={windowWidth * 0.07}
            height={windowWidth * 0.06}
              style={{ resizeMode: "contain" }}
            />
          )}
        </View>
      );
    } else if (imageName == "DappBottomTab") {
      return (
        <View>
          {theme.theme == "light" ? (
            // <Image source={require('../assets/img/lleft.png')} />
            <Backlight
            width={windowWidth * 0.07}
            height={windowWidth * 0.06}
              style={{ resizeMode: "contain" }}
            />
          ) : (
            <BackDark
            width={windowWidth * 0.07}
            height={windowWidth * 0.06}
              style={{ resizeMode: "contain" }}
            />
          )}
        </View>
      );
    } else if (imageName == "add") {
      return (
        <Icn
          name="plus"
          type="antdesign"
          style={{
            alignSelf: "flex-start",
          }}
          color={theme.theme==="dark"?"white":"black"}
          size={20}
        />
      );
    } else if (imageName == "scan") {
      return (
        <Icn
          name="scan1"
          type="antdesign"
          style={{
            alignSelf: "center",
          }}
          color={theme.text}
          size={23}
        />
      );
    } else if (imageName == "toggle") {
      return (
        <Icn
          name="sound-mix"
          type="entypo"
          style={{
            alignSelf: "center",
            transform: [{ rotate: "90deg" }],
          }}
          color={theme.text}
          size={23}
        />
      );
    } else if (imageName == "wallet") {
      return (
        <Icn
          name="wallet"
          type="entypo"
          style={{
            alignSelf: "center",
          }}
          color={theme.text}
          size={23}
        />
      );
    } else if (imageName == "exitApp") {
      return (
        <Icn
          name="close"
          type="antDesign"
          style={{
            alignSelf: "center",
          }}
          color={theme.text}
          size={20}
        />
      );
    }
  };

  const renderImage = (image1) => {
    return image1 ? setImage(image1) : <View />;
  };
  // console.log("props.leftImage",props.leftImage);
  return (
    <Surface style={appBarStyle.headerStyle}>
      <View style={appBarStyle.leftImgView}>
        <Pressable onPress={() => goback(props.leftImage)} disabled={disabled}>
          {renderImage(props.leftImage)}
        </Pressable>

        <View style={appBarStyle.rightImgView}>
          <Pressable
            onPress={() => goback(props.rightImage2)}
            style={{ right: 20 }}
            disabled={disabled}
          >
            {renderImage(props.rightImage2)}
          </Pressable>
          <Pressable
            onPress={() => goback(props.rightImage)}
            disabled={disabled}
          >
            {renderImage(props.rightImage)}
          </Pressable>
        </View>
      </View>
      <Text style={appBarStyle.largeFont}>{props.name}</Text>
      <OfflineNotice />
    </Surface>
  );
};

export default Header;

const styles = (theme) =>
  StyleSheet.create({
    headerStyle: {
      height: 80,
      justifyContent: "center",
      backgroundColor: "transparent",
      boxShadow: 0,
      width:"95%",
      alignSelf:"center"
    },
    largeFont: {
      fontSize: RFPercentage(3),
      fontFamily: Fonts.Medium,
      position: "absolute",
      width: "75%",
      textAlign: "center",
      alignSelf:"center",
      fontWeight:'700',
      color: theme.theme === "dark" ? "white" : "#612CD2",
      // backgroundColor:"red"
    },
    leftImgView: {
      flexDirection: "row",
      zIndex: 1,
      justifyContent: "space-between",
      alignItems: "center",
      width:"98%",
      // marginTop: 15,
      // backgroundColor:"green"
    },
    rightImgView: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    InrView: {
      backgroundColor: Colors.PRIMARY,
      width: 50,
      height: 30,
      alignSelf: "center",
      borderRadius: 5,
      justifyContent: "center",
    },
    InrTxt: {
      alignSelf: "center",
      color: Colors.primaryColor,
    },
  });
