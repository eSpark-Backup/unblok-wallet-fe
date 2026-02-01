import axios from "axios";

import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  TouchableOpacity,
  Keyboard,
  TextInput,
  Linking,
  Dimensions,
  FlatList,
  BackHandler,
  NativeModules,
  ToastAndroid,
  Pressable,
  ImageBackground,
  StatusBar,
} from "react-native";

import getRealm from "../../localDb/RealmConfig";
import { Images } from "../../utils/Images";
import themeContext from "../../utils/themeContext";

import { Fonts } from "../../utils/Fonts";

import Eyeoff from "../../assets/img/eye.svg";
import Eyeon from "../../assets/img/eyeon.svg";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { List } from "realm";
import { secretKey } from "../../api/ApiConstants";
import {
  formValidation,
  loginFunction,
  encryptFunction,
} from "./common/Sign_in";
import isEmpty from "../../utils/isEmpty";
import LLogo from "../../assets/img/applogo2d.png";
import DLogo from "../../assets/img/applogo2l.png";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
// import CryptoJS from 'crypto-js';
import KeyboardComp from "./Keyboard/keyboard";
import Header from "../../Components/Header";
import { RFPercentage } from "react-native-responsive-fontsize";
import { borderRadius, borderWidth, windowheight } from "../../utils/Dimensions";
import TickGreen from "../../assets/img/tick.svg";
import { CheckBox } from "react-native-elements";

// import PasswordInputText from 'react-native-hide-show-password-input';
export default function Signin(props) {
  const [mailAddress, setMailaddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [mailNotFound, setMailNotFound] = useState("")
  const [passwordErr, setPasswordErr] = useState("")
  const [error, setError] = useState({})
  // const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSelected1, setSelection1] = useState(false);
  const [show, setShow] = useState(true);
  const { ApiModule } = NativeModules;

  state = {
    query: '',
    data: []
  }


  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };
      // Add Event Listener for hardwareBackPress
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        // Once the Screen gets blur Remove Event Listener
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );


  useFocusEffect(
    React.useCallback(() => {
      getRemeberMe()
      setSelection1(false)
    }, [])
  )

  useEffect(() => {
    setError({})
    setMailNotFound("")
    setPasswordErr("")
  }, [mailAddress, password])


  const theme = React.useContext(themeContext);
  const style = styles(theme);
  const getRemeberMe = async () => {
    getRealm()
      .then((realm) => {
        var rememberObj = realm.objects("rememberMe")
        if (rememberObj.length != 0) {
          
          encryptFunction({ Do: "decrypt", encryptKey: rememberObj[0].password })
            .then((ress) => {
              console.log("ressss", ress.data);
              setPassword(ress.data.data);
              setMailaddress(rememberObj[0].mailAddress);
              setRememberMe(true)
            })
            .catch((err) => {
              console.log("errroror", err);
            })
        } else {
          setPassword("");
          setMailaddress("")
          setRememberMe(false)
        }
      })
      .catch((err) => {
        console.log("errr on getremmenrber", err);
      })
  }

  const submitFunction = async () => {
    
    var formData = { mailAddress: mailAddress.toLowerCase().trim(), password }

    var validate = await formValidation(formData)
    if (!isEmpty(validate)) setError(validate)
    else {
      formData.deviceId = global.deviceId
      loginFunction(formData)
        .then((resp) => {
          if (resp.data.success) {
            // ToastAndroid.showWithGravityAndOffset(
            //   resp.data.msg,
            //   ToastAndroid.LONG,
            //   ToastAndroid.BOTTOM,
            //   25,
            //   50
            // );
            global.mailAddress = mailAddress
            ApiModule.receiveMail(mailAddress);
            encryptFunction({ Do: "encrypt", password: password })
              .then((res) => {
                getRealm()
                  .then((realm) => {
                    var rememberObj = realm.objects("rememberMe")
                    var loginStatus = realm.objects("loginStatus")

                    realm.write(() => {
                      realm.create("loginStatus", { logIn: "true", mail: mailAddress.toLowerCase() })
                    })

                    console.log("loginStatus", loginStatus);

                    if (rememberMe === true) {
                      if (rememberObj.length == 0) {
                        realm.write(() => {
                          realm.create("rememberMe", { mailAddress: mailAddress.toLowerCase(), password: res.data.data })
                        })
                      } else {
                        realm.write(() => {
                          rememberObj[0].mailAddress = mailAddress.toLowerCase()
                          rememberObj[0].password = res.data.data
                        })
                      }
                    } else {
                      if (rememberObj.length != 0) {
                        realm.write(() => {
                          realm.delete(rememberObj[0]);
                        })
                      }
                    }
                    props.navigation.navigate("CreateWallet")
                  })
                  .catch((err) => {
                    console.log("errroro on submit function", err);
                  })
              })
              .catch((err) => {
                console.log("errererjker", err);
              })


          } else {
            resp.data.error == "password" ? setPasswordErr(resp.data.msg) : setMailNotFound(resp.data.msg)
          }
        })
        .catch((err) => {
          console.log("error on submitfunction", err);
        })
    }
  
  }

