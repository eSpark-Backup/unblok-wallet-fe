import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  BackHandler,
  TouchableOpacity,
  AppState,
  RefreshControl,
  Image,
  ImageBackground,
  StatusBar
} from "react-native";
import themeContext from "../../utils/themeContext";
import getRealm from "../../localDb/RealmConfig";
import Header from "../../Components/Header";
import { Fonts } from "../../utils/Fonts";
import { Icon as Icn } from "react-native-elements";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Images } from "../../utils/Images";
import { windowWidth, windowheight } from "../../utils/Dimensions";
const Preference = (props) => {
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [pushcheck, setPushCheck] = useState(global?.Dapp);
  const [isEnabled, setIsEnabled] = useState(false);

  console.log("global?.Dapp", global?.Dapp);


  return (
    <SafeAreaView style={style.container}>
      <ImageBackground
          source={theme.theme === "light" ? Images.backgroundWhite : Images.background}
          style={{
            width: windowWidth,
            height: windowheight,
            paddingTop: StatusBar.windowheight,
          }}
          resizeMode="cover"
        >
      <Header name={"Preferences"} leftImage={"back"} />
      <View style={{width:"85%",alignSelf:"center"}}>

      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("DefaultCurrencyList");
        }}
        style={{ marginTop: "10%" }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.Medium,
              fontSize: RFPercentage(2),
              textAlign: "center",
              color: theme.theme == "light" ? "#000" : "#fff"
            }}
          >
            Choose Default Currency
          </Text>
          <Icn
            name="chevron-right"
            type="evilicons"
            style={{
              alignSelf: "center",
              left: -10,
            }}
            color={theme.theme == "light" ? "#000" : "#fff"}
            size={30}
          />
        </View>
      </TouchableOpacity>
      <Image
          style={{ width: "100%", height: 1, marginBottom: "5%", marginTop: "5%" }}
          source={require("../../assets/img/deviderPNG.png")}
          resizeMode="cover"
        />
      </View>
      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
          marginTop: -17
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
          {theme.theme == 'light' ?
            <Dapplight width={windowWidth * 0.07} height={windowheight * 0.07} style={{ resizeMode: "contain", alignSelf: "center" }} /> :
            <DappDark width={windowWidth * 0.07} height={windowheight * 0.07} style={{ resizeMode: "contain", alignSelf: "center" }} />
          }
          <Text
            style={{
              fontFamily: Fonts.Regular,
              fontSize: RFPercentage(2.2),
              textAlign: "center",
              color: theme.text,
              marginLeft: 10
            }}
          >
            Enable Dapp Browser
          </Text>
        </View>
        <View style={{justifyContent:"center"}}>
          <Switch
            value={pushcheck}
            onValueChange={(value) => {
              setPushCheck(value);
              saveDappStatus(value);
            }}
            disabled={false}
            activeText={'On'}
            inActiveText={'Off'}
            circleSize={22}
            barHeight={15}
            circleBorderWidth={0}
            backgroundActive={theme.theme == "light" ? "#cdd0d1" : '#000'}
            backgroundInactive={theme.theme == "light" ? "#000" : '#fff'}
            circleActiveColor={theme.theme == "light" ? "#000" : '#cdd0d1'}
            circleInActiveColor={theme.theme == "light" ? "#cdd0d1" : '#000'}
            changeValueImmediately={true}
            innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
            outerCircleStyle={{}} // style for outer animated circle
            renderActiveText={false}
            renderInActiveText={false}
            switchLeftPx={2.5}
            switchRightPx={2.5}
            switchWidthMultiplier={1.5}
            switchBorderRadius={30}
          />
        </View>
      </View> */}
      </ImageBackground>
    </SafeAreaView>
  );
};
export default Preference;

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
