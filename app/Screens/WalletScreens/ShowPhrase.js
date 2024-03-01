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
  Image
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
import { Searchbar } from "react-native-paper";
import { RFPercentage } from "react-native-responsive-fontsize";
const CopyWalletPharse = (props) => {
  //redux
  const dispatch = useDispatch();
  const setSeedDataRedux = (item) => dispatch(addSeedData(item));

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
    ApiClient.post(ApiConstants.seedgenerate)
      .then((res) => {
        const seedList = res.data.data;
        seedCopyFunc(res.data.data);
        const seedListArr = seedList.split(" ");
        seedListArrFunc(seedListArr);
        const tempList = seedListArr.map((str, index) => ({
          value: str,
          id: index + 1,
          checked: false,
        }));
        seedListArray(tempList);
        Clipboard.setString(seedList);
        setQrData(seedList.toString());
      })
      .catch((err) => {
        console.log("seed generate err", err);
      });
  };

  /**
   * add item for dynamic interests
   */
  const Item = ({ item, onPress, textColor, backgroundColor,borderWidth,borderColor ,borderRadius}) => (
    <TouchableHighlight
      onPress={onPress}
      style={{
        backgroundColor: backgroundColor,
        borderColor:theme.phrase,
        borderWidth: 1,
        marginRight: 10,
        marginTop: 12,
        alignItems: "center",
        borderStyle: "solid",
        paddingHorizontal: 12,
        borderRadius: 5,
        paddingVertical: 6,
      }}
    >
      <Text
        style={{
          paddingHorizontal: 5,
          color: textColor,
          fontSize: RFPercentage(2),
          fontFamily: Fonts.Regular,
          textTransform:"capitalize"
        }}
      >
        {item}
      </Text>
    </TouchableHighlight>
  );

  /**
   * map interests in the array
   */
  const mapData = () => {
    return seedListArr.map((item, index) => {
      const backgroundColor = "transparent";
      const color = theme.text;
      const borderWidth = 1;
      const borderColor = theme.search;
      const borderRadius = 30;
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
 
           <Header name={"Wallet send"} leftImage={"back"} />
           <View style={{marginHorizontal:20}}>
           <Text style={{fontFamily:Fonts.Regular,fontSize:16,marginBottom:20,
                marginTop:20,
                color:"#000"}}>Name</Text>
           <Searchbar
                placeholder="Main-Wallet"
                style={style.custsearch}
                backgroundColor={"transparent"}
                iconColor={theme.search}
                inputStyle={{color: theme.text,fontFamily:Fonts.Regular,fontSize:RFPercentage(2)}}
                placeholderTextColor={theme.search}
            /> 
            </View>
      <ScrollView>
        {/* <View style={style.mainView} /> */}
        <View style={{ marginTop: "4%" }}>
          <View style={{ marginHorizontal: 4 }}>
            {/* <Text style={style.pharseTxt}>Your Secret Phrase</Text> */}
          </View>
          <View style={style.mapData}>{mapData()}</View>
        </View>
      
      </ScrollView>
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
      fontSize: 13,
      color: theme.text,
      textAlign: "center",
      borderBottomColor:theme.text,
      borderBottomWidth:1,
      width:75,
      marginBottom:20
    },
    continueBtn: {
      borderRadius: 40,
      width: 175,
      height:50,
      alignSelf: "center",
      backgroundColor: "transparent",
      color:"#00B0FF",
      paddingVertical:10,
      borderWidth:1,
      borderColor:"#00B0FF",
      marginBottom:15
    },
    copyTxt: {
      fontFamily: Fonts.Regular,
      fontSize: 13,
      color: theme.text,
      textAlign: "center",
      marginLeft:8
    },
    copyView: {
      marginTop: "5%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    mapData: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginHorizontal: 20,
    },
    des: {
      fontFamily: Fonts.Regular,
      fontSize: 14,
      color: theme.text,
      textAlign: "left",
      marginBottom:15,
      marginLeft:15,
      marginTop:0
    },
    pharseTxt: {
      fontFamily: Fonts.Regular,
      fontSize: 20,
      color: theme.text,
      textAlign: "center",
    },
    mainView: {
      backgroundColor: theme.blackandwhite,
      height: 60,
    },
    custsearch: {
        borderRadius:10,
        backgroundColor:theme.background,
        borderColor:theme.phrase1,
        borderWidth:1,
        margin:15,
        elevation:0,
        fontFamily:Fonts.Bold,
        color:theme.text
      },
  });
