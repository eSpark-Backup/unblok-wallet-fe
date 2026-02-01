import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StatusBar,
  Dimensions,
  Image,
  Pressable,
  ImageBackground,
} from "react-native";
import Voice from "@react-native-community/voice";
import { Card } from "react-native-shadow-cards";
// import theme from '../../utils/theme';
import { Fonts } from "../../utils/Fonts";
import { RFValue } from "react-native-responsive-fontsize";
import Errorvoice from "../g_voice.json";
import themeContext from "../../utils/themeContext";
import { Images } from "../../utils/Images";
import { windowWidth, windowheight } from "../../utils/Dimensions";
const SpeechRecognitionComponent = ({ visible, onhide, searchtext }) => {
  const theme = useContext(themeContext);
  const height = Dimensions.get("window").height;
  const [success, setSuccess] = useState(false);
  const [voiceValue, setVoiceValue] = useState("");

  useEffect(() => {
    Voice.onSpeechResults = (results) => {
      console.log(results.value[0], "hiiiiiiii");
      setVoiceValue(results.value[0])
      setTimeout(() => {
        searchtext(results.value[0]);
        onhide(false)
      }, 1000)
    };

    Voice.onSpeechEnd = () => {
      setSuccess(false)
      // You can perform any actions here when speech recognition stops
    };

    // Event listener for speech recognition error
    Voice.onSpeechError = (error) => {
      setSuccess(true)
      // You can handle speech recognition errors here
    };

    return () => {
      // Clean up event listeners when component unmounts
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    setSuccess(false)
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting speech recognition', error);
    }
  };

  const stopListening = async () => {
    setSuccess(false)
    try {
      await Voice.stop();
      onhide(false)
    } catch (error) {
      console.error('Error stopping speech recognition', error);
    }
  };

  useEffect(() => {
    if (visible) {
      startListening()
    }
  }, [visible])

  return (
    <>
      {/* <StatusBar backgroundColor={'red'} /> */}
      <Modal transparent={true} visible={visible} animationType="fade">
        <View
          onStartShouldSetResponder={() => stopListening()}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
          }}
        >
         
          <View
            style={{
              width: "80%",
              borderRadius: 10,
              alignSelf: "center",
              overflow:"hidden",
              borderWidth: 2,
                  borderColor: "rgba(162, 121, 250, 0.30)",
            }}
          >
             <ImageBackground
              source={theme.theme === "dark" ? Images.backgroundVoice :  Images.backgroundVoiceDark}
              style={{
                width: "100%",
                alignSelf: "center",
                justifyContent: "space-evenly",
                paddingVertical: "5%",
               
              }}
              resizeMode="cover"
            >
            <Text
              style={{
                color: theme.theme == "light" ? "#fff" : "#000",
                fontFamily: Fonts.Medium,
                fontSize: RFValue(15),
                textAlign: "center",
              }}
            >
              Google
            </Text>
            {!success ? (
              <>
                <Image
                  source={require("../../assets/img/voice.gif")}
                  style={{
                    width: 80,
                    height: 80,
                    alignSelf: "center",
                    resizeMode: "contain",
                    marginTop: "5%",
                  }}
                />
                <Text
                  style={{
                    color: theme.theme == "light" ? "#fff" : "#000",
                    fontFamily: Fonts.Regular,
                    fontSize: RFValue(14),
                    textAlign: "center",
                    marginTop: "5%",
                  }}
                >
                  {voiceValue != "" ? voiceValue : "Try saying something"}{" "}
                </Text>
                {/* <Text style={{ color: "#000", fontFamily: Fonts.Regular, fontSize: RFValue(14), textAlign: "center", marginTop: "5%" }} >{voiceValue}</Text> */}
              </>
            ) : (
              <>
                <Image
                  source={require("../../assets/img/errorvoice.png")}
                  style={{
                    width: 60,
                    height: 60,
                    alignSelf: "center",
                    resizeMode: "contain",
                    marginTop: "5%",
                  }}
                />
                <Text
                  style={{
                    color: theme.theme == "dark" ? "#000" : "#fff",
                    fontFamily: Fonts.Regular,
                    fontSize: RFValue(14),
                    textAlign: "center",
                    marginTop: "5%",
                  }}
                >
                  Didn't catch that. Try speaking again.
                </Text>
              </>
            )}
            {success && (
              <Pressable
                onPress={() => startListening()}
                style={{
                  width: "30%",
                  paddingVertical: "2%",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "rgba(162, 121, 250, 0.30)",
                  backgroundColor:"rgba(155, 124, 220, 0.15)",
                  alignSelf: "center",
                  marginTop: "2.5%",
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    color: theme.theme == "dark" ? "#000" : "#fff",
                    fontFamily: Fonts.Regular,
                    fontSize: RFValue(10),
                    textAlign: "center",
                  }}
                >
                  Try again
                </Text>
              </Pressable>
            )}
            <Text
              style={{
                color: theme.theme == "dark" ? "#000" : "#fff",
                fontFamily: Fonts.Regular,
                fontSize: RFValue(11),
                textAlign: "center",
                marginTop: "5%",
              }}
            >
              English (United States)
            </Text>
          </ImageBackground>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SpeechRecognitionComponent;
