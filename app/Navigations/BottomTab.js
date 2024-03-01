import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useContext, useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  Dimensions,
} from "react-native";
import Icon, { Icons } from "../Components/CustomIcons";
import { Colors } from "../utils/Colors";
import * as Animatable from "react-native-animatable";
import WalletHome from "../Screens/WalletScreens/WalletHome";
import Dapp from "../Screens/DappScreens/Dapp";
import SettingsHome from "../Screens/SettingsScreens/SettingsHome";
import themeContext from "../utils/themeContext";
import Swap from "../Screens/SwapScreens/Swap";
import { Fonts } from "../utils/Fonts";
import { Images } from "../utils/Images";
import BottomTab1 from "../Navigations/BottomTab1";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import getRealm from "../localDb/RealmConfig";
import Wallet from "../Screens/OtherPages/Wallet";
import { windowWidth } from "../utils/Dimensions";

import Homelight from "../assets/icons/lighttheme/Home.svg";
import Homedark from "../assets/icons/darktheme/Home.svg";
import Activehomelight from "../assets/icons/lighttheme/Homeactive.svg";
import Activehomedark from "../assets/icons/darktheme/Homeactive.svg";

import Walletlight from "../assets/icons/lighttheme/wallet_updated.svg";
import Walletdark from "../assets/icons/darktheme/Wallet_updated.svg";
import Activewalletlight from "../assets/icons/lighttheme/wallet_solid_active_updated.svg";
import Activewalletdark from "../assets/icons/darktheme/wallet_solid_active_updated.svg";

import Dapplight from "../assets/icons/lighttheme/Apps.svg";
import Dappdark from "../assets/icons/darktheme/Apps.svg";
import ActiveDapplight from "../assets/icons/lighttheme/Home solid black.svg";
import ActiveDappdark from "../assets/icons/darktheme/Home solid white.svg";

import Swapplight from "../assets/icons/lighttheme/Swap.svg";
import Swappdark from "../assets/icons/darktheme/Swap.svg";
import ActiveSwapplight from "../assets/icons/lighttheme/exchange solid black.svg";
import ActiveSwappdark from "../assets/icons/darktheme/Swapactive.svg";

import Settingslight from "../assets/icons/lighttheme/Setting.svg";
import Settingsdark from "../assets/icons/darktheme/Setting.svg";
import ActiveSettingslight from "../assets/icons/lighttheme/setting solid black.svg";
import ActiveSettingsdark from "../assets/icons/darktheme/setting solid white.svg";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useDispatch, useSelector } from "react-redux";
import { footReducer } from "../Redux/Actions/fiatDataAction";
import { RFValue } from "react-native-responsive-fontsize";
import Dapplatest from "../Screens/DappScreens/Dapplatest";
import Dappmultitabs from "../Screens/DappScreens/Dapplatest/Multitabs";
import Dappheadernew from "../Screens/DappScreens/Dapplatest/Dappheadernew";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsKeyboard from "../Screens/SettingsScreens/SettingsKeyboard";
import { MyTransition2 } from "../utils/Animations";
import { StatusBar } from "react-native";
import MultitabsFooter from "../Components/MultitabsFooter";
import DappMultitabs from "../Components/DappMultitabs";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;



const TabArr2 = [
  {
    route: "WalletHomeBottomTab",
    label: "Wallet",
    type: Images.BottomWallet,
    activeIcon: "wallet",
    inActiveIcon: "wallet",
    component: WalletHome,
  },
  {
    route: "SwapBottomTab",
    label: "Swap",
    type: Images.BottomSwap,
    activeIcon: "swap",
    inActiveIcon: "swap",
    component: BottomTab1,
  },
  {
    route: "SettingsHome",
    label: "Settings",
    type: Images.BottomSettings,
    activeIcon: "gear",
    inActiveIcon: "gear",
    component: SettingsHome,
  },
];

const Tab = createBottomTabNavigator();

