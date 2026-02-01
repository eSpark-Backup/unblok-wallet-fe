import React, { useContext } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ImportWithPharse from "../Screens/WalletScreens/ImportWithPharse";
import ImportWithPrivateKey from "../Screens/WalletScreens/ImportWithPrivateKey";
//for after create
import ImportWithPrivateKey2 from "../Screens/WalletScreens/ImportWithPrivateKey2";
import ImportWithPharse2 from "../Screens/WalletScreens/ImportWithPhrase2";

import { Colors } from "../utils/Colors";
import { Fonts } from "../utils/Fonts";
import themeContext from "../utils/themeContext";
import { windowheight } from "../utils/Dimensions";

const TopTabs = createMaterialTopTabNavigator();

export const ImportTab = (props) => {
  const theme = useContext(themeContext);
  return (
    <TopTabs.Navigator
    initialRouteName="ImportWithPharse2"
    style={{ backgroundColor: "transparent", width: "85%", alignSelf: "center",}}
    screenOptions={{
      tabBarActiveTintColor: theme.theme === "dark" ? "black" : "white",
      tabBarLabelStyle: { fontSize: 12, fontFamily: Fonts.Regular },
      tabBarIndicatorStyle: {
        height: "80%",
        width: "50%",
        backgroundColor: theme.theme === "light" ? "#612CD2" : "#FFF600",
        borderRadius: 5,
        position: "absolute",
        bottom: "9%",
    //  justifyContent:"space-between"
      },
      tabBarInactiveTintColor: theme.theme === "dark" ? "#696969" : "#696969",
      tabBarInactiveBackgroundColor: "black", 
      tabBarItemStyle:{justifyContent:"space-between"}
    }}
    tabBarOptions={{
      pressColor: "transparent",
      
    }}
  >

      <TopTabs.Screen
        name="ImportWithPharse"
        component={ImportWithPharse}
        initialParams={props}
        options={{ tabBarLabel: "Pharse" }}
      />
      <TopTabs.Screen
        name="ImportWithPrivateKey"
        initialParams={props}
        component={ImportWithPrivateKey}
        options={{ tabBarLabel: "Private Key" }}
      />
    </TopTabs.Navigator>
  );
};

export const ImportTab2 = (props) => {
  const theme = useContext(themeContext);
  return (
    <TopTabs.Navigator
      initialRouteName="ImportWithPharse2"
      style={{ backgroundColor: "transparent", width: "85%", alignSelf: "center" }}
      screenOptions={{
        tabBarActiveTintColor: theme.theme === "dark" ? "black" : "white",
        tabBarLabelStyle: { fontSize: 12, fontFamily: Fonts.Regular },
        tabBarIndicatorStyle: {
          height: "80%",
          width: "50%",
          backgroundColor: theme.theme === "light" ? "#612CD2" : "#FFF600",
          borderRadius: 5,
          position: "absolute",
          bottom: "9%",
      //  justifyContent:"space-between"
        },
        tabBarInactiveTintColor: theme.theme === "dark" ? "#696969" : "#696969",
        tabBarInactiveBackgroundColor: "black", 
        tabBarItemStyle:{justifyContent:"space-between"}
      }}
      tabBarOptions={{
        pressColor: "transparent",
        
      }}
      >
      <TopTabs.Screen
        name="ImportWithPharse2"
        component={ImportWithPharse2}
        initialParams={props}
        options={{ tabBarLabel: "Pharse" }}
      />
      <TopTabs.Screen
        name="ImportWithPrivateKey2"
        initialParams={props}
        component={ImportWithPrivateKey2}
        options={{ tabBarLabel: "Private Key" }}
      />
    </TopTabs.Navigator>
  );
};
