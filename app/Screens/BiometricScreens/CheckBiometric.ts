import React, { useContext, useState, useEffect, useRef } from "react";
import { SafeAreaView, StyleSheet, BackHandler } from "react-native";
import themeContext from "../../utils/themeContext";
import { useFocusEffect } from "@react-navigation/native";
import ReactNativeBiometrics from "react-native-biometrics";
import getRealm from "../../localDb/RealmConfig";

const CheckBiometric = (props) => {
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);

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
  console.log("propsprops", props.route);
  useEffect(() => {
    pressHandler();
  }, []);
  console.log("global.bioPage", global.bioPage);
  const pressHandler = () => {
    getRealm()
      .then((realm) => {
        var passcodeVal = realm.objects("userPasscodeValue");
        var biometricVal = realm.objects("userBiometricStatus");
        console.log("passcodeVal", passcodeVal);
        console.log("biometricVal", biometricVal);
        console.log("serwerwerwer", passcodeVal.length == 1 && (biometricVal.length != 1 || biometricVal[0].userBiometricStatus != "false"));
        if (
          passcodeVal.length == 1 &&
          (biometricVal.length != 1 ||
            biometricVal[0].userBiometricStatus != "false")
        ) {
          console.log("hhrheeheh");
          props.navigation.navigate(global.bioPage, props?.route?.params);
          onfinger();
        } else {
          ReactNativeBiometrics.simplePrompt({
            promptMessage: "Confirm fingerprint",
          })
            .then((resultObject) => {
              const { success } = resultObject;

              if (success) {
                console.log("successful biometrics provided");
                home();
              } else {
                console.log("user cancelled biometric prompt1");
                // BackHandler.exitApp();
              }
            })
            .catch(() => {
              console.log("biometrics failed");
              home();
            });
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "getPasscodeStatus err from localDb in splash");
      });
  };

  const onfinger = () => {
    ReactNativeBiometrics.simplePrompt({
      promptMessage: "Confirm fingerprint",
    })
      .then((resultObject) => {
        const { success } = resultObject;

        if (success) {
          console.log("successful biometrics provided");

          home();
        } else {
          console.log("user cancelled biometric prompt2");
          // BackHandler.exitApp();
        }
      })
      .catch(() => {
        //console.log("biometrics failed");
      });
  };

  const home = () => {
    const routes = props.navigation.getState()?.routes;
    console.log("routes", routes);
    const prevRoute = routes[routes.length - 2];
    console.log("prevRouteprops?.route?.params", prevRoute, props?.route?.params);
    if (props?.route?.params) {
      if ((props?.route?.params == "SwapBottomTab") || (props?.route?.params == "WalletHomeBottomTab") || (props?.route?.params == "Receive") || (props?.route?.params == "Send")) global.initialEnter = true;

      ((props?.route?.params == "Receive") || (props?.route?.params == "Send")) ?
        props.navigation.navigate("commonRbSheet", params = props?.route?.params) :
        props.navigation.navigate(props?.route?.params)
      global.bioPage = ""
    } else if (prevRoute.name == "Splash" || prevRoute.name == "CheckBiometric") {
      global.bioPage = ""
      props.navigation.navigate("WalletHome");
    } else {
      props.navigation.navigate(global.bioPage == "EnterPasscodePhrase" ? "ShowWalletPhrase" : global.bioPage == "EnterPrivateKey" ? "ShowWalletPrivateKey" : prevRoute.name);
      global.bioPage = ""
    }
  };

  return <SafeAreaView style={style.container}></SafeAreaView>;
};
export default CheckBiometric;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    seperatorLine: {
      height: 0.5,
      backgroundColor: "grey",
    },
  });
