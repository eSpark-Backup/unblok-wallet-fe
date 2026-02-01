import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  TouchableHighlight,
  ToastAndroid,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  StatusBar
} from "react-native";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { Fonts } from "../../utils/Fonts";
import Clipboard from "@react-native-community/clipboard";
import { Colors } from "../../utils/Colors";
import QRCode from "react-native-qrcode-svg";
import { Button, Icon as Icn, Card } from "react-native-elements";
import ApiClient from "../../api/ApiClient";
import { ApiConstants } from "../../api/ApiConstants";
import { useDispatch } from "react-redux";
import { addSeedData } from "../../Redux/Actions/seedDataAction";
import LinearGradient from "react-native-linear-gradient";
import LCopy from "../../assets/img/lcopy.svg";
import Copy from "../../assets/img/copy.svg";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
// import QR from "../../assets/img/qr.svg";
import isEmpty from "../../utils/isEmpty";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { EncodePrivateKey } from "../../utils/common";
import { Images } from "../../utils/Images";
const CopyWalletPharse = (props) => {
  //redux
  const dispatch = useDispatch();
  const setSeedDataRedux = (item) => dispatch(addSeedData(item));
  var root = props.route.params
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);

  //api states
  const [copyVal, seedCopyFunc] = useState("");
  const [seedListArr, seedListArrFunc] = useState([]);
  const [qrdata, setQrData] = useState("");
  const [seedList, seedListArray] = useState([]);

  useEffect(() => {
    seedGenerate();
  }, []);

  const copy = () => {
    copyToClipboard();
  };

  const copyToClipboard = () => {
    Clipboard.setString(copyVal);
    // ToastAndroid.showWithGravityAndOffset(
    //   "Phrase Copied!",
    //   ToastAndroid.LONG,
    //   ToastAndroid.BOTTOM,
    //   25,
    //   50
    // );
  };

  //for seed generate
  const seedGenerate = async () => {
    ApiClient.get(ApiConstants.seedgenerate)
      .then(async(res) => {
        // console.log("RESSSSSSS", res.data);
        const seedList = await EncodePrivateKey(res.data.data);
        console.log("seedList",seedList);
        seedCopyFunc(seedList);
        const seedListArr = seedList.split(" ");
        seedListArrFunc(seedListArr);
        const tempList = seedListArr.map((str, index) => ({
          value: str,
          id: index + 1,
          checked: false,
        }));
        seedListArray(tempList);
        // Clipboard.setString(seedList);
        setQrData(seedList.toString());
      })
      .catch((err) => {
        console.log("seed generate err", err);
      });
  };

  /**
   * add item for dynamic interests
   */
  const Item = ({
    item,
  }) => (
    <View
      onPress={() => {
        // onPress();
      }}
      style={{
        backgroundColor: "rgba(162, 121, 250, 0.15)",
        borderColor:
        theme.theme === "light"
            ? "rgba(97, 44, 210, 0.50)"
            : "rgba(162, 121, 250, 0.30)",
        borderWidth: 1,
        alignItems: "center",
        borderStyle: "solid",
        
        borderRadius: 5,
        margin: "1%",
        width: "31.2%",
      }}
    >
      <Text
        style={{
          padding: "8%",
          color: theme.theme === "dark" ? "white" : "black",
          fontSize: RFPercentage(1.5),
          fontFamily: Fonts.Regular,
          textTransform: "capitalize",
        }}
      >
        {item.value}
      </Text>
    </View>
  );

  /**
   * map interests in the array
   */
  const mapData = () => {
    return seedList.map((item, index) => {
      const backgroundColor = "transparent";
      const color = theme.text;
      const borderWidth = 1;
      const borderColor = theme.phrase1;
      const borderRadius = 10;
      return (
        <Item
          key={index.toString()}
          item={item}
          backgroundColor={backgroundColor}
          textColor={color}
          borderWidth={borderWidth}
          borderColor={borderColor}
          borderRadius={borderRadius}
        />
      );
    });
  };

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
        <Header
          leftImage={root == "after" ? "back" : "privacyInfoBack"}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{}}>
            <View style={{ marginHorizontal: 4, marginVertical: 1 }}>
              <Text style={style.pharseTxt}>Your Secret Phrase</Text>
              <Text style={style.des}>
                Please write down or copy these words in the right order and
                save them in a secure place.
              </Text>
            </View>
            <View style={style.mapData}>
              {mapData()}
            </View>
            <TouchableOpacity onPress={copy}>
              <View style={style.copyView}>
                {theme.theme === "dark" ? (
                  <Image
                  style={{ width: 18, }}
                  source={require("../../assets/img/copy.png")}
                  resizeMode="contain"
                />
                ) : (
                  <Image
                  style={{ width: 18, }}
                  source={require("../../assets/img/copy.png")}
                  resizeMode="contain"
                />
                )}
                <Text style={style.copyTxt}>Copy</Text>
              </View>
            </TouchableOpacity>
            <Image
            style={{ width: "100%", marginTop: "0%",height:1.5, marginBottom: "0%" }}
            source={require("../../assets/img/devider.png")}
            resizeMode="contain"
          />
          
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 12,
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: RFPercentage(2),
                    alignSelf: "center",
                    color: "red",
                    textAlign: "center",
                  
                  }}
                >
                  Never share your secret phrase to anyone,
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: RFPercentage(2),
                    alignSelf: "center",
                    color: "red",
                    textAlign: "center",
                  
                  }}
                >
                  as this gives full access to your wallet!
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 2 }}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  style={style.continueBtn}
                  onPress={() => {
                    if (seedList.length != 0) {
                      setSeedDataRedux(seedList);
                      props.navigation.navigate("ConfirmWalletPharse");
                    }
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.Regular,
                      color: theme.theme === "light" ? "white" : "black",
                      fontSize: RFPercentage(2),
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    Create
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{alignItems:"center",flexDirection:"row",justifyContent:"center",marginBottom:"2%"}}>
              <Image
            style={{ width: "35%",  }}
            source={require("../../assets/img/devider.png")}
            resizeMode="contain"
          />
                <Text style={{color:theme.theme==="dark"?"white":"black"}}>Or</Text>
                <Image
            style={{ width: "35%",  }}
            source={require("../../assets/img/devider.png")}
            resizeMode="contain"
          />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={style.scanTxt}>Scan QR</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "4%",
                  
                }}
              >
                {!isEmpty(qrdata) ? (
                  <View style={{  padding: 15, backgroundColor:"#FFFFFF" }}>
                  <QRCode color={"#000"} value={qrdata} size={100} />
                </View>
                ) : (
                  <></>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default CopyWalletPharse;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scanTxt: {
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(1.8),
      color: theme.theme === "dark" ? "white" : "black",
      textAlign: "center",
      borderBottomColor: theme.theme === "dark" ? "white" : "black",
      borderBottomWidth: 1,
      marginBottom: 5,
    },
    continueBtn: {
      borderRadius: 1.7,
      width: "75%",
      height: windowheight * 0.05,
      alignSelf: "center",
      backgroundColor: theme.theme === "light" ? "#612CD2" : "#FFF600",
      color: theme.theme === "dark" ? "white" : "black",

      borderColor: theme.texttheme,
      justifyContent: "center",
      marginBottom: 15,
    },
    copyTxt: {
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(2.2),
      color: "#A279FA",
      textAlign: "center",
      marginLeft:5,
    },
    copyView: {
      // marginTop: "2%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      height:45
    },
    mapData: {
      flexDirection: "row",
      flexWrap: "wrap",
      width: "90%",
      alignSelf: "center",
      // justifyContent: "space-between",

    },
    des: {
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(1.75),
      color: theme.theme === "dark" ? "white" : "black",
      textAlign: "left",
      marginBottom: "5%",
      marginLeft: 15,
      marginTop: 0,
    },
    pharseTxt: {
      fontFamily: Fonts.Bold,
      fontSize: RFPercentage(2.8),
      color: theme.theme === "dark" ? "white" : "black",
      textAlign: "left",
      marginLeft: 15,
      marginBottom: 15,
      fontWeight:"bold"
    },
    mainView: {
      backgroundColor: theme.blackandwhite,
      height: 60,
    },
  });
