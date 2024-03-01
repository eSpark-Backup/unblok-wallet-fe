import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  BackHandler,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  TouchableHighlight,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { Fonts } from "../../utils/Fonts";
import Clipboard from "@react-native-community/clipboard";
import { Colors } from "../../utils/Colors";
import { Button, Icon as Icn, Card, Image } from "react-native-elements";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { EncodePrivateKey } from "../../utils/common";
import { Images } from "../../utils/Images";

const ShowWalletPhrase = (props) => {
  const [selectedMnemonic, setSelectedMnemonic] = useState([]);
  const [copyVal, seedCopyFunc] = useState("");
  //redux
  const selectedWalletNameDetails = useSelector(
    (state) => state.walletNameEditReducer.walletName
  );

  useEffect(() => {
    console.log("selectedWalletNameDetails", selectedWalletNameDetails);
    var mnemonic = EncodePrivateKey(selectedWalletNameDetails
      .item?.mnemonic).split(' ');
    console.log("mnemonic", mnemonic);
    setSelectedMnemonic(mnemonic);
    seedCopyFunc(EncodePrivateKey(selectedWalletNameDetails.item.mnemonic));
  }, [selectedWalletNameDetails]);

  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        props.navigation.navigate("ShowWalletDetails");
      };
      // Add Event Listener for hardwareBackPress
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        // Once the Screen gets blur Remove Event Listener
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  /**
   * add item for dynamic interests
   */
  const Item = ({ item, onPress, textColor, backgroundColor }) => (
    <TouchableHighlight
      onPress={onPress}
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
          padding: "10%",
          color: theme.theme === "dark" ? "white" : "black",
          fontSize: RFPercentage(1.5),
          fontFamily: Fonts.Regular,
          textTransform: "capitalize",
        }}
      >
        {item}
      </Text>
    </TouchableHighlight>
  );
  console.log("selectedMnemonic", selectedMnemonic);
  /**
   * map interests in the array
   */
  const mapData = () => {
    return selectedMnemonic.map((item, index) => {
      const backgroundColor = item.checked ? theme.phrase : theme.phrase;
      const color = item.checked ? theme.phraseTxt : theme.phraseTxt;

      return (
        <Item
          key={index.toString()}
          item={item}
          backgroundColor={backgroundColor}
          textColor={color}
        />
      );
    });
  };
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
        <Header name={"View Phrase"} leftImage={"walletDetails"} />

        <ScrollView>
          <View style={style.viewStyle}>
            <Text style={style.pharseTxt}>Your Secret Phrase</Text>
            <Text style={style.des}>
            Please write down or copy these words in the right
order and save them in a secure place.
            </Text>
            <View style={style.mapData}>{mapData()}</View>
            <TouchableOpacity onPress={copy}>
              <View style={style.copyView}>
                {/* <Icn
                  name="file-copy"
                  type="MaterialIcons"
                  style={{
                    alignSelf: "center",
                  }}
                  color="#A279FA"
                  size={windowWidth * 0.04}
                /> */}
                {theme.theme === "dark" ? (
                  <Image
                  style={{ width: 18,height:18}}
                  source={require("../../assets/img/copy.png")}
                  resizeMode="contain"
                />
                ) : (
                  <Image
                  style={{ width: 18,height:18}}
                  source={require("../../assets/img/copy.png")}
                  resizeMode="center"
                />
                )}
                <Text style={style.copyTxt}>Copy</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Card
          containerStyle={{
            elevation: 0,
            alignItems: "center",
            backgroundColor: "transparent",
            marginBottom: 10,
            marginTop: -20,
            borderColor: "transparent",
            width: "80%",
            alignSelf: "center",
          }}
        >
          <Image
            style={{
              width: "100%",
              height: 1,
              marginBottom: 20,
              marginTop: 20,
            }}
            source={require("../../assets/img/devider.png")}
            resizeMode="cover"
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  fontFamily: Fonts.Bold,
                  fontSize: RFPercentage(1.8),
                  color: "#A279FA",
                  alignSelf: "center",
                  marginBottom: 20,
                  fontWeight:"bold"
                }}
              >
                Do not share your secret phrase!
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.Regular,
                  fontSize: RFPercentage(1.6),
                  alignSelf: "center",
                  color: theme.theme === "dark" ? "white" : "black",
                  textAlign: "center",
                }}
              >
                If someone has your secret phrase, they will have full control
                of your wallet.
              </Text>
            </View>
          </View>
        </Card>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default ShowWalletPhrase;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    viewStyle: {
      width: "90%",
      alignSelf: "center",
      marginTop: "15%",
      
    },
    des: {
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(1.75),
      color: theme.theme === "dark" ? "white" : "black",
      textAlign: "left",
      marginBottom: "10%",
      marginLeft: 15,
      marginTop: 0,
      // fontWeight:"bold"
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
    mapData: {
        flexDirection: "row",
                flexWrap: "wrap",
                width: "90%",
                alignSelf: "center",
                justifyContent: "space-between",
              
    },
    copyTxt: {
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(2.2),
      color: "#A279FA",
      textAlign: "center",
      marginLeft:5
    },
    copyView: {
      marginTop: "10%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
  });
