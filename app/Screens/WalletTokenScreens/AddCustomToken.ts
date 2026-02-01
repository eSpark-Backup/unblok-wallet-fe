import React, { useContext, useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ToastAndroid,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Pressable,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import themeContext from "../../utils/themeContext";
import { Fonts } from "../../utils/Fonts";
import getRealm from "../../localDb/RealmConfig";
import { Colors } from "../../utils/Colors";
import ApiClient from "../../api/ApiClient";
// import { TextInput } from "react-native-paper";
import { ApiConstants } from "../../api/ApiConstants";
import { Icon as Icn, Card, Button } from "react-native-elements";
import Header from "../../Components/Header";
import Clipboard from "@react-native-community/clipboard";
import RBSheet from "react-native-raw-bottom-sheet";
import { Images } from "../../utils/Images";
import LinearGradient from "react-native-linear-gradient";
import TokenClient from "../../api/TokenClient";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
  customToken_add,
  custom_token_fetch_func,
  enable_Coin_func,
  enable_coin_priv_func,
  network_listFunc,
} from "./common/Add_CustomToken";
import { useSelector } from "react-redux";
import isEmpty from "../../utils/isEmpty";
import { showImage } from "../../utils/showImage";
import { ImageBackground } from "react-native";
import { windowWidth, windowheight } from "../../utils/Dimensions";
const AddCustomToken = (props) => {
  //theme config

  // console.log("contractAddress",contractAddress);
  const selectedCurrencyFromRedux = useSelector(
    (state) => state.allCurrrencyReducer.Allcurrency
  );

  const ToknListFromRedux = useSelector(
    (state) => state.tokenListReducer.tokenList
  );
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [contractAddress, setContractAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [decimals, setDecimals] = useState("");
  const [tokenArr, setTokenArr] = useState([]);
  const [networkList, setNetworkList] = useState([]);
  const [load, setLoad] = useState(false);
  const [networkType, setNetworkType] = useState(
    selectedCurrencyFromRedux?.walletType == "SingleCoin"
      ? selectedCurrencyFromRedux?.wallets[0].tokenType
      : "ERC20"
  );
  const [netWorkName, setNetWorkName] = useState(
    selectedCurrencyFromRedux?.walletType == "SingleCoin"
      ? selectedCurrencyFromRedux?.wallets[0].currencyName
      : "Ethereum"
  );

  // console.log("selectedCurrencyFromRedux", JSON.stringify(selectedCurrencyFromRedux, null, 2));
  const refRBSheet = useRef();

  useEffect(() => {
    network_list_func();
    setTokenArr(ToknListFromRedux);
  }, []);

  useEffect(() => {
    if (contractAddress.length >= 42) customTokenFetchApi(contractAddress)
  }, [contractAddress])

  useEffect(() => {
    if (!isEmpty(contractAddress)) customTokenFetchApi()
  }, [networkType])

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setContractAddress(text);
    // customTokenFetchApi(text);
  };


  // console.log("selectedCurrencyFromRedux", JSON.stringify(selectedCurrencyFromRedux, null, 2));
  //for getting token details by pasting contract address
  const customTokenFetchApi = async (text) => {
    let params = {
      walletaddress: selectedCurrencyFromRedux.wallets[0].walletaddress,
      privateKey: selectedCurrencyFromRedux.wallets[0].privKey,
      contractaddress: text ?? contractAddress,
      tokenType: networkType,
    };
    custom_token_fetch_func(params)
      .then((res) => {
        console.log("lkfkasl;dkfl;kasdfasdf", res.data);
        if (res.data.status) {
          var resData = res.data.data;
          setTokenName(resData.tokenName);
          setDecimals(resData.decimal);
          setTokenSymbol(resData.tokenSymbol);
                  } else {
          ToastAndroid.showWithGravityAndOffset(
            "Invalid Contract",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        }

      })
      .catch((err) => {
        console.log("err", err);
        ToastAndroid.showWithGravityAndOffset(
          "Invalid Contract",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      })
  };
  // console.log("tokenArr", JSON.stringify(tokenArr, null, 2));
  //for enable coin
  const Token_enable = async (item) => {

    getRealm()
      .then((realm) => {
        const tokenArr = realm.objects("Token_array");

        // console.log("tokenArr", JSON.stringify(tokenArr, null, 2));

        var findWallet = tokenArr.filter((item) => {
          return item.uniqueKey == selectedCurrencyFromRedux.uniqueKey
        })
        // console.log("findWallet", JSON.stringify(findWallet, null, 2));

        var param = {
          tokenType: networkType,
          currencySymbol: tokenSymbol,
          contractAddress: contractAddress,
          currencyimage: ""
        }
        if (findWallet.length == 0) {
          // console.log("param", param);
          realm.write(() => {
            walletData = realm.create("Token_array", {
              uniqueKey: selectedCurrencyFromRedux.uniqueKey,
              Tokens: [param],
            });
          });

        } else {
          realm.write(() => {
            findWallet[0].Tokens.push(param)
          })
        }
        props.navigation.navigate("WalletHomeBottomTab")
      })
      .catch((err) => {
        console.log("errror on enable coin", err);
      })

  };

  const importCustomToken = async () => {
    let params = {
      currencyName: tokenName,
      currencySymbol: tokenSymbol,
      contractAddress: contractAddress,
      decimals: decimals,
      tokentype: networkType,
      type: "Token",
    };
    console.log("params", params);
    customToken_add(params)
      .then((res) => {
        // console.log("res.data in custom add", res.data);
        setLoad(false)
        if (
          res.data.message == "Contract already exist" &&
          res.data.errors == undefined
        ) {
          if (isEmpty(tokenArr)) { Token_enable(params); }
          else if (
            res.data.errors != undefined ||
            res.data.message == "Invalid Contract Address"
          ) {
            ToastAndroid.showWithGravityAndOffset(
              "Invalid Contract Address",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
          } else if (res.data.status == true) {
            //push into arr
            Token_enable(res.data);
          } else if (!isEmpty(tokenArr)) {
            var getArr = tokenArr[0]
            var checkarr = getArr.Tokens.filter((item) => {
              return item.contractAddress == params.contractAddress && item
            })
            if (checkarr.length != 0) {
              ToastAndroid.showWithGravityAndOffset(
                "Address Already Exists",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );
            } else {
              Token_enable(res.data);
            }
          }
        }
        else if (
          res.data.errors != undefined ||
          res.data.message == "Invalid Contract Address"
        ) {
          ToastAndroid.showWithGravityAndOffset(
            "Invalid Contract Address",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        }
        else if (res.data.status == true) {
          //push into arr
          Token_enable(res.data);
        }
      })
      .catch((err) => {
        console.log("errror on import custom", err);
        ToastAndroid.showWithGravityAndOffset(
          "Invalid Contract",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      });
  };
  //for network list
  const network_list_func = async () => {
    network_listFunc()
      .then(function (res) {
        console.log("networkListnetworkListnetworkList", res.data);
        if (res.data.data.length != 0) {
          var removeBtc = res.data.data.filter(item => item.currencySymbol != "BTC")
          setNetworkList(removeBtc);
        }

      })
      .catch(function (err) {
        console.log("networklist err", err);
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
        <Header name={"Add Custom Token"} leftImage={"back"} />
        <ScrollView>
          <Card
            containerStyle={{
              borderRadius: 10,
              elevation: 0,
              borderColor: "transparent",
              backgroundColor: "transparent",
            }}
          >
            <View style={{ marginTop: "3%" }}>
              {/* <TouchableOpacity onPress={() => refRBSheet.current.open()}> */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // backgroundColor:"red",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: RFPercentage(2),
                    color: theme.theme === "dark" ? "#FFF" : "black",
                    fontFamily: Fonts.Medium,
                    // marginTop:15
                  }}
                >
                  Network
                </Text>
                {/* <View style={{ flexDirection: "row" }}> */}
                {/* <Text
                    style={{
                      fontSize: 16,
                      color: theme.text,
                      fontFamily: Fonts.Medium,
                    }}
                  >
                    {netWorkName}
                  </Text> */}
                <Button
                  title={" " + netWorkName}
                  icon={showImage(networkType)}
                  buttonStyle={style.continueBtn}
                  titleStyle={{
                    fontFamily: Fonts.Bold,
                    color: theme.theme == "light" ? "#000" : "#fff",
                    fontSize: RFPercentage(2),
                  }}
                  onPress={() => refRBSheet.current.open()}
                />
              </View>

              <View style={{ marginTop: "5%" }} />
              <TouchableOpacity onPress={fetchCopiedText}>
                <Text style={style.paste}>PASTE</Text>
              </TouchableOpacity>
              <TextInput
                placeholder="Contract Address"
                underlineColor="transparent"
                underlineColorAndroid="transparent"
                selectionColor={"#9370DB"}
                placeholderTextColor={"#9370DB"}
                value={contractAddress}
                // mode="outlined"
                onChangeText={(contractAddress) => {
                  setContractAddress(contractAddress);
                }}
                style={{
                  backgroundColor: "rgba(155, 124, 220, 0.15)",
                  fontFamily: "Orbitron-Bold",
                  color: theme.text,
                  borderRadius: 5,
                  borderWidth: 2,
                  borderColor: "rgba(162, 121, 250, 0.30)",
                  fontFamily: Fonts.Regular,
                  paddingLeft: 10,
                  color: theme.theme === "dark" ? "#fff" : "#000",
                  fontSize: RFPercentage(1.7),
                }}
                // outlineColor={"lightgrey"}
                theme={{
                  colors: {
                    text: theme.text,
                    accent: theme.background,
                    primary: Colors.PRIMARY,
                    placeholder: "grey",
                    background: theme.background,
                  },
                }}
              />
              <View style={{ marginTop: "5%" }} />
              <TextInput
                placeholder="Name"
                selectionColor={"#9370DB"}
                placeholderTextColor={"#9370DB"}
                underlineColor="transparent"
                underlineColorAndroid="transparent"
                style={{
                  backgroundColor: "rgba(155, 124, 220, 0.15)",
                  fontFamily: "Orbitron-Bold",
                  color: theme.text,
                  borderRadius: 5,
                  borderWidth: 2,
                  borderColor: "rgba(162, 121, 250, 0.30)",
                  fontFamily: Fonts.Regular,
                  paddingLeft: 10,
                  color: theme.theme === "dark" ? "#fff" : "#000",
                  fontSize: RFPercentage(1.7),
                }}
                value={tokenName}
                // mode="outlined"
                editable={false}
                onChangeText={(tokenName) => {
                  setTokenName(tokenName);
                }}
                // outlineColor={"lightgrey"}
                theme={{
                  colors: {
                    text: theme.text,
                    accent: theme.background,
                    primary: Colors.PRIMARY,
                    placeholder: "grey",
                    background: theme.background,
                  },
                }}
              />
              <View style={{ marginTop: "5%" }} />
              <TextInput
                placeholder="Symbol"
                selectionColor={"#9370DB"}
                placeholderTextColor={"#9370DB"}
                underlineColor="transparent"
                underlineColorAndroid="transparent"
                style={{
                  backgroundColor: "rgba(155, 124, 220, 0.15)",
                  fontFamily: "Orbitron-Bold",
                  color: theme.text,
                  borderRadius: 5,
                  borderWidth: 2,
                  borderColor: "rgba(162, 121, 250, 0.30)",
                  fontFamily: Fonts.Regular,
                  paddingLeft: 10,
                  color: theme.theme === "dark" ? "#fff" : "#000",
                  fontSize: RFPercentage(1.7),
                }}
                value={tokenSymbol}
                editable={false}
                // mode="outlined"
                onChangeText={(tokenSymbol) => {
                  setTokenSymbol(tokenSymbol);
                }}
                // outlineColor={"lightgrey"}
                theme={{
                  colors: {
                    text: theme.text,
                    accent: theme.background,
                    primary: Colors.PRIMARY,
                    placeholder: "grey",
                    background: theme.background,
                  },
                }}
              />
              <View style={{ marginTop: "5%" }} />
              <TextInput
                placeholder="Decimals"
                selectionColor={"#9370DB"}
                placeholderTextColor={"#9370DB"}
                underlineColor="transparent"
                underlineColorAndroid="transparent"
                style={{
                  backgroundColor: "rgba(155, 124, 220, 0.15)",
                  fontFamily: "Orbitron-Bold",
                  color: theme.text,
                  borderRadius: 5,
                  borderWidth: 2,
                  borderColor: "rgba(162, 121, 250, 0.30)",
                  fontFamily: Fonts.Regular,
                  paddingLeft: 10,
                  color: theme.theme === "dark" ? "#fff" : "#000",
                  fontSize: RFPercentage(1.7),
                }}
                value={decimals.toString()}
                editable={false}
                // mode="outlined"
                onChangeText={(decimals) => {
                  setDecimals(decimals);
                }}
                // outlineColor={"lightgrey"}
                theme={{
                  colors: {
                    text: theme.text,
                    accent: theme.background,
                    primary: Colors.PRIMARY,
                    placeholder: "grey",
                    background: theme.background,
                  },
                }}
              />

              {contractAddress == "" ||
              tokenName == "" ||
              tokenSymbol == "" ||
              decimals == "" ? (
                <View
                  style={{
                    fleDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 25,
                  }}
                >
                  {/* <Button
                  title="Import"
                  buttonStyle={{ backgroundColor: "transparent" }}
                  titleStyle={{
                    fontFamily: Fonts.Regular, color: theme.text, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 15,
                    borderRadius: 30, color: theme.text, width: 200,

                    borderColor: theme.text,
                  }}
                /> */}
                  <Pressable
                    style={{
                      marginTop: "5%",
                      width: "100%",
                      height: 49,
                      backgroundColor:
                        theme.theme === "black" ? "#707070" : "#707070",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      border: 1,
                      borderRadius: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.Regular,
                        color: "#9e9e9e",
                        fontSize: RFPercentage(2.4),
                      }}
                    >
                      Import
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View
                  style={{
                    fleDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 25,
                  }}
                >
                  {/* <Button
                  title="Import"
                  buttonStyle={{ backgroundColor: "transparent" }}
                  titleStyle={{
                    fontFamily: Fonts.Regular, color: theme.text, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 15,
                    borderColor: theme.text, color: theme.text, borderRadius: 30, width: 200
                  }}
                  onPress={() => {
                    importCustomToken();
                  }}
                /> */}
                  <Pressable
                    disabled={load}
                    onPress={() => {
                      setLoad(true);

                      setTimeout(() => {
                        if (!load) importCustomToken();
                      }, 1000);
                    }}
                    style={{
                      marginTop: "5%",
                      width: "100%",
                      height: 49,
                      backgroundColor:
                        theme.theme === "dark" ? "#FFF600" : "#612CD2",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      border: 1,
                      borderRadius: 2,
                    }}
                  >
                    {!load ? (
                      <Text
                        style={{
                          fontFamily: Fonts.Regular,
                          color: theme.theme === "light" ? "#ffffff" : "black",
                          fontSize: RFPercentage(2.4),
                        }}
                      >
                        Import
                      </Text>
                    ) : (
                      <ActivityIndicator />
                    )}
                  </Pressable>
                </View>
              )}
            </View>
          </Card>
          {console.log("networroro", JSON.stringify(networkList, null, 2))}
          <Card
            containerStyle={{
              borderRadius: 5,
              elevation: 0,
              backgroundColor: "rgba(155, 124, 220, 0.15)",
              bottom: 5,
              marginTop: "5%",
              marginBottom: 20,
              borderWidth: 2,
              borderColor: "rgba(162, 121, 250, 0.30)",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icn
                name="warning"
                type="antDesign"
                style={{
                  alignSelf: "center",
                }}
                color={theme.theme == "light" ? "#000" : "#fff"}
                size={20}
              />
              <Text
                style={{
                  fontFamily: Fonts.Regular,
                  fontSize: RFPercentage(1.8),
                  marginHorizontal: 10,
                  color: theme.theme == "light" ? "#000" : "#fff"
                }}
              >
                Anyone can create a token, including fake version of existing
                tokens. Learn about scams and security risks.
              </Text>
            </View>
          </Card>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(162, 121, 250, 0.15)",
            }}
          >
            {console.log("networkList", networkList)}
            <RBSheet
              ref={refRBSheet}
              height={
                selectedCurrencyFromRedux?.walletType === "SingleCoin" &&
                selectedCurrencyFromRedux?.wallets &&
                selectedCurrencyFromRedux.wallets[0] &&
                networkList.filter(
                  (item) =>
                    item.currencySymbol.toLowerCase() ===
                    selectedCurrencyFromRedux.wallets[0].currency.toLowerCase()
                ).length === 1
                  ? 100
                  : selectedCurrencyFromRedux?.walletType !== "SingleCoin" &&
                    selectedCurrencyFromRedux.wallets &&
                    selectedCurrencyFromRedux.wallets[0] &&
                    networkList?.filter(
                      (item) =>
                        item.currencySymbol.toLowerCase() ===
                        selectedCurrencyFromRedux.wallets[0].currency.toLowerCase()
                    ).length === 2
                  ? 200
                  : 300
              }
              closeOnDragDown={false}
              closeOnPressMask={true}
              closeDuration={300}
              keyboardAvoidingViewEnabled={true}
              openDuration={300}
              customStyles={{
                wrapper: {
                  backgroundColor: "#00000088",
                },
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor:theme.theme==="dark"?"#F2ECFF": "rgba(155, 124, 220, 0.15)",
                  height: 50,
                }}
              >
                <FlatList
                  data={
                    selectedCurrencyFromRedux.walletType == "SingleCoin"
                      ? networkList.filter(
                          (item) =>
                            item.currencySymbol.toLowerCase() ==
                            selectedCurrencyFromRedux.wallets[0].currency.toLowerCase()
                        )
                      : networkList
                  }
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setNetworkType(item.type);
                        setNetWorkName(item.name);
                        refRBSheet.current.close();
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          backgroundColor: "transparent",
                          alignItems: "center",
                          marginHorizontal: 30,
                          marginTop: "5%",
                        }}
                      >
                        {/* {console.log("item", item)} */}
                        {showImage(item.type)}
                        <Text
                          style={{
                            fontFamily: Fonts.Bold,
                            fontSize: RFPercentage(2),
                            color: "black",
                            marginHorizontal: 10,
                          }}
                        >
                          {item.name}
                        </Text>
                        {item.name == netWorkName && (
                          <Icn
                            name="check"
                            type="antDesign"
                            style={{
                              alignSelf: "center",
                            }}
                            color="black"
                            size={20}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </RBSheet>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AddCustomToken;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    multiTxt: {
      fontFamily: Fonts.Medium,
      fontSize: 18,
      marginHorizontal: 20,
      alignSelf: "center",
      color: theme.text,
    },
    cardView: {
      flexDirection: "row",
      marginTop: "8%",
    },
    currencyName: {
      fontFamily: Fonts.Medium,
      fontSize: 18,
      alignSelf: "center",
      marginHorizontal: 20,
      color: theme.text,
    },
    flex: {
      flexDirection: "row",
    },
    logoStyle: {
      width: 30,
      height: 30,
      borderRadius: 20,
    },
    cardContainer: {
      width: "100%",
      alignSelf: "center",
    },
    paste: {
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(2.5),
      color: theme.theme == "light" ? "#000" : "#fff",
      alignSelf: "flex-end",
      textTransform: "capitalize",
      marginBottom: 10,
    },
    continueBtn: {
      borderRadius: 5,
      height: 45,
      // width: "83%",
      // alignSelf: "center",
      // marginLeft: 80,
      backgroundColor: "transparent",
    },
  });
