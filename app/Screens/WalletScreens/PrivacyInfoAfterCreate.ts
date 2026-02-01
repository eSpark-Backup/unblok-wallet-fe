import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  SafeAreaView,
  BackHandler,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Button } from "react-native-elements";
import Header from "../../Components/Header";
import { Images } from "../../utils/Images";
import { Colors } from "../../utils/Colors";
import themeContext from "../../utils/themeContext";
import { ScrollView } from "react-native";
import { Fonts } from "../../utils/Fonts";
import { CheckBox } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
// import { TOUCHABLE_STATE } from "react-native-gesture-handler/lib/typescript/components/touchables/GenericTouchable";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { get_CMS_function } from "./common/privacy_info";
import RenderHTML from "react-native-render-html";
import getRealm from "../../localDb/RealmConfig";
import { borderWidth, windowWidth, windowheight } from "../../utils/Dimensions";
import Privacy from "../../assets/img/newprivacyicon.svg";
import TickGreen from "../../assets/img/tick.svg";

const PrivacyInfo = (props) => {
  const theme = useContext(themeContext);
    const style = styles(theme);
  const [isSelected, setSelection] = useState(false);
  const [contents, setContent] = useState([]);
  const [passwordLength, setPassword] = useState(0);
  // const contents = [
  //   {
  //     txt: "The recovery phrase is the master key to your funds. Never share it with anyone else.",
  //     txt2: "The wallet will never ask you to share your recovery phrase",
  //     txt3: "If you lose your recovery phrase, not even the wallet can recovery your funds.",
  //   },
  // ];

  var root = props.route.params
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (root == "createWallet1") {
          setTimeout(() => {
            props.navigation.navigate("CreateWallet");
          }, 500);
        } else {
          props.navigation.goBack();
        }
      };
      // Add Event Listener for hardwareBackPress
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      getCmsContent()
      getPasscodeStatus();
      return () => { };
    }, [])
  )

  //get passcode status
  const getPasscodeStatus = () => {
    getRealm()
      .then((realm) => {
        var passcodeVal = realm.objects("userPasscodeValue");
        console.log("passcodeVal", passcodeVal);
        passcodeVal.length != 0 ? setPassword(1) : setPassword(0)

        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "getPasscodeStatus err from localDb in createWallet");
      });
  };

  const getCmsContent = async () => {
    console.log("ehuiehruheses");
    var params = {
      subject: ["privacy_policy1", "privacy_policy2", "privacy_policy3"],
      from: "privacy"
    }
    get_CMS_function(params)
      .then((res) => {
        setContent(res.data)
        console.log("resssss", res.data);
      })
      .catch((err) => {
        console.log("errro on getcms content");
      })
  }

  const mixedStyle = {
    
    p: {
      color: theme.theme == "light" ? '#000' : '#fff',
      fontSize: RFPercentage(1.9)
    }
  }

  return (
    <SafeAreaView style={style.container}>
      <View style={{ windowheight, justifyContent: "flex-start" }}>
        <ImageBackground
          source={theme.theme === 'light' ? Images.backgroundWhite : Images.background}
          style={{
            width: windowWidth,
            height: windowheight,
            paddingTop: StatusBar.windowheight,
          }}
          resizeMode="cover"
        >
          <ImageBackground
            source={theme.theme === 'light' ? Images.backgroundgrouplight : Images.backgroundgroup}
            style={{ width: windowWidth, height: windowheight, marginTop: 20 }}
          >
          <ScrollView style={{marginBottom:"10%"}}>
            <View
              style={{
                flexDirection: "column",
                windowheight,
                width: windowWidth,
              }}
            >
              <View style={{ width: "100%" }}>
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: "70%",
                      padding: 2,
                      marginTop: 20,
                      justifyContent: "space-between",
                      flexDirection: "row",
                    }}
                  >
                    <Image
                      style={{
                        width: 20,
                        height: 20,
                        marginTop: 18,
                        marginLeft: 5,
                      }}
                      source={require("../../assets/img/polygon.png")}
                      resizeMode="contain"
                    />
                    <Image
                      style={{ width: 26, height: 26 }}
                      source={require("../../assets/img/maskgroup1.png")}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>
              <View style={{}}>
                <View style={style.cardWrapper}>
                  <LinearGradient
                    colors={["rgba(155, 124, 220, 0.15)", "transparent"]}
                    style={style.card}
                  >
                    <View style={{ height: "60%", flexDirection: "column" }}>
                      <View
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View style={{ width: "70%", marginTop: 10, }}>
                          <Image
                            style={{ width: 26, height: 26 }}
                            source={require("../../assets/img/maskgroup2.png")}
                            resizeMode="contain"
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Text style={style.createText}>Privacy</Text>
                        <Text style={style.walletText}> Policy</Text>
                      </View>
                      <View style={style.cardWrapper2}>
                        <View style={style.card2}>
                          <View style={{ alignItems: "center", marginTop: 10 }}>
                            <Image
                              style={{ width: 280, height: 155 }}
                              source={require("../../assets/img/avataricon.png")}
                              resizeMode="contain"
                            />
                            <Image
                              style={{ width: "100%",  marginTop:-1}}
                              source={require("../../assets/img/devider.png")}
                              resizeMode="contain"
                            />
                          </View>
                          <View
                            style={{
                              alignItems: "center",
                              flexDirection: "column",
                              paddind: 20,
                            }}
                          >
                            <Text style={style.keyText}>
                              The secret phrase is the master key to your
                              wallet, and anyone with it can access your
                              account. Never share it with anyone!
                            </Text>
                            <Text style={style.keyText}>
                              UNBLOK customer support will never ask for your
                              secret phrase.
                            </Text>
                            <Text style={style.keyText}>
                              If I lose my secret phrase, I will lose access to
                              my crypto forever.
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={style.checkBox}>
                        <CheckBox
                          checkedColor={style.checkedColor}
                          uncheckedColor={theme.text}
                          containerStyle={style.checkContainer}
                          textStyle={{
                            fontSize: 18,
                            color: theme.theme === "dark" ? "white" : "black",
                          }}
                          fontFamily="Orbitron-Bold"
                          checked={isSelected}
                          onPress={() => {
                            if (isSelected == true) {
                              setSelection(false);
                            } else {
                              setSelection(true);
                            }
                          }}
                        />
                        <Text style={style.textUnderstand}>
                          I understand the risks
                        </Text>
                      </View>
                      {isSelected == true ? (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <TouchableOpacity
                            style={style.continueBtn}
                            onPress={() => {
                              if (passwordLength == 0) {
                                props.navigation.navigate(
                                  "SetPasswordforCreate"
                                );
                              } else {
                                props.navigation.navigate("CopyWalletPharse");
                              }
                            }}
                          >
                            <Text style={style.checked_btn}>Continue</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <TouchableOpacity
                            style={style.continueBtn1}
                            disabled={true}
                            // onPress={() => {
                            //   props.navigation.navigate("PrivacyInfo");
                            // }}
                          >
                            <Text style={style.unChecked_btn}>Continue</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </LinearGradient>
                </View>
              </View>
            </View>
          </ScrollView>
          </ImageBackground>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default PrivacyInfo;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      flex: 1,
    },
    mainView: {
      backgroundColor: theme.blackandwhite,
      height: 60,
    },
    createText: {
      color:theme.theme === "dark" ? "#FFF600" : "#000000",
      textAlign: "center",
      fontSize: RFPercentage(3),
      fontFamily:Fonts.Bold,
      fontWeight:"bold",
     
    },
    walletText: {
      color: theme.theme === "dark" ? "#FFF" : "#612CD2",
      textAlign: "center",
      fontSize: RFPercentage(3),
      fontFamily:Fonts.Bold,
      fontWeight:"bold",
      textShadowColor: theme.theme === "light" ? "#000" : "#612CD2",
      textShadowOffset: { width: -1.5, height: 2.5 },
      textShadowRadius: 1,
      // textShadowColor: theme.theme === "light" ? "#612CD2" : "#612CD2",
      // textShadowOffset: { width: -1.5, height: 3 },
      // textShadowRadius: 2,
    },
    privateText: {
      color: "#FFF",
      textAlign: "center",
      fontSize: 20,
      fontWeight: "400",
    },
    cardWrapper: {
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      width: 330,
      height: 680,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: "rgba(162, 121, 250, 0.30)",
      marginTop: 10,
    },
    cardWrapper2: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 30,
    },
    card2: {
      width: 260,
      height: 400,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: "white",
      backgroundColor: "white",
    },
    keyText: {
      color: "#000",
      textAlign: "center",
      fontSize: 12,
      fontWeight: "300",
      lineHeight: 20,
      marginTop: 10,
      width: "90%",
    },
    mainView2: {
      alignSelf: "center",
      justifyContent: "center",
      marginTop: "6%",
    },
    imgStyle: {
      alignSelf: "center",
      width: 150,
      height: 150,
    },
    txtStyle: {
      fontSize: RFPercentage(1.5),
      marginTop: 30,
      color: theme.text,
      fontFamily: Fonts.Regular,
      marginBottom: 20,
      marginHorizontal: 30,
    },
    txt2Style: {
      marginTop: 10,
      fontSize: RFPercentage(1.5),
      color: theme.text,
      fontFamily: Fonts.Regular,
      marginBottom: 20,
    },
    txt3: {
      marginTop: 10,
      fontSize: RFPercentage(1.5),
      color: theme.text,
      fontFamily: Fonts.Regular,
      marginBottom: 20,
    },
    checkContainer: {
      borderColor: "transparent",
      backgroundColor: "transparent",
    },
    continueBtn: {
      borderRadius: 10,
      width: 250,
      fontFamily: Fonts.Bold,
      backgroundColor: "transparent",
      color: theme.buttonclr,
      paddingTop: 10,
      paddingBottom: 10,
    },
    continueBtn1: {
      borderRadius: 10,
      width: 250,
      fontFamily: Fonts.Bold,
      backgroundColor: "transparent",
      color: theme.buttonclr,
      paddingTop: 10,
      paddingBottom: 10,
    },
    checkBox: {
      marginTop: "7%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 0,
    },
    textUnderstand: {
      color: theme.theme === "light" ? "black" : "white",
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(1.7),
      marginLeft: -5,
    },
    checkedColor: theme.theme === "dark" ? "#FFF600" : "#612CD2",
    checked_btn: {
      fontFamily: Fonts.Regular,
      color: theme.theme == "dark" ? "black" : "white",
      borderWidth: 2,
      borderColor:theme.theme == "dark" ? "#FFF600" : "#612CD2",
      backgroundColor:theme.theme == "dark" ? "#FFF600" : "#612CD2",
      width: 250,
      borderRadius: 1.76,
      height: 49,
      lineHeight: 45,
      fontSize: 13,
      textAlign: "center",

    },
    unChecked_btn: {
      fontFamily: Fonts.Regular,
      color: "#535353",
      borderWidth: 2,
      borderColor: theme.theme == "light" ? "#535353" : "#535353",
      backgroundColor: theme.theme == "light" ? "#999999" : "#999999",
      width: 250,
      borderRadius: 1.76,
      height: 49,
      lineHeight: 45,
      fontSize: 13,
      textAlign: "center",
    },
  });
