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
  ActivityIndicator
} from "react-native";
import themeContext from "../../utils/themeContext";
import { Button } from "react-native-elements";
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
import { addScanDetails } from "../../Redux/Actions/scanDetailsAction";
import { useFocusEffect } from "@react-navigation/native";
import LinearGradient from 'react-native-linear-gradient';
import { seedimport } from './common/Import_WithPharse'
import { AES, enc } from 'react-native-crypto-js';
import { TouchableOpacity } from "react-native";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";

const ImportWithPharse = (props) => {
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [name, setName] = useState("");
  const [phrase, setPhrase] = useState("");
  const [phraseErr, setPhraseErr] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletDetails, setWalletDetails] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [saveSelectedWalletIndexState, setSaveSelectedWalletIndex] =
    useState(0);

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
    if (
      (!isEmpty(phrase) && phrase.match(/(\w+)/g).length == 12) ||
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

  useEffect(() => {
    getWalletData();
  }, []);

  const getWalletData = () => {
    getRealm()
      .then((realm) => {
        var walletData = realm.objects("Wallet_array");
        console.log("walletData", walletData);
        setName("Wallet " + (walletData.length + 1));
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "wallet data list err from localDb");
      });
  };

  const seedvalidateMultiCoin = async () => {
    setLoading(true);
    if (!isEmpty(phrase) && phrase.match(/(\w+)/g).length == 12) {
      var Mnemonic = AES.encrypt(phrase.trim().toString(), ApiConstants.secretOrKey).toString()

      let params = {
        currency: props.route.params.currencyParam,
        tokenType: props.route.params.tokenType,
        seed: Mnemonic,
        singlecoin: "single-coin",
        walletname: name,
        deviceId: global.deviceId,
        mailAddress: global.mailAddress
      };
      await seedimport(params)
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
      {/* <LinearGradient colors={theme.theme == 'light' ? ['#fff', '#fff'] : ['#151918', '#171515']}
        useAngle={true}
        angle={170}
        style={{ width: "100%", height: "100%" }}
      > */}
      <ScrollView>
        <View style={style.viewStyle}>
          <TextInput
            // label="Name"
            value={name}
            placeholder="Name"
            placeholderTextColor={theme.theme == "light" ? "gray" : "gray"}
            error={nameErr}
            selectionColor={theme.text}
underline="transparent"
            underlineColorAndroid='transparent'

            onChangeText={(name) => {
              setName(name);
            }}
            style={{
              borderRadius: 5, fontFamily: Fonts.Regular
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
          <TouchableWithoutFeedback onPress={fetchCopiedText}>
            <Text style={style.paste}>PASTE</Text>
          </TouchableWithoutFeedback>
          <TextInput
            // label="Phrase"
            value={phrase}
            // mode="outlined"
            multiline
            numberOfLines={2}
            placeholder="Phrase"
            placeholderTextColor={theme.theme == "light" ? "gray" : "gray"}
            underlineColor="transparent"
            underlineColorAndroid='transparent'
            selectionColor={theme.text}
            error={phraseErr}
            style={{
               borderRadius: 5, fontFamily: Fonts.Regular
              , paddingLeft: 10, color: theme.theme==="dark"?"white":"black",
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
                placeholder: "grey",
                background: "transparent",
              },
            }}
          />
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
        {phrase != "" ? loading == false ? (
          <TouchableOpacity style={style.createBtn}
            onPress={() => {
              setLoading(true)
              setTimeout(() => {
                seedvalidateMultiCoin();
              }, 1500)
            }}
          >
            <Text style={{
              textAlign: "center",
              fontSize: RFPercentage(2),
              fontFamily: Fonts.Regular,
              color: theme.theme==="dark"?"black":"white",
            }}>Import</Text>
          </TouchableOpacity>

          // <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 }}>


          //   <Button
          //     title="Import"
          //     buttonStyle={style.continueBtn}
          //     titleStyle={{
          //       fontFamily: Fonts.Regular, color: theme.theme == "light" ? "#000" : "#fff", fontSize: 16,
          //       borderWidth: 1, borderColor: theme.theme == "light" ? "#000" : "#fff", borderRadius: 50, height: 45, lineHeight: 40,
          //       width: 250
          //     }}
          //     onPress={() => {
          //       seedvalidateUsingPrivateKey();
          //     }}
          //   />
          // </View>
        ) : (
          <TouchableOpacity style={style.createBtn}
          >
            <Text style={{
             textAlign: "center",
             fontSize: RFPercentage(2),
             fontFamily: Fonts.Regular,
             color: theme.theme==="dark"?"black":"white",
            }}>
              <ActivityIndicator size="small" color={theme.theme == "dark" ? "#000" : "#fff"} />
            </Text>
          </TouchableOpacity>

          // <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
          //   <Button
          //     title="Import"
          //     loading
          //     buttonStyle={style.continueBtn}
          //     titleStyle={{
          //       fontFamily: Fonts.Regular, color: theme.theme == "light" ? "#000" : "#fff", fontSize: 16,
          //       borderWidth: 1, borderColor: theme.theme == "light" ? "#000" : "#fff", borderRadius: 50, height: 45, lineHeight: 40,
          //       width: 250
          //     }}
          //   />
          // </View>
        ) : (<></>)}
        {/* {phrase != "" ? loading == false ? (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
              <Button
                title="Import"
                buttonStyle={style.continueBtn}
                titleStyle={{
                  fontFamily: Fonts.Regular, color:theme.texttheme, fontSize: 16,
                  borderWidth: 1, borderColor:theme.texttheme, borderRadius: 50, height: 45, lineHeight: 40,
                  width: 250
                }}
                onPress={() => {
                  seedvalidateMultiCoin();
                }}
              />
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 }}>

              <Button
                title="Import"
                loading
                buttonStyle={style.continueBtn}
                titleStyle={{
                  fontFamily: Fonts.Regular, color:theme.texttheme, fontSize: 16,
                  borderWidth: 1, borderColor:theme.texttheme, borderRadius: 50, height: 45, lineHeight: 40,
                  width: 250
                }}
              />
            </View>
          ):(<></>)} */}
      </ScrollView>
      {/* </LinearGradient> */}
    </SafeAreaView>
  );
};

export default ImportWithPharse;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      paddingTop:"10%"
    },
    continueBtn: {
      borderRadius: 5,
      height: 45,
      width: "90%",
      alignSelf: "center",
      // marginTop: 20,
      backgroundColor: "transparent",
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
      fontSize: 16,
      textAlign: "center",
      marginTop: "5%",
      color: theme.theme == "light" ? "#000" : "#fff",
    },
    paste: {
      fontFamily: Fonts.Bold,
      fontSize: 14,
      color: theme.theme == "light" ? "#000" : "#fff",
      alignSelf: "flex-end",
    },
    invalidPhraseTxt: {
      fontFamily: Fonts.Medium,
      fontSize: 12,
      color: "red",
      alignSelf: "flex-start",
    },
    viewStyle: {
      // marginHorizontal: 20,
      marginTop: "2%",
    },
    viewStyle2: {
      // marginHorizontal: 20,
      marginTop: "5%",
    },
  });
