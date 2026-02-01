import React, { useCallback, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Linking,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import Header from "../../Components/Header";
import { Images } from "../../utils/Images";
import themeContext from "../../utils/themeContext";
import { Fonts } from "../../utils/Fonts";
import { Icon as Icn, Switch } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { getFaqContentApi } from "./common/faq_";
import RenderHTML from "react-native-render-html";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { windowWidth, windowheight } from "../../utils/Dimensions";

export default function PrivacyPolicy(props) {
  const theme = React.useContext(themeContext);

  const [q_one, setq_one] = React.useState(0);
  const [privacy, setPrivacy] = useState([])
  const [accordion, setAccordion] = useState([])

  useFocusEffect(
    React.useCallback(() => {
      getFaqContentt()
    }, [])
  )

  const getFaqContentt = async () => {
    var respp = await getFaqContentApi("privacy")
    // console.log('respp.data', JSON.stringify(respp.data, null, 2))
    if (respp.data.success) {
      var accord = []
      var cms = []
      respp.data.data.map((val) => {
        if (val.Type == "Accordion") accord.push(val)
        else cms.push(val)
      })

      setAccordion(accord);
      setPrivacy(cms)
        }
    }
  
  const selection = (key) => {
    setq_one(key)
    var data = [...accordion]
    // data.map((val)=>{
    //     if(val.status == true) val.status = false
    // })
    data[key].status = !data[key].status
    setAccordion(data)
    }
  console.log('accordion', JSON.stringify(accordion, null, 2))
  const mixedStyle = {

    p: {
      color: theme.theme == "light" ? '#000' : '#fff',
      fontSize: RFValue(13),
      fontFamily: Fonts.Regular
    },

    li: {
      color: theme.theme == "light" ? '#000' : '#fff',
      fontSize: RFValue(12),
      fontFamily: Fonts.Bold
        }
    }
  return (
    <>
      <SafeAreaView
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: theme.background,
        }}
      >
        <ImageBackground
          source={theme.theme === "light" ? Images.backgroundWhite : Images.background}
          style={{
            width: windowWidth,
            height: windowheight,
            paddingTop: StatusBar.windowheight,
          }}
          resizeMode="cover"
        >
          <View style={{}}>
            <View style={{ height: "15%" }}>
              <Header name={"Privacy policy"} leftImage={"back"} />
            </View>
            <View style={{ height: "82.5%",width:"85%",alignSelf:"center" }}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {privacy.map((data, key) => {
                  return (
                    <View style={{ marginTop: 10, }}>
                      <RenderHTML
                        source={{ html: `${data.answer}` }}
                        tagsStyles={mixedStyle}
                      />
                    </View>
                  );
                })}
                {accordion.map((data, key) => {
                  return (
                    <>
                    <View>
                      <View style={{ marginTop: "5%",  }}>
                        <View>
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                            onPress={() => selection(key)}
                          >
                            <View style={{ width: "80%" }}>
                              <Text
                                style={{
                                  fontFamily: Fonts.Bold,
                                  color:
                                    theme.theme == "light" ? "#000" : "#fff",
                                  fontSize: RFPercentage(1.8),
                                }}
                              >
                                {data.question}
                              </Text>
                            </View>
                            <View>
                              <Icn
                                name="chevron-right"
                                type="evilicons"
                                style={
                                  data.status
                                    ? { transform: [{ rotate: "88deg" }] }
                                    : { transform: [{ rotate: "0deg" }] }
                                }
                                color={theme.theme == "light" ? "#000" : "#fff"}
                                size={30}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {data.status ? (
                        <View style={{ marginTop: 30 ,width:"95%",alignSelf:"center",
                            borderColor: "rgba(162, 121, 250, 0.30)",
                            borderWidth: 2,
                            backgroundColor: "rgba(155, 124, 220, 0.15)",
                            borderRadius: 5,
                            padding: 10,}}>
                          <RenderHTML
                            source={{ html: `${data.answer}` }}
                            tagsStyles={mixedStyle}
                          />
                        </View>
                      ) : (
                        <></>
                      )}
                    </View>
                    {key !== accordion.length - 1 && (
                      <Image
                        style={{ width: "100%", height: 1,marginTop:"5%" }}
                        source={require("../../assets/img/deviderPNG.png")}
                        resizeMode="cover"
                      />
                    )}
                    </>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
}
