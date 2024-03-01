import React, { useState, useContext } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  StatusBar,
} from "react-native";
import Header from "../../Components/Header";
import QRCodeScanner from "react-native-qrcode-scanner";
import { Button } from "react-native-elements";
import { Images } from "../../utils/Images";
import Clipboard from "@react-native-community/clipboard";
import { Fonts } from "../../utils/Fonts";
import themeContext from "../../utils/themeContext";
import { useDispatch, useSelector } from "react-redux";
import { addScanDetails } from "../../Redux/Actions/scanDetailsAction";
import LinearGradient from "react-native-linear-gradient";
import { ApiConstants } from "../../api/ApiConstants";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { ImageBackground } from "react-native";
import {
  borderRadius,
  windowWidth,
  windowheight,
} from "../../utils/Dimensions";
const ScanAddress = (props) => {
  //redux
  const dispatch = useDispatch();
  const setScanDetails = (item) => dispatch(addScanDetails(item));
  const path = props?.route?.params?.path

  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);

  const [qrCodeData, SetQrCodeData] = useState("");

  const CopyAddress = (e) => {
    Clipboard.setString(e ? e : qrCodeData);
    nav(e ? e : qrCodeData);
    setScanDetails(e ? e : qrCodeData);
  };

  const nav = (data) => {
    path ?
      props.navigation.navigate(path, { data: data })
      :
      props.navigation.goBack("");
  };

  const onSuccess = (e) => {
    console.error("QR data=" + e.data);
    SetQrCodeData(e.data);
    CopyAddress(e.data)
    if (String(e.data)?.substring(0, 3) == ('wc:')) {

      dispatch({
        type: "Session",
        data: {
          url: e?.data,
          StopAction: true,
          Loader: true
        }
      })

    }
  };

  return (
    <SafeAreaView style={style.container}>
      <ImageBackground
        source={theme.theme === "dark" ? Images.background :Images.backgroundWhite}
        style={{
          width: windowWidth,
          height: windowheight,
          paddingTop: StatusBar.windowheight,
        }}
        resizeMode="cover"
      >
        <Header name={"Scan"} leftImage={"back"} />
        <Image
          style={{ width: "100%",  marginBottom: "10%" }}
          source={require("../../assets/img/devider.png")}
          resizeMode="contain"
        />
        <View
          style={{
            textAlign: "center",
            alignSelf: "center",
            width: "75%",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: theme.theme === "dark" ? "#fff" : "#000",

              marginTop: "5%",
              fontSize: RFPercentage(3),
              fontFamily: Fonts.Bold,
            }}
          >
            Scan QR Code
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: theme.theme === "dark" ? "#fff" : "#000",
              fontSize: RFPercentage(3),
              fontFamily: Fonts.Bold,
            }}
          >
            to connect to DApps
          </Text>
        </View>

        <QRCodeScanner
          onRead={onSuccess}
          containerStyle={{
            backgroundColor: "transparent",

          }}
          showMarker={true}
          customMarker={
            <Image
              source={require("../../assets/img/showmaker1.png")}
              style={{ height: RFPercentage(47), width: RFPercentage(47) }}
            />
          }
          cameraStyle={{
            width: RFPercentage(48),
            height: RFPercentage(48),
            overflow: "hidden",
            borderRadius: 10,
            alignSelf: "center",
            marginTop: "-15%",
           
          }}
          bottomContent={
            <Text
          style={{
            textAlign: "center",
            color: theme.theme === "dark" ? "#612CD2" : "#612CD2",
            fontSize: RFPercentage(2),
            fontFamily: Fonts.Medium,
            width: "75%",
            alignSelf: "center",
            marginTop:"-20%"
            
          }}
        >
          Place QR inside the viewfinder rectangle to scan it.
        </Text>}
        />

      </ImageBackground>
    </SafeAreaView>
  );
};

export default ScanAddress;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
  });
