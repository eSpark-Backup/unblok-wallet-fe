import React, { useContext, useState } from "react";
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
  StatusBar,
  BackHandler
} from "react-native";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { Images } from "../../utils/Images";
import { Button } from "react-native-elements";
import { Fonts } from "../../utils/Fonts";
// import { Colors } from "../../utils/Colors";
// import { Col } from "native-base";
import LinearGradient from 'react-native-linear-gradient';
import { RFPercentage } from "react-native-responsive-fontsize";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { useFocusEffect } from "@react-navigation/native";
import getRealm from "../../localDb/RealmConfig";
const CreateWallet2 = (props) => {
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [passwordLength, setPassword] = useState(0);
  useFocusEffect(
    React.useCallback(() => {
      getPasscodeStatus();
      return () => { };
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Logout!', 'Are You Sure want to Logout ?', [
          {
            text: 'Cancel'
          },
          { text: 'OK', onPress: () => props.navigation.navigate("Signin") },
        ]);

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

  //get passcode status
  const getPasscodeStatus = () => {
    getRealm()
      .then((realm) => {
        var passcodeVal = realm.objects("userPasscodeValue");
        if (passcodeVal.length != 0) {
          setPassword(1);
        } else {
          setPassword(0);
        }

        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "getPasscodeStatus err from localDb in createWallet");
      });
  };
  return (
    <SafeAreaView style={style.container}>
      <View style={{ windowheight, justifyContent: "flex-start" }}>
      <ImageBackground
          source={theme.theme === "dark" ? Images.background :Images.backgroundWhite}
          style={{
            width: windowWidth,
            height: windowheight,
            
          }}
          resizeMode="cover"
        >
          
          <ImageBackground
            source={theme.theme === "dark" ? Images.backgroundgroup : Images.backgroundgrouplight}
            style={{ width: windowWidth, height: windowheight, }}
          >
            <Header name={"Create Wallet"} leftImage={"back"} />
            <View
              style={{
                flexDirection: "column",
             
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
                  <View
                    style={{
                      width: "70%",
                      marginTop: 30,
                      justifyContent: "space-between",
                      flexDirection: "row",
                    }}
                  >
                    <Image
                      style={{ width: 24, height: 24, marginTop: 20 }}
                      source={require("../../assets/img/polygon.png")}
                      resizeMode="contain"
                    />
                    <Image
                      style={{ width: 26, height: 26, marginTop: 5 }}
                      source={require("../../assets/img/maskgroup1.png")}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>
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
                      <View style={{ width: "70%", marginTop: 10 }}>
                        <Image
                          style={{ width: 26, height: 26 }}
                          source={require("../../assets/img/maskgroup2.png")}
                          resizeMode="contain"
                        />
                      </View>
                    </View>
                    <View
                      style={{ alignItems: "center", flexDirection: "column" }}
                    >
                      <Text style={style.createText}>Create</Text>
                      <Text style={style.walletText}> Wallet</Text>
                    </View>
                    <Image
                        style={{width:"100%",height:1.5,marginTop:10}}
                        source={require("../../assets/img/devider.png")}
                        resizeMode="contain"
                      />
                    <View
                      style={{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        style={{}}
                        source={require("../../assets/img/vector.png")}
                        resizeMode="contain"
                      />
                    </View>
                    <View
                      style={{ alignItems: "center",}}
                    >
                      <Image
                        style={{ width: "75%",height: "80%",}}
                        source={require("../../assets/img/walletimg.png")}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                  <View
                    style={{ alignItems: "center", flexDirection: "column" }}
                  >
                    <Text style={style.privateText}>Private & Secure</Text>
                    <Text style={style.keyText}>
                      Private Keys never leave your device
                    </Text>
                  </View>
                  <View
                    style={{
                      height: "20%",
                      justifyContent: "flex-end",
                      flexDirection: "column",
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          props.navigation.navigate(
                            "PrivacyInfoAfterCreate",
                            "createWallet1"
                          );
                        }}
                        style={{
                          width: "85%",
                          height: 45,
                          alignSelf: "center",
                          backgroundColor: theme.theme==="dark"? "yellow":"#612CD2",
                          alignContent: "center",
                          alignItems: "center",
                          justifyContent: "center",
                          border: 1,
                          borderRadius: 1.76,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.theme==="dark"? "#000":"#fff",
                            fontSize: 20,
                            fontWeight: "bold",
                          }}
                        >
                          Create a New Wallet
                        </Text>
                      </TouchableOpacity>
                      <View style={{ marginTop: 10 }}>
                        <TouchableOpacity
                          onPress={() => {
                            if (passwordLength == 0) {
                              props.navigation.navigate("SetPasswordforImport");
                            } else {
                              props.navigation.navigate("ImportWallet");
                            }
                          }}
                        >
                          <Text style={style.keyText}>
                            Already have a wallet
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      width: "90%",
                      alignItems: "flex-end",
                      marginTop: 35,
                    }}
                  >
                    <Image
                      style={{ width: 26, height: 26 }}
                      source={require("../../assets/img/maskgroup.png")}
                      resizeMode="contain"
                    />
                  </View>
                </LinearGradient>
              </View>
            </View>
          </ImageBackground>
        </ImageBackground>
        </View>
      {/* <ScrollView showsVerticalScrollIndicator={false} >
        <Image source={{ uri: Images.createwalletPng }} style={style.imgStl} />
        <Text style={style.privacyTxt}>Private and Secure</Text>
        <Text style={style.privacyTxt2}>
          Private keys never leave your device.
        </Text>

        <TouchableOpacity style={style.createBtn}
          onPress={() => {
            props.navigation.navigate("PrivacyInfoAfterCreate", "after");
          }}
        >
          <Text style={{
            textAlign: "center",
            fontFamily: Fonts.Regular, color: theme.texttheme,
            borderWidth: 1,
            borderColor: theme.texttheme, borderRadius: windowWidth * 0.1, fontSize: RFPercentage(1.8), padding: windowheight * 0.025
          }}>CREATE A NEW WALLET</Text>
        </TouchableOpacity>
        <TouchableWithoutFeedback
          onPress={() =>
            props.navigation.navigate("ImportWalletAfterCreate")
          }
        >
          <Text style={style.walletTxt}>I already have a wallet</Text>
        </TouchableWithoutFeedback>
      </ScrollView> */}
    </SafeAreaView>
  );
};
export default CreateWallet2;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    mainView: {
      backgroundColor: theme.background,
      height: 60,
    },
    createText: {
      color: theme.theme==="dark"?"#FFF600":"#000000",
      textAlign: "center",
      fontSize: RFPercentage(3.5),
      fontFamily:Fonts.Bold,
      fontWeight:"bold"
    },
    walletText: {
      color: theme.theme==="light"? "#612CD2":"#fff",
      textAlign: "center",
      fontSize: RFPercentage(3.5),
      fontFamily:Fonts.Bold,
      textShadowColor: theme.theme === "light" ? "#000" : "#612CD2",
      textShadowOffset: { width: -1.5, height: 2.5 },
      textShadowRadius: 1,
      fontWeight:"bold"

    },
    privateText: {
      color: theme.theme==="light"? "#000":"#fff",
      textAlign: "center",
      fontSize:  RFPercentage(2.5),
      fontFamily:Fonts.Medium,
      fontWeight:"bold",
  
    },
    keyText: {
      color: theme.theme==="light"? "#000":"#fff",
      textAlign: "center",
      fontSize: 15,
      fontWeight: "400",
      width:"100%",
   
    },
    view2: {
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: "red",
    },
    cardWrapper: {
      justifyContent: "center",
      alignItems: "center",
      marginTop:"-20%"
    },
    card: {
      width: "80%",
      height: 544,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: "rgba(162, 121, 250, 0.30)",
    },
    view3: {
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "green",
    },
    imgStl: {
      resizeMode: "contain",
      marginTop: "30%",
      width: windowWidth * 0.5,
      height: windowheight * 0.25,
      aspectRatio: 1,
      alignSelf: "center",
    },
    privacyTxt: {
      fontFamily: Fonts.Medium,
      fontSize: RFPercentage(2.5),
      color: theme.text,
      textAlign: "center",
      marginTop: "15%",
    },
    privacyTxt2: {
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(1.9),
      color: theme.text,
      marginTop: "2%",
      textAlign: "center",
    },
    btnView: {
      alignSelf: "center",
      justifyContent: "center",
      width: 200,
    },
    createBtn: {
      width: "auto",
      backgroundColor: "transparent",
      color: "#000",
      height: "auto",
      alignSelf: "center",
      marginTop: "15%",
    },
    walletTxt: {
      fontFamily: Fonts.Regular,
      color: theme.text,
      fontSize: RFPercentage(1.9),
      textAlign: "center",
      marginTop: "5%",
      marginBottom: "10%",
    },
  });
