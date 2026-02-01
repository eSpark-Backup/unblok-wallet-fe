import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  BackHandler,
  TouchableOpacity,
  Alert,
  ScrollView,
  ToastAndroid,
  RefreshControl,
  Image,
  Dimensions,
  StatusBar,
  ImageBackground
} from "react-native";
import themeContext from "../../utils/themeContext";
import getRealm from "../../localDb/RealmConfig";
import Header from "../../Components/Header";
import { Icon as Icn, Card, Button } from "react-native-elements";
import ItemBox from "../../Components/ItemBox";
import { useFocusEffect } from "@react-navigation/native";
import ApiClient from "../../api/ApiClient";
import { ApiConstants } from "../../api/ApiConstants";
import { Colors } from "../../utils/Colors";
import SegmentedControl from "../../Components/SegmentedControl";
import { Fonts } from "../../utils/Fonts";
import { Images } from "../../utils/Images";
import ReactNativePinView from "react-native-pin-view";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
const EnterPasscode = (props) => {
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);

  //for pinview component
  const pinView = useRef(null);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [yourPasscode, setYourPasscode] = useState("");
  const { width, height } = Dimensions.get('window');
  const isPhone = width < 600;

  const dispatch = useDispatch()
  const { weburl } = useSelector(state => ({
    weburl: state.DapplatestReducer.weburl
  }));

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        // props.navigation.goBack()
        return true;
      };
      // Add Event Listener for hardwareBackPress
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      pinView.current.clearAll();
      getPasscodeStatus();
      return () => {
        // Once the Screen gets blur Remove Event Listener
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  // console.log("kkkkkkkkkkkkkk", props);

  useEffect(() => {
    StatusBar.setBarStyle(theme.theme === "light" ? "dark-content" : "light-content");
    StatusBar.setBackgroundColor(theme.theme === "dark" ? "rgb(25,14,47)" : "#fff");
    if (enteredPin.length > 0) {
      setShowRemoveButton(true);
    } else {
      setShowRemoveButton(false);
    }
    if (enteredPin.length == 6) {
      if (yourPasscode != enteredPin) {
        pinView.current.clearAll();
        ToastAndroid.showWithGravityAndOffset(
          "Passcode Does Not Match",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else if (yourPasscode == enteredPin) {
        // `navigation` const is passed to the screen component or from useNavigation()
        const routes = props.navigation.getState()?.routes;
        const prevRoute = routes[routes.length - 2];
        console.log("prevRoute", prevRoute);
        if (props?.route?.params) {
          // if ((props?.route?.params == "SwapBottomTab") || (props?.route?.params == "WalletHomeBottomTab") || (props?.route?.params == "Receive") || (props?.route?.params == "Send")|| (props?.route?.params == "ScanAddress")) global.initialEnter = true;
          if (props?.route?.params) global.initialEnter = true;

          ((props?.route?.params == "Receive") || (props?.route?.params == "Send") || (props?.route?.params == "Buy") || (props?.route?.params == "Sell")) ?
            props.navigation.navigate("commonRbSheet", params = props?.route?.params) :

            (props?.route?.params == "ScanAddress") ?
              props.navigation.navigate("ScanAddress", { path: "WalletConnect" }) :

              (props?.route?.params.slice(0, 2) == "wc") ?
                dispatch({
                  type: "Session",
                  data: {
                    url: props?.route?.params, StopAction: true, Loader: true,
                    from: weburl
                  }
                })
                :
                props.navigation.navigate(props?.route?.params)
          // props.navigation.navigate(root);
        } else if (
          prevRoute.name == "Splash" ||
          prevRoute.name == "CheckBiometric" ||
          prevRoute.name == "EnterPasscode" ||
          prevRoute.name == "Wallet" ||
          prevRoute.name == "Signin"
        ) {
          props.navigation.navigate("WalletHome");
        } else {
          props.navigation.navigate(prevRoute.name);
        }
      }
    }
  }, [enteredPin]);

  //get passcode status
  const getPasscodeStatus = () => {
    getRealm()
      .then((realm) => {
        var passcodeVal = realm.objects("userPasscodeValue");
        setYourPasscode(passcodeVal[0].passcode);
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "getPasscodeStatus err from localDb");
      });
  };
  // React.useEffect(() => {
  //   console.log("mode", theme.theme)
  //   if (theme.theme == "light") {

  //     StatusBar.setBarStyle('dark-content');
  //   }
  //   else {
  //     StatusBar.setBarStyle('light-content');
  //   }

  // }, [theme.theme]);
  return (
    <SafeAreaView style={style.container}>
 <ImageBackground
        source={theme.theme === "light" ? Images.backgroundWhite : Images.background}
        style={{
          width: windowWidth,
          height: windowheight,
        
        }}
        resizeMode="cover"
      >
      <Header leftImage={"back"} />
      <ScrollView>
        <View style={{ marginTop: "10%" }} />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              color: theme.theme === "dark" ? "#fff" : "black",
              fontFamily: Fonts.Bold,
              fontSize: RFPercentage(2.8),
              fontWeight:"bold"
            }}
          >
            Enter Passcode
          </Text>

          <ReactNativePinView
            inputSize={windowWidth * 0.04}
            ref={pinView}
            // style={{ width: "75%" }}
            pinLength={6}
            buttonSize={windowWidth * 0.15}
            style={isPhone ? { width: "80%" } : { width: "60%" }}
            onValueChange={(value) => setEnteredPin(value)}
            buttonAreaStyle={{
              backgroundColor: "transparent",
              marginTop: "20%"
            }}
            inputAreaStyle={{
              marginTop: "20%"
            }}
            inputViewEmptyStyle={{
              borderColor:
              theme.theme === "light"
                  ? "rgba(97, 44, 210, 0.50)"
                  : "rgba(162, 121, 250, 0.30)",
              backgroundColor: "rgba(155, 124, 220, 0.15)",
              borderWidth: 1,
              borderRadius: 5,
            }}
            inputViewFilledStyle={{
              borderColor:
              theme.theme === "light"
                  ? "rgba(97, 44, 210, 0.50)"
                  : "rgba(162, 121, 250, 0.30)",
              backgroundColor: theme.theme === "dark" ? "#FFF600" : "#612CD2",
              borderWidth: 2,
              borderRadius: 5,
            }}
            inputTextStyle={{
              color: theme.texttheme,
            }}
            buttonViewStyle={{
              borderColor:
              theme.theme === "light"
                  ? "rgba(97, 44, 210, 0.50)"
                  : "rgba(162, 121, 250, 0.30)",
              backgroundColor: "rgba(155, 124, 220, 0.15)",
              borderRadius: 5,
              borderWidth: 2,
            }}
            buttonTextStyle={{
              color: theme.theme === "dark" ? "white" : "black",
              backgroundColor: "transparent",
            }}
            onButtonPress={(key) => {
              if (key === "custom_right") {
                pinView.current.clear();
              } else if (key === "custom_left" && global.biometricStatus == 1) {
                global.bioPage = "EnterPasscode"
                props.navigation.push("CheckBiometric", props?.route?.params ? props?.route?.params : "");
              }
            }}
            customRightButton={
              showRemoveButton ? (
                <Icn
                name="backspace"
                type="MaterialIcons"
                style={{
                  alignSelf: "center",
                }}
                color={theme.theme === "dark" ? "#FFF600" :"#612CD2"}
                size={35}
              />
              ) : undefined
            }
            customLeftButton={
              global.biometricStatus == 1 ?
                <Image source={{ uri: theme.theme == "light" ? Images.fingerDark : Images.fingerLight }} style={{ width: windowWidth * 0.0525, height: windowheight * 0.0525, alignSelf: "center", resizeMode: "contain", aspectRatio: 1 }} />
                : <></>
            }
          />
        </View>
      </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default EnterPasscode;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    seperatorLine: {
      height: 1,
      backgroundColor: "grey",
    },
    passcodeTxt: {
      alignSelf: "center",
      marginTop: "30%",
      color: theme.text,
      fontSize: 20,
      fontFamily: Fonts.Bold,
    },
    passCodeBtn: {
      width: 62,
      height: 62,
      justifyContent: "center",
      borderRadius: 100,
      backgroundColor: theme.background,
      marginEnd: 4,
      marginBottom: 8,
      marginTop: 20,
      color: theme.text,
      borderRadius: 100,
    },
  });
