import React, { useContext } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text } from "react-native";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { ImportTab2 } from "../../Navigations/TopTabs";
import { useSelector } from "react-redux";
import LinearGradient from 'react-native-linear-gradient';
import { View } from "react-native-animatable";
import { Surface } from "react-native-paper";
import Backlight from '../../assets/icons/lighttheme/Back arrow.svg'
import BackDark from '../../assets/icons/darktheme/Back arrow.svg'
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { Fonts } from "../../utils/Fonts";
import { RFPercentage } from "react-native-responsive-fontsize";

const ImportWalletTabAfterCreate = (props) => {
  //redux
  const importDetailsRedux = useSelector(
    (state) => state.importWalletReducer.importData
  );

  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);

  return (
    <SafeAreaView style={style.container}>
      <View style={{
        height: windowheight*0.15,
        justifyContent: "center",
        backgroundColor: "transparent",
        boxShadow: 0
      }} >
        <Pressable onPress={() => props.navigation.goBack()} >
        {theme.theme == 'light' ?
          (
            // <Image source={require('../assets/img/lleft.png')} />
            <Backlight width={windowWidth * 0.07} height={windowWidth * 0.07} style={{ resizeMode: "contain",marginLeft:"2.5%"  }} />
          ) :

          (<BackDark width={windowWidth * 0.07} height={windowWidth * 0.07} style={{ resizeMode: "contain",marginLeft:"2.5%"  }} />)

        }
        </Pressable>
        <Text style={{
          color: theme.text,
          fontFamily: Fonts.Regular,
          fontSize: RFPercentage(2.75),
          marginLeft: 17,
          marginTop: 30,
          textAlign: "left",
        }}>{"Import " + importDetailsRedux.currency}</Text>
     
      </View>
         {/* <Header
          name={"Import " + importDetailsRedux.currency}
          leftImage={"back"}
        /> */}
        {/* <Surface style={appBarStyle.headerStyle}>

            </Surface> */}
      <View style={{ height: "85%", backgroundColor: "green" }} >
        <ImportTab2
          currencyParam={importDetailsRedux.currency}
          tokenType={importDetailsRedux.tokenType}
        />
      </View>


    </SafeAreaView>
  );
};

export default ImportWalletTabAfterCreate;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
  });
