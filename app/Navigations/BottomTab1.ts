import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "react-native";
//Utils
import { MyTransition2 } from "../utils/Animations";
import themeContext from "../utils/themeContext";
import Swap from "../Screens/SwapScreens/Swap";
import YouGet from "../Screens/SwapScreens/YouGet";
import YouPay from "../Screens/SwapScreens/YouPay";
import Approve from "../Screens/SwapScreens/Approve";

const StackComponent = createStackNavigator();

const BottomTab1 = (props) => {
  //theme config
  const theme = useContext(themeContext);
  return (
    <>
      <StatusBar barStyle={theme.theme == "light" ? "dark-content" : "light-content"} backgroundColor={theme.theme==="dark"?"rgb(25,14,47)":"#ffffff"} />
      <StackComponent.Navigator
        screenOptions={MyTransition2}
        initialRouteName={"Swap"}
      > 
        <StackComponent.Screen name={"Swap"} component={Swap} />
        <StackComponent.Screen name={"YouGet"} component={YouGet} />
        <StackComponent.Screen name={"YouPay"} component={YouPay} />
        <StackComponent.Screen name={"Approve"} component={Approve} />
        
      </StackComponent.Navigator>
    </>
  );
};
export default BottomTab1;
