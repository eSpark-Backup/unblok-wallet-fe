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
import getRealm from "../../localDb/RealmConfig";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { addScanDetails } from "../../Redux/Actions/scanDetailsAction";
import LinearGradient from 'react-native-linear-gradient';
import { seedimportPrivKey } from "./common/Import_WithPrivateKey";
import isEmpty from "../../utils/isEmpty";
import { AES, enc } from 'react-native-crypto-js';
import { TouchableOpacity } from "react-native";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Toastfn } from "../../utils/toast";

const ImportWithPrivateKey2 = (props) => {
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [name, setName] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [privateMsg, setPrivateMsg] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [privateKeyErr, setPrivateKeyErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletArr, setWalletArr] = useState([])
  const [addressArr, setAdressArr] = useState([])
  const [nameArr, setNameArr] = useState([])

  useEffect(() => {
    setScanDetails("");
  }, []);
  const dispatch = useDispatch();
  const setScanDetails = (item) => dispatch(addScanDetails(item));

  const scanDetailFromRedux = useSelector(
    (state) => state.scanDataReducer.scanData
  );

  const fetchCopiedText2 = async () => {
    const text = await Clipboard.getString();
    setPrivateKey(text);
  };

  useEffect(() => {
    if (name.length == 0) {
      setNameErr(true);
    } else {
      setNameErr(false);
    }
  }, [name]);

  useEffect(() => {
    if (privateKey.length != 0) {
      setPrivateKeyErr(false);
    }
  }, [privateKey]);

  var QRcodeAddress = scanDetailFromRedux;

  useFocusEffect(
    React.useCallback(() => {
      // Add Event Listener for hardwareBackPress

      setPrivateKey(QRcodeAddress);
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
        console.log("walletData", walletData);
        setName("Wallet " + (walletData.length + 1));
        setWalletArr(walletData)
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

  const seedvalidateUsingPrivateKey = async () => {
    if (isEmpty(name)) {
      return Toastfn("Wallet name can't be empty")
    }
    setLoading(true);
    if (privateKey == "") {
      setPrivateMsg("Field Required")
      setPrivateKeyErr(true);
    }
    if (privateKey != "" && name != "") {
      var privKey = AES.encrypt(privateKey.trim().toString(), ApiConstants.secretOrKey).toString()

      let params = {
        currency: props.route.params.currencyParam,
        tokenType: props.route.params.tokenType,
        privateKey: privKey,
        deviceId: global.deviceId,
        singlecoin: "single-coin",
        walletname: name,
        mailAddress: global.mailAddress
      };
      seedimportPrivKey(params)
        .then((res) => {
          setLoading(false);
          var resd = res.data.data
          if (res.data.status) {
            // var checkAdd = addressArr.includes(resd.wallets[0].walletaddress);
            var checkname = nameArr.includes(resd.walletname);
            console.log("resd", JSON.stringify(resd, null, 2));
            var checkVal = walletArr.map((val) => {
              return val.wallets.map((item) => {
                return (item.walletaddress.toLowerCase() === resd.wallets[0].walletaddress.toLowerCase() &&
                  item.currency.toLowerCase() === resd.wallets[0].currency.toLowerCase()
                ) ? true : false
              })
            })
            var checkAdd = checkVal.flat().includes(true)
            if (checkAdd) {
              return Toastfn("Wallet Already Exist")
            }
            if (checkname) {
              return Toastfn("Please enter new Wallet Name")
            }

            dispatch({
              type: "Session",
              data: {
                Type_Emit: 'accountsChanged',
                Address : resd.wallets[0].walletaddress,
                chain : 56
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
            setPrivateMsg("Invalid Private Key")
            setPrivateKeyErr(true);
            // Toastfn("Invalid Private Key")
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log("seedimportprivatekey err", err);
        });
    } else {
      setLoading(false);
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
            error={nameErr}
            selectionColor={theme.text}
            placeholderTextColor={theme.theme == "light" ? "gray" : "gray"}
            maxLength={25}
            placeholder="Name"
            underlineColor="transparent"
            underlineColorAndroid='transparent'
            placeholderStyle={{ fontFamily: Fonts.Regular, paddingLeft: 10 ,color:"gray" }}
            // mode="outlined"
            onChangeText={(name) => {
              setName(name);
            }}
            style={{   borderWidth: 1, borderColor: theme.search, borderRadius: 5, fontFamily: Fonts.Regular
              , paddingLeft: 10, color: theme.theme==="dark"?"white":"black",
              borderColor:"rgba(162, 121, 250, 0.30)",
              borderWidth:2,
              backgroundColor:"rgba(155, 124, 220, 0.15)" }}
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
          <TouchableWithoutFeedback onPress={fetchCopiedText2}>
            <Text style={style.paste}>PASTE</Text>
          </TouchableWithoutFeedback>
          <TextInput
            // label="Private Key"
            value={privateKey}
            error={privateKeyErr}
            placeholder="Private Key"
            placeholderTextColor={theme.theme == "light" ? "gray" : "gray"}
            multiline
            numberOfLines={2}
            selectionColor={theme.text}
            // mode="outlined"
            underlineColor="transparent"
            underlineColorAndroid='transparent'
            placeholderStyle={{ fontFamily: Fonts.Regular, paddingLeft: 10 ,color:"gray" }}
            onChangeText={(privateKey) => {
              setPrivateKey(privateKey);
            }}
            style={{ borderWidth: 1, borderColor: theme.search, borderRadius: 5, fontFamily: Fonts.Regular
              , paddingLeft: 10, color: theme.theme==="dark"?"white":"black",
              borderColor:"rgba(162, 121, 250, 0.30)",
              borderWidth:2,
              backgroundColor:"rgba(155, 124, 220, 0.15)"}}
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

          {privateKeyErr == true && (
            <Text style={style.invalidPhraseTxt}>{privateMsg}</Text>
          )}
        </View>
        <Text style={style.des}>Typically 64 alphanumeric characters.</Text>
        {privateKey != "" ? loading == false ? (
          <TouchableOpacity style={style.createBtn}
            onPress={() => {
              setLoading(true)
              setTimeout(() => {
                seedvalidateUsingPrivateKey();
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
      </ScrollView>
      {/* </LinearGradient> */}
    </SafeAreaView>
  );
};

export default ImportWithPrivateKey2;

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
      marginBottom: 10
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
