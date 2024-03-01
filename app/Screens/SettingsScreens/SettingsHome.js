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
  Linking,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Image } from "react-native-elements";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { Colors } from "../../utils/Colors";
import { Fonts } from "../../utils/Fonts";
import { Icon as Icn } from "react-native-elements";
import { EventRegister } from "react-native-event-listeners";
import getRealm from "../../localDb/RealmConfig";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ThemeChangelight from "../../assets/icons/lighttheme/Theme Change.svg";
import ThemeChangeDark from "../../assets/icons/darktheme/Theme Change.svg";
import ImportWalletlight from "../../assets/icons/lighttheme/Import Wallet.svg";
import ImportWalletDark from "../../assets/icons/darktheme/Import Wallet.svg";
import Securitylight from "../../assets/icons/lighttheme/Security.svg";
import SecurityDark from "../../assets/icons/darktheme/Security.svg";
import Notificationlight from "../../assets/icons/lighttheme/Notification.svg";
import NotificationDark from "../../assets/icons/darktheme/Notification.svg";
import Preferencelight from "../../assets/icons/lighttheme/Preference.svg";
import PreferenceDark from "../../assets/icons/darktheme/Preference.svg";
import Faqlight from "../../assets/icons/lighttheme/FAQ.svg";
import FaqDark from "../../assets/icons/darktheme/FAQ.svg";
import Aboutuslight from "../../assets/icons/lighttheme/About us.svg";
import AboutusDark from "../../assets/icons/darktheme/About us.svg";
import WalletconnectLight from "../../assets/icons/lighttheme/WalletConnect.svg";
import WalletconnectDark from "../../assets/icons/darktheme/WalletConnect.svg";
import KeyboardLight from "../../assets/icons/lighttheme/Keyboard Black.svg";
import KeyboardDark from "../../assets/icons/darktheme/Keyboard White.svg";
import LogoutLight from "../../assets/icons/lighttheme/logout_light.svg";
import LogoutDark from "../../assets/icons/darktheme/logout_dark.svg";
import Iiconlight from "../../assets/icons/lighttheme/About us.svg";
import IiconDark from "../../assets/img/Iiconlight.svg";
import StarIcaonlight from "../../assets/icons/lighttheme/Inactive Favorite Black.svg";
import StarIcaonDark from "../../assets/icons/darktheme/Favorites.svg";
import RewardWalletlight from "../../assets/icons/lighttheme/Rewards Wallet Black.svg";
import RewardWalletDark from "../../assets/icons/darktheme/Rewards Wallet White.svg";
import Modal from "react-native-modal";
import Backlight from "../../assets/icons/lighttheme/Back arrow.svg";
import BackDark from "../../assets/icons/darktheme/Back arrow.svg";