const TabButton = (props) => {

  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const theme = useContext(themeContext);
  const dispatch = useDispatch();
  const setSwapdatas = (item) => dispatch(footReducer(item));
  const navigation = useNavigation();
  // console.log("lallallalalla", props);
  // useEffect(() => {
  //   if (focused) {
  //     viewRef.current.animate({
  //       0: { scale: 0.5, rotate: "0deg" },
  //       1: { scale: 1.5, rotate: "360deg" },
  //     });
  //   } else {
  //     viewRef.current.animate({
  //       0: { scale: 1.5, rotate: "360deg" },
  //       1: { scale: 1, rotate: "0deg" },
  //     });
  //   }
  // }, [focused]);

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
          navigation.navigate(item.route);
        } else if (
          (global.passcodeStatus == 1 || global.passcodeStatus == 0) &&
          global.biometricStatus != 0
        ) {
          global.bioPage = "EnterPasscode";
          navigation.push("CheckBiometric", item.route);
        } else if (passcodeVal.length == 1 || global.biometricStatus == 0) {
          navigation.navigate("EnterPasscode", item.route);
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "navigateFunc err from localDb in splash");
      });
  };
  const footVal = useSelector((state) => state.fiatDataReducer.footerReducer);
  // console.log("footVal",footVal);
  // const [skeleton, setSkeleton] = useState(false)
  // useEffect(() => {
  //   setTimeout(() => {
  //     setSkeleton(true)
  //   }, 2000)
  // }, [])

  if (!footVal)
    setTimeout(() => {
      setSwapdatas(true);
    }, 5000);

  return (
    <>
      {theme.theme == "light" ? (
        footVal ? (
          <TouchableOpacity
            // onPress={onPress}
            onPress={() => {
              item.label != "Dapp" && global?.initialEnter == undefined
                ? navigateFunc()
                : navigation.navigate(item.route);
            }}
            activeOpacity={1}
            style={styles.container}
          >
            <Animatable.View
              ref={viewRef}
              duration={1000}
              style={styles.container}
            >
              {focused ? item.activelightImage : item.lightImage}
            </Animatable.View>
          </TouchableOpacity>
        ) : (
          <View style={styles.container}>
            <SkeletonPlaceholder
              borderRadius={4}
              highlightColor={"rgb(241,241,241)"}
              enabled={true}
            >
              <View style={{ width: 30, height: 30, borderRadius: 10 }} />
            </SkeletonPlaceholder>
          </View>
        )
      ) : footVal ? (
        <>
          <TouchableOpacity
            // onPress={onPress}
            onPress={() => {
              item.label != "Dapp" && global?.initialEnter == undefined
                ? navigateFunc()
                : navigation.navigate(item.route);
            }}
            activeOpacity={1}
            style={styles.container}
          >
            <Animatable.View
              ref={viewRef}
              duration={1000}
              style={styles.container}
            >
              {focused ? item.activedarkImage : item.darkImage}
            </Animatable.View>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.container}>
          <SkeletonPlaceholder
            borderRadius={4}
            highlightColor={"rgb(241,241,241)"}
            enabled={true}
          >
            <View style={{ width: 30, height: 30, borderRadius: 10 }} />
          </SkeletonPlaceholder>
        </View>
      )}
    </>
  );
};
// " rgb(25,14,47)"
const StackComponent = createStackNavigator();
const SettingComponent=()=>{
  const theme = useContext(themeContext);
return(
  <>
  <StatusBar barStyle={theme.theme == "light" ? "dark-content" : "light-content"} backgroundColor={theme.theme==="dark"?"rgb(25,14,47)":"#ffffff"} />
<StackComponent.Navigator
        screenOptions={MyTransition2}
        
      initialRouteName={"SettingsHome"}
      >

        <StackComponent.Screen name={"SettingsHome"} component={SettingsHome} />
        <StackComponent.Screen
          name={"SettingsKeyboard"}
          component={SettingsKeyboard}
        />
        </StackComponent.Navigator>
        </>
)
}

