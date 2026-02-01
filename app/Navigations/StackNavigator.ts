import React, { useCallback, useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Linking,
  NativeModules,
  PermissionsAndroid,
  StatusBar,
  ToastAndroid
} from "react-native";

//Utils
import { MyTransition2 } from "../utils/Animations";
import themeContext from "../utils/themeContext";
import { Colors } from "../utils/Colors";

//top tab screens
import { ImportTab } from "../Navigations/TopTabs";
//bottom tab
import BottomTab from "./BottomTab";
import ApiClient from "../api/ApiClient";
import { ApiConstants } from "../api/ApiConstants";
import DeviceInfo from "react-native-device-info";
import EncryptedStorage from "react-native-encrypted-storage";
import { useNetInfo } from "@react-native-community/netinfo";
import getRealm from "../localDb/RealmConfig";
// import LLogo from "../../assets/img/llogo.svg";
// import DLogo from "../../assets/img/dlogo.svg";
import { NavigationContainer, DarkTheme, DefaultTheme, useFocusEffect } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { DefaultCurrency, DefaultCurrencyName, fiatData } from "../Redux/Actions/fiatDataAction";
import TokenClient from "../api/TokenClient";
//App Screens
//Initial
// import Splash from "../Screens/InitialScreens/Splash";
import Onboarding from "../Screens/InitialScreens/Onboarding";
//Wallet
import CreateWallet from "../Screens/WalletScreens/CreateWallet";
import CreateWallet2 from "../Screens/WalletScreens/CreateWallet2";
import PrivacyInfo from "../Screens/WalletScreens/PrivacyInfo";
import CopyWalletPharse from "../Screens/WalletScreens/CopyWalletPharse";
import ConfirmWalletPharse from "../Screens/WalletScreens/ConfirmWalletPharse";
import ImportWallet from "../Screens/WalletScreens/ImportWallet";
import ImportWithPharse from "../Screens/WalletScreens/ImportWithPharse";
import ImportMultiCoinWallet from "../Screens/WalletScreens/ImportMultiCoinWallet";
import ImportMultiCoinAfterCreate from "../Screens/WalletScreens/ImportMultiCoinAfterCreate";
import ImportWithPrivateKey from "../Screens/WalletScreens/ImportWithPrivateKey";
import ImportWalletTab from "../Screens/WalletScreens/ImportWalletTab";
import ImportWalletTabAfterCreate from "../Screens/WalletScreens/ImportWalletTabAfterCreate";
import WalletList from "../Screens/WalletScreens/WalletList";
//WalletTokenScreens
import TokenList from "../Screens/WalletTokenScreens/TokenList";
import AddCustomToken from "../Screens/WalletTokenScreens/AddCustomToken";
//WalletDetailScreens
import ShowWalletDetails from "../Screens/WalletDetailScreens/ShowWalletDetails";
//scanner screens
import ScanPhrase from "../Screens/ScannerScreens/ScanPhrase";
import ScanAddress from "../Screens/ScannerScreens/ScanAddress";
//Passcode screens
import SetPasscode from "../Screens/PasscodeScreens/SetPasscode";
import SetPasswordforCreate from "../Screens/PasscodeScreens/SetPasswordforCreate";
import SetPasswordforImport from "../Screens/PasscodeScreens/SetPasswordforImport";
import ConfirmPasscode from "../Screens/PasscodeScreens/ConfirmPasscode";
import DisablePasscode from "../Screens/PasscodeScreens/DisablePasscode";
import DisablePassword from "../Screens/PasscodeScreens/DisablePassword";
import EnablePasscode from "../Screens/PasscodeScreens/EnablePasscode";
import EnterPasscode from "../Screens/PasscodeScreens/EnterPasscode";
import EnterPasscodePhrase from "../Screens/PasscodeScreens/EnterPasscodePhrase";
import EnterPrivateKey from "../Screens/PasscodeScreens/EnterPrivateKey";
import ConfirmPasswordforCreate from "../Screens/PasscodeScreens/ConfirmPasswordforCreate";
import ConfirmPasswordforImport from "../Screens/PasscodeScreens/ConfirmPasswordforImport";
//settings screens
import SettingsHome from "../Screens/SettingsScreens/SettingsHome";
import SecurityScreen from "../Screens/SettingsScreens/SecurityScreen";
//wallet transaction screens
import WalletHistory from "../Screens/WalletTransactionScreens/WalletHistory";
import WalletHistoryWebView from "../Screens/WalletTransactionScreens/WalletHistoryWebView";
import WalletSend from "../Screens/WalletTransactionScreens/WalletSend";
import ConfirmSend from "../Screens/WalletTransactionScreens/ConfirmSend";
import WalletReceive from "../Screens/WalletTransactionScreens/WalletReceive";
import PaymentWebView from "../Screens/WalletTransactionScreens/PaymentWebView";
//dapp screens
// import Dapp from "../Screens/DappScreens/Dapp";
import DappWeb from "../Screens/DappScreens/DappWeb";
//notification screens
import Notification from "../Screens/NotificationScreens/Notification";
//preference screens
import Preference from "../Screens/PreferenceScreens/Preference";
import DefaultCurrencyList from "../Screens/PreferenceScreens/DefaultCurrencyList";
import Currency from "../Screens/PreferenceScreens/Currency";
//About screens
// import About from "../Screens/AboutScreens/About";
//Biometric Screens
import CheckBiometric from "../Screens/BiometricScreens/CheckBiometric";
//Rbsheets
import commonRbSheet from '../Screens/RbsheetScreens/commonRbSheet'
// import Languages from "../Screens/Languages/Languages";
//connect wallet screens
// import WalletconnectScreen from "../Screens/WalletConnect/index";
//swap screens
import Swap from "../Screens/SwapScreens/Swap";
import ConfirmSwap from "../Screens/SwapScreens/ConfirmSwap";
import ShowWalletPhrase from "../Screens/WalletDetailScreens/ShowWalletPhrase";
import ShowWalletPrivateKey from "../Screens/WalletDetailScreens/ShowWalletPrivateKey";
// import PrivacyInfoAfterCreate from "../Screens/WalletScreens/PrivacyInfoAfterCreate";
import ImportWalletAfterCreate from "../Screens/WalletScreens/ImportWalletAfterCreate";
import ImportWithPharse2 from "../Screens/WalletScreens/ImportWithPhrase2";
import ImportWithPrivateKey2 from "../Screens/WalletScreens/ImportWithPrivateKey2";
import SendBTC from "../Screens/RbsheetScreens/SendBTC";
import ReceiveBTC from "../Screens/RbsheetScreens/ReceiveBTC";
import BuyBTC from "../Screens/RbsheetScreens/BuyBTC";
import YouGet from "../Screens/SwapScreens/YouGet";
import YouPay from "../Screens/SwapScreens/YouPay";
import Approve from "../Screens/SwapScreens/Approve";
import WalletConnect from "../Screens/WalletScreens/WalletConnect";
import Transfer from "../Screens/SwapScreens/Transfer";
import PrivacyInfoAfterCreate from "../Screens/WalletScreens/PrivacyInfoAfterCreate";
import Passcode from "../Screens/PasscodeScreens/Passcode";
import GetStarted from "../Screens/InitialScreens/GetStarted";
import Signin from "../Screens/OtherPages/Sigin";
import PasswordRecovery1 from "../Screens/OtherPages/PasswordRecovery1";
import ConfirmPassword from "../Screens/OtherPages/ConfirmPassword";
import VerificationCode from "../Screens/OtherPages/VerificationCode";
import Signup from "../Screens/OtherPages/Signup";
import Wallet from "../Screens/OtherPages/Wallet";
import WalletSettings from "../Screens/OtherPages/WalletSettings";
import WalletEnter from "../Screens/OtherPages/WalletEnter";
import EditProfile from "../Screens/OtherPages/EditProfile";
import Emoji from "../Screens/OtherPages/Emoji";
import UpdateProfile from "../Screens/OtherPages/UpdateProfile";
import ChangePassword from "../Screens/OtherPages/ChangePassword";
import NLanguages from "../Screens/OtherPages/NLanguages";
import AboutUs from "../Screens/OtherPages/AboutUs";
import FAQ from "../Screens/OtherPages/FAQ";
import ShowSecretPhrase from "../Screens/WalletScreens/ShowSecretPhrase";
import ShowPhrase from "../Screens/WalletScreens/ShowPhrase";
import enterPasscodeforReset from '../Screens/PasscodeScreens/enterPasscodeforReset';
// import Keyboard from '../Screens/OtherPages/Keyboard/keyboard'
import VerificationForSign from '../Screens/OtherPages/VerificationForSign';
import Rewards from '../Screens/OtherPages/rewardPage'
import ApprovePage from '../Screens/walletConnect/ApprovePage';
import SignPage from '../Screens/walletConnect/SignPage';
import ComingSoon from '../Screens/OtherPages/ComingSoon';
import SearchBarTest from '../Screens/OtherPages/SearchBarTest';
import SettingsKeyboard from '../Screens/SettingsScreens/SettingsKeyboard';
import Dappsearch from "../Screens/DappScreens/Dappsearch";
import TestSc from "../Screens/TestSc";
import '../Screens/walletConnect/WC2'
import Skeletondapp from "../Screens/Skeleton/skeletondapp";
import Testscreen from "../Screens/testscreen";
import Earnscreen from "../Screens/Earn/earn";
import CollapsibleHeaderScreen from "../Screens/samplescreen";
import PrimaryWallet from "../Screens/WalletScreens/primaryWallet";
import SpeechRecognitionComponent from "../Screens/OtherPages/voice";
import Dapplatest from "../Screens/DappScreens/Dapplatest";