// import Toggle from "react-native-toggle-element";
// import SwitchToggle from "react-native-switch-toggle";
// import ToggleSwitch from 'toggle-switch-react-native'
import { Switch } from "react-native-switch";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import { Images } from "../../utils/Images";
const SettingsHome = (props) => {
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
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { width, height } = Dimensions.get('window');
  const isPhone = width < 600;
  const isFocused = useIsFocused();
  const deviceHeight = Dimensions.get("window").height
  const deviceWidth = Dimensions.get("window").width
  useFocusEffect(
    React.useCallback(() => {
      // getWalletName()
      setWalletName(global.walletName)
    }, [global.walletName])
  )
  // const getWalletName = async () => {
  //   getRealm()
  //     .then(async (realm) => {
  //       var walletData = realm.objects("Wallet_array");
  //       var arr = walletData.filter((item, index) => {
  //         return item.selected == "true"
  //       });
  //       setWalletName(arr[0].walletname)
  //     })
  //     .catch((err) => {
  //       console.log("errro on setttt", err);
  //     })
  // }
  const [settingsdata, setSettingsdata] = useState([
    {
      iconlight: (
        <ThemeChangelight
          width={windowWidth * 0.055}
          height={windowWidth * 0.055}
          style={{ resizeMode: "contain" }}
        />
      ),
      icondark: (
        <ThemeChangeDark
          width={windowWidth * 0.055}
          height={windowWidth * 0.055}
          style={{ resizeMode: "contain" }}
        />
      ),
      active:
        global.themeData != null &&
        (global.themeData == "true" || global.themeData == true)
          ? true
          : false,
      title: "Dark Mode",
      key: "",
    },
  ]);

  const [settingsdata1, setSettingsdata1] = useState([
    {
      iconlight: (
        <ImportWalletlight
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      icondark: (
        <ImportWalletDark
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      title: "My Wallets",
    },
    {
      iconlight: (
        <Securitylight
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      icondark: (
        <SecurityDark
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      title: "Security",
    },
    {
      iconlight: (
        <WalletconnectLight
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      icondark: (
        <WalletconnectDark
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      title: "WalletConnect",
    },
    {
      iconlight: (
        <Notificationlight
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      icondark: (
        <NotificationDark
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      title: "Notification",
    },
    {
      iconlight: (
        <Preferencelight
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      icondark: (
        <PreferenceDark
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      title: "Preferences",
    },
    {
      iconlight: (
        <Faqlight
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      icondark: (
        <FaqDark
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      title: "FAQ",
    },
    {
      iconlight: (
        <Aboutuslight
          width={windowWidth * 0.08}
          height={windowWidth * 0.08}
          style={{ resizeMode: "contain" }}
        />
      ),
      icondark: (
        <AboutusDark
          width={windowWidth * 0.08}
          height={windowWidth * 0.08}
          style={{ resizeMode: "contain" }}
        />
      ),
      title: "About Us",
    },
    {
      iconlight: (
        <RewardWalletlight
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      icondark: (
        <RewardWalletDark
          width={windowWidth * 0.07}
          height={windowWidth * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      title: "Payout Wallet",
    },
    {
      iconlight: (
        <LogoutLight
          width={windowWidth * 0.07}
          height={windowWidth * 0.05}
          style={{ resizeMode: "contain", }}
        />
      ),
      icondark: (
        <LogoutDark
          width={windowWidth * 0.07}
          height={windowWidth * 0.05}
          style={{ resizeMode: "contain", }}
        />
      ),
      title: "Logout",
    },
  

  ])

  const onChangeFunction = async (text, val, index) => {
    var data = [...settingsdata]
  
    data[index].active = !data[index].active
    setSettingsdata(data)
    EventRegister.emit("changeTheme", val);
    setTimeout(() => {
      changeNavigationBarColor(val ? '#35225B' : "#ffffff", false, false)
    }, 1)

  }
  const logoutFunction = async () => {
    setIsModalVisible(false)
    getRealm()
      .then((realm) => {
        var logoutStatus = realm.objects("loginStatus")
        var walletData = realm.objects("Wallet_array");
        var tokenData = realm.objects("Token_array");
        realm.write(() => {
          realm.delete(logoutStatus)
        })
        realm.write(() => {
          realm.delete(walletData)
        })
        if (tokenData.length != 0) {
          realm.write(() => {
            realm.delete(tokenData)
          })
        }
        global.mailAddress= ""
        props.navigation.navigate("Signin")
      })
      .catch((err) => {
        console.log("errri on lout function", err);
      })
  }


  const navigateFunc = () => {
    getRealm()
      .then((realm) => {
        var passcodeVal = realm.objects("userPasscodeValue");
        var biometricVal = realm.objects("userBiometricStatus");
        global.passcodeStatus = passcodeVal.length;
        if (biometricVal.length != 0) {
          if (biometricVal[0].userBiometricStatus == "false") {
            global.biometricStatus = 0;
          } else if (biometricVal[0].userBiometricStatus == "true") {
            global.biometricStatus = 1;
          }
        } else {
          global.biometricStatus = 0;
        }

        if (passcodeVal.length == 0 && global.biometricStatus == 0) {
          props.navigation.navigate("WalletList")
        } else if (
          (global.passcodeStatus == 1 || global.passcodeStatus == 0) &&
          global.biometricStatus != 0
        ) {
          global.bioPage = "EnterPasscode"
          props.navigation.push("CheckBiometric", "WalletList");
        } else if (passcodeVal.length == 1 || global.biometricStatus == 0) {
          props.navigation.navigate("EnterPasscode", "WalletList");
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "navigateFunc err from localDb in splash");
      });
  };

  const onchangeNavigation = (index) => {
    switch (index) {
      case 0: global?.initialEnter == undefined ? navigateFunc() : props.navigation.navigate("WalletList")
        break;
      case 1: props.navigation.navigate("SecurityScreen")
        break;
      case 2: props.navigation.navigate("WalletConnect")
        break;
      case 3: props.navigation.navigate("Notification")
        break;
      case 4: props.navigation.navigate("Preference")
        break;
      case 5: props.navigation.navigate("FAQ")
        break;
      case 6: props.navigation.navigate("AboutUs")
        break;
      case 7: props.navigation.navigate("PrimaryWallet")
        break;
      // case 8: Linking.openURL('myApp://Dapp');
      case 8: setIsModalVisible(!isModalVisible)
        break;
    }
  
  }
  // useEffect(() => {
  //   StatusBar.setBarStyle(theme.theme === "light" ? "dark-content" : "light-content");
  //   StatusBar.setBackgroundColor(theme.theme === "dark" ? "rgb(25,14,47)" : "#fff");
  // }, [theme.theme]);
  return (
    <SafeAreaView style={style.container}>
      <ImageBackground
        source={theme.theme === "dark" ? Images.background : Images.backgroundWhite}
        style={{
          width: windowWidth,
          height: windowheight,
          paddingTop: StatusBar.windowheight,
        }}
        resizeMode="cover"
      >
    
        
          <>
              
              {/* <Header name={"Settings"} leftImage={"settingBack"} /> */}
              <Header name={"Settings"}/>

              <View style={{ width: "100%", height: "80%" }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{ width: "90%", alignSelf: "center" }}>
                    {settingsdata.map((e, i) => (
                      <View
                        style={{
                          flexDirection: "row",
                          width: "90%",
                          alignSelf: "center",
                          alignItems: "center",
                          height: windowheight * 0.075,
                          marginTop: "0.5%",
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
                              color: theme.theme === "dark" ? "#fff" : "black",
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
                              theme.theme === "dark" ? "#612CD2" : "#c3acf3"
                            }
                            backgroundInactive={
                              theme.theme === "dark" ? "#612CD2" : "#c3acf3"
                            }
                            circleActiveColor={theme.theme==="dark"?"#FFFFFF":"#612CD2"}
                            circleInActiveColor={theme.theme==="dark"?"#FFFFFF":"#612CD2"}
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
                    ))}
                    <Image
                      style={{ width: "100%", height: 1 }}
                      source={require("../../assets/img/deviderPNG.png")}
                      resizeMode="cover"
                    />
                    {/* <View style={{ width: "95%", alignSelf: "center" }} > */}
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate("SettingsKeyboard");
                      }}
                      style={{
                        flexDirection: "row",
                        width: "90%",
                        alignSelf: "center",
                        alignItems: "center",
                        height: windowheight * 0.075,
                        marginTop: "0.5%",
                      }}
                    >
                      <View
                        style={{
                          width: "13%",
                          height: "60%",
                          justifyContent: "center",
                        }}
                      >
                        {theme.theme == "light" ? (
                          <KeyboardLight
                            width={windowWidth * 0.07}
                            height={windowWidth * 0.06}
                            style={{ resizeMode: "contain" }}
                          />
                        ) : (
                          <KeyboardDark
                            width={windowWidth * 0.07}
                            height={windowWidth * 0.06}
                            style={{ resizeMode: "contain" }}
                          />
                        )}
                      </View>
                      <View style={{ width: "72%" }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(1.95),
                            color: theme.theme === "dark" ? "#fff" : "black",
                          }}
                        >
                          Keyboard
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <Image
                      style={{ width: "100%", height: 1 }}
                      source={require("../../assets/img/deviderPNG.png")}
                      resizeMode="cover"
                    />
                    {/* </View> */}
                    {settingsdata1.map((e, i) => (
                      <>
                        <TouchableOpacity
                          onPress={() => onchangeNavigation(i)}
                          style={{
                            flexDirection: "row",
                            width: "90%",
                            alignSelf: "center",
                            alignItems: "center",
                            height: windowheight * 0.075,
                            marginTop: "0.5%",
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
                    style={i == 0 ? style.wallet1 :
                      i == 1 ? style.security :
                        // i == 2 ? style.wallet :
                        i == 2 ? style.notification :
                          i == 3 ? style.preference :
                            i == 4 ? style.faq :
                              style.faq} /> */}
                            {theme.theme == "light" ? e.iconlight : e.icondark}
                          </View>
                          <View style={{ width: "72%" }}>
                            <Text
                              style={{
                                fontFamily: Fonts.Regular,
                                fontSize: RFPercentage(1.95),
                                color:
                                  theme.theme === "dark" ? "#fff" : "black",
                              }}
                            >
                              {e.title}
                            </Text>
                          </View>
                          {/* <TouchableOpacity onPress={() => onchangeNavigation(i)} style={{ width: "15%", alignItems: "center", }} >
                  <Icn
                    name="chevron-right"
                    type="evilicons"
                    color={theme.text}
                    size={windowWidth * 0.07}
                  />
                </TouchableOpacity> */}
                        </TouchableOpacity>
                        {i !== settingsdata1.length - 1 && (
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
                    {/* {settingsdata1.map((e, i) => (
              <View style={{ flexDirection: "row", width: "92.5%", alignSelf: "center", alignItems: "center",marginTop: "2.5%",height:windowheight*0.075 }} >

                <View style={{ width: "15%",height:"60%",justifyContent:"center"}} >
                  <Settings6 width={windowWidth * 0.09} height={windowheight * 0.035} fill={"#000"} />
                </View>
                <TouchableOpacity onPress={() => onchangeNavigation(i)} style={{ width: "70%" }} >
                  <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.text }}>{e.title}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onchangeNavigation(i)} style={{ width: "15%", alignItems: "center", }} >
                  <Icn
                    name="chevron-right"
                    type="evilicons"
                    color={theme.text}
                    size={windowWidth * 0.07}
                  />
                </TouchableOpacity>

              </View>))} */}
                  </View>
                </ScrollView>
              </View>
              <Modal
                isVisible={isModalVisible}
                entry="bottom"
                backdropPressToClose={true}
                visible={isModalVisible}
                backdropColor={"#989898"}
                onBackButtonPress={() => setIsModalVisible(false)}
              >
                <View
                  onStartShouldSetResponder={() => setIsModalVisible(false)}
                  style={{
                    backgroundColor:
                      theme.theme === "dark"
                        ? "rgba(14, 4, 36, 0.80)"
                        : "rgba(68, 68, 68, 0.95)",
                    width: deviceWidth,
                    height: deviceHeight * 1.2,
                    justifyContent: "center",
                    alignSelf: "center",
                    
                  }}
                >
                  
                  <View
                    style={
                      theme.theme == "light"
                        ? style.logoutpopup_light
                        : style.logoutpopup_dark
                    }
                  >
                  <View style={{ justifyContent:'center', alignItems:'center',  width:'100%'}}>
                  <View style={{ width:'50%',  top:5,}}>
                  <Image
                                          style={{ width: 26, height: 26,top:0,left:0 }}
                                          source={require("../../assets/img/maskgroup1.png")}
                                          resizeMode="contain"
                                        />
                  </View>
                                         <View>
                                         {theme.theme == "light" ? (
                        <IiconDark
                          width={windowWidth * 0.35}
                          height={windowWidth * 0.35}
                          style={{ resizeMode: "contain" }}
                        />
                      ) : (
                        <IiconDark
                          width={windowWidth * 0.35}
                          height={windowWidth * 0.35}
                          style={{ resizeMode: "contain" }}
                        />
                      )}
                      <View style={{  top:20,right:"-20%",position:"absolute"}}>
                  <Image
                                          style={{ width: 26, height: 26,top:0,left:0 }}
                                          source={require("../../assets/img/maskgroup.png")}
                                          resizeMode="contain"
                                        />
                  </View>
                                         </View>
                  </View>
                    <View
                      style={{ padding: 10, alignItems: "flex-end" }}
                    >
                    </View>
                    <View style={{ alignItems: "center" }}>
                    
                     
                      {/* <Text
                  style={{
                    fontFamily: Fonts.Regular,
                    fontSize: RFPercentage(2.3),
                    color: "red",
                    textAlign: "center",
                    marginTop: 5
                  }}
                >
                  If you logout all the credentials is will be deleted
                </Text> */}
                      <Text
                        style={{
                          color: theme.theme === "dark" ? "white" : "black",
                          fontFamily: Fonts.Bold,
                          fontSize: RFPercentage(3),
                          marginTop: "6%",
                          alignSelf: "center",
                          textAlign: "center",
                          fontWeight:"700"
                        }}
                      >
                        Logout?
                      </Text>
                      <Image
                        style={{
                          width: 200,
                          height: 1.2,
                          marginBottom: 20,
                          marginTop: 20,
                        }}
                        source={require("../../assets/img/devider.png")}
                        resizeMode="cover"
                      />
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Pressable
                          onPress={() => {
                            setIsModalVisible(false);
                          }}
                        >
                          <View
                            style={{
                              backgroundColor:
                                theme.theme === "dark"
                                  ? "#FFF600"
                                  : "rgba(155, 124, 220, 0.15);",
                              borderRadius: 5,
                              width: 120,
                              paddingHorizontal: 5,
                              paddingVertical: 5,
                              borderWidth: 1,
                              borderColor: "rgba(162, 121, 250, 0.30)",
                              marginTop: 20,
                              marginRight: 5,
                            }}
                          >
                            <Text
                              style={{
                                color: "black",
                                fontFamily: Fonts.Regular,
                                textAlign: "center",
                                width: "100%",
                                marginVertical: 5,
                                fontSize: RFPercentage(1.75),
                              }}
                            >
                              No
                            </Text>
                          </View>
                        </Pressable>
                        <Pressable onPress={() => logoutFunction()}>
                          <View
                            style={{
                              backgroundColor:
                                theme.theme === "dark"
                                  ? "rgba(155, 124, 220, 0.15)"
                                  : "#612CD2",
                              borderRadius: 5,
                              width: 120,
                              paddingHorizontal: 5,
                              paddingVertical: 5,
                              borderWidth: 1,
                              borderColor: "rgba(162, 121, 250, 0.30)",
                              marginTop: 20,
                            }}
                          >
                            <Text
                              style={{
                                color: "white",
                                fontFamily: Fonts.Regular,
                                textAlign: "center",
                                width: "100%",
                                marginVertical: 5,
                                fontSize: RFPercentage(1.75),
                              }}
                            >
                              Yes
                            </Text>
                          </View>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
          </>
       
     
            </ImageBackground>
    </SafeAreaView>
  );
};
export default SettingsHome;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      flex:1
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
    logoutpopup_light: {
      // height:windowheight*0.3,
      alignSelf: "center",
      width: "80%",
      // backgroundColor: theme.blackandwhite,
      backgroundColor: "white",
      borderColor: "rgba(162, 121, 250, 0.30)",
      borderRadius: 10,
      padding: "5%",
      position: "relative",
    },
    logoutpopup_dark: {
      // height:windowheight*0.3,
      alignSelf: "center",
      width: "80%",
      // backgroundColor: theme.blackandwhite,
      backgroundColor: "rgba(155, 124, 220, 0.15)",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "rgba(162, 121, 250, 0.30)",
      padding: "5%",
      position: "relative",
    },
  });