export default function AnimTab1() {
  const theme = useContext(themeContext);
  const [multitab, setMultitab] = useState(false);
  const [tabLength, setTabLength] = useState(0);
//   useFocusEffect(
//     useCallback(() => {
//         if (props?.route?.params?.isEnabled == false) {
//             setMultitab(true)
//         } else {
//             setMultitab(false)
//         }

//         console.log("props?.route?.params?.isEnabled", props?.route?.params?.isEnabled);
//     }, [props?.route?.params?.isEnabled])
// )
  const getDappTabs = async () => {
    getRealm()
      .then((realm) => {
        var dappVal1 = realm.objects("dappTabs");
        // console.log("dappTabs", JSON.stringify(dappVal1, null, 2));
        setTabLength(dappVal1.length)
        if (dappVal1.length != 0) setTabLength(dappVal1.length);
        else {
          var TabID = String(Date.now())
          var setObj = { URL: "https://www.google.com/", hostName: "www.google.com", id: "0" }
          realm.write(() => {
            realm.create("dappTabs", {
              ImageUrl: "",
              TabId: TabID,
              TAB: [setObj]
            });
          });
          setTabLength(1)
        }

      })
      .catch((err) => {
        console.log("errro onn getdapppteabs", err);
      })

  }
  useFocusEffect(
    useCallback(() => {
      getDappTabs()
    }, [])
  )
  let TabArr1 = [
    {
      route: "DappBottomTab",
      label: "Dapp",
      lightImage: (
        <Dapplight
          width={width * 0.07}
          height={width * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      darkImage: (
        <Dappdark
          width={width * 0.07}
          height={width * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      activelightImage: (
        <ActiveDapplight
          width={width * 0.07}
          height={width * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      activedarkImage: (
        <ActiveDappdark
          width={width * 0.07}
          height={width * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      component: Dapp,
    },
    {
      route: 'multitabs',
      label: 'Tabs',
      lightImage: <MultitabsFooter borderColor="rgba(47, 36, 72, 0.42)" textColor="rgba(47, 36, 72, 0.42)" backgroundColor="#fffff" tabLength={tabLength} />,
      darkImage: <MultitabsFooter borderColor="#fff" textColor="#fff" backgroundColor="#fffff" tabLength={tabLength} />,
      activelightImage: <MultitabsFooter borderColor="#612CD2" textColor="#612CD2" backgroundColor="#fffff" tabLength={tabLength} />,
      activedarkImage: <MultitabsFooter borderColor="#A279FA" textColor="#A279FA" backgroundColor="#fffff" tabLength={tabLength} />,
      // component: DappMultitabs,
    },
    {
      route: "WalletHomeBottomTab",
      label: "Wallet",
      lightImage: (
        <Walletlight
          width={width * 0.065}
          height={width * 0.065}
          style={{ resizeMode: "contain" }}
        />
      ),
      darkImage: (
        <Walletdark
        width={width * 0.065}
        height={width * 0.065}
          style={{ resizeMode: "contain" }}
        />
      ),
      activelightImage: (
        <Activewalletlight
        width={width * 0.065}
        height={width * 0.065}
          style={{ resizeMode: "contain" }}
        />
      ),
      activedarkImage: (
        <Activewalletdark
        width={width * 0.065}
        height={width * 0.065}
          style={{ resizeMode: "contain" }}
        />
      ),
      component: WalletHome,
    },
  
    {
      route: "SwapBottomTab",
      label: "Swap",
      lightImage: (
        <Swapplight
          width={width * 0.08}
          height={width * 0.08}
          style={{ resizeMode: "contain", }}
        />
      ),
      darkImage: (
        <Swappdark
          width={width * 0.08}
          height={width * 0.08}
          style={{ resizeMode: "contain", }}
        />
      ),
      activelightImage: (
        <ActiveSwappdark
          width={width * 0.08}
          height={width * 0.08}
          style={{ resizeMode: "contain", }}
        />
      ),
      activedarkImage: (
        <ActiveSwappdark
          width={width * 0.08}
          height={width * 0.08}
          style={{ resizeMode: "contain",  }}
        />
      ),
      component: BottomTab1,
    },
    {
      route: "SettingsHome",
      label: "Settings",
      lightImage: (
        <Settingslight
          width={width * 0.07}
          height={width * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      darkImage: (
        <Settingsdark
          width={width * 0.07}
          height={width * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      activelightImage: (
        <ActiveSettingslight
          width={width * 0.07}
          height={width * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      activedarkImage: (
        <ActiveSettingsdark
          width={width * 0.07}
          height={width * 0.07}
          style={{ resizeMode: "contain" }}
        />
      ),
      component: SettingComponent,
    },
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: height * 0.075,
          paddingHorizontal:"10%",
          borderColor: "transparent",
borderWidth:0,
          backgroundColor: theme.theme === "dark" ? "#34205c" : "rgba(255, 255, 255, 1)",
          elevation: 0,
          
        },
      }}
    >
      {/* {dappStatus === false ? TabArr1.filter((item) => { return item.label != "Dapp" }).map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />,
            }}
          />
        );
      })
        : */}
       {TabArr1.map((item, index) => {
        if (item.route === "multitabs") {
          return (
            <Tab.Screen
              key={index}
              name={item.route}
              options={{
                tabBarShowLabel: false,
                tabBarButton: (props) => <TabButton {...props} item={item} />,
              }}
            >
              {() => <>
                    {/* <Dappheadernew search={() => { props.navigation.navigate("Searchdapp"); }} /> */}
                {/* <Dappmultitabs multitab={setMultitab} /> */}
                <DappMultitabs setTabLength={setTabLength} />
                
            </>}
            </Tab.Screen>
          );
        } else {
          return (
            <Tab.Screen
              key={index}
              name={item.route}
              component={item.component}
              options={{
                tabBarShowLabel: false,
                tabBarButton: (props) => <TabButton {...props} item={item} />,
              }}
            />
          );
        }
      })}
     
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
