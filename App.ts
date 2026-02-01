import "@walletconnect/react-native-compat";
import React, { useContext, useEffect, useState } from "react";
import Routes from "./app/Navigations/Routes";
import { Provider } from "react-redux";
import configureStore from "./app/Redux/store";
import { Appearance, AppState, LogBox, Platform, StatusBar } from 'react-native';
// import SplashScreen from 'react-native-splash-screen'
import { MenuProvider } from 'react-native-popup-menu';
import Splash from "./app/Screens/InitialScreens/Splash";
import { NavigationContainer } from "@react-navigation/native";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import themeContext from "./app/utils/themeContext";

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
const store = configureStore();
const TextEncodingPolyfill = require('text-encoding');
const BigInt = require('big-integer')

const App = () => {
  const theme = useContext(themeContext);
  const [isAppReady, setIsAppReady] = useState(false);
  useEffect(() => {
    StatusBar.setBarStyle("dark-content");
    StatusBar.setBackgroundColor("#ffffff");
    changeNavigationBarColor("#ffffff" , false, false)
  }, [theme]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true); 
    }, 2000);

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, []);

  LogBox.ignoreLogs
    (['Warning: The provided value \'moz',
      'Warning: The provided value \'ms-stream'
    ])

  AppState.addEventListener('memoryWarning', (state) => {
    console.log("state Error mMeory leak", state)
  });

  Object.assign(global, {
    TextEncoder: TextEncodingPolyfill.TextEncoder,
    TextDecoder: TextEncodingPolyfill.TextDecoder,
    BigInt: BigInt,
  });

  if (!isAppReady) {
    return     <Provider store={store}>
    <NavigationContainer >
      <Splash />
    </NavigationContainer>
  </Provider>
  }
  // useEffect(() => {
  //   SplashScreen.hide();
  // }, [])
  return (
    // <DappWeb/>
    <Provider store={store}>
      <MenuProvider>
        <Routes />
      </MenuProvider>
    </Provider>
  );
};
export default App;




