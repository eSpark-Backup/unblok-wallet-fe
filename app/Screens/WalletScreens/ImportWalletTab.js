import React, { useContext } from "react";
import { ImageBackground, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { ImportTab } from "../../Navigations/TopTabs";
import { useSelector } from "react-redux";
import LinearGradient from 'react-native-linear-gradient';
import { Fonts } from "../../utils/Fonts";
import { RFPercentage } from "react-native-responsive-fontsize";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import Backlight from '../../assets/icons/lighttheme/Back arrow.svg'
import BackDark from '../../assets/icons/darktheme/Back arrow.svg'
import { Images } from "../../utils/Images";
const ImportWalletTab = (props) => {
  //redux
  const importDetailsRedux = useSelector(
    (state) => state.importWalletReducer.importData
  );

  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);

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

      <Header
        name={"Import " + importDetailsRedux.currency}
        leftImage={"back"}
      />
      <ImportTab
        currencyParam={importDetailsRedux.currency}
        tokenType={importDetailsRedux.tokenType}
      />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ImportWalletTab;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
  });
