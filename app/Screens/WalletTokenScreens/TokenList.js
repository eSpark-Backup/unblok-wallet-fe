import React, { useEffect, useContext, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
  Dimensions,
  TextInput,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Switch } from "react-native-switch";
import themeContext from "../../utils/themeContext";
import { Divider } from "react-native-elements";
import { Fonts } from "../../utils/Fonts";
import { Images } from "../../utils/Images";
import { Colors } from "../../utils/Colors";
import ApiClient from "../../api/ApiClient";
import { Searchbar } from "react-native-paper";
import { ApiConstants } from "../../api/ApiConstants";
import { Icon as Icn } from "react-native-elements";
import Header from "../../Components/Header";
import getRealm from "../../localDb/RealmConfig";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { IconShowing, gettokenList } from "./common/Token_List";
import { useSelector } from "react-redux";
import isEmpty from "../../utils/isEmpty";
import { useFocusEffect } from "@react-navigation/native";
import { showImage } from "../../utils/showImage";

import Searchlight from "../../assets/icons/lighttheme/Search.svg";
import Searchdark from "../../assets/icons/darktheme/Search.svg";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { SvgUri } from "react-native-svg";
import Buylight from "../../assets/icons/lighttheme/Buy.svg";
import BuyDark from "../../assets/icons/darktheme/Buy.svg";

const _ = require("lodash");

