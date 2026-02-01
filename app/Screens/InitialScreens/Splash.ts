import React, { useCallback, useContext, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  Image,
  View,
  ImageBackground,
  StatusBar
} from "react-native";
import themeContext from "../../utils/themeContext";
import { Images } from "../../utils/Images";
import { Fonts } from "../../utils/Fonts";
import ApiClient from "../../api/ApiClient";
import { ApiConstants } from "../../api/ApiConstants";
import DeviceInfo from "react-native-device-info";
import EncryptedStorage from "react-native-encrypted-storage";
import { useNetInfo } from "@react-native-community/netinfo";
import getRealm from "../../localDb/RealmConfig";
// import LLogo from "../../assets/img/llogo.svg";
// import DLogo from "../../assets/img/dlogo.svg";

import { windowWidth, windowheight } from "../../utils/Dimensions";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { DefaultCurrency, DefaultCurrencyName, fiatData } from "../../Redux/Actions/fiatDataAction";
import TokenClient from "../../api/TokenClient";
import changeNavigationBarColor from "react-native-navigation-bar-color";

const Splash = (props) => {
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
//check network
  const netInfo = useNetInfo();

  const dispatch = useDispatch()


  const SetDefaultCurrencies = (item) => dispatch(DefaultCurrency(item));
  const defaultCurrency = (item) => dispatch(DefaultCurrencyName(item))
  const setFiatData = (item) => dispatch(fiatData(item));
  useEffect(() => {
    global.resumePath = "Splash";
    if (netInfo.isConnected == false) {
      ToastAndroid.showWithGravityAndOffset(
        "Check Your Internet!",
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50
      );
    } else {
      getWalletData();
      setSettings()
    }
  }, [netInfo]);

  useFocusEffect(useCallback(() => {
    getDefaultCurrency()
  }, []))

  const getDefaultCurrency = () => {
    getRealm()
      .then((realm) => {
        var defaultCurrencyVal = realm.objects("defaultCurrency");
        if (defaultCurrencyVal.length == 0) {
          SetDefaultCurrencies("$");
          defaultCurrency("USD");
          fiatdata("USD")
          realm.write(() => {
            initialVal = realm.create("defaultCurrency", {
              defaultCurrency: "USD",
            });
          });
        } else {
          console.log("defaultCurrencyVal[0].defaultCurrency", defaultCurrencyVal[0].defaultCurrency)
          fiatdata(defaultCurrencyVal[0].defaultCurrency)
          defaultCurrency(defaultCurrencyVal[0].defaultCurrency)
          SetDefaultCurrencies(
            defaultCurrencyVal[0].defaultCurrency == "USD"
              ? "$"
              : defaultCurrency == "GBP"
                ? "£"
                : "€"
          );
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.error("err", err);
      });
  };

  const fiatdata = async (defaultCurrency) => {
    TokenClient.get(ApiConstants.coinmarketcap_All_Req, {
      params: { defaultCurrency },
    })
      .then(function (res) {
        // console.log("adadadadadadad",res.data.data);
        setFiatData(res.data.data);
      })
      .catch(function (err) {
        console.error("coinmarketcap_bysymbol err 2", err);
      });
  };

  const setSettings = async () => {
    getRealm()
      .then((realm) => {
        var keyboardSpecs = realm.objects("keyboardSpecs")
        if (keyboardSpecs.length == 0) {
          realm.write(() => {
            realm.create("keyboardSpecs", {
              Dapp: "true",
              translate: "true",
              wallet: "true",
              language: "true",
              Themes: "true",
              voice: "true",
              capsLetter: "true",
              wordPrediction: "true",
            })
          })
          global.keyboardSettings = JSON.stringify({
            Dapp: "true",
            translate: "true",
            wallet: "true",
            language: "true",
            Themes: "true",
            voice: "true",
            capsLetter: "true",
            wordPrediction: "true",
          })
        } else {
          console.log("sgtuhgtgwegwe", keyboardSpecs);
          global.keyboardSettings = JSON.stringify(keyboardSpecs[0])
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log("error on keyboard schema", err);
      })
  }

  //check if user is created a wallet already if not means calls getUserToken
  const getWalletData = async () => {
    getRealm()
      .then((realm) => {
        var deviceId = DeviceInfo.getUniqueId();
        global.deviceId = deviceId;
        var walletData = realm.objects("Wallet_array");
        // global.walletArray = walletData;

        var loginStatus = realm.objects("loginStatus")
        console.log("loginStatus",loginStatus);
        if (loginStatus != undefined && loginStatus.length != 0) {
          // getPasscodeStatus();
          // props.navigation.navigate("Wallet");
          navigateToWallet()
        } else {
          getUserToken();
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "wallet data list err from localDb");
      });
  };

  const navigateToWallet = async () => {
    getRealm()
      .then((realm) => {
        var walletStatus = realm.objects("Wallet_array")
        if (walletStatus != undefined && walletStatus.length != 0) {
          getPasscodeStatus()
        } else {
          props.navigation.navigate("CreateWallet")
        }
      })
      .catch(() => {
        console.log("error on navigateWallet", err);
      })
  }

  const getPasscodeStatus = () => {
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
          props.navigation.navigate("WalletHome");
        } else if (
          (global.passcodeStatus == 1 || global.passcodeStatus == 0) &&
          global.biometricStatus != 0
        ) {
          global.bioPage = "EnterPasscode"
          props.navigation.push("CheckBiometric");
        } else if (passcodeVal.length == 1 || global.biometricStatus == 0) {
          props.navigation.navigate("EnterPasscode");
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "getPasscodeStatus err from localDb in splash");
      });
  };
  //get passcode status


  //for getting user token
  const getUserToken = async () => {
    var deviceId = DeviceInfo.getUniqueId();
    global.deviceId = deviceId;
    console.log("deviceId", deviceId);
    let params = {
      deviceid: deviceId,
    };
    ApiClient.post(ApiConstants.newuser, params)
      .then((res) => {
        console.log('newuser res', res.data.token);
        saveToken(res.data.token);
      })
      .catch((err) => {
        console.log("newuser err", err);
      });
  };

  const saveToken = async (token) => {
    try {
      await EncryptedStorage.setItem("UserToken", token);
      retrieveData();
    } catch (error) { }
  };

  const retrieveData = async () => {
    try {
      const newUserToken = await EncryptedStorage.getItem("UserToken");
      if (
        newUserToken !== null &&
        newUserToken != undefined &&
        newUserToken != ""
      ) {
        global.token = newUserToken;
        props.navigation.navigate("GetStarted");
      }
    } catch (error) {
      console.log("err while saving token",error);
    }
  };
  React.useEffect(() => {
    changeNavigationBarColor(theme.theme == "dark" ? '#35225B': "#ffffff" , false, false)
  }, [theme]);
  return (
    <>
     <StatusBar barStyle={theme.theme == "dark" ? "light-content":"dark-content" } backgroundColor={theme.theme==="dark"?"rgb(25,14,47)":"#ffffff"} />
    <SafeAreaView style={style.container}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <View style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>

          {theme.theme == "light" ?
            (
              <ImageBackground source={Images.background} style={{ width: windowWidth, height: windowheight, paddingTop: StatusBar.windowheight, }}>
              {/* <Image style={{flex: 1, width: windowWidth , height: windowheight  }} source={Images.splashlogo} resizeMode="contain" /> */}
             <View style={{flexDirection:'column',  width:windowWidth, backgroundColor:'white'}}>
             <View style={{width: '100%', height:'20%'}}>
                <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: '50%', marginTop: 30 }}>
                    <Image style={{ width: 26, height: 26 }} source={require("../../assets/img/maskgroup.png")} resizeMode="contain" />
                  </View>

                </View>
                <View style={{ padding: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                  <View style={{ width: '80%', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  <Image style={{ width: 26 , height: 26, }} source={require("../../assets/img/maskgroup1.png")} resizeMode="contain" />
                  </View>
                </View>
              </View>
              <View style={{height:'60%', justifyContent:'center'}}>
                <View style={{justifyContent:'center',alignItems:'center'}}>
                <Image style={{ width: 105, height: 113 }} source={require("../../assets/img/appicon.png")} resizeMode="contain" />
                </View>
              </View>
              <View style={{height:'20%', justifyContent:'center', flexDirection:'column'}}>
              <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: '70%',height:'50%', justifyContent:'flex-end'}}>
                    <Image style={{ width: 26, height: 26 }} source={require("../../assets/img/maskgroup2.png")} resizeMode="contain" />
                  </View>
                  <View style={{ width: '100%',alignItems:'center',height:'50%',justifyContent:'center'}}>
                    <Image style={{ width: 137, height: 23 }} source={require("../../assets/img/keyboard3.0.png")} resizeMode="contain" />
                  </View>
                </View>
              </View>
             </View>
            </ImageBackground>
            )
            : (<ImageBackground source={Images.background} style={{ width: windowWidth, height: windowheight, paddingTop: StatusBar.windowheight, }}>
             <View style={{flexDirection:'column', windowheight, width:windowWidth, }}>
             <View style={{width: '100%', height:'20%'}}>
                <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: '50%', marginTop: 30 }}>
                    <Image style={{ width: 26, height: 26 }} source={require("../../assets/img/maskgroup.png")} resizeMode="contain" />
                  </View>

                </View>
                <View style={{ padding: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                  <View style={{ width: '80%', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  <Image style={{ width: 26 , height: 26, }} source={require("../../assets/img/maskgroup1.png")} resizeMode="contain" />
                  </View>
                </View>
              </View>
              <View style={{height:'60%', justifyContent:'center'}}>
                <View style={{justifyContent:'center',alignItems:'center'}}>
                <Image style={{ width: 105, height: 113 }} source={require("../../assets/img/appicon.png")} resizeMode="contain" />
                </View>
              </View>
              <View style={{height:'20%', justifyContent:'center', flexDirection:'column'}}>
              <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: '70%',height:'50%', justifyContent:'flex-end'}}>
                    <Image style={{ width: 26, height: 26 }} source={require("../../assets/img/maskgroup2.png")} resizeMode="contain" />
                  </View>
                  <View style={{ width: '100%',alignItems:'center',height:'50%',justifyContent:'center'}}>
                    <Image style={{ width: 137, height: 23 }} source={require("../../assets/img/keyboard3.0.png")} resizeMode="contain" />
                  </View>
                </View>
              </View>
             </View>
            </ImageBackground>
            )
          }
        </View>
      </View>
    </SafeAreaView>
    </>
  );
};
export default Splash;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
      height:windowheight,
      width: windowWidth
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
