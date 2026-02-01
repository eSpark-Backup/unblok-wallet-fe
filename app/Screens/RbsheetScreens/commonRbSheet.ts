import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  BackHandler,
  ImageBackground,
  StatusBar,
} from "react-native";
import themeContext from "../../utils/themeContext";
import getRealm from "../../localDb/RealmConfig";
import Header from "../../Components/Header";
import { useFocusEffect } from "@react-navigation/native";
import { Colors } from "../../utils/Colors";
import { Fonts } from "../../utils/Fonts";
import { Images } from "../../utils/Images";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, Searchbar } from "react-native-paper";
import { addCurrencyDetails } from "../../Redux/Actions/walletDetailsAction";
import { useNavigation } from "@react-navigation/native";
import { tokenAssetUpdateFunc } from "./common/common_RbSheet.js";
import { RFPercentage } from "react-native-responsive-fontsize";
import isEmpty from "../../utils/isEmpty";
import { showImage } from "../../utils/showImage";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { Icon as Icn, Switch, Card } from "react-native-elements";
import { SvgUri } from "react-native-svg";
import Ethereum from "../../assets/icons/darktheme/Ethereum.svg";
import deviderPNG from "../../assets/img/deviderPNG.png";
import GraphGreen from "../../assets/img/GraphGreen.svg";
import GraphRed from "../../assets/img/GraphRed.svg";

