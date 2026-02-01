import React, { useEffect, useContext, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  StyleSheet,
  ToastAndroid,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  StatusBar
} from "react-native";
import themeContext from "../../utils/themeContext";
import { Button, colors } from "react-native-elements";
import Header from "../../Components/Header";
import { Fonts } from "../../utils/Fonts";
import ApiClient from "../../api/ApiClient";
import { ApiConstants } from "../../api/ApiConstants";
import Clipboard from "@react-native-community/clipboard";
import { Colors } from "../../utils/Colors";
// import { TextInput } from "react-native-paper";
import isEmpty from "../../utils/isEmpty";
import getRealm from "../../localDb/RealmConfig";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { addScanDetails } from "../../Redux/Actions/scanDetailsAction";
import LinearGradient from 'react-native-linear-gradient';
import { seedimportmulicoin } from './common/Import_MultiCoinWallet'
import { AES, enc } from 'react-native-crypto-js';
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Images } from "../../utils/Images";

const ImportMultiCoinWallet = (props) => {
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [name, setName] = useState("");
  const [phrase, setPhrase] = useState("");
  const [phraseErr, setPhraseErr] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setPhrase(text);
  };

  useEffect(() => {
    setScanDetails("");
  }, []);
  const dispatch = useDispatch();
  const setScanDetails = (item) => dispatch(addScanDetails(item));

  const scanDetailFromRedux = useSelector(
    (state) => state.scanDataReducer.scanData
  );

  var QRcodeAddress = scanDetailFromRedux;
  useFocusEffect(
    React.useCallback(() => {
      // Add Event Listener for hardwareBackPress

      setPhrase(QRcodeAddress);
      return () => {
        // Once the Screen gets blur Remove Event Listener
      };
    }, [QRcodeAddress])
  );

  useEffect(() => {
    getWalletData();
  }, []);

  const getWalletData = () => {
    getRealm()
      .then((realm) => {
        var walletData = realm.objects("Wallet_array");
        setName("Multi-Coin Wallet " + (walletData.length + 1));
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "wallet data list err from localDb");
      });
  };

  useEffect(() => {
    if (phrase &&
      (!isEmpty(phrase) && phrase?.match(/(\w+)/g)?.length == 12) ||
      phrase.length == 0
    ) {
      setPhraseErr(false);
    } else {
      setPhraseErr(true);
    }
  }, [phrase]);

  useEffect(() => {
    if (name.length == 0) {
      setNameErr(true);
    } else {
      setNameErr(false);
    }
  }, [name]);

  // console.log("phrase.toString().trim()",phrase.trim().toString());

  const seedvalidateMultiCoin = async () => {
    setLoading(true);
    if (!isEmpty(phrase) && phrase.match(/(\w+)/g).length == 12) {
      var Mnemonic = AES.encrypt(phrase.trim().toString(), ApiConstants.secretOrKey).toString()

      let params = {
        seed: Mnemonic,
        multicoin: "multi-coin",
        walletname: name,
        deviceId: global.deviceId,
        mailAddress: global.mailAddress
      };
      await seedimportmulicoin(params)
        .then((res) => {
          setLoading(false);
          if (res.data.status == true) {
            getRealm()
              .then((realm) => {
                let walletData;

                realm.write(() => {
                  walletData = realm.create("Wallet_array", { ...res.data.data });
                });
                global.newWallet = "import"
                props.navigation.navigate("WalletHome");
              })
              .catch((err) => {
                setLoading(false);
                console.log("Wallet_array localDb err", err);
              });
          } else {
            //console.log('seedvalidation multi coin res', res);
            ToastAndroid.showWithGravityAndOffset(
              "Invalid Phrase",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log("seedvalidateMultiCoin err", err);
        });
    } else {
      setLoading(false);
      setPhraseErr(true);
    }
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
        name={"Import Multi-Coin Wallet"}
        leftImage={"back"}
      />
      <ScrollView>
        <View style={style.viewStyle}>
          <TextInput
            placeholder="Name"
            placeholderTextColor={theme.theme == "light" ? "gray" : "gray"}
            value={name}
            error={nameErr}
            selectionColor={theme.text}
            multiline
            maxLength={25}
            numberOfLines={2}
            underlineColor="transparent"
            underlineColorAndroid='transparent'
            placeholderStyle={{ fontFamily: Fonts.Regular, paddingLeft: 10 ,color:"gray" }}

            onChangeText={(name) => {
              setName(name);
            }}
            style={{
              borderWidth: 1, borderColor: theme.search, borderRadius: 5, fontFamily: Fonts.Regular
              , paddingLeft: 10, color: theme.theme==="dark"?"white":"black",
              borderColor:"rgba(162, 121, 250, 0.30)",
              borderWidth:2,
              backgroundColor:"rgba(155, 124, 220, 0.15)"

            }}
            theme={{
              colors: {
                text: theme.theme == "light" ? "#000" : "#fff",
                accent: "transparent",
                primary: "transparent",
                placeholder: "grey",
                background: "transparent",
              },
            }}
          />
          {nameErr == true && name.length == 0 && (
            <Text style={style.invalidPhraseTxt}>Field Required</Text>
          )}
        </View>

        <View style={style.viewStyle2}>

          <TextInput
            placeholder="Phrase"
            placeholderTextColor={theme.theme == "light" ? "gray" : "gray"}
            value={phrase}
            multiline
            selectionColor={theme.text}
            numberOfLines={2}
            underlineColor="transparent"
            underlineColorAndroid='transparent'
            error={phraseErr}
            placeholderStyle={{ fontFamily: Fonts.Regular, paddingLeft: 10 }}
            style={{
              borderWidth: 1, borderColor: theme.search, borderRadius: 5, fontFamily: Fonts.Regular,
              fontWeight: "normal", paddingLeft: 10, color: theme.theme==="dark"?"white":"black",
              borderColor:"rgba(162, 121, 250, 0.30)",
              borderWidth:2,
              backgroundColor:"rgba(155, 124, 220, 0.15)"
            }}
            onChangeText={(phrase) => {
              setPhrase(phrase);
            }}
            theme={{
              colors: {
                text: theme.theme == "light" ? "#000" : "#fff",
                accent: "transparent",
                primary: "transparent",
                placeholder: "rgba(0,0,0,0.5)",
                background: "transparent",
              },
            }}
          />
          <TouchableWithoutFeedback onPress={fetchCopiedText}>
            <Text style={[style.paste, { marginTop: 10 }]}>PASTE</Text>
          </TouchableWithoutFeedback>
          {phraseErr == true && phrase.length != 0 && (
            <Text style={style.invalidPhraseTxt}>Invalid Phrase</Text>
          )}
          {phraseErr == true && phrase.length == 0 && (
            <Text style={style.invalidPhraseTxt}>Field Required</Text>
          )}
        </View>
        <Text style={style.des}>
          Typically 12 words separated by single spaces.
        </Text>

        {phrase != "" &&
          <TouchableOpacity style={style.createBtn}
            onPress={() => {
              setLoading(true)
              setTimeout(() => {
                seedvalidateMultiCoin();
              }, 1500)
            }}
          >
            {!loading ?
              <Text style={{
                textAlign: "center",
                fontSize: RFPercentage(2),
                fontFamily: Fonts.Regular,
                color: theme.theme==="dark"?"black":"white",
              }}>Import</Text> :
              <ActivityIndicator size="small" color={theme.theme == "dark" ? "#000" : "#fff"} />}

          </TouchableOpacity>}


      </ScrollView>
     </ImageBackground>
    </SafeAreaView>
  );
};

export default ImportMultiCoinWallet;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    continueBtn: {
      borderRadius: 5,
      height: 45,
      width: "90%",
      alignSelf: "center",
      backgroundColor: "transparent",
      color: theme.buttonclr
    },
    createBtn: {
      width: "80%",
      backgroundColor:theme.theme==="dark"? "#FFF600":"#612CD2",
      color: "#000",
      height: 50,
      alignSelf: "center",
      marginTop: "10%",
      borderWidth: 1,
      borderColor: "rgba(162, 121, 250, 0.30)", borderRadius: 5,
      justifyContent: "center"

    },
    des: {
      fontFamily: Fonts.Regular,
      fontSize: 14,
      textAlign: "center",
      marginTop: "5%",
      color: theme.theme == "light" ? "#000" : "#fff",
    },
    paste: {
      fontFamily: Fonts.Bold,
      fontSize: 14,
      color: theme.search,
      alignSelf: "flex-end",
      color: theme.theme == "light" ? "#000" : "#fff",
    },
    invalidPhraseTxt: {
      fontFamily: Fonts.Medium,
      fontSize: 12,
      color: "red",
      alignSelf: "flex-start",
    },
    viewStyle: {
      marginHorizontal: 20,
      marginTop: "6%",
    },
    viewStyle2: {
      marginHorizontal: 20,
      marginTop: "5%",
    },
  });
