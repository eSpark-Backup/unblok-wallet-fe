import React, { useState, useEffect } from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import { SafeAreaView, StyleSheet, StatusBar, Linking } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import themeContext from "../utils/themeContext";
import theme from "../utils/theme";
import EncryptedStorage from "react-native-encrypted-storage";
import { useSelector } from "react-redux";
import { linking } from "../api/common";
import changeNavigationBarColor from "react-native-navigation-bar-color";
const Routes = () => {
  //for saving theme state
  const [mode, setMode] = useState(false);
  const [dappStatus, setDappStatus] = useState(false);
  const dappStatusFromRedux = useSelector(
    (state) => state.DappWebReducer.dappWeb
  );


  useEffect(() => {
    if (dappStatusFromRedux.status == "true") {
      setDappStatus(true);
    } else {
      setDappStatus(false);
    }
    console.log("dappStatusFromRedux.status", dappStatusFromRedux.status);
  }, [dappStatusFromRedux.status]);

  useEffect(() => {
    let eventListener = EventRegister.addEventListener(
      "changeTheme",
      (data) => {
        setMode(data);
        saveThemeData(data);
      }
    );
    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  });

  useEffect(async () => {
    const themeData = await EncryptedStorage.getItem("themeData");
    global.themeData = themeData;
    if (
      global.themeData != undefined &&
      global.themeData != null &&
      global.themeData == "true"
    ) {
      setMode(true);
    } else {
      setMode(false);
    }
  }, []);

  const saveThemeData = async (data) => {
    try {
      await EncryptedStorage.setItem("themeData", JSON.stringify(data));
      retrieveData();
    } catch (error) { }
  };

  const retrieveData = async () => {
    try {
      const themeData = await EncryptedStorage.getItem("themeData");
      if (themeData !== null) {
        global.themeData = JSON.parse(themeData);
      }
    } catch (error) { }
  };


  React.useEffect(() => {
    
    if (mode) {
      StatusBar.setBarStyle('light-content');
    }
    else {
      StatusBar.setBarStyle('dark-content');
    }
  }, [mode]);
  // React.useEffect(() => {
  //   StatusBar.setBarStyle(mode ? "dark-content" : "light-content");
  //   StatusBar.setBackgroundColor(mode ? "#1A0E30" : "#fff");
  // }, [mode]);

  React.useEffect(() => {
    changeNavigationBarColor(theme.theme == "dark" ? '#34205c': "#ffffff" , false, false)
  }, [theme]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      {/* {dappStatus == true ? (
        <DappWeb />
      ) : ( */}
      <themeContext.Provider value={mode === true ? theme.dark : theme.light}>
        <NavigationContainer 
        theme={mode === true ? DarkTheme : DefaultTheme} 
        // linking={linking} //! have to remove this for not to crash
         >
          <StackNavigator  /> 
        </NavigationContainer>
      </themeContext.Provider>
      {/* )} */}
    </SafeAreaView>
  );
};



export default Routes;
