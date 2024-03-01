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
  ActivityIndicator,
  ImageBackground,
  StatusBar,
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
import { useFocusEffect } from "@react-navigation/native";
import { addScanDetails } from "../../Redux/Actions/scanDetailsAction";
import LinearGradient from "react-native-linear-gradient";
import { seedimportmulicoin } from "./common/Import_MultiCoinWallet";
import { AES, enc } from "react-native-crypto-js";
import { TouchableOpacity } from "react-native";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Images } from "../../utils/Images";

const ImportMultiCoinAfterCreate = (props) => {
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [name, setName] = useState("");
  const [phrase, setPhrase] = useState("");
  const [phraseErr, setPhraseErr] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletDetails, setWalletDetails] = useState([]);
  const [addressArr, setAdressArr] = useState([]);
  const [nameArr, setNameArr] = useState([]);

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

        // console.log("walletDatammmmm", JSON.stringify(walletData, null, 2));
        var walletAddressArr = []
        var walletName = []
        walletData.map((val) => {
          walletName.push(val.walletname)
          val.wallets.map((item) => {
            walletAddressArr.push(item.walletaddress)
          })
        })
        setAdressArr(walletAddressArr);
        setNameArr(walletName)
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "wallet data list err from localDb");
      });
  };

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

  const seedvalidateMultiCoin = async () => {
    if (isEmpty(name)) {
      return ToastAndroid.showWithGravityAndOffset(
        "Wallet name can't be empty",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
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
      // console.log("params",params);
      seedimportmulicoin(params)
        .then((res) => {
          setLoading(false);
          if (res.data.status == true) {
            var resd = res.data.data
            var checkAdd = addressArr.includes(resd.wallets[0].walletaddress);
            var checkname = nameArr.includes(resd.walletname);
            // console.log("resd",JSON.stringify(resd,null,2));
            if (checkAdd == true) {
              return ToastAndroid.showWithGravityAndOffset(
                "Wallet Already Exist",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );
            }
            if (checkname == true) {
              return ToastAndroid.showWithGravityAndOffset(
                "Please enter new Wallet Name",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );
            }

            dispatch({
              type: "Session",
              data: {
                Type_Emit: 'accountsChanged',
                Address: resd.wallets[0].walletaddress,
                chain: 56
              },
            });

            getRealm()
              .then((realm) => {
                let walletData;

                var prevWalletData = realm.objects("Wallet_array");

                var arr = prevWalletData.filter((item, index) => {
                  return item.selected == "true"
                });

                realm.write(() => {
                  arr[0].selected = "false"
                })

                realm.write(() => {
                  walletData = realm.create("Wallet_array", { ...res.data.data });
                });
                global.newWallet = "import"
                props.navigation.navigate("DappBottomTab");
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
        <Header name={"Import Multi-Coin Wallet"} leftImage={"back"} />
        <ScrollView>
          <View style={style.viewStyle}>
            <TextInput
              // label="Name"
              placeholder="Name"
              value={name}
              error={nameErr}
              selectionColor={theme.text}
              underlineColor="transparent"
              placeholderStyle={{ fontFamily: Fonts.Regular }}
              placeholderTextColor={theme.theme == "light" ? "gray" : "gray"}
              maxLength={25}
              // mode="outlined"
              onChangeText={(name) => {
                setName(name);
              }}
              theme={{
                colors: {
                  text: theme.theme == "light" ? "#000" : "#fff",
                  accent: "transparent",
                  primary: "transparent",
                  placeholder: "#000",
                  background: "transparent",
                },
              }}
              style={{
                fontFamily: Fonts.Regular,
                borderWidth: 1,
                borderColor: theme.search,
                borderRadius: 5,
                paddingLeft: 10,
                color: theme.theme === "dark" ? "white" : "black",
                borderColor: "rgba(162, 121, 250, 0.30)",
                borderWidth: 2,
                backgroundColor: "rgba(155, 124, 220, 0.15)",
              }}
            />
            {nameErr == true && name.length == 0 && (
              <Text style={style.invalidPhraseTxt}>Field Required</Text>
            )}
          </View>

          <View style={style.viewStyle2}>
            <TextInput
              // label="Phrase"
              placeholder="Phrase"
              placeholderTextColor={theme.theme == "light" ? "gray" : "gray"}
              placeholderStyle={{ fontFamily: Fonts.Regular }}
              style={{
                borderWidth: 1,
                borderColor: theme.search,
                borderRadius: 5,
                fontFamily: Fonts.Regular,
                paddingLeft: 10,
                color: theme.theme==="dark"?"white":"black",
                borderColor:"rgba(162, 121, 250, 0.30)",
                borderWidth:2,
                backgroundColor:"rgba(155, 124, 220, 0.15)"
              }}
              selectionColor={theme.text}
              underlineColor="transparent"
              value={phrase}
              multiline={true}
              // mode="outlined"
              error={phraseErr}
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
              // style={{fontFamily:Fonts.Bold}}
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
          <>
            <Text style={style.des}>
              Typically 12 words separated by single spaces.
            </Text>
          </>

          {phrase != "" && (
            <TouchableOpacity
              style={style.createBtn}
              onPress={() => {
                setLoading(true);
                setTimeout(() => {
                  seedvalidateMultiCoin();
                }, 1500);
              }}
            >
              {!loading ? (
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: RFPercentage(2),
                    fontFamily: Fonts.Regular,
                    color: theme.texttheme,
                  }}
                >
                  Import
                </Text>
              ) : (
                <ActivityIndicator
                  size="small"
                  color={theme.theme == "light" ? "#000" : "#fff"}
                />
              )}
            </TouchableOpacity>
          )}
          {/* {phrase != "" ? loading == false ? (
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
              fontFamily: Fonts.Regular, color: theme.texttheme,
              borderWidth: 1,
              borderColor: theme.texttheme, borderRadius: windowWidth * 0.08, fontSize: RFPercentage(2), padding: windowheight * 0.020
            }}>Import</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={style.createBtn}
          >
            <Text style={{
              textAlign: "center",
              display: "flex",
              width: "100%",
              fontFamily: Fonts.Regular, color: theme.texttheme,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: theme.texttheme, borderRadius: windowWidth * 0.08, fontSize: RFPercentage(2), padding: windowheight * 0.020
            }}>
              <ActivityIndicator size="small" color={theme.theme == "light" ? "#000" : "#fff"} />
            </Text>
          </TouchableOpacity>

        ) : (<></>)} */}

          {/* {phrase &&
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
              fontFamily: Fonts.Regular, color: theme.texttheme,
              borderWidth: 1,
              borderColor: theme.texttheme, borderRadius: windowWidth * 0.08, fontSize: RFPercentage(2), padding: windowheight * 0.020
            }}>Import</Text>
          </TouchableOpacity>
          } */}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ImportMultiCoinAfterCreate;

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
      // marginTop: 20,
      backgroundColor: "transparent",
      color: theme.buttonclr,
    },
    des: {
      fontFamily: Fonts.Regular,
      fontSize: 14,
      textAlign: "center",
      marginTop: "5%",
      color: theme.theme == "light" ? "#000" : "#fff",
    },
    createBtn: {
      width: "50%",
      backgroundColor: "transparent",
      color: "#000",
      height: 55,
      alignSelf: "center",
      marginTop: "10%",
      borderWidth: 1,
      borderColor: theme.texttheme,
      borderRadius: windowWidth * 0.08,
      justifyContent: "center",
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
