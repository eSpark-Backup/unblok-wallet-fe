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
  ImageBackground,
  StatusBar
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
import { RFPercentage } from "react-native-responsive-fontsize";
import { windowWidth, windowheight } from "../../utils/Dimensions";
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

  useFocusEffect(
    React.useCallback(() => {
      // const onBackPress = () => {
      //   BackHandler.exitApp();
      //   return true;
      // };
      // // Add Event Listener for hardwareBackPress
      // BackHandler.addEventListener("hardwareBackPress", onBackPress);
      getPasscodeStatus();
      // return () => {
      //   // Once the Screen gets blur Remove Event Listener
      //   BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      // };
    }, [])
  );

  useEffect(() => {
    console.log("yourPasscode", yourPasscode, enteredPin);
    if (enteredPin.length > 0) {
      setShowRemoveButton(true);
    } else {
      setShowRemoveButton(false);
    }
    if (enteredPin.length == 6) {
      if (yourPasscode != enteredPin) {
        pinView.current.clearAll();
        ToastAndroid.showWithGravityAndOffset(
          "Passcode Does Not Match!",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else if (yourPasscode == enteredPin) {
        // `navigation` const is passed to the screen component or from useNavigation()
        props.navigation.navigate("SetPasscode");
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
      <Header />
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
            }}
          >
            Enter Your Passcode to Reset
          </Text>

          <ReactNativePinView
            inputSize={windowWidth * 0.04}
            ref={pinView}
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
              color: theme.texttheme
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
              }
              //  else if (key === "custom_left" && global.biometricStatus == 1 ) {
              //   global.bioPage = "EnterPasscode"
              //   props.navigation.push("CheckBiometric");
              // }
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
                // <Image source={{ uri: theme.theme == "light" ? Images.clearDark : Images.clearLight }} style={{ width: windowWidth * 0.045, height: windowheight * 0.045, alignSelf: "center", resizeMode: "contain", aspectRatio: 1 }} />
              ) : undefined
            }
            // customLeftButton={
            //   global.biometricStatus == 1 ?
            //     <Image source={{ uri: theme.theme == "light" ? Images.fingerDark : Images.fingerLight }} style={{ width: windowWidth * 0.0525, height: windowheight * 0.0525, alignSelf: "center", resizeMode: "contain", aspectRatio: 1 }} />
            //     : <></>
            // }
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