const TokenList = (props) => {
  //theme config
  const height = Dimensions.get("window").height;
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [tokenList, setTokenList] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const currencyListFromRedux = useSelector(
    (state) => state.selectedCurrencyListReducer.selectedList
  );

  const AllListFromRedux = useSelector(
    (state) => state.tokenListReducer.tokenList
  );

  const walletDetails = useSelector(
    (state) => state.allCurrrencyReducer.Allcurrency
  );

  // console.log("AllListFromRedux", JSON.stringify(AllListFromRedux, null, 2));
  // console.log("walletDetails", JSON.stringify(walletDetails, null, 2));
  // console.log("currencyListFromRedux", JSON.stringify(currencyListFromRedux, null, 2));

  //for search bar
  const onChangeSearch = (query) => setSearchQuery(query);

  //for search function
  const [searchQuery, setSearchQuery] = useState("");
  const [state, setState] = useState({
    data: [],
    loading: false,
  });
  const { data } = state;

  const filterdData = searchQuery
    ? data.filter((item) => {
        // console.log("iteememe", item);
        const itemData = (isEmpty(item.contractAddress) ? item.currencyName : item.currencySymbol).toUpperCase();
        const textData = searchQuery.toUpperCase();
        return itemData.indexOf(textData) > -1;
      })
    : data;

  // useEffect(() => {
  //   token_list_func();
  // }, []);

  // console.log("filterdData", JSON.stringify(filterdData, null, 2));

  useFocusEffect(
    React.useCallback(() => {
      token_list_func();
      return () => { };
    }, [])
  )

  const token_list_func = async () => {

    gettokenList()
      .then((res) => {
        if (AllListFromRedux.length != 0) {
          var customTokenArr = []
          console.log("rerrrrrrrrrrrrrrrrree",res.data);
          res.data.length != 0 ? res.data.map((item) => {
                item.enabled = false
                console.log("itemitem",item);
                var customTokenArrExist = AllListFromRedux[0].Tokens.some(
                  (i) => i.contractAddress === item.contractAddress
                );
                if (customTokenArrExist == false) {
                  customTokenArr.push(item);
                }
              }) : []

          // console.log("customTokenArr",customTokenArr);

          let mergeing = [...currencyListFromRedux, ...AllListFromRedux[0].Tokens]
          mergeing.map((item) => {
            item.enabled = true
            return item
          })
          var merged = [...mergeing, ...customTokenArr]

          setTokenList(merged);
          setState({ data: merged })
        } else {
          console.log("res.data else",res.data);
          var arr = res.data.length != 0 ? res.data.map((item) => {
                  item.enabled = false
                  return item
                }) : []

          if(walletDetails.walletType == 'SingleCoin'){
            arr = arr.filter(item=>item.tokenType == walletDetails.wallets[0].tokenType)
          }


          let finalMerge = currencyListFromRedux.map((item) => {
            item.enabled = true
            return item
          })
          let merge = [...finalMerge, ...arr]
          // console.log("mergegegegege", merge);

          setState({ data: merge })

        }

      })
      .catch((err) => {
        console.log("errree on gettokenlist func", err);
      })



  }

  const toggleSwitch = (tokenItem, index, value) => {
    //enabled 'if' called disabled 'else' called
    if (value == true) {
      // tokenItem.enabled = true;
      enable_coin(tokenItem, index, value);
    } else {
      tokenItem.enabled = false;
      getRealm()
        .then((realm) => {
          if (tokenItem.contractAddress != "") {
            var tokenData = realm.objects("Token_array");

            var findWalletArr = tokenData.filter((item) => {
              return item.uniqueKey == walletDetails.uniqueKey
            })

            var findToken = findWalletArr[0].Tokens.filter((item) => {
              return item.contractAddress == tokenItem.contractAddress
            })

            props.navigation.navigate("WalletHome");

            setTimeout(() => {
              realm.write(() => {
                realm.delete(findToken[0]);
              });
            }, 1000)

          } else {
            ToastAndroid.showWithGravityAndOffset(
              "Networks can't be deleted",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
          }

          return () => {
            realm.close();
          };
        })
        .catch((err) => {
          console.log(err, "toggleSwitch localdb err");
        });
    }
  };

  //for enable coin
  const enable_coin = async (item, value) => {
    setRefreshing(true);
    getRealm()
      .then((realm) => {

        const tokenArr = realm.objects("Token_array");

        var findWallet = tokenArr.filter((item) => {
          return item.uniqueKey == walletDetails.uniqueKey
        })
        // console.log("iririririririr",item);
        var param = {
          tokenType: item.tokenType,
          currencySymbol: item.currencySymbol,
          contractAddress: item.contractAddress,
          currencyimage: item.currencyimage
        }
        // console.log("param", param);
        if (findWallet.length == 0) {
          // console.log("param", param);
          realm.write(() => {
            walletData = realm.create("Token_array", {
              uniqueKey: walletDetails.uniqueKey,
              Tokens: [param],
            });
          });

        } else {
          realm.write(() => {
            findWallet[0].Tokens.push(param)
          })
        }
        props.navigation.navigate("WalletHome");

      })
      .catch((err) => {
        console.log(err, "local db err in enable_coin");
      });
  };

console.log("filterdDatafilterdData", JSON.stringify(filterdData, null, 2));

  return (
    <>
    <StatusBar barStyle={theme.theme == "light" ? "dark-content" : "light-content"} backgroundColor={theme.theme==="dark"?"rgb(25,14,47)":"#F8F4FF"} />
    <SafeAreaView style={style.container}>
      <ImageBackground
        source={theme.theme === "light" ? Images.backgroundSend : Images.background}
        style={{
          width: windowWidth,
          height: windowheight,
          paddingTop: StatusBar.windowheight,
        }}
        resizeMode="cover"
      >
        <Header name={"Enable Tokens"} leftImage={"back"} />
        <View style={style.custsearch}>
          <View
            style={{
              borderRadius: 5,
              backgroundColor: "rgba(155, 124, 220, 0.15)",
              borderColor: "rgba(162, 121, 250, 0.30)",
              borderWidth: 1,
              marginHorizontal: 10,
              fontFamily: Fonts.Bold,
              elevation: 0,
              fontSize: RFPercentage(2),
              flexDirection: "row",
              alignItems: "center",
              
            }}
          >
            <Icn
              name="search"
              type="Ionicons"
              style={{
                alignSelf: "center",
                marginLeft: 10,
                marginRight: 10,
              }}
              color="#A279FA"
              size={25}
            />
            <TextInput
              placeholder="Search Tokens"
              style={{
                width: "70%",
                color: theme.theme === "dark" ? "white" : "black",
                fontFamily: Fonts.Regular,
                fontSize: RFPercentage(2),
              }}
              placeholderTextColor="#A279FA"
              returnKeyType="search"
              caretColor="red"
              value={searchQuery}
              onChangeText={(contractAddress) => {
                setSearchQuery(contractAddress);
              }}
            />
          </View>
          <Image
            style={{
              width: "100%",
              height: 1.2,
              marginBottom: 10,
              marginTop: "7%",
              alignSelf: "center",
            }}
            source={require("../../assets/img/devider.png")}
            resizeMode="cover"
          />
        </View>

        <View style={style.custsearchToken}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("AddCustomToken");
            }}
          >
            <View
              style={{
                borderRadius: 5,
                backgroundColor: "rgba(155, 124, 220, 0.15)",
                borderColor: "rgba(162, 121, 250, 0.30)",
                borderWidth: 1,
                marginHorizontal: 15,
                marginVertical: 15,
                fontFamily: Fonts.Bold,
                elevation: 0,
                fontSize: RFPercentage(2),
                flexDirection: "row",
                alignItems: "center",
                padding: 14,
                width: "55%",
                justifyContent:"space-around"
              }}
            >
              {theme.theme == "light" ? (
                <Buylight
                  width={16}
                  height={16}
                  style={{ resizeMode: "contain" }}
                />
              ) : (
                <BuyDark
                  width={16}
                  height={16}
                  style={{ resizeMode: "contain" }}
                />
              )}
              <Text style={style.customTokenTxt}>Custom Token</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: "75%",
            marginTop: "5%",
            backgroundColor: "white",
            borderRadius: 12,
            alignItems: "center",
            paddingTop: 20,
          }}
        >
          <ScrollView style={{
            width:"90%",
          }}>
            {filterdData.length === 0 ? (
              <>
                <View
                          style={{
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: 300,
                          }}
                        >
                          <View
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Image
                              source={require("../../assets/img/noCruncy.png")}
                              style={{
                                width: RFPercentage(8.5),
                                height: RFPercentage(8.5),
                                resizeMode: "contain",
                              }}
                            />
                          </View>
                          <View>
                            <Text
                              style={{
                                fontFamily: Fonts.Regular,
                                fontSize: RFPercentage(2),
                                marginTop: 20,
                                color: "black",
                                width: "100%",
                                textAlign: "center",
                              }}
                            >
                              <Text>No Crypto Found!</Text>
                            </Text>
                          </View>
                        </View>
              </>
            ) : (
              <>
                <ScrollView style={{ }}>
                  {_.map(filterdData, (item, index) => (
                    <>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingVertical: "5%",
                          width: "90%",
                          alignSelf:"center"
                        }}
                        key={Math.random()}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: "100%",
                            alignSelf:"center",
                            justifyContent:"space-between",

                          }}
                        >
                          <View style={{
                            flexDirection:"row",
                           
                          }}>
                            
                            <View
                              style={{
                              
                              
                                justifyContent: "center",
                                borderRadius: 5,
                                marginRight:10
                              }}
                            >
                              {!isEmpty(item.currencyimage) ? (
                                <SvgUri
                                  width={40}
                                  height={40}
                                  uri={`http:/192.53.121.26:8096/images/${item.currencyimage}`}
                                  
                                />
                              ) : (
                                showImage(item.tokenType)
                              )}
                            </View>
                            <View
                              style={{
                                width: "70%" ,
                                alignItems: "flex-start",
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                style={{
                                  color: "#000000",
                                  fontFamily: Fonts.Medium,
                                  // marginLeft: "5%",
                                  fontSize: RFPercentage(1.9),
                                  width: "70%",
                                }}
                              >
                                {isEmpty(item?.contractAddress)
                                  ? item?.currencyName
                                  : item?.currencySymbol}
                              </Text>
                             
                              <Text
                                style={{
                                  color: theme.search,
                                  // marginLeft: "5%",
                                  fontSize: RFPercentage(1.9),
                                  width: "70%",
                                }}
                                key={index}
                              >
                                {item?.balance === 0 || !item?.balance
                                          ? "0"
                                          : item?.balance?.toFixed(6)}{" "}
                                        {item?.currency?item?.currency:item?.currencySymbol}
                               
                                {/* 0 ETH */}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              alignItems: "flex-end",
                            }}
                          >
                            <Switch
                              onValueChange={(value) =>
                                toggleSwitch(item, index, value)
                              }
                              value={item.enabled}
                              disabled={false}
                              activeText={"On"}
                              inActiveText={"Off"}
                              circleSize={20}
                              barHeight={15}
                              circleBorderWidth={0}
                              backgroundActive={
                                theme.theme === "dark" ? "#612CD2" : "#612CD2"
                              }
                              backgroundInactive={
                                theme.theme === "dark" ? "#612CD2" : "#612CD2"
                              }
                              circleActiveColor={theme.theme==="dark"?"#c3acf3":"#c3acf3"}
                              circleInActiveColor={theme.theme==="dark"?"#c3acf3":"#c3acf3"}
                              changeValueImmediately={true}
                              innerCircleStyle={{
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              outerCircleStyle={{}}
                              renderActiveText={false}
                              renderInActiveText={false}
                              switchLeftPx={2.5}
                              switchRightPx={2.5}
                              switchWidthMultiplier={1.5}
                              switchBorderRadius={30}
                            />
                          </View>
                        </View>
                      </View>
                      {filterdData.length === 1 ? (
                        <Image
                          style={{ width: "90%", height: 1,alignSelf:"center"  }}
                          source={require("../../assets/img/deviderPNG.png")}
                          resizeMode="cover"
                        />
                      ) : (
                        index !== filterdData.length - 1 && (
                          <>
                            <Image
                              style={{ width: "90%", height: 1,alignSelf:"center" }}
                              source={require("../../assets/img/deviderPNG.png")}
                              resizeMode="cover"
                            />
                          </>
                        )
                      )}
                    </>
                  ))}
                </ScrollView>
              </>
            )}
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
    </>
  );
};

export default TokenList;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    custsearch: {
      marginTop: "5%",
      width: "85%",
      alignSelf: "center",
    },
    custsearchToken: {
      width: "85%",
      alignSelf: "center",
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
    flatListView2: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 20,
    },
    flatListView: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: "3%",
      padding: 10,
    },
    IcnView: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: "5%",
      marginHorizontal: 10,
    },
    customTokenTxt: {
      fontSize: RFPercentage(2.1),
      color: theme.theme === "light" ? "black" : "white",
      fontFamily: Fonts.Regular,
      marginLeft: 10,
    },
    currencyNameTxt: {
      fontSize: 18,
      color: theme.text,
      fontFamily: Fonts.Regular,
      marginHorizontal: 20,
    },
  });
