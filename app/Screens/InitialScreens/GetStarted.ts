import React, { useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  NativeModule,
  Dimensions,
  BackHandler,
  NativeModules,
  ToastAndroid,
  StatusBar,
} from "react-native";
import themeContext from "../../utils/themeContext";
import { Fonts } from "../../utils/Fonts";
// import LLogo from "../../assets/img/llogo.svg";
// import DLogo from "../../assets/img/dlogo.svg";

// import LLogo from "../../assets/img/logolight.png";
// import DLogo from "../../assets/img/logodark.png";
import LLogo from "../../assets/img/applogo2d.png";
import DLogo from "../../assets/img/applogo2l.png";
import { useFocusEffect } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { ApiConstants } from "../../api/ApiConstants";
import { Images } from "../../utils/Images";
import { windowWidth, windowheight } from "../../utils/Dimensions";
export default function GetStarted(props) {
  const theme = React.useContext(themeContext);
    const style = styles(theme);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const {ApiModule} = NativeModules ;

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

  // useFocusEffect(
  //     React.useCallback(() => {
  //         ApiModule.isKeyboardEnabled("UNBLOK KEYBOARD")
  //             .then((result) => {
  //                 console.log("resulttttt", result);
  //             })
  //             .catch((err) => {
  //                 console.log("error", err);
  //             })
  //     }, [ApiModule]))

  const navigate = () => {
    try {
      // ApiModule.isKeyboardEnabled(result => {
      //     console.log('Callback value:', result);
      // })
      // ApiModule.isKeyboardEnabled(enabled => {
      //     if (enabled) {
          props.navigation.navigate("Signin")
      // ApiModule.openInputMethodPickerAndNavigate();
      //  console.log('Keyboard enabled',enabled);
      // } else {
      //   console.log('Desired keyboard is not enabled.');
      //   ApiModule.openKeyboardSettings();
      
      // }});

    } catch (error) {
      console.log("Error on enabling")
        }
   
    }
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
            {theme.theme == "light" ? (
              <View style={{ height: "100%", justifyContent: "flex-start" }}>
                <View
                  style={{
                    width: windowWidth,
                    height: windowheight,
                    paddingTop: StatusBar.windowheight,
                    backgroundColor: "white",
                  }}
                >
                  <ImageBackground
                    source={Images.backgroundgrouplight}
                    style={{
                      width: windowWidth,
                      height: windowheight,
                      marginTop: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        windowheight,
                        width: windowWidth,
                      }}
                    >
                      <View style={{ width: "100%", height: "20%" }}>
                        <View
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View style={{ width: "50%", marginTop: 30 }}>
                            <Image
                              style={{ width: 26, height: 26 }}
                              source={require("../../assets/img/maskgroup.png")}
                              resizeMode="contain"
                            />
                          </View>
                        </View>
                        <View
                          style={{
                            padding: 10,
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              width: "80%",
                              alignItems: "flex-end",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Image
                              style={{ width: 26, height: 26 }}
                              source={require("../../assets/img/maskgroup1.png")}
                              resizeMode="contain"
                            />
                          </View>
                        </View>
                      </View>
                      <View style={{ height: "60%", flexDirection: "column" }}>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            style={{ width: 315, height: 318 }}
                            source={require("../../assets/img/startedgroup.png")}
                            resizeMode="contain"
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
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
                        <View
                          style={{
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            style={{ width: 0, height: 299 }}
                            source={require("../../assets/img/vector.png")}
                            resizeMode="contain"
                          />
                        </View>
                      </View>
                      <Image
                              style={{ width:"100%",height:1.5}}
                              source={require("../../assets/img/devider.png")}
                              resizeMode="contain"
                            />
                      <View
                        style={{
                          height: "20%",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <View
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => navigate()}
                            style={{
                              width: 315,
                              height: 49,
                              backgroundColor:theme.theme==="dark"? "yellow":"#612CD2",
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "center",
                              border: 1,
                              borderRadius: 2,
                            }}
                          >
                            <Text
                              style={{
                                color:theme.theme==="dark"? "#000":"#fff",
                                fontSize: 20,
                                fontWeight: "bold",
                              }}
                            >
                              Get Started
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </ImageBackground>
                </View>
              </View>
            ) : (
              <View style={{ windowheight, justifyContent: "flex-start" }}>
                <ImageBackground
                  source={Images.background}
                  style={{
                    width: windowWidth,
                    height: windowheight,
                    paddingTop: StatusBar.windowheight,
                  }}
                  resizeMode="cover"
                >
                  <ImageBackground
                    source={Images.backgroundgroup}
                    style={{
                      width: windowWidth,
                      height: windowheight,
                      marginTop: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        windowheight,
                        width: windowWidth,
                      }}
                    >
                      <View style={{ width: "100%", height: "20%" }}>
                        <View
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View style={{ width: "50%", marginTop: 30 }}>
                            <Image
                              style={{ width: 26, height: 26 }}
                              source={require("../../assets/img/maskgroup.png")}
                              resizeMode="contain"
                            />
                          </View>
                        </View>
                        <View
                          style={{
                            padding: 10,
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              width: "80%",
                              alignItems: "flex-end",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Image
                              style={{ width: 26, height: 26 }}
                              source={require("../../assets/img/maskgroup1.png")}
                              resizeMode="contain"
                            />
                          </View>
                        </View>
                      </View>
                      <View style={{ height: "60%", flexDirection: "column" }}>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            style={{ width: "90%", height: "70%" }}
                            source={require("../../assets/img/startedgroup.png")}
                            resizeMode="contain"
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              style={{ width: 74, height: 74 }}
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
                        <View
                          style={{
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            style={{ width: 0, height: 299 }}
                            source={require("../../assets/img/vector.png")}
                            resizeMode="contain"
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          height: "20%",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <View
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => navigate()}
                            style={{
                              width: 315,
                              height: 49,
                              backgroundColor: "yellow",
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "center",
                              border: 1,
                              borderRadius: 1.76,
                            }}
                          >
                            <Text
                              style={{
                                color: "#000",
                                fontSize: 20,
                                fontWeight: "bold",
                              }}
                            >
                              Get Started
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </ImageBackground>
                </ImageBackground>
              </View>
            )}
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
      justifyContent: "center",
      alignItems: "center",
      height: windowheight,
      width: windowWidth,
    },
    txt: {
      color: "grey",
      fontSize: 12,
      fontFamily: Fonts.Bold,
    },
    title: {
      color: "#fff",
      fontSize: 16,
      fontFamily: Fonts.Bold,
    },
  });
