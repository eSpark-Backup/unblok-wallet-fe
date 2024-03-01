import React, { useState } from "react";
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
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect } from "@react-navigation/native";
import { getFaqContentApi } from "./common/faq_";
import RenderHTML from "react-native-render-html";
import { windowWidth, windowheight } from "../../utils/Dimensions";

export default function AboutUs(props) {
  const theme = React.useContext(themeContext);
  const [privacy, setPrivacy] = React.useState(false);
  const [terms, setTerms] = React.useState(false);
  const style = styles(theme);

  const [about, setAbout] = useState([])

  useFocusEffect(
    React.useCallback(() => {
      getFaqContentt()
    }, [])
  )

  const getFaqContentt = async () => {
    var respp = await getFaqContentApi("about")
    // console.log("resspspsps", respp.data);
    if (respp.data.success) {
      setAbout(respp.data.data)
        }
    }
  
  const mixedStyle = {

    p: {
      color: theme.theme == "light" ? '#000' : '#fff',
      fontSize: RFValue(13),
      fontFamily: Fonts.Regular,
    }
    }

  return (
    <>
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
          <>
            <Header name={"About Us"} leftImage={"back"} />
            <View
              style={{
                height: "83%",
                marginTop: "5%",
                width: "90%",
                alignSelf: "center",
              }}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* {about.length != 0 &&
                                about.map((val) => {
                                    return ( */}
                <View
                  style={{
                    borderColor: "rgba(162, 121, 250, 0.30)",
                    borderWidth: 2,
                    paddingHorizontal: 15,
                    paddingVertical: 40,
                    backgroundColor: "rgba(155, 124, 220, 0.10)",
                    borderRadius: 5,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontFamily: Fonts.Bold,
                        fontSize: RFPercentage(1.6),
                        color: theme.theme === "dark" ? "white" : "black",
                        lineHeight:23
                      }}
                    >
                      UNBLOK is a crypto payment system that enables users to
                      exchange their data for cryptocurrency via Non-Fungible
                      Tokens (NFTs) with companies, investors, and advertisers.
                      The received crypto payments can then be converted into
                      other cryptocurrencies, NFTs, gift cards, or fiat
                      currency.
                    </Text>
                  </View>
                  <View style={{ marginHorizontal: 10 }}>
                    {/* <RenderHTML
                                                    source={{ html: `${val.answer}` }}
                                                    tagsStyles={mixedStyle}
                                                /> */}
                  </View>
                </View>
                {/* )
                                })
                            } */}
              </ScrollView>
              {/* <View style={{ marginHorizontal: 20, marginTop: 40 }}>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 14, color: theme.text }}>
                            UNBLOK is the world’s first decentralized digital data marketplace where consumers and brands are incentivized for sharing their mobile data. Users can earn crypto tokens by allowing access to personal customer data while using our proprietary mobile keyboard. Data including search keywords and location is collected, processed, and sold via the Data Marketplace. Data collected from user activity is decentralized and stored securely on the blockchain.</Text>
                    </View> */}
              {/* <View style={{ marginHorizontal: 20 }}>
                        <View style={{ marginTop: 30 }}>
                            <View>
                                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} onPress={() => {
                                    setPrivacy(!privacy)
                                    setTerms(false)
                                }}>
                                    <Text style={{ color: theme.text }}>Privacy Policy</Text>
                                    <Icn
                                        name="chevron-right"
                                        type="evilicons"
                                        style={privacy == true ? { transform: [{ rotate: '88deg' }] } : { transform: [{ rotate: '0deg' }] }}
                                        color={theme.theme == "light" ? "#000" : "#fff"}
                                        size={30}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {privacy == true ?
                            (<View style={{ marginTop: 30 }}>
                                <Text style={{ color: theme.text }} >The UNBLOK “Company,” “us,” “we,” or “our” owns and operates www.unblokapp.com and UNBLOK mobile application (hereinafter referred to as “Service”). </Text>
                                <Text style={{ marginTop: 30, color: theme.text }}>UNBLOK is committed to protecting the privacy, confidentiality and security of any personal information about our users. Your privacy is always at the top of our priorities, and we are focused on protecting it from unauthorized access.</Text>
                            </View>)
                            : (<></>)}
                        <View style={{ marginTop: 30 }}>
                            <View>
                                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} onPress={() => {
                                    setTerms(!terms)
                                    setPrivacy(false)
                                }}>
                                    <Text style={{ color: theme.text }}>Terms of Service</Text>
                                    <Icn
                                        name="chevron-right"
                                        type="evilicons"
                                        style={terms == true ? { transform: [{ rotate: '88deg' }] } : { transform: [{ rotate: '0deg' }] }}
                                        color={theme.theme == "light" ? "#000" : "#fff"}
                                        size={30}
                                    />

                                </TouchableOpacity>
                            </View>
                            {terms == true ?
                                (<View style={{ marginTop: 30 }}>
                                    <Text style={{ color: theme.text }} >The UNBLOK “Company,” “us,” “we,” or “our” owns and operates www.unblokapp.com and UNBLOK mobile application (hereinafter referred to as “Service”). </Text>
                                    <Text style={{ marginTop: 30, color: theme.text }}>UNBLOK is committed to protecting the privacy, confidentiality and security of any personal information about our users. Your privacy is always at the top of our priorities, and we are focused on protecting it from unauthorized access.</Text>
                                </View>)
                                : (<></>)
                            }
                        </View>
                    </View> */}
            </View>
          </>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
}

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    custsearch: {
      borderRadius: 5,
      backgroundColor: theme.background,
      borderColor: theme.phrase1,
      borderWidth: 1,
      margin: 15,
      fontFamily: Fonts.Bold,
      elevation: 0,
      fontSize: RFPercentage(2),
    },
  });
