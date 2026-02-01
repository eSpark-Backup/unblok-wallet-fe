import React, { useContext, useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  ToastAndroid,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { Colors } from "../../utils/Colors";
import { Fonts } from "../../utils/Fonts";
import { Icon as Icn } from "react-native-elements";
import getRealm from "../../localDb/RealmConfig";
import { useFocusEffect } from "@react-navigation/native";
import ReactNativeBiometrics from "react-native-biometrics";
import LinearGradient from "react-native-linear-gradient";
import { Switch } from "react-native-switch";
import { RFPercentage } from "react-native-responsive-fontsize";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import Passcodelight from "../../assets/icons/lighttheme/Passcode.svg";
import PasscodeDark from "../../assets/icons/darktheme/Passcode.svg";
import Biolight from "../../assets/icons/lighttheme/FingerPrint.svg";
import Biodark from "../../assets/icons/darktheme/FingerPrint.svg";
import Resetlight from "../../assets/icons/lighttheme/Reset Passcode.svg";
import Resetdark from "../../assets/icons/darktheme/Reset Passcode.svg";
import { Images } from "../../utils/Images";

const SecurityScreen = (props) => {
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [passcodeStatus, setPasscodeStatus] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState(false);
  const [pushcheck, setPushCheck] = useState(false);
  const [isbiometric, setbiometric] = useState();

  useEffect(() => {
    ReactNativeBiometrics.isSensorAvailable().then((resultObject) => {
      const { available, biometryType } = resultObject;

      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        // console.log("TouchID is supported");
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        //  console.log("FaceID is supported");
      } else if (
        available &&
        biometryType === ReactNativeBiometrics.Biometrics
      ) {
        setbiometric(1);
      } else {
        setbiometric(0);
      }
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getBiometricStatus();
      return () => { };
    }, [])
  );

  //get Notification status from db
  const getBiometricStatus = () => {
    getRealm()
      .then((realm) => {
        var biometricVal = realm.objects("userBiometricStatus");
        if (biometricVal.length != 0) {
          if (biometricVal[0].userBiometricStatus == "false") {
            setBiometricStatus(false);
            setPushCheck(false);
            global.biometricStatus = 0;
          } else if (biometricVal[0].userBiometricStatus == "true") {
            setBiometricStatus(true);
            setPushCheck(true);
            global.biometricStatus = 1;
          }
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "userBiometricStatus err from localDb");
      });
  };

  //local db to save notification enable disable status
  const saveBiometricStatus = (value) => {
    getRealm()
      .then((realm) => {
        var biometricVal = realm.objects("userBiometricStatus");
        console.log("biometricVal", biometricVal);
        global.biometricStatus = value == true ? 1 : 0
        if (biometricVal.length == 0) {
          //for create notification status first time
          let initialVal;
          realm.write(() => {
            initialVal = realm.create("userBiometricStatus", {
              userBiometricStatus: value.toString(),
            });
          });
        } else {
          //for update passcode value
          realm.write(() => {
            biometricVal[0].userBiometricStatus = value.toString();
          });
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "pushNotificationStatus err from localDb");
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      getPasscodeStatus();
      return () => { };
    }, [passcodeStatus])
  );

  //get passcode status
  const getPasscodeStatus = () => {
    getRealm()
      .then((realm) => {
        var passcodeVal = realm.objects("userPasscodeValue");
        if (passcodeVal.length == 0) {
          setPasscodeStatus(false);
          global.passcodeStatus = 0;
        } else {
          setPasscodeStatus(true);
          global.passcodeStatus = 1;
        }
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
        <Header name={"Security"} leftImage={"back"} />
        <ScrollView style={{ width: "85%", alignSelf: "center" }}>
          <View
            style={{
              flexDirection: "row",
              marginTop: "5%",
              alignItems: "center",
              width: "100%",
              height: windowheight * 0.065,
              alignSelf: "center",
            }}
          >
            <View
              style={{ width: "13%", height: "100%", justifyContent: "center" }}
            >
              {theme.theme == "light" ? (
                <Passcodelight
                  width={windowWidth * 0.07}
                  height={windowWidth * 0.07}
                  style={{ resizeMode: "contain" }}
                />
              ) : (
                <PasscodeDark
                  width={windowWidth * 0.07}
                  height={windowWidth * 0.07}
                  style={{ resizeMode: "contain" }}
                />
              )}
            </View>
            <View
              style={{ width: "72%", height: "100%", justifyContent: "center" }}
            >
              <Text
                style={{
                  fontFamily: Fonts.Regular,
                  fontSize: RFPercentage(2),
                  color: theme.theme == "light" ? "#000" : "#fff",
                }}
              >
                Passcode
              </Text>
            </View>
            <View
              style={{
                width: "15%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Switch
                value={passcodeStatus}
                onValueChange={(value) => {
                  setPasscodeStatus(value);
                  if (value == true) {
                    props.navigation.navigate("SetPasscode");
                  } else if (value == false && pushcheck == false) {
                    props.navigation.navigate("DisablePasscode");
                  } else if (value == false && pushcheck == true) {
                    ToastAndroid.showWithGravityAndOffset(
                      "Disable biometric for disable passcode",
                      ToastAndroid.LONG,
                      ToastAndroid.TOP,
                      25,
                      50
                    );
                  }
                }}
                disabled={false}
                activeText={"On"}
                inActiveText={"Off"}
                circleSize={22}
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
                outerCircleStyle={{}} // style for outer animated circle
                renderActiveText={false}
                renderInActiveText={false}
                switchLeftPx={2.5}
                switchRightPx={2.5}
                switchWidthMultiplier={1.5}
                switchBorderRadius={30}
              />
            </View>
          </View>
          <Image
            style={{ width: "100%", height: 1, marginTop: "5%" }}
            source={require("../../assets/img/deviderPNG.png")}
            resizeMode="cover"
          />

          {isbiometric != 0 && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  height: windowheight * 0.065,
                  alignSelf: "center",
                  marginTop: "2.5%",
                }}
              >
                <View
                  style={{
                    width: "13%",
                    height: "100%",
                    justifyContent: "center",
                  }}
                >
                  {/* <Icn
                name="fingerprint"
                type="Entypo"
                style={{
                  alignSelf: "flex-start",
                }}
                color={theme.text}
                size={25}
              /> */}
                  {theme.theme == "light" ? (
                    <Biolight
                      width={windowWidth * 0.07}
                      height={windowWidth * 0.07}
                      style={{ resizeMode: "contain" }}
                    />
                  ) : (
                    <Biodark
                      width={windowWidth * 0.07}
                      height={windowWidth * 0.07}
                      style={{ resizeMode: "contain" }}
                    />
                  )}
                </View>
                <View
                  style={{
                    width: "72%",
                    height: "100%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.Regular,
                      fontSize: RFPercentage(2),
                      color: theme.theme == "light" ? "#000" : "#fff",
                    }}
                  >
                    Biometric Authentication
                  </Text>
                </View>

                <View
                  style={{
                    width: "15%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Switch
                    value={pushcheck}
                    onValueChange={(value) => {
                      if (value == true && passcodeStatus == false) {
                        ToastAndroid.showWithGravityAndOffset(
                          "Enable passcode for enable biometric",
                          ToastAndroid.LONG,
                          ToastAndroid.TOP,
                          25,
                          50
                        );
                      } else if (value == false) {
                        saveBiometricStatus(value);
                        setPushCheck(value);
                        ToastAndroid.showWithGravityAndOffset(
                          "Successfully Disabled",
                          ToastAndroid.LONG,
                          ToastAndroid.TOP,
                          25,
                          50
                        );
                      } else {
                        saveBiometricStatus(value);
                        setPushCheck(value);
                        ToastAndroid.showWithGravityAndOffset(
                          "Successfully Enabled",
                          ToastAndroid.LONG,
                          ToastAndroid.TOP,
                          25,
                          50
                        );
                      }
                    }}
                    disabled={false}
                    activeText={"On"}
                    inActiveText={"Off"}
                    circleSize={22}
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
                    outerCircleStyle={{}} // style for outer animated circle
                    renderActiveText={false}
                    renderInActiveText={false}
                    switchLeftPx={2.5}
                    switchRightPx={2.5}
                    switchWidthMultiplier={1.5}
                    switchBorderRadius={30}
                  />
                </View>
              </View>
              <Image
                style={{ width: "100%", height: 1, marginTop: "5%" }}
                source={require("../../assets/img/deviderPNG.png")}
                resizeMode="cover"
              />
            </>
          )}

          {passcodeStatus == true ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  height: windowheight * 0.065,
                  alignSelf: "center",
                  marginTop: "2.5%",
                }}
              >
                <View
                  style={{
                    width: "15%",
                    height: "100%",
                    justifyContent: "center",
                  }}
                >
                  {/* <Image source={theme.theme == "dark" ? require("../../assets/img/newresetd.png") : Images.reset} style={{ width: 19, height: 15, alignSelf: "center" }} /> */}
                  {theme.theme == "light" ? (
                    <Resetlight
                      width={windowWidth * 0.06}
                      height={windowWidth * 0.06}
                      style={{ resizeMode: "contain",transform: [{ rotate: '30deg' }] }}
                    />
                  ) : (
                    <Resetdark
                      width={windowWidth * 0.06}
                      height={windowWidth * 0.06}
                      style={{ resizeMode: "contain",transform: [{ rotate: '30deg' }] }}
                    />
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate("enterPasscodeforReset");
                  }}
                  style={{
                    width: "70%",
                    height: "100%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.Regular,
                      fontSize: RFPercentage(2),
                      color: theme.theme === "dark" ? "white" : "black",
                    }}
                  >
                    Reset Passcode
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    width: "15%",
                    height: "100%",
                    justifyContent: "center",
                  }}
                ></View>
                {/* <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate("enterPasscodeforReset");
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>

                  <Image source={Images.reset} style={{ width: 20, height: 17, marginLeft: 25 }} />

                  <View style={{ flexDirection: "column", marginLeft: "11%" }}>
                    <Text
                      style={{
                        fontFamily: Fonts.Regular,
                        fontSize: RFPercentage(2),
                        color: theme.text,
                      }}
                    >
                      Reset Passcode
                    </Text>
                  </View>
                </View>
              </TouchableOpacity> */}
              </View>
              <Image
                style={{ width: "100%", height: 1, marginTop: "5%" }}
                source={require("../../assets/img/deviderPNG.png")}
                resizeMode="cover"
              />
            </>
          ) : (
            <></>
          )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default SecurityScreen;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    seperatorLine: {
      marginTop: "3%",
    },
  });
