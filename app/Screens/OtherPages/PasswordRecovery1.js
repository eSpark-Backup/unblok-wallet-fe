import React, { useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Linking,
  ToastAndroid,
  useColorScheme,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Images } from "../../utils/Images";
import themeContext from "../../utils/themeContext";
import { Fonts } from "../../utils/Fonts";
// import LLogo from "../../assets/img/llogo.svg";
// import DLogo from "../../assets/img/dlogo.svg";

import LLogo from "../../assets/img/applogo2d.png";
import DLogo from "../../assets/img/applogo2l.png";
import Header from "../../Components/Header";

import { formValidation, sendMailFunc } from "./common/Password_Recovery1";
import isEmpty from "../../utils/isEmpty";
import {
  borderRadius,
  borderWidth,
  windowWidth,
  windowheight,
} from "../../utils/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
// const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get("window").height;
//   import PasswordInputText from 'react-native-hide-show-password-input';
export default function PasswordRecovery1(props) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [mailAddress, setMailAddress] = React.useState("");
  const [error, setError] = useState({});
  const [mailErr, setMailErr] = useState("");
  const [load, setLoad] = useState(false);
  const theme = React.useContext(themeContext);
  const style = styles(theme);

  const submitFunc = async () => {
    setLoad(true)
    var validate = await formValidation({ mailAddress:mailAddress.toLowerCase().trim() })
    console.log("validate", validate);
    if (!isEmpty(validate)) setError(validate)
    else {
      sendMailFunc(mailAddress.toLowerCase().trim())
        .then((res) => {
          console.log("eresss", res.data);
          setLoad(false)
          if (res.data.success) {
            // ToastAndroid.showWithGravityAndOffset(
            //     res.data.msg,
            //     ToastAndroid.LONG,
            //     ToastAndroid.BOTTOM,
            //     25,
            //     50
            // );
            props.navigation.navigate("VerificationCode")
          } else {
            setMailErr(res.data.msg)
          }
        })
        .catch((err) => {
          setLoad(false)
          console.log("errrr on send mail function", err);
        })
        }
    }
  
  return (
    <>
      <SafeAreaView style={style.container}>
        {/* <View style={{ marginHorizontal: 25, marginTop: 50 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <View style={{textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center"}}>
               

                    {theme.theme == "light" ?
                                    (
                                        <Image source={LLogo} resizeMode="contain" />
                                    )
                                    : (
                                        <Image source={DLogo} resizeMode="contain" />
                                    )
                                }
                    </View>

                </View>
                <View style={{ marginTop: 30 }}>
                    <Text style={{
                        fontFamily: Fonts.Bold, fontSize: 21, color: theme.text,
                        marginBottom: 10
                    }}>Password Recovery</Text>
                </View>
                <Text style={{
                    fontFamily: Fonts.Regular, fontSize: 13, color: "#000",
                    marginBottom: 30, color: theme.text,width:"80%"
                }}>Enter your Email Address to get a verification code</Text>
                <View style={{ marginBottom: 30 }}>
                    <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: "#000", marginBottom: 15, color: theme.text,}}>Email Address*</Text>
                    <View style={{
                        borderColor: theme.bordercolor, borderWidth: 1, paddingHorizontal: 10,
                        borderRadius: 5 }}>
                        <TextInput
                            selectionColor={theme.text}
                            onChangeText={setMailAddress}
                            value={mailAddress}
                            placeholder="Enter Email Address"
                            placeholderTextColor={"grey"}
                            style={{ fontFamily: Fonts.Regular, paddingLeft: 10 }}
                        />
                    </View>
                    {error && error?.mailAddress && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red" }}>{error.mailAddress}</Text>}
                    {error && error?.mailValidateErr && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red" }}>{error.mailValidateErr}</Text>}
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity style={{
                        backgroundColor: "transparent", borderColor:theme.texttheme, borderWidth: 1,
                        borderRadius: 30, width: 150, padding: 15, marginTop: 30
                    }} onPress={() => { submitFunc() }}>
                     
                        <Text style={{
                            width: "100%", textAlign: "center", color:theme.texttheme,
                            fontFamily: Fonts.Regular
                        }}>Continue</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 50, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("Signin")}>
                        <Text style={{
                            width: "100%", textAlign: "center", borderBottomColor: theme.text,
                            borderBottomWidth: 1, fontSize: 14, color: theme.text
                        }}>Back To Login</Text>
                    </TouchableOpacity>
                </View>
            </View> */}
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
                <View style={{ width: "90%", alignSelf: "center" }}>
                  <Text
                    style={{
                      fontFamily: Fonts.Bold,
                      fontSize: RFPercentage(3.5),
                      color: theme.theme === "dark" ? "#fff" : "black",
                      fontWeight:"bold",
                    }}
                  >
                    Password Recovery
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.Medium,
                      fontSize: RFPercentage(1.9),
                      color: theme.theme === "dark" ? "#fff" : "black",
                    }}
                  >
                    Enter email address to get a verification code
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
                          onChangeText={(val) => {
                            setMailAddress(val);
                            setError({});
                            setMailErr("");
                          }}
                          value={mailAddress}
                          placeholder="Enter Email Address"
                          placeholderTextColor={"#A279FA"}
                          style={style.input_container}
                        />
                      </View>
                    </View>
                    {error && error?.mailAddress && (
                      <Text style={style.error_container}>
                        {error.mailAddress}
                      </Text>
                    )}
                    {error && error?.mailValidateErr && (
                      <Text style={style.error_container}>
                        {error.mailValidateErr}
                      </Text>
                    )}
                    {mailErr != "" ? (
                      <Text style={style.error_container}>{mailErr}</Text>
                    ) : (
                      <></>
                    )}
                  </View>
                  <TouchableOpacity
                    style={{
                      alignSelf: "center",
                      marginTop: "20%",
                      width: "90%",
                      height: 49,
                      backgroundColor:
                        theme.theme === "dark" ? "#FFF600" : "#612CD2",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      border: 1,
                      borderRadius: 2,
                    }}
                    onPress={() => {
                      submitFunc();
                    }}
                  >
                    <Text
                      style={{
                        width: "100%",
                        textAlign: "center",
                        fontFamily: Fonts.Regular,
                        color: theme.theme === "light" ? "#fff" : "black",
                        fontSize: RFPercentage(2),
                      }}
                    >
                      Continue
                    </Text>
                  </TouchableOpacity>
                </View>
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
      fontFamily: Fonts.Medium,
      fontSize: RFPercentage(1.9),
      color: theme.theme === "dark" ? "#fff" : "black",
      marginLeft: "5%",
    },
    box_container: {
      borderColor: "rgba(162, 121, 250, 0.30)",
      borderWidth: 1,
      backgroundColor: "rgba(155, 124, 220, 0.15)",
      borderRadius: 5,
      marginTop: "2.5%",
    },
    input_container: {
      fontFamily: Fonts.Regular,
      color: theme.theme === "dark" ? "#fff" : "black",
      fontSize: RFPercentage(1.9),
    },
    error_container: {
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(1.6),
      color: "red",
      marginTop: "1%",
    },
  });