const _ = require("lodash");
const SendRbSheet = (props) => {
  
    var root = props.route.params

  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      var incLength = 2
      const onBackPress = () => {
        // BackHandler.goBack()
        // navigation.navigate("WalletHomeBottomTab");
        // return true;

        const routes = navigation.getState()?.routes;
        var prevRoute
        if ((routes[routes.length - incLength]?.name == "EnterPasscode") || (routes[routes?.length - incLength].name == "CheckBiometric")) {
          incLength = incLength + 1
          return onBackPress();
        } else {
          prevRoute = routes[routes.length - incLength]
        }
        navigation.navigate(prevRoute.name);
        return true
      };
      // Add Event Listener for hardwareBackPress
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        // Once the Screen gets blur Remove Event Listener
        // getPasscodeStatus();
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  //redux
  const dispatch = useDispatch();
  const setWalletDetailsinRedux = (item) => dispatch(addCurrencyDetails(item));



  //for search bar
  const onChangeSearch = (query) => setSearchQuery(query);
  //for search function
  const [searchQuery, setSearchQuery] = useState("");
  const [IsLoad, setIsLoad] = useState(true);
  const [tokenLength, setTokenLength] = useState(0);
  const [reslength, setReslength] = useState(0);
  const [skip, setskip] = useState(currencyListFromRedux?.length >= 3 ? 5 : 7);
  const [limit, setLimit] = useState(0);
  const [state, setState] = useState({
    data: [],
    loading: false,
  }); // only one data source
  const { data, loading } = state;

  const filterdData = searchQuery // based on text, filter data and use filtered data
    ? data.filter((item) => {
        const itemData = item.currencyName.toUpperCase();
        const textData = searchQuery.toUpperCase();
        return itemData.indexOf(textData) > -1;
      })
    : data; // on on text, u can return all data


  const currencyListFromRedux = useSelector(
    (state) => state.selectedCurrencyListReducer.selectedList
  );

  const AllListFromRedux = useSelector(
    (state) => state.tokenListReducer.tokenList
  );

  const walletDetails = useSelector(
    (state) => state.allCurrrencyReducer.Allcurrency
  );

  // console.log("AllListFromRedux", AllListFromRedux);
  // console.log("currencyListFromRedux", currencyListFromRedux);

  //for getting default currency
  const [defaultCurrency, setDefaultCurrency] = React.useState("");

  useFocusEffect(
    React.useCallback(() => {
      // setState({
      //     data: AllListFromRedux,
      //     loading: false,
      // });
      setTokenLength(0)
      setReslength(0)
      setskip(currencyListFromRedux.length >= 3 ? 5 : 7)
      setLimit(0)
      setIsLoad(true)
      getDefaultCurrency();
      return () => { };
    }, [])
  );


  // get DefaultCurrency from db
  const getDefaultCurrency = async () => {
    getRealm()
      .then(async (realm) => {
        var defaultCurrencyVal = realm.objects("defaultCurrency");
        if (defaultCurrencyVal.length == 0) {
          setDefaultCurrency("USD");
          tokenListFun("USD");
        } else {
          setDefaultCurrency(defaultCurrencyVal[0].defaultCurrency);
          tokenListFun(defaultCurrencyVal[0].defaultCurrency);
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "pushNotificationStatus err from localDb");
      });
  };
  // console.log("AllListFromRedux", AllListFromRedux);

  const tokenListFun = async (datas) => {
    // setIsLoad(true)

    if (AllListFromRedux.length != 0 && AllListFromRedux[0].Tokens && AllListFromRedux[0].Tokens?.length != 0) {
      var cutarr = AllListFromRedux[0].Tokens.slice(limit, skip)

      setTokenLength(AllListFromRedux[0].Tokens.length)
      let params = {
        defaultCurrency: defaultCurrency,
        Tokens: cutarr,
        walletDetails: walletDetails
            }
      // console.log("params", params);
      var token_res = await tokenAssetUpdateFunc(params)
      // console.log("token_res", token_res.data);
      var length = token_res.data?.tokens?.length
      setReslength(reslength == 0 ? length : reslength + length)
      isEmpty(data) ?
                setState({
            data: [...currencyListFromRedux, ...token_res.data.tokens],
            loading: false,
          })
        :
                setState({
            data: data.concat(token_res.data.tokens),
            loading: false,
          })

      setIsLoad(false)
      setskip(skip + 5)
      setLimit(skip)
    } else {
      setState({
        data: currencyListFromRedux,
        loading: false,
      })
            setIsLoad(false)
        }

    }
    // React.useEffect(() => {
    //   if (theme.theme === "light" && (root==="Send" || root==="Receive" || root==="Buy" || root==="Sell")) {
    //     StatusBar.setBackgroundColor('#F8F4FF');
    //   } else if (theme.theme==="light"){
    //     StatusBar.setBackgroundColor('#ffffff');
    //   }
    //   else{
    //     StatusBar.setBackgroundColor('rgb(25,14,47)');
    //   }
    // }, [root]);
    
    // console.log("filterdData", filterdData);
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
        <Header name={`${root}`} leftImage={"back"} />

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
              caretColor="#F45532"
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
            <>
              {IsLoad ? (
                <>
                  <View>
                    <ActivityIndicator size="small" color={theme.theme == "light" ? "#000" : "#fff"} />
                  </View>
                </>
              ) : (
                <>
                  <ScrollView
                    onMomentumScrollEnd={() => {
                      if (reslength != tokenLength) {
                        tokenListFun(defaultCurrency);
                      }
                    }}
                    showsVerticalScrollIndicator={false}
                  >
                    {filterdData?.length != 0 && filterdData!==undefined  ? (
                      <>
                        <View
                          style={{
                            width: "95%",
                            paddingVertical: "1%",
                            alignSelf: "center",
                          }}
                        >
                          {_.map(filterdData, (item,i) => (
                            <>
                            <TouchableOpacity onPress={() => {
                                setWalletDetailsinRedux(item); props.navigation.navigate(root === "Send" ? "SendBTC" : root === "Receive" ? "ReceiveBTC" : "BuyBTC",root)
                              }}
                              key={Math.random()}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignSelf:"center",
                                  justifyContent:"space-between",
                                  marginVertical:"5%" 
                                }}
                              >
                                <View style={{width:"45%",flexDirection:"row",justifyContent:"space-between"}}>

                                <View
                                  style={{
                                    // width: "13%",
                                      height: windowheight * 0.05,
                                      justifyContent: "center",
                                  }}
                                >
                                  {!isEmpty(item?.currencyimage) ? (
                                    <SvgUri
                                      width={40}
                                      height={40}
                                      uri={`http:/192.53.121.26:8096/images/${item?.currencyimage}`}
                                    />
                                  ) 
                                  :showImage(item.tokenType)}
                                 
                                </View>
                                <View
                                  style={{
                                    width: "75%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    paddingLeft:"2%",
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: "#000000",
                                      fontFamily: Fonts.Medium,
                                      // marginLeft: "5%",
                                      fontSize: RFPercentage(1.9),
                                      width: "95%",
                                    }}
                                  >
                                    {item?.currencyName}
                                    {/* Ethereum */}
                                  </Text>
                                  <Text
                                    style={{
                                      color: theme.search,
                                      // marginLeft: "5%",
                                      fontSize: RFPercentage(1.9),
                                      width: "95%",
                                    }}
                                    key={i}
                                  >
                                    {item?.balance != 0 ? item?.balance?.toFixed(2) : "0"} {item?.currency}
                                    {/* 0 ETH */}
                                  </Text>
                                </View>
                                </View>
                                <View
                                  style={{
                                    width: "20%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                    {item.changePer != 0 ?
                                        (item.changePer < 0 ? (
                                    <GraphRed
                                      resizeMode="contain"
                                      width={"100%"}
                                    />
                                    ) : (
                                          <GraphGreen
                                            resizeMode="contain"
                                            width={"100%"}
                                          />
                                        )): <GraphGreen
                                        resizeMode="contain"
                                        width={"100%"}
                                      />}
                                </View>
                                {console.log("itemPrice>>",item)}
                                <View style={{ width: "33%", }}>
                                  <Text
                                    style={{
                                      color: item.changePer < 0 ? "#F45532"
                                      : "#08c708",
                                      fontFamily: Fonts.Regular,
                                      textAlign: "right",
                                      fontSize: RFPercentage(1.9),
                                      width: "100%",
                                    }}
                                  >
                                    {(defaultCurrency == "USD" && "$") ||
                                                                            (defaultCurrency == "GBP" && "£") ||
                                                                            (defaultCurrency == "EUR" && "€")}
                                                                        {formattedPrice(parseFloat(item.singleValue).toFixed(2))}
                                  </Text>
                                  {item.changePer != 0 && item.changePer ? (
                                    <Text
                                      style={{
                                        color:
                                          item?.changePer < 0 ? "#F45532"
                                          : "#08c708",
                                        fontFamily: Fonts.Regular,
                                        textAlign: "right",
                                        fontSize: RFPercentage(1.9),
                                        width: "100%",
                                      }}
                                    >
                                      {item?.changePer?.toFixed(2)}%
                                      {/* -0.421% */}
                                    </Text>
                                   
                                  ):<Text
                                  style={{
                                    color:
                                      item?.changePer < 0 ? "#F45532"
                                      : "#08c708",
                                    fontFamily: Fonts.Regular,
                                    textAlign: "right",
                                    fontSize: RFPercentage(1.9),
                                    width: "100%",
                                  }}
                                >
                                  
                                 0.00%
                                </Text>}
                                </View>
                              </View>
                            </TouchableOpacity>
                              <Image
                                    style={{ width: "100%", height: 1,alignSelf: "center",}}
                                    source={require("../../assets/img/deviderPNG.png")}
                                    resizeMode="cover"
                                  />
                                  </>
                          ))}
                        </View>
                        
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
                  </ScrollView>
                </>
              )}
            </>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
    </>
  );
};
export default SendRbSheet;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
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