import Searchdapp from "../Screens/DappScreens/Dapplatest/search";
import PrivacyPolicy from "../Screens/OtherPages/PrivacyPolicy";
import TermsOfService from "../Screens/OtherPages/TermsOfService";
import SelectWalletforDetails from "../Screens/WalletDetailScreens/SelectWalletforDetails";
import StartupScreen from "../Screens/InitialScreens/StartupScreen";
import { linking } from "../api/common";
import RssReaderList from "../Screens/OtherPages/rssReaderLIst";
import DappList from "../Screens/DappScreens/DappList";
import TestChartdata from "../Screens/OtherPages/ForTest";
import Test from "../Screens/test";
import Splash from "../Screens/InitialScreens/Splash";
import changeNavigationBarColor from "react-native-navigation-bar-color";
const StackComponent = createStackNavigator();



const StackNavigator = (props) => {
  //theme config
  const theme = useContext(themeContext);
  console.log(theme.theme, "theme check")
  useEffect(() => {
    StatusBar.setBarStyle(theme.theme === "light" ? "dark-content" : "light-content");
    StatusBar.setBackgroundColor(theme.theme === "dark" ? "rgb(25,14,47)" : "#ffffff");
  }, [theme.theme]);
  const netInfo = useNetInfo();
  const dispatch = useDispatch()
  const [RouteName, setRoutName] = useState("")

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

  useEffect(() => {
    requestAudioPermission();

  }, []);

  const requestAudioPermission = async () => {
    try {
      const result = await PermissionsAndroid.request(' ')
      console.log("LPPPPP", result)

      //   if (result === RESULTS.GRANTED) {
      //     console.log('Audio permission granted');
      //   } else {
      //     console.log('Audio permission denied');
      //   }
    } catch (error) {
      console.log('Error requesting audio permission:', error);
    }
  };

  useFocusEffect(useCallback(() => {
    getDefaultCurrency()
    //change navBar colour
    // NavigationBarColor("#fff");
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
              : defaultCurrencyVal[0].defaultCurrency == "GBP"
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
  //for getting user token
  const getUserTokens = async () => {
    console.log("aahahahah");
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


  //check if user is created a wallet already if not means calls getUserToken
  const getWalletData = async () => {
    getRealm()
      .then(async (realm) => {
        var deviceId = DeviceInfo.getUniqueId();
        global.deviceId = deviceId;
        var walletData = realm.objects("Wallet_array");
        // global.walletArray = walletData;

        var loginStatus = realm.objects("loginStatus")
        console.log("loginStatus", loginStatus);
        if (loginStatus != undefined && loginStatus.length != 0) {
          // getPasscodeStatus();
          // props.navigation.navigate("Wallet");
          navigateToWallet()
        } else {
          getUserTokens()
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "wallet data list err from localDb stacknavigator");
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
        // navigation.navigate("GetStarted");
        setRoutName("GetStarted")
      }
    } catch (error) {
      console.log("err while saving token", error);
    } finally {
      setIsLoading(false)
    }
  };
  const [isLoading, setIsLoading] = useState(true);

  const setPasscodeStatus = () => {
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

        // if (passcodeVal.length == 0 && global.biometricStatus == 0) {
        //   props.navigation.navigate("WalletHome");
        // } else if (
        //   (global.passcodeStatus == 1 || global.passcodeStatus == 0) &&
        //   global.biometricStatus != 0
        // ) {
        //   global.bioPage = "EnterPasscode"
        //   props.navigation.push("CheckBiometric");
        // } else if (passcodeVal.length == 1 || global.biometricStatus == 0) {
        //   props.navigation.navigate("EnterPasscode");
        // }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "getPasscodeStatus err from localDb in splash");
      });
  };

  const { ApiModule } = NativeModules;


  const navigateToWallet = async () => {
    getRealm()
      .then(async (realm) => {
        var walletStatus = realm.objects("Wallet_array")
        if (walletStatus != undefined && walletStatus.length != 0) {
          // getPasscodeStatus()
          // ApiModule.openDapp(result => {
          //   console.log("ApiModule",result);
          //   if (result) {
          //     return setRoutName("DappBottomTab")
          //   } else {
          //    ApiModule.openWallet2(val => {
          //       console.log("ApiModuleval",val);
          //       if (val) {
          //         return setRoutName("WalletHomeBottomTab")
          //       } else {
          //         return setRoutName("DappBottomTab")
          //       }

          //     })
          //   }
          // })
          // var ffff = ApiModule.openWallet2();
          // console.log("ffff",ffff);
          setRoutName("WalletHome")
          // props.navigation.navigate("WalletHome");
        } else {
          setRoutName("CreateWallet")
          // props.navigation.navigate("CreateWallet")
        }
        setPasscodeStatus()
      })
      .catch((err) => {
        console.log("error on navigateWallet", err);
      }).finally(() => {
        setIsLoading(false);
      })
  }

  if (isLoading) {
    // Render a loading indicator or splash screen while retrieving initial data
    return null;
  }


  return (
    <>
      <StatusBar barStyle={theme.theme == "light" ? "dark-content" : "light-content"} backgroundColor={theme.theme==="dark"?"rgb(25,14,47)":"#ffffff"} />
      <TestSc />
      <StackComponent.Navigator
        screenOptions={MyTransition2}
        initialRouteName={RouteName}
      // initialRouteName={"ApprovePage"}
      >

        <StackComponent.Screen name={"Test"} component={Test} />
        <StackComponent.Screen name={"Splash"} component={Splash} />
        <StackComponent.Screen name={"CollapsibleHeaderScreen"} component={CollapsibleHeaderScreen} />
        <StackComponent.Screen name={"RssReaderList"} component={RssReaderList} />
        <StackComponent.Screen name={"Searchdapp"} component={Searchdapp} />
        <StackComponent.Screen name={"TestChartdata"} component={TestChartdata} />
        <StackComponent.Screen name={"DappList"} component={DappList} />
        <StackComponent.Screen name={"SpeechRecognitionComponent"} component={SpeechRecognitionComponent} />
        <StackComponent.Screen name={"Dapplatest"} component={Dapplatest} />
        <StackComponent.Screen name={"Earnscreen"} component={Earnscreen} />
        <StackComponent.Screen name={"Testscreen"} component={Testscreen} />
        <StackComponent.Screen name={"Dappsearch"} component={Dappsearch} />
        <StackComponent.Screen name={"Onboarding"} component={Onboarding} />
        <StackComponent.Screen name={"GetStarted"} component={GetStarted} />
        <StackComponent.Screen name={"Signin"} component={Signin} />
        <StackComponent.Screen name={"CreateWallet"} component={CreateWallet} />
        <StackComponent.Screen name={"PasswordRecovery1"} component={PasswordRecovery1} />
        <StackComponent.Screen name={"ConfirmPassword"} component={ConfirmPassword} />
        <StackComponent.Screen name={"VerificationCode"} component={VerificationCode} />
        <StackComponent.Screen name={"Signup"} component={Signup} />
        <StackComponent.Screen name={"Wallet"} component={Wallet} />
        <StackComponent.Screen name={"WalletSettings"} component={WalletSettings} />
        <StackComponent.Screen name={"WalletEnter"} component={WalletEnter} />
        <StackComponent.Screen name={"EditProfile"} component={EditProfile} />
        <StackComponent.Screen name={"UpdateProfile"} component={UpdateProfile} />
        <StackComponent.Screen name={"ChangePassword"} component={ChangePassword} />
        <StackComponent.Screen name={"NLanguages"} component={NLanguages} />
        <StackComponent.Screen name={"AboutUs"} component={AboutUs} />
        <StackComponent.Screen name={"ShowSecretPhrase"} component={ShowSecretPhrase} />
        <StackComponent.Screen name={"ShowPhrase"} component={ShowPhrase} />
        <StackComponent.Screen name={"Emoji"} component={Emoji} />
        <StackComponent.Screen name={"enterPasscodeforReset"} component={enterPasscodeforReset} />
        <StackComponent.Screen
          name={"CreateWallet2"}
          component={CreateWallet2}
        />
        <StackComponent.Screen name={"PrivacyInfo"} component={PrivacyInfo} />
        <StackComponent.Screen
          name={"CopyWalletPharse"}
          component={CopyWalletPharse}
        />
        <StackComponent.Screen
          name={"ConfirmWalletPharse"}
          component={ConfirmWalletPharse}
        />
        <StackComponent.Screen name={"ImportWallet"} component={ImportWallet} />
        <StackComponent.Screen
          name={"ImportWithPharse"}
          component={ImportWithPharse} />
        <StackComponent.Screen
          name={"ImportWithPharse2"}
          component={ImportWithPharse2}
        />
        <StackComponent.Screen
          name={"ImportMultiCoinWallet"}
          component={ImportMultiCoinWallet}
        />
        <StackComponent.Screen
          name={"ImportMultiCoinAfterCreate"}
          component={ImportMultiCoinAfterCreate}
        />
        <StackComponent.Screen
          name={"ImportWithPrivateKey"}
          component={ImportWithPrivateKey}
        />

        <StackComponent.Screen
          name={"ImportWithPrivateKey2"}
          component={ImportWithPrivateKey2}
        />
        <StackComponent.Screen name={"ImportTab"} component={ImportTab} />
        <StackComponent.Screen
          name={"ImportWalletTab"}
          component={ImportWalletTab}
        />
        <StackComponent.Screen
          name={"ImportWalletTabAfterCreate"}
          component={ImportWalletTabAfterCreate}
        />
        <StackComponent.Screen
          name={"ImportWalletAfterCreate"}
          component={ImportWalletAfterCreate}
        />

        <StackComponent.Screen name={"ScanPhrase"} component={ScanPhrase} />

        <StackComponent.Screen
          name={"PrivacyInfoAfterCreate"}
          component={PrivacyInfoAfterCreate}
        />

        <StackComponent.Screen
          name={"WalletHome"}
          children={() => <BottomTab />}
        />
        <StackComponent.Screen name={"BottomTab"} component={BottomTab} />
        <StackComponent.Screen name={"WalletList"} component={WalletList} />
        <StackComponent.Screen name={"TokenList"} component={TokenList} />
        <StackComponent.Screen name={"WalletConnect"} component={WalletConnect} />
        <StackComponent.Screen name={"SetPasscode"} component={SetPasscode} />
        <StackComponent.Screen name={"EnablePasscode"} component={EnablePasscode} />
        <StackComponent.Screen name={"DiasblePassword"} component={DisablePassword} />
        <StackComponent.Screen
          name={"SetPasswordforCreate"}
          component={SetPasswordforCreate}
        />
        <StackComponent.Screen
          name={"SetPasswordforImport"}
          component={SetPasswordforImport}
        />

        <StackComponent.Screen
          name={"EnterPrivateKey"}
          component={EnterPrivateKey}
        />
        <StackComponent.Screen
          name={"PaymentWebView"}
          component={PaymentWebView}
        />
        <StackComponent.Screen
          name={"DisablePasscode"}
          component={DisablePasscode}
        />
        <StackComponent.Screen
          name={"ConfirmPasscode"}
          component={ConfirmPasscode}
        />
        <StackComponent.Screen
          name={"ConfirmPasswordforCreate"}
          component={ConfirmPasswordforCreate}
        />
        <StackComponent.Screen
          name={"ConfirmPasswordforImport"}
          component={ConfirmPasswordforImport}
        />

        <StackComponent.Screen
          name={"EnterPasscode"}
          component={EnterPasscode}
        />
        <StackComponent.Screen
          name={"EnterPasscodePhrase"}
          component={EnterPasscodePhrase}
        />

        <StackComponent.Screen
          name={"SecurityScreen"}
          component={SecurityScreen}
        />

        <StackComponent.Screen
          name={"AddCustomToken"}
          component={AddCustomToken}
        />
        <StackComponent.Screen
          name={"WalletHistory"}
          component={WalletHistory}
        />
        <StackComponent.Screen
          name={"WalletHistoryWebView"}
          component={WalletHistoryWebView}
        />
        <StackComponent.Screen
          name={"WalletReceive"}
          component={WalletReceive}
        />
        <StackComponent.Screen name={"WalletSend"} component={WalletSend} />
        <StackComponent.Screen name={"ConfirmSend"} component={ConfirmSend} />
        {/* <StackComponent.Screen name={"SettingsHome"} component={SettingsHome} /> */}
        <StackComponent.Screen name={"ScanAddress"} component={ScanAddress} />
        {/* <StackComponent.Screen name={"Dapp"} component={Dapp} /> */}
        <StackComponent.Screen name={"DappWeb"} component={DappWeb} />
        <StackComponent.Screen name={"Swap"} component={Swap} />
        <StackComponent.Screen name={"ConfirmSwap"} component={ConfirmSwap} />
        <StackComponent.Screen name={"Notification"} component={Notification} />
        {/* <StackComponent.Screen name={"Languages"} component={Languages} /> */}
        <StackComponent.Screen name={"Preference"} component={Preference} />
        <StackComponent.Screen name={"Transfer"} component={Transfer} />
        <StackComponent.Screen name={"SendBTC"} component={SendBTC} />
        <StackComponent.Screen name={"ReceiveBTC"} component={ReceiveBTC} />
        <StackComponent.Screen name={"BuyBTC"} component={BuyBTC} />
        <StackComponent.Screen name={"YouGet"} component={YouGet} />
        <StackComponent.Screen name={"YouPay"} component={YouPay} />
        <StackComponent.Screen name={"Approve"} component={Approve} />
        <StackComponent.Screen name={"Passcode"} component={Passcode} />
        <StackComponent.Screen name={"FAQ"} component={FAQ} />
        <StackComponent.Screen name={"VerificationForSign"} component={VerificationForSign} />
        <StackComponent.Screen name={"commonRbSheet"} component={commonRbSheet} />
        <StackComponent.Screen name={"Rewards"} component={Rewards} />
        {/* <StackComponent.Screen
          name={"WalletconnectScreen"}
          component={WalletconnectScreen}
        /> */}
        <StackComponent.Screen
          name={"CheckBiometric"}
          component={CheckBiometric}
        />
        <StackComponent.Screen
          name={"DefaultCurrencyList"}
          component={DefaultCurrencyList}
        />
        <StackComponent.Screen
          name={"Currency"}
          component={Currency}
        />
        <StackComponent.Screen
          name={"ShowWalletDetails"}
          component={ShowWalletDetails}
        />
        <StackComponent.Screen
          name={"ShowWalletPhrase"}
          component={ShowWalletPhrase}
        />
        <StackComponent.Screen
          name={"ShowWalletPrivateKey"}
          component={ShowWalletPrivateKey}
        />
        {/* <StackComponent.Screen
          name={"keyboard"}
          component={Keyboard}
        /> */}

        <StackComponent.Screen name={"ApprovePage"} component={ApprovePage} options={{
          animationEnabled: true
        }} />
        <StackComponent.Screen name={"SignPage"} component={SignPage} options={{
          animationEnabled: true
        }} />
        <StackComponent.Screen
          name={"ComingSoon"}
          component={ComingSoon}
        />
        <StackComponent.Screen
          name={"SearchBarTest"}
          component={SearchBarTest}
        />
        {/* <StackComponent.Screen
          name={"SettingsKeyboard"}
          component={SettingsKeyboard}
        /> */}
        <StackComponent.Screen
          name={"PrimaryWallet"}
          component={PrimaryWallet}
        />
        <StackComponent.Screen
          name={"PrivacyPolicy"}
          component={PrivacyPolicy}
        />
        <StackComponent.Screen
          name={"TermsOfService"}
          component={TermsOfService}
        />
        <StackComponent.Screen
          name={"SelectWalletforDetails"}
          component={SelectWalletforDetails}
        />

      </StackComponent.Navigator>
      {/* </NavigationContainer> */}
    </>

  );
};
export default StackNavigator;
