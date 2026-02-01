import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
  TextInput,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Fonts } from "../../utils/Fonts";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { ActivityIndicator, Searchbar } from "react-native-paper";
import { Images } from "../../utils/Images";
import { useSelector } from "react-redux";
import { getTokenList, firstshowImage } from "./common/You_Get";
import { useDispatch } from "react-redux";
// import { swapdata } from '../../Redux/Actions/swapDataAction'
import isEmpty from "../../utils/isEmpty";
import { useFocusEffect } from "@react-navigation/native";
import TokenClient from "../../api/TokenClient";
import { ApiConstants } from "../../api/ApiConstants";
import { RFPercentage } from "react-native-responsive-fontsize";
import { showImage } from "../../utils/showImage";
import Searchlight from "../../assets/icons/lighttheme/Search.svg";
import Searchdark from "../../assets/icons/darktheme/Search.svg";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { Icon as Icn, Switch, Card } from "react-native-elements";
import { SvgUri } from "react-native-svg";
import Ethereum from "../../assets/icons/darktheme/Ethereum.svg";
import deviderPNG from "../../assets/img/deviderPNG.png";
import GraphGreen from "../../assets/img/GraphGreen.svg";
import GraphRed from "../../assets/img/GraphRed.svg";

export default function YouGet(props) {
  const theme = useContext(themeContext);
  const style = styles(theme);
  const onChangeSearch = (query) => setSearchQuery(query);
  const [searchQuery, setSearchQuery] = useState("");
  const [defaultCurrency, setDefaultCurrency] = React.useState("");
  const [Tokenlist, setTokenlist] = useState([]);
  const [load, setload] = useState(true);
  
  const filterdata = searchQuery
    ? Tokenlist.filter((item) =>
        item?.currencyName.toLowerCase()?.includes(searchQuery.toLowerCase())
      )
    : Tokenlist;
  // console.log("filterdata", filterdata)

  const { youpaytoken, TokenTypes } = useSelector(
    (state) => state.fiatDataReducer.swapdata
  );

  const selectedWallet = useSelector(
    (state) => state.selectedCurrencyListReducer.selectedList
  );

  useFocusEffect(
    useCallback(() => {
      var params = youpaytoken
        ? {
            address: selectedWallet[0].walletaddress,
            currencySymbol: youpaytoken?.currencySymbol
          }
        : {
            address: selectedWallet[0].walletaddress,
            type: TokenTypes
        }
      getTokenList(params)
        .then((res) => {
          setload(false);
          console.log("res.data.data1", res.data)
          setTokenlist(res.data);
        })
        .catch((e) => {
          setload(false);
          console.error("deselect all", e);
        });
    }, [youpaytoken])
  );
  const formattedPrice=(cryptoPrice) => cryptoPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
          <Header name={"Receive"} leftImage={"back"} />

          <View style={style.custsearch}>
            <View
              style={{
                borderRadius: 5,
                backgroundColor: "rgba(155, 124, 220, 0.15)",
                borderColor: "rgba(162, 121, 250, 0.30)",
                borderWidth: 1,
                marginHorizontal: 15,
                fontFamily: Fonts.Bold,
                elevation: 0,
                fontSize: RFPercentage(2),
                flexDirection: "row",
                alignItems: "center",
                padding: 4,
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
                onChangeText={onChangeSearch}
                returnKeyType="search"
                caretColor="red"
                value={searchQuery}
                // onSubmitEditing={() => { redirecttoBrowser() }}
              />
            </View>
            <Image
              style={{
                width: "100%",
                height: 1.2,
                marginBottom: "7%",
                marginTop: "7%",
                alignSelf: "center",
              }}
              source={require("../../assets/img/devider.png")}
              resizeMode="cover"
            />
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
            <ScrollView>
              {load ? (
                <ActivityIndicator size={"small"} />
              ) : (
                <>
                  {filterdata?.length > 0 ? (
                    <>
                      {filterdata &&
                        filterdata?.map((item,i) => (
                          <>
                            <TouchableOpacity
                              onPress={() => {
                                if (
                                  !isEmpty(youpaytoken) &&
                                  youpaytoken.currencySymbol ===
                                    item.currencySymbol
                                ) {
                                  ToastAndroid.showWithGravityAndOffset(
                                    `You cannot swap same token`,
                                    ToastAndroid.LONG,
                                    ToastAndroid.BOTTOM,
                                    25,
                                    50
                                  );
                                } else {
                                  props.navigation.navigate({
                                    name: "Swap",
                                    params: { forGet: item },
                                    merge: true,
                                  });
                                }
                              }}
                            >
                             <View style={{ flexDirection: "row", alignItems: "center", width: "90%", paddingVertical: "2.2%", marginVertical: "2.2%", alignSelf: "center",justifyContent:"space-between",}}>
                          <View style={{flexDirection:"row",width:"48%"}}>

                          <View style={{ }} >
                            {!isEmpty(item.currencyimage)
                              ?
                              <SvgUri
                                width={40}
                                height={40}
                                uri={`http:/192.53.121.26:8096/images/${item.currencyimage}`}
                              />
                              : showImage(item.tokenType)}
                          </View>
                          <View style={{paddingLeft:"5%", width: "70%",justifyContent:"center"}} >
                            <Text style={{
                              fontSize: 16,color: "#000000", fontFamily: Fonts.Regular,
                            }}>{item?.currencyName}</Text>
                          </View>
                          </View>
                        
                          <View style={{width:"48%",}} >
                            <Text style={{ fontSize: 16, color: "#000000", fontFamily: Fonts.Regular,textAlign:"right" }}>{item?.fee == 0 ? "0" : item?.fee?.toFixed(4)} {" "} {item.currencySymbol}</Text>
                          </View>
                        </View>
                            </TouchableOpacity>
                            <Image
                          style={{ width: "90%",height:1.5,alignSelf:"center" }}
                          source={require("../../assets/img/deviderPNG.png")}
                          resizeMode="cover"
                        />
                          </>
                        ))}
                    </>
                  ) : (
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
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
}
const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    custsearch: {
      marginTop: "7.5%",
      width: "85%",
      alignSelf: "center",
    },
    container2: {
      backgroundColor: theme.background,
      padding: 16,
    },
    seperatorLine: {
      height: 0.5,
      backgroundColor: "grey",
    },
  });