// console.log("Fonts", Fonts);
  return (
    <>
      <SafeAreaView style={style.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <View
            style={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ windowheight, justifyContent: "flex-start" }}>
              <ImageBackground
                source={theme.theme === "dark" ? Images.background : Images.backgroundWhite}
                style={{
                  width: windowWidth,
                  height: windowheight,
                  paddingTop: StatusBar.windowheight,
                }}
                resizeMode="cover"
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Image
                      style={{ width: 74, height: 79 }}
                      source={require("../../assets/img/appicon.png")}
                      resizeMode="contain"
                    />
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      height: "50%",
                      justifyContent: "center",
                      paddingLeft: 10,
                    }}
                  >
                    <Image
                      style={{ width: 129, height: 21 }}
                      source={require("../../assets/img/keyboard3.0.png")}
                      resizeMode="contain"
                    />
                  </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ padding: 20 }}>
                  <Text
                    style={{
                      fontFamily: Fonts.Bold,
                      fontSize: RFPercentage(4),
                      color: theme.theme === "dark" ? "#fff" : "black",
                      fontWeight:"bold"
                    }}
                  >
                    Sign In
                  </Text>
                  {/* <Text style={{
              fontFamily: Fonts.Regular, fontSize: RFPercentage(2), color: theme.texttheme, marginTop: "1%"
            }}>Enter your email address to login</Text> */}

                  <View style={{ marginTop: "5%" }}>
                    <Text style={style.title_text}>Email Address*</Text>

                    <View style={style.box_container}>
                      <View
                        style={{
                          marginLeft: "4%",
                          width: "90%",
                          height: windowHeight * 0.07,
                          justifyContent: "center",
                        }}
                      >
                        <TextInput
                          selectionColor={"#A279FA"}
                          onChangeText={setMailaddress}
                          value={mailAddress}
                          blurOnSubmit={false}
                          placeholder="Enter Email Address"
                          dataDetectorTypes={["phoneNumber"]}
                          placeholderTextColor={"#A279FA"}
                          style={style.input_container}
                          textContentType="newPassword"
                        />
                      </View>
                    </View>
                    {error && error?.mailValidateErr && (
                      <Text style={style.error_container}>
                        {error.mailValidateErr}
                      </Text>
                    )}
                    {error && error?.mailAddressError && (
                      <Text style={style.error_container}>
                        {error.mailAddressError}
                      </Text>
                    )}
                    {mailNotFound != "" ? (
                      <Text style={style.error_container}>{mailNotFound}</Text>
                    ) : (
                      <></>
                    )}
                  </View>

                  <View style={{ marginTop: "5%" }}>
                    <Text style={style.title_text}>Password*</Text>

                    <View
                      style={{
                        alignItems: "center",
                        borderColor: "rgba(162, 121, 250, 0.30)",
                        borderWidth: 1,
                        backgroundColor: "rgba(155, 124, 220, 0.15)",
                        borderRadius: 5,
                        marginTop: "2.5%",
                      }}
                    >
                      <View
                        style={{
                          marginLeft: "4%",
                          width: "90%",
                          height: windowHeight * 0.07,
                          flexDirection: "row",
                        }}
                      >
                        <View
                          style={{ width: "85%", justifyContent: "center" }}
                        >
                          <TextInput
                            secureTextEntry={show}
                            // selectionColor={theme.text}
                            onChangeText={setPassword}
                            value={password}
                            placeholder="Enter Password"
                            placeholderTextColor={"#A279FA"}
                            style={{
                              fontFamily: Fonts.Regular,
                              color: "#A279FA",
                              fontSize: RFPercentage(1.9),
                            }}
                            selectionColor={"#A279FA"}
                            dataDetectorTypes={["phoneNumber"]}
                            blurOnSubmit={false}
                            textContentType="newPassword"
                          />
                        </View>
                        <View
                          style={{ width: "15%", justifyContent: "center" }}
                        >
                          <TouchableOpacity onPress={() => setShow(!show)}>
                            {!show ? (
                              <Eyeon
                                style={{ alignSelf: "center", aspectRatio: 1 }}
                                width={windowWidth * 0.05}
                                height={windowWidth * 0.05}
                              />
                            ) : (
                              <Eyeoff
                                style={{ alignSelf: "center", aspectRatio: 1 }}
                                width={windowWidth * 0.05}
                                height={windowWidth * 0.05}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                      {/* <TextInput

                    secureTextEntry={show}
                    selectionColor={theme.text}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Enter Password"
                    placeholderTextColor={"grey"}
                    style={{ fontFamily: Fonts.Regular, width: "94%", color: theme.text, padding: "4%",fontSize: RFPercentage(1.9), }}
                  />

                  <TouchableOpacity
                    onPress={() => setShow(!show)}
                  >
                    {theme.theme == "light" ?
                      <Eye fill={"#000"} /> :
                      <Eye fill={"#fff"} />
                    }
                  </TouchableOpacity> */}
                    </View>
                    {passwordErr != "" ? (
                      <Text style={style.error_container}>{passwordErr}</Text>
                    ) : (
                      <></>
                    )}
                    {error && error?.passwordError && (
                      <Text style={style.error_container}>
                        {error.passwordError}
                      </Text>
                    )}
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "90%",
                      alignSelf: "center",
                      marginTop: "3%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <CheckBox
                        checkedColor={style.checkedColor}
                        uncheckedColor={theme.text}
                        containerStyle={style.checkContainer}
                        textStyle={{
                          fontSize: 18,
                          color: theme.theme === "dark" ? "white" : "black",
                        }}
                        fontFamily="Orbitron-Bold"
                        checked={rememberMe}
                        onPress={() => {
                          setRememberMe(!rememberMe);
                        }}
                      />
                      <Text
                        style={{
                          color: theme.theme === "dark" ? "#FFF" : "black",
                          fontFamily: Fonts.Regular,
                          fontSize: RFPercentage(1.9),
                        }}
                      >
                        Remember me
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate("PasswordRecovery1")
                      }
                    >
                      <Text
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: "#A279FA",
                          width: "100%",
                          fontFamily: Fonts.Regular,
                          fontSize: RFPercentage(1.8),
                          color: "#A279FA",
                        }}
                      >
                        Forgot Password
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Image
                    style={{
                      width: "100%",
                      height: 1,
                      marginTop: "10%",
                      marginBottom: 0,
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
                    }}
                  >
                    <CheckBox
                        checkedColor={style.checkedColor}
                        uncheckedColor={theme.text}
                        containerStyle={style.checkContainer}
                        textStyle={{
                          fontSize: 14,
                          color: theme.theme === "dark" ? "white" : "black",
                        }}
                        fontFamily="Orbitron-Bold"
                        checked={isSelected1}
                        onPress={() => {
                          setSelection1(!isSelected1);
                        }}
                      />
                    {/* <TouchableOpacity
                      style={{
                        width: windowHeight * 0.0225,
                        justifyContent: "center",
                        height: windowHeight * 0.0225,
                        borderColor: "#707070",
                        marginRight: 5,
                        borderRadius: 2,
                        justifyContent: "center",
                        borderWidth: borderWidth * 0.3,
                      }}
                      onPress={() => {
                        setSelection1(!isSelected1);
                      }}
                    >
                      {isSelected1 && (
                        <TickGreen
                          width={15}
                          height={12}
                          style={{
                            resizeMode: "contain",
                            alignSelf: "center",
                            aspectRatio: 1,
                          }}
                        />
                      )}
                    </TouchableOpacity> */}
                    <Text
                      style={{
                        color: theme.text,
                        fontFamily: Fonts.Regular,
                        fontSize: RFPercentage(1.6),
                        color: theme.theme === "dark" ? "#FFF" : "black",
                        marginLeft: "2%",
                      }}
                    >
                      I accept the Terms of Service
                    </Text>
                  </View>
                  <Image
                    style={{
                      width: "100%",
                      height: 1,
                      marginTop: 20,
                      marginBottom: 10,
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
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        borderRightWidth: 1,
                        borderRightColor: "#A279FA",
                        paddingRight: 20,
                        fontFamily: Fonts.Regular,
                      }}
                      onPress={() => {
                        props.navigation.navigate("PrivacyPolicy");
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Fonts.Regular,
                          color:
                            theme.theme === "dark"
                              ? "#A279FA"
                              : "rgba(0, 0, 0, 0.60)",
                          fontSize: RFPercentage(2),
                        }}
                      >
                        Privacy Policy
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ paddingLeft: 20 }}
                      onPress={() => {
                        props.navigation.navigate("TermsOfService");
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Fonts.Regular,
                          color:
                            theme.theme === "dark"
                              ? "#A279FA"
                              : "rgba(0, 0, 0, 0.60)",
                          fontSize: RFPercentage(2),
                        }}
                      >
                        Terms of Service
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isSelected1 ? (
                      <>
                        <TouchableOpacity
                          style={{
                            marginTop: "5%",
                            width: "82%",
                            height: 49,
                            backgroundColor:
                              theme.theme === "dark" ? "#FFF600" : "#612CD2",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            border: 1,
                            borderRadius: 1.76,
                          }}
                          onPress={() => submitFunction()}
                        >
                          <Text
                            style={{
                              fontSize: "400",
                              fontFamily: Fonts.Regular,
                              color:
                                theme.theme === "light" ? "#ffffff" : "black",
                              fontSize: RFPercentage(2.4),
                            }}
                          >
                            Sign In
                          </Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={{
                            marginTop: "5%",
                            width: "82%",
                            height: 49,
                            backgroundColor:
                              theme.theme === "black" ? "#707070" : "#707070",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            border: 1,
                            borderRadius: 1.76,
                          }}
                          onPress={() => submitFunction()}
                        >
                          <Text
                            style={{
                              fontSize: "400",
                              fontFamily: Fonts.Regular,
                              color: "#9e9e9e",
                              fontSize: RFPercentage(2.4),
                            }}
                          >
                            Sign In
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>

                  <View
                    style={{
                      marginTop: "5%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "2%",
                      width: "90%",
                      alignSelf: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.Regular,
                        color: theme.theme === "dark" ? "#FFF" : "black",
                        fontSize: RFPercentage(1.9),
                      }}
                    >
                      Don't have an account?{" "}
                    </Text>
                    {/* <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => props.navigation.navigate("Signup")}>
                <Text textBreakStrategy="simple" style={{ textDecorationLine: "underline", color: theme.text, fontSize: RFPercentage(1.9) }}>Sign Up</Text>
              </TouchableOpacity> */}
                    <Pressable
                      onPress={() => props.navigation.navigate("Signup")}
                    >
                      <View style={{ marginLeft: "1.5%" }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            color: "#A279FA",
                            fontSize: RFPercentage(1.9),
                            fontWeight:"bold"
                          }}
                        >
                          Sign Up
                        </Text>
                        <View
                          style={{
                            width: "100%",
                            height: 1,
                            // backgroundColor: theme.text,
                          }}
                        />
                      </View>
                    </Pressable>
                  </View>
                </View>
                </ScrollView>
              </ImageBackground>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    title_text: {
      fontFamily: Fonts.Bold,
      fontSize: RFPercentage(2.4),
      color: theme.theme === "dark" ? "#fff" : "black",
      marginLeft: "5%",
    },
    title: {
      color: "#fff",
      fontSize: 30,
      fontWeight: "400",
    },
    emailtext: {
      color: "#fff",
      fontSize: 30,
      fontWeight: "400",
    },
    box_container: {
      borderColor: "rgba(162, 121, 250, 0.30)",
      borderWidth: 2,
      backgroundColor: "rgba(155, 124, 220, 0.15)",
      borderRadius: 5,
      marginTop: "2.5%",
    },
    input_container: {
      fontFamily: Fonts.Regular,
      color: "#A279FA",
      fontSize: RFPercentage(1.9),
    },
    error_container: {
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(1.6),
      color: "red",
      marginTop: "1%",
    },
    checkedColor: theme.theme === "dark" ? "#FFF600" : "#612CD2",
    checkContainer: {
      borderColor: "transparent",
      backgroundColor: "transparent",
      margin:"0%",
      padding: "0%",


    },
  });
