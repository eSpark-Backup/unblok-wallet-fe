import React, {
    useContext,
    useState,
    useEffect,
    useRef,
    useCallback,
  } from "react";
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
    Dimensions,
    ToastAndroid,
    ImageBackground,
    StatusBar,
  } from "react-native";
  import themeContext from "../../utils/themeContext";
  import getRealm from "../../localDb/RealmConfig";
  import Header from "../../Components/Header";
  import { Fonts } from "../../utils/Fonts";
  import { Image } from "react-native-elements";

  
  import { RFPercentage } from "react-native-responsive-fontsize";
  import { windowheight } from "../../utils/Dimensions";
  import { Images } from "../../utils/Images";
  const WalletConnect = (props) => {
    //theme config
    const theme = useContext(themeContext);
    const style = styles(theme);
    const [pushcheck, setPushCheck] = useState(false);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

  
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
          <Header name={"WalletConnect"} leftImage={"back"} />
          <View style={{ alignItems: "center", marginTop: "20%" }}>
            {/* <View style={{ width: "100%", alignItems: "center" }}>
                      {theme.theme == "light" ?
                          (
                              <Image source={LLogo} style={{ width: windowWidth * 0.8, height: windowHeight * 0.1 }} resizeMode="contain" />
  
                          )
                          : (
                              <Image source={DLogo} style={{ width: windowWidth * 0.8, height: windowHeight * 0.1 }} resizeMode="contain" />
                          )
                      }
                  </View> */}
  
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 20,
                marginTop: "50%",
              }}
            >
              <Text
                style={{
                  color: theme.theme === "dark" ? "#fff" : "black",
                  fontFamily: Fonts.Regular,
                  width: windowWidth - 100,
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: RFPercentage(5),
                }}
              >
                Coming Soon!
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 30,
              }}
            ></View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  };
  export default WalletConnect;
  
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
  