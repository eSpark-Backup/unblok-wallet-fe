import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  ToastAndroid,
  Pressable,
  ImageBackground,
  StatusBar,
} from "react-native";
import themeContext from "../../utils/themeContext";
import getRealm from "../../localDb/RealmConfig";
import Header from "../../Components/Header";
import { Fonts } from "../../utils/Fonts";
import { Images } from "../../utils/Images";
import { Colors } from "../../utils/Colors";
import { RadioButton } from "react-native-paper";
import { Icon as Icn, Button, Card } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import { RFPercentage } from "react-native-responsive-fontsize";
import Secret from "../../assets/img/secret-phrase.svg";
import Private from "../../assets/img/private-key.svg";
import isEmpty from "../../utils/isEmpty";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { setShowingType } from "../../Redux/Actions/walletNameEditAction";
import { useFocusEffect } from "@react-navigation/native";
const ShowWalletDetails = (props) => {
  //redux
  const selectedWalletNameDetails = useSelector(
    (state) => state.walletNameEditReducer.walletName
  );

  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);

  const [name, setName] = useState(selectedWalletNameDetails?.item?.walletname);
  const [walletName, setWalletName] = useState([]);
  const [nameErr, setNameErr] = useState(false);

  const dispatch = useDispatch()

  const setSelectedType = (item) => dispatch(setShowingType(item));

  useFocusEffect(
    useCallback(() => {
      setSelectedType("")
    }, [])
  )

  useEffect(() => {
    getWalletData();
  }, []);

  const getWalletData = () => {
    getRealm()
      .then((realm) => {
        var walletData = realm.objects("Wallet_array");

        var walletName = walletData.map((item, i) => {
          return item.walletname
        })
        setWalletName(walletName);
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.error(err, "wallet data list err from localDb");
      });
  };

  const editWalletName = () => {
    if (isEmpty(name)) return setNameErr(true);
    if (walletName.includes(name)) {
      return ToastAndroid.showWithGravityAndOffset(
        "Name Already Exists",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
    getRealm()
      .then((realm) => {
        var walletData = realm.objects("Wallet_array");

        realm.write(() => {
          walletData[selectedWalletNameDetails.selectedIndexForEditName].walletname = name
        })

        props.navigation.goBack();
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "editWalletName err from localDb");
      });
  };

  // const deleteWallet = () => {
  //   getRealm()
  //     .then((realm) => {
  //       var walletData = realm.objects("Wallet_array");
  //       console.log("walletData", JSON.stringify(walletData, null, 2));

  //       if (selectedWalletNameDetails.item.selected == "true") {

  //         var nxtWal = walletData[selectedWalletNameDetails.selectedIndexForEditName - 1]

  //         console.log("nxtWal", JSON.stringify(nxtWal, null, 2));

  //         realm.write(() => {
  //           nxtWal.selected = "true"
  //         })

  //       }

  //       realm.write(() => {
  //         realm.delete(walletData[selectedWalletNameDetails.selectedIndexForEditName]);
  //       })

  //       props.navigation.goBack();

  //       return () => {
  //         realm.close();
  //       };
  //     })
  //     .catch((err) => {
  //       console.log(err, "editWalletName err from localDb");
  //     });
  // };



  const navigateSecurityPage = async (item) => {
    try {
      getRealm()
        .then((realm) => {
          var passcodeVal = realm.objects("userPasscodeValue");
          var biometricVal = realm.objects("userBiometricStatus");
          console.log("passcodeVal", passcodeVal);
          if (passcodeVal.length == 0 && global.biometricStatus == 0) {
            props.navigation.navigate(item);
          } else if (
            ((global.passcodeStatus == 1 || global.passcodeStatus == 0)) &&
            global.biometricStatus != 0
          ) {
            global.bioPage = "EnterPasscode"
            props.navigation.push("CheckBiometric", item);
          } else if (passcodeVal.length == 1 || global.biometricStatus == 0) {
            props.navigation.navigate("EnterPasscode", item);
          }

        })
        .catch((err) => {
          console.log("errror on navigagtet", err);
        })


    } catch (error) {
      console.log("errror on navigatepage", error);
    }
  }


  return (
    <SafeAreaView style={style.container}>
      <ImageBackground
        source={theme.theme === "light" ? Images.backgroundWhite: Images.background}
        style={{
          width: windowWidth,
          height: windowheight,
          paddingTop: StatusBar.windowheight,
        }}
        resizeMode="cover"
      >
        <Header name={"Wallet"} leftImage={"back"} />
        <ScrollView>
          {/* {selectedWalletNameDetails.selectedIndexForEditName != 0 && (
          <TouchableOpacity
            onPress={() => {
              deleteWallet();
            }}
          >
            <View
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                marginHorizontal: 20,
                marginTop: 10,
                flexDirection: "row",
              }}
            >
              <Icn
                name="delete"
                type="MaterialCommunityIcons"
                color={"#FF0000"}
                size={25}
              />
              <Text
                style={{
                  marginStart: 10,
                  color: theme.text,
                  textAlign: "center",
                  fontFamily: Fonts.Bold,
                }}
              >
                Delete Wallet
              </Text>
            </View>
          </TouchableOpacity>
        )} */}
          <View style={style.viewStyle}>
            <View style={{ backgroundColor: "transparent", borderRadius: 10 }}>
              <TextInput
                // label="Name"
                value={name}
                error={nameErr}
                selectionColor={theme.text}
                placeholderTextColor={"#A279FA"}
                // mode="outlined"
                maxLength={25}
                onChangeText={(name) => {
                  setName(name);
                }}
                underlineColor="transparent"
                underlineColorAndroid="transparent"
                theme={{
                  colors: {
                    text: theme.text,
                    accent: theme.input,
                    primary: Colors.PRIMARY,
                    placeholder: "transparent",
                    background: "transparent",
                  },
                }}
                style={{
                  fontFamily: Fonts.Regular,
                  borderWidth: 1,
                  borderColor: theme.phrase1,
                  borderRadius: 5,
                  paddingLeft: 10,
                  color:  theme.theme == "light" ? "#fff" : "#fff",
                  height: windowWidth * 0.13,
                  fontSize: RFPercentage(1.85),
                  borderColor: "rgba(162, 121, 250, 0.30)",
                  borderRadius: 5,
                  borderWidth: 2,
                  backgroundColor:theme.theme==="dark"? "rgba(155, 124, 220, 0.10)":"#612CD2",
                }}
              />
            </View>
            {nameErr == true && name.length == 0 && (
              <Text style={{ color: "red" }}>Field Required</Text>
            )}
          </View>
          <View style={{ marginTop: 25, alignItems: "center" }}>
            <Pressable
              onPress={() => {
                editWalletName();
              }}
              style={{
                fontFamily: Fonts.Regular,
                borderWidth: 1,
                paddingVertical: 10,
                borderRadius: 5,
                width: "85%",
                justifyContent: "center",
                borderColor:theme.theme==="dark"?"white":"black",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: RFPercentage(2),
                  fontFamily: Fonts.Medium,
                  color:  theme.theme==="dark"?"white":"black",
                }}
              >
                Edit Wallet Name
              </Text>
            </Pressable>

            {/* <TouchableOpacity style={{
            borderRadius: 5,
            height: 45,
            width: "90%",
            alignSelf: "center",
            marginTop: 10,
            backgroundColor: "transparent",
            color: theme.buttonclr,
            alignItems: "center"
          }} onPress={()=>{editWalletName();}} >
            <Text style={{
              fontFamily: Fonts.Regular, color: theme.texttheme, fontSize: 16,
              borderWidth: 1, borderColor: theme.texttheme, borderRadius: 50, height: 45,
              width: 250,textAlign:"center"
            }}>Edit Wallet Name</Text>
          </TouchableOpacity> */}
          </View>

          {/* show pharse */}

          <View style={{ marginTop: 20 }}>
            {selectedWalletNameDetails.item.mnemonic != "" && (

              <TouchableOpacity
                onPress={() => {
                  if (global.passcodeStatus == 1) {
                    // props.navigation.navigate("EnterPrivateKey");
                    navigateSecurityPage("ShowWalletPhrase")
                  } else {
                    props.navigation.navigate("ShowWalletPhrase");
                  }
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    marginVetical: 10,
                    width:"85%",
                  alignSelf: "center",

                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    <Icn
                      name="content-copy"
                      type="MaterialIcons"
                      style={{
                        alignSelf: "center",
                        transform: [{ scaleX: -1 }],
                      }}
                      color="#A279FA"
                      size={22}
                    />
                    <Text
                      style={{
                        marginStart: 15,
                        color:  theme.theme==="dark"?"white":"black",
                        fontFamily: Fonts.Regular,
                        fontSize: RFPercentage(2),
                      }}
                    >
                      Show Secret Phrase
                    </Text>
                  </View>
                  <Icn
                    name="right"
                    type="antdesign"
                    color={ theme.theme==="dark"?"white":"black"}
                    size={20}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
          <Image
              style={{ width: "100%",}}
              source={require("../../assets/img/deviderPNG.png")}
              resizeMode="contain"
            />
          <View>
            <TouchableOpacity
              onPress={() => {
                if (global.passcodeStatus == 1) {
                  setSelectedType("ShowWalletPrivateKey")
                  // props.navigation.navigate("EnterPasscodePhrase");\
                  if (selectedWalletNameDetails.item.walletType == "MultiCoin") return navigateSecurityPage("SelectWalletforDetails");
                  else return navigateSecurityPage("ShowWalletPrivateKey");
                } else {
                  setSelectedType("ShowWalletPrivateKey")
                  if (selectedWalletNameDetails.item.walletType == "MultiCoin") return props.navigation.navigate("SelectWalletforDetails");
                  else return props.navigation.navigate("ShowWalletPrivateKey");
                }
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                  marginVetical: 20,
                  width:"85%",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                  }}
                >
                  {theme.theme == "light" ? (
                    <Private fill="#A279FA" />
                  ) : (
                    <Private fill="#A279FA" />
                  )}
                  <Text
                    style={{
                      marginStart: 15,
                      color:theme.theme==="dark"?"white":"black",
                      fontFamily: Fonts.Regular,
                      fontSize: RFPercentage(2),
                    }}
                  >
                    Show Private Key
                  </Text>
                </View>
                <Icn
                  name="right"
                  type="antdesign"
                  color={theme.theme==="dark"?"white":"black"}
                  size={20}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default ShowWalletDetails;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    seperatorLine: {
      height: 1,
      backgroundColor: "black",
    },
    viewStyle: {
      width:"85%",
      alignSelf: "center",
      marginTop: "5%",
      borderRadius: 10,
    },
    continueBtn: {
      borderRadius: 5,
      height: 45,
      width: "90%",
      alignSelf: "center",
      marginTop: 20,
      backgroundColor: "transparent",
      color: theme.buttonclr,
      marginLeft: 20,
    },
    phrasebtn: {
      width: "90%",
      alignSelf: "center",
      backgroundColor: theme.text,
      borderColor: "#707070",
      borderWidth: 0.2,
      elevation: 5,
      bottom: 10,
      justifyContent: "center",
      borderRadius: 10,
    },
  });
