import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  BackHandler,
  TouchableOpacity,
  View,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { Colors } from "../../utils/Colors";
import { useFocusEffect } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { Fonts } from "../../utils/Fonts";
import themeContext from "../../utils/themeContext";
import { Images } from "../../utils/Images";


const Onboarding = (props) => {
  const onDone = () => {
    props.navigation.navigate("CreateWallet");
  };
  const onSkip = () => {
    props.navigation.navigate("CreateWallet");
  };
  const renderNextButton = () => {
    return (
      <View>
        <Text style={{ color: "#c17722", fontFamily: Fonts.Bold }}>Next</Text>
      </View>
    );
  };
  const renderDoneButton = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => onDone()}>
          <Text style={{ color: "#c17722", fontFamily: Fonts.Bold }}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const renderSkipButton = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => onSkip()}>
          <Text style={{ color: "#c17722", fontFamily: Fonts.Bold }}>Skip</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const theme = React.useContext(themeContext);
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

  const RenderItem = ({ item }) => {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: item.backgroundColor,
          alignItems: "center",
          justifyContent: "space-around",
          paddingBottom: 50,
        }}
      >
        <Text style={styles.introTitleStyle}>{item.title}</Text>
        <Image style={styles.introImageStyle} source={item.image.src} />
        <Text style={styles.introTextStyle}>{item.text}</Text>
        <LinearGradient
          colors={["#FFF229", "#518D56"]}
          useAngle={true}
          angle={170}
          style={{ width: 325, borderRadius: 20 }}
        >
          <TouchableOpacity style={{ padding: 15 }}>
            <Text
              style={{
                color: "#000",
                width: "100%",
                textAlign: "center",
                fontFamily: Fonts.Bold,
                fontSize: 18,
              }}
            >
              {item.buttonText}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
        {item.title == "Create Wallet" ? (
          <>
            <Text style={styles.introTextStyle}>{item.title2}</Text>
          </>
        ) : (
          <></>
        )}
      </SafeAreaView>
    );
  };

  return (
    <>
      <LinearGradient
        colors={
          theme.theme == "light" ? ["#fff", "#fff"] : ["#151918", "#171515"]
        }
        useAngle={true}
        angle={180}
        style={{ width: "100%", height: "100%" }}
      >
        <AppIntroSlider
          data={slides}
          renderItem={RenderItem}
          onDone={onDone}
          showSkipButton={true}
          onSkip={onSkip}
          activeDotStyle={{
            backgroundColor: theme.text,
          }}
          dotStyle={{
            backgroundColor: "grey",
          }}
          showDoneButton
          showNextButton
          renderDoneButton={renderDoneButton}
          renderNextButton={renderNextButton}
          renderSkipButton={renderSkipButton}
          fontFamily={Fonts.Bold}
        />
      </LinearGradient>
    </>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  introImageStyle: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  introTextStyle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    paddingVertical: 30,
    fontFamily: Fonts.Medium,
    letterSpacing: 2,
  },
  introTitleStyle: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: Fonts.Bold,
  },
});

const slides = [
  // {
  //   key: "s1",
  //   text: "Non-custodial wallet",
  //   title: "Welcome to Chiptoss",
  //   image: {
  //     uri: `${ApiConstants.URL}WalletImages/newcreatewallet.webp`,
  //   },
  //   buttonText: "Continue",
  // },
  // {
  //   key: "s1",
  //   text: "Non-custodial wallet",
  //   title: "Welcome to Chiptoss",
  //   image: {
  //     src: Images.createwalletPng,
  //   },
  //   buttonText:"Continue",
  // },
  {
    key: "s1",
    title: "Create Wallet",
    text: "Private keys never leave your device",
    image: {
      src: require("../../assets/img/appicon.png"),
    },
    buttonText: "Create a new wallet",
    title2: "I already have a wallet",
  },
  // {
  //   key: "s3",
  //   title: "Secure Wallet",
  //   text: "Full control and biometric protection",
  //   image: {
  //     src: Images.createwalletPng,
  //   },
  //   buttonText:"Continue"
  // },
];
