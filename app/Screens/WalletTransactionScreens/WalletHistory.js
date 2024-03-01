import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
  PanResponder,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  ImageBackground,
} from "react-native";
import themeContext from "../../utils/themeContext";
import getRealm from "../../localDb/RealmConfig";
import Header from "../../Components/Header";
import ItemBox from "../../Components/ItemBox";
import { useFocusEffect } from "@react-navigation/native";
import ApiClient from "../../api/ApiClient";
import {
  ApiConstants,
  eth_url,
  bnb_url,
  tron_url,
  bitcoin_url,
  bitcoinDetails,
  mat_url,
} from "../../api/ApiConstants";
import { Colors } from "../../utils/Colors";
import SegmentedControl from "../../Components/SegmentedControl";
import { Fonts } from "../../utils/Fonts";
import { Icon as Icn, Card, Button } from "react-native-elements";
import { Images } from "../../utils/Images";
import moment from "moment";
import { useSelector } from "react-redux";
// import LinearGradient from "react-native-linear-gradient";
import TokenClient from "../../api/TokenClient";
import { showImage } from "../../utils/showImage";
import isEmpty from "../../utils/isEmpty";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Sendlight from "../../assets/icons/lighttheme/Send.svg";
import SendDark from "../../assets/icons/darktheme/Send.svg";
import Receivelight from "../../assets/icons/lighttheme/Receive.svg";
import ReceiveDark from "../../assets/icons/darktheme/Receive.svg";
import Buylight from "../../assets/icons/lighttheme/Buy.svg";
import BuyDark from "../../assets/icons/darktheme/Buy.svg";
import SellLight from "../../assets/icons/lighttheme/Sell Black.svg";
import SellDark from "../../assets/icons/darktheme/Sell White.svg";

import SearchLight from "../../assets/icons/lighttheme/Search.svg";
import SearchDark from "../../assets/icons/darktheme/Search.svg";
import Backlight from "../../assets/icons/lighttheme/Back arrow.svg";
import BackDark from "../../assets/icons/darktheme/Back arrow.svg";
import * as shape from "d3-shape";
import { LineChart, XAxis, YAxis } from "react-native-svg-charts";
import { AreaChart, Grid } from "react-native-svg-charts";
// import { LineChart } from 'react-native-chart-kit';
import axios from "axios";
import {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Svg,
  Text as SvgText,
} from "react-native-svg";

const WalletHistory = (props) => {
  //redux
  const walletDetailsFromRedux = useSelector(
    (state) => state.walletDetailReducer.currencyList
  );
  // console.log('walletDetailsFromRedux', JSON.stringify(walletDetailsFromRedux, null, 2))
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [tabs, setTabs] = useState("chart");
  const [transactionList, setTransactionList] = useState([]);
  const [transactionListBitCoin, setTransactionListBitCoin] = useState([]);
  const [symbol, setSymbol] = useState(walletDetailsFromRedux.currency)
  const [
    transactionListBitCoinUnconfirmed,
    setTransactionListBitCoinUnconfirmed,
  ] = useState([]);

  const [convertBalance, setConvertBalance] = useState(0);
  const [fiatSymbol, setFiatSymbol] = useState(0);
  const [confirmationBal, setConfirmationBal] = useState(0);
  const scheduledata = ["1H", "1D", "1W", "1M", "1Y", "ALL"]

  useFocusEffect(
    React.useCallback(() => {
      getcoinmarketsymbol();
      transactionListApi();
    }, [])
  )

  //transaction list api
  const transactionListApi = () => {
    if (walletDetailsFromRedux.currency == "BTC") {
      ApiClient.get(bitcoinDetails + walletDetailsFromRedux.walletaddress)
        .then(function (res) {
          console.log("res.datavvvvvvv", JSON.stringify(res.data, null, 2));
          if (res.data.txrefs != undefined) {
            setTransactionListBitCoin(res.data.txrefs);
            if (res.data.unconfirmed_balance != undefined) {
              setConfirmationBal(res.data.unconfirmed_balance);
            }
          } else {
            setTransactionListBitCoin([]);
          }
          if (res.data.unconfirmed_txrefs != undefined) {
            console.log(
              "res.data.unconfirmed_txrefs",
              res.data.unconfirmed_txrefs
            );
            setTransactionListBitCoinUnconfirmed(res.data.unconfirmed_txrefs);
          }
        })
        .catch(function (err) {
          console.log("transaction_list api err", err);
        });
    } else {
      let params = {
        address: walletDetailsFromRedux.walletaddress,
        contractAddress: walletDetailsFromRedux.contractAddress,
        tokentype:
          walletDetailsFromRedux.tokenType != undefined
            ? walletDetailsFromRedux.tokenType
            : "",
        currency: walletDetailsFromRedux.currency,
      };
      TokenClient.post(ApiConstants.transaction_list, params)
        .then(function (res) {
          setTransactionList(res.data.data);
        })
        .catch(function (err) {
          console.log("transaction_list api err", err);
        });
    }
  };

  const convert = (timestamp) => {
    if (timestamp.toString().length == 13) {
      var milliseconds = timestamp;
    } else {
      var milliseconds = timestamp * 1000;
    }

    const dateObject = new Date(milliseconds);

    const humanDateFormat = dateObject.toLocaleString();

    return (
      <View style={{ marginHorizontal: 30 }}>
        <Text
          style={{
            fontFamily: Fonts.Regular,
            fontSize: 14,
            color: "grey",
          }}
        >
          {moment(humanDateFormat).format("YYYY-MM-DD hh:mm A")}
        </Text>
      </View>
    );
  };

  const getcoinmarketsymbol = () => {
    getRealm()
      .then((realm) => {
        var defaultCurrencyVal = realm.objects("defaultCurrency");

        let trxParam = {
          Symbol: walletDetailsFromRedux.currency,
          convertSymbol:
            defaultCurrencyVal.length == 0
              ? "USD"
              : defaultCurrencyVal[0].defaultCurrency,
        };
        setFiatSymbol(trxParam.convertSymbol);

        TokenClient.post(ApiConstants.coinmarketcap_bysymbol, trxParam)
          .then(function (res) {
            setConvertBalance(res.data.data);
          })
          .catch(function (err) {
            console.log("coinmarketcap_bysymbol err", err);
          });
      })
      .catch(function (err) {
        console.log("local db err defaultCurrency", err);
      });
  };
  // console.log(
  //   "walletDetailsFromReduxwalletDetailsFromRedux",
  //   walletDetailsFromRedux
  // );

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [50, 45, 60, 70, 65, 80],
      },
    ],
  };
const [Time, setTime] = useState("1h")
  const [selectedindex, setSelectedindex] = useState(0)
  const [ChangePer, setChangePer] = useState(0)
  const [dateList, setDateList] = useState([
    '08-31 15:09',
    '08-31 15:10',
    '08-31 15:11',
    '08-31 15:12',
    '08-31 15:13',
    '08-31 15:14',
    '08-31 15:15',
    '08-31 15:16',
    '08-31 15:17',
    '08-31 15:18',
    '08-31 15:19',
  ]);
  const [priceList, setPriceList] = useState([
    47022.9649875,
    47097.6349875,
    47132.3149875,
    47137.6449875,
    47164.9949875,
    47175.9949875,
    47180.9949875,
    47190.9949875,
    47200.9949875,
    47210.9949875,
    47225.9949875,
  ]);

  const size = useRef(dateList.length);

  const [positionX, setPositionX] = useState(-1);// The currently selected X coordinate position

  const panResponder = useRef(
    PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        updatePosition(evt.nativeEvent.locationX);
        return true;
      },
      onPanResponderMove: (evt, gestureState) => {
        updatePosition(evt.nativeEvent.locationX);
        return true;
      },
      onPanResponderRelease: () => {
        setPositionX(-1);
      },
    })
  );

  const apx = (size = 0) => {
    let width = Dimensions.get('window').width;
    return (width / 750) * size;
  };

  const updatePosition = (x) => {
    const YAxisWidth = apx(130);
    const x0 = apx(0);// x0 position
    const chartWidth = apx(750) - YAxisWidth - x0;
    const xN = x0 + chartWidth;//xN position
    const xDistance = chartWidth / size.current;// The width of each coordinate point
    if (x <= x0) {
      x = x0;
    }
    if (x >= xN) {
      x = xN;
    }

    // console.log((x - x0) )

    // The selected coordinate x :
    // (x - x0)/ xDistance = value
    let value = ((x - x0) / xDistance).toFixed(2);
    if (value >= size.current - 1) {
      value = size.current - 1; // Out of chart range, automatic correction
    }

    setPositionX(Number(value));
  };

  const CustomGrid = ({ x, y, ticks }) => (
    <G>
      {
        // Horizontal grid
        ticks.map((tick) => (
          <Line
            key={tick}
            x1="0%"
            x2="100%"
            y1={y(tick)}
            y2={y(tick)}
            stroke="#EEF3F6"
          />
        ))
      }
      {
        // Vertical grid
        priceList.map((_, index) => (
          <Line
            key={index.toString()}
            y1="0%"
            y2="100%"
            x1={x(index)}
            x2={x(index)}
            stroke="#EEF3F6"
          />
        ))
      }
    </G>
  );

  const CustomLine = ({ line }) => (
    <Path
      key="line"
      d={line}
      stroke={(Time == "1h" ? walletDetailsFromRedux?.changePer : ChangePer) >= 0 ? "#08c708" : "#F45532"}
      strokeWidth={apx(4)}
      fill="none"
    />
  );

  const CustomGradient = () => (
    <Defs key="gradient">
      <LinearGradient id="gradient" x1="0" y="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="rgb(134, 65, 244)" />
        <Stop offset="100%" stopColor="rgb(66, 194, 244)" />

        <Stop offset="0%" stopColor="#FEBE18" stopOpacity={0.25} />
        <Stop offset="100%" stopColor="#FEBE18" stopOpacity={0} />
      </LinearGradient>
    </Defs>
  );

  const Tooltip = ({ x, y, ticks }) => {
    if (positionX < 0) {
      return null;
    }

    const date = dateList[positionX];

    return (
      <G x={x(positionX)} key="tooltip">
        <G
          x={positionX > size.current / 2 ? -apx(300 + 10) : apx(10)}
          y={y(priceList[positionX]) - apx(10)}>
          <Rect
            y={-apx(24 + 24 + 20) / 2}
            rx={apx(12)} // borderRadius
            ry={apx(12)} // borderRadius
            width={apx(300)}
            height={apx(96)}
            stroke="rgba(254, 190, 24, 0.27)"
            fill="rgba(255, 255, 255, 0.8)"
          />

          <SvgText x={apx(20)} fill="#617485" opacity={0.65} fontSize={apx(24)}>
            {date}
          </SvgText>
          <SvgText
            x={apx(20)}
            y={apx(24 + 20)}
            fontSize={apx(24)}
            fontWeight="bold"
            fill="rgba(224, 188, 136, 1)">
            ${priceList[positionX]}
          </SvgText>
        </G>

        <G x={x}>
          <Line
            y1={ticks[0]}
            y2={ticks[Number(ticks.length)]}
            stroke="#FEBE18"
            strokeWidth={apx(4)}
            strokeDasharray={[6, 3]}
          />

          <Circle
            cy={y(priceList[positionX])}
            r={apx(20 / 2)}
            stroke="#fff"
            strokeWidth={apx(2)}
            fill="#FEBE18"
          />
        </G>
      </G>
    );
  };

  const verticalContentInset = { top: apx(40), bottom: apx(40) };



  useEffect(() => {
    getGraphDatas()
  }, [Time])

  const getGraphDatas = async () => {
    try {
      var getDatas = await TokenClient.get(ApiConstants.getGraphValue, { params: { Symbol: `${symbol}USDT`, interval: Time, limit: 100 } })
      // console.log("getDatas", getDatas.data);
      if (getDatas.data?.success) {
        setDateList(getDatas.data.data.dateArr)
        setPriceList(getDatas.data.data.priceArr)
        setChangePer(getDatas.data.data.changePercentage ?? 0.000)
      }
    } catch (error) {
      console.log("ereree", error);
    }
  
  }
  const formattedPrice=(cryptoPrice) => cryptoPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // console.log("walletDetailsFromRedux", walletDetailsFromRedux);
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
        <View style={{ height: "12%" }}>
          <Header
            name={  `${walletDetailsFromRedux.currencyName
              ? `${walletDetailsFromRedux.currencyName}`
              : "Ethereum"}`}
            leftImage={"back"}
          />
        </View>
        <View style={{ height: "30%", justifyContent: "space-around" }}>
          <View style={{ alignSelf: "center" }}>
            {walletDetailsFromRedux &&
            !isEmpty(walletDetailsFromRedux?.currencyimage) ? (
              <SvgUri
                width={40}
                height={40}
                uri={`http:/192.53.121.26:8096/images/${walletDetailsFromRedux?.currencyimage}`}
              />
            ) : (
              showImage(walletDetailsFromRedux?.tokenType, "walletHistory")
            )}
          </View>
          <View style={{ alignSelf: "center" }}>
            
            {walletDetailsFromRedux.currency == "TRX" ||
            walletDetailsFromRedux.currency == "ETH" ||
            walletDetailsFromRedux.currency == "BNB" ||
            walletDetailsFromRedux.currency == "BTC" ||
            walletDetailsFromRedux.currency == "MATIC" ? (
              <>
                <Text
                  style={{
                    fontFamily: Fonts.Bold,
                    fontSize: RFPercentage(3.5),
                    color: theme.theme == "light" ? "#612CD2" : "#f1f1f1",
                    marginTop: 10,
                    textAlign: "center",
                    fontWeight:"bold"
                  }}
                >
                  {(fiatSymbol == "USD" && "$") ||
                    (fiatSymbol == "GBP" && "£") ||
                    (fiatSymbol == "EUR" && "€")}
                  {(walletDetailsFromRedux.balance * convertBalance).toFixed(2)}
                </Text>
                <Text
              style={{
                fontFamily: Fonts.Medium,
                fontSize: RFPercentage(2.2),
                color: theme.theme === "dark" ? "white" : "black",
                textAlign: "center",
                fontWeight:"bold"
              }}
            >
              {walletDetailsFromRedux.balance
                ? `${walletDetailsFromRedux.balance} ${walletDetailsFromRedux.currency}`
                : "0 ETH"}
            </Text>
                <View style={{ flexDirection: "row",marginTop:"2%",height:42 }}>
                  <Text
                    style={{
                      color:(walletDetailsFromRedux?.changePer
                     ) < 0
                     ? "#F45532" : "#08c708",
                      textAlign: "center",
                      fontSize: RFPercentage(1.7),
                      fontFamily: Fonts.Regular,
                      marginRight: 5,
                    }}
                  >
                    {(fiatSymbol == "USD" && "$") ||
                  (fiatSymbol == "GBP" && "£") ||
                  (fiatSymbol == "EUR" && "€")}
                {formattedPrice(parseFloat(walletDetailsFromRedux?.singleValue).toFixed(2))} ({walletDetailsFromRedux?.changePer?.toFixed(2)}%)
                  </Text>
                  <Text
                    style={{
                      color: theme.theme === "dark" ? "#fff" : "black",
                      textAlign: "center",
                      fontSize: RFPercentage(1.7),
                      fontFamily: Fonts.Regular,
                    }}
                  >
                    Today
                  </Text>
                </View>
              </>
            ) : (
              <>
              <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: RFPercentage(3),
                    color: theme.theme == "light" ? "#000" : "#f1f1f1",
                    marginTop: 1,
                    textAlign: "center",
                  }}
                >
                 $0.0
                </Text>
              <View style={{ flexDirection: "row",marginTop:"7%"  }}>
              <Text
                style={{
                  color:(walletDetailsFromRedux?.changePer
                    ) < 0
                    ? "#F45532" : "#08c708",
                  textAlign: "center",
                  fontSize: RFPercentage(1.7),
                  fontFamily: Fonts.Regular,
                  marginRight: 5,
                }}
              >
                +3.22% ($3.95)
              </Text>
              <Text
                style={{
                  color: theme.theme === "dark" ? "#fff" : "black",
                  textAlign: "center",
                  fontSize: RFPercentage(1.7),
                  fontFamily: Fonts.Regular,
                }}
              >
                Today
              </Text>
            </View>
              </>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              width:"75%",
              alignSelf:"center",
              height:60,
              
            }}
          >
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("SendBTC");
              }}
            >
              <View
                style={{
                  width: 45,
                  height: 45,
                  borderWidth: 2,
                  borderRadius: 5,
                  borderColor: "rgba(162, 121, 250, 0.30)",
                  backgroundColor: "rgba(155, 124, 220, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {theme.theme == "dark" ? (
                  <SendDark
                    width={windowWidth * 0.04}
                    height={windowWidth * 0.04}
                    style={{ resizeMode: "contain" }}
                  />
                ) : (
                  <Sendlight
                    width={windowWidth * 0.04}
                    height={windowWidth * 0.04}
                    style={{ resizeMode: "contain" }}
                  />
                )}
              </View>
              <Text
                style={{
                  fontFamily: Fonts.Regular,
                  fontSize: RFPercentage(2),
                  color: theme.theme == "dark" ? "#fff" : "#000",
                  textAlign: "center",
                  marginTop: "10%",
                }}
              >
                Send
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("ReceiveBTC");
              }}
              style={{ alignItems: "center" }}
            >
              <View
                style={{
                  width: 45,
                  height: 45,
                  borderWidth: 2,
                  borderRadius: 5,
                  borderColor: "rgba(162, 121, 250, 0.30)",
                  backgroundColor: "rgba(155, 124, 220, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {theme.theme == "light" ? (
                  <Receivelight
                    width={windowWidth * 0.04}
                    height={windowWidth * 0.04}
                    style={{ resizeMode: "contain" }}
                  />
                ) : (
                  <ReceiveDark
                    width={windowWidth * 0.04}
                    height={windowWidth * 0.04}
                    style={{ resizeMode: "contain" }}
                  />
                )}
              </View>
              <Text
                style={{
                  fontFamily: Fonts.Regular,
                  fontSize: RFPercentage(2),
                  color: theme.theme == "dark" ? "#fff" : "#000",
                  textAlign: "center",
                  marginTop: "10%",
                }}
              >
                Receive
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("BuyBTC", (params = "Buy"))
              }}
            >
              <View
                style={{
                  width: 45,
                  height: 45,
                  borderWidth: 2,
                  borderRadius: 5,
                  borderColor: "rgba(162, 121, 250, 0.30)",
                  backgroundColor: "rgba(155, 124, 220, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {theme.theme == "light" ? (
                  <Buylight
                    width={windowWidth * 0.04}
                    height={windowWidth * 0.04}
                    style={{ resizeMode: "contain" }}
                  />
                ) : (
                  <BuyDark
                    width={windowWidth * 0.04}
                    height={windowWidth * 0.04}
                    style={{ resizeMode: "contain" }}
                  />
                )}
              </View>
              <Text
                style={{
                  fontFamily: Fonts.Regular,
                  fontSize: RFPercentage(2),
                  color: theme.theme == "dark" ? "#fff" : "#000",
                  textAlign: "center",
                  marginTop: "10%",
                }}
              >
                Buy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("BuyBTC", (params = "Sell"))
              }}
            >
              <View
                style={{
                  width: 45,
                  height: 45,
                  borderWidth: 2,
                  borderRadius: 5,
                  borderColor: "rgba(162, 121, 250, 0.30)",
                  backgroundColor: "rgba(155, 124, 220, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {theme.theme == "light" ? (
                  <SellLight
                    width={windowWidth * 0.04}
                    height={windowWidth * 0.04}
                    style={{ resizeMode: "contain" }}
                  />
                ) : (
                  <SellDark
                    width={windowWidth * 0.04}
                    height={windowWidth * 0.04}
                    style={{ resizeMode: "contain" }}
                  />
                )}
              </View>
              <Text
                style={{
                  fontFamily: Fonts.Regular,
                  fontSize: RFPercentage(2),
                  color: theme.theme == "dark" ? "#fff" : "#000",
                  textAlign: "center",
                  marginTop: "10%",
                }}
              >
                Sell
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Image
          style={{ width: "100%", height: 1, marginBottom: 15, marginTop: 20 }}
          source={require("../../assets/img/devider.png")}
          resizeMode="cover"
        />
        <View
          style={{
            width: "90%",
            alignSelf: "center",
            paddingVertical: "1%",
            justifyContent: "space-around",
            flexDirection: "row",
          }}
        >
          <Pressable
            onPress={() => setTabs("chart")}
            style={{
              width: "45%",
              backgroundColor:
                tabs == "chart"
                  ? theme.theme == "dark"
                    ? "#612CD2"
                    : "#612CD2"
                  : theme.theme==="light"?"rgba(197, 197, 197, 0.15)": "rgba(197, 197, 197, 0.15)",
              borderColor:
                tabs == "chart"
                  ? theme.theme == "dark"
                    ? "#612CD2"
                    : "#612CD2"
                  : theme.theme==="light"?"rgba(197, 197, 197, 0.30)": "rgba(197, 197, 197, 0.30)",
              borderWidth: 2,
              paddingVertical: "2.5%",
              justifyContent: "center",
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                color:
                  tabs == "chart"
                    ? "white"
                    : theme.theme == "dark"
                    ? "#696969"
                    : "#696969",
                textAlign: "center",
                fontFamily: tabs == "chart" ? Fonts.Regular : Fonts.Regular,
                fontSize: RFValue(12),
              }}
            >
              Chart
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setTabs("transaction")}
            style={{
              width: "45%",
              backgroundColor:
                tabs == "transaction"
                  ? theme.theme == "dark"
                    ? "#612CD2"
                    : "#612CD2"
                  : theme.theme==="light"?"rgba(197, 197, 197, 0.15)": "rgba(197, 197, 197, 0.15)",
              borderColor:
                tabs == "transaction"
                  ? theme.theme == "dark"
                    ? "#612CD2"
                    : "#612CD2"
                  :theme.theme==="light"?"rgba(197, 197, 197, 0.30)": "rgba(197, 197, 197, 0.30)",
              borderWidth: 2,
              paddingVertical: "2.5%",
              justifyContent: "center",
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                color:
                  tabs == "transaction"
                    ? "white"
                    : theme.theme == "dark"
                    ? "#696969"
                    : "#696969",
                textAlign: "center",
                fontFamily: tabs == "transaction" ? Fonts.Regular : Fonts.Regular,
                fontSize: RFValue(12),
              }}
            >
              Transactions
            </Text>
          </Pressable>
        </View>

        {tabs == "transaction" ? (
          <View style={{ height: "50%", justifyContent: "center",backgroundColor:"white",borderRadius:5,marginTop:"5%" }}>
            {transactionListBitCoinUnconfirmed.length != 0 && (
              <>
                {walletDetailsFromRedux.currency == "BTC" && (
                  <>
                    {/* <Card
                  containerStyle={{
                    width: "95%",
                    height: "100%",

                    alignSelf: "center",
                    borderRadius: 20,
                    borderColor: theme.theme == "light" ? "#f6f6f6" : "#292929",
                    backgroundColor: theme.theme == "light" ? "#f6f6f6" : "#292929",
                  }}
                > */}
                    <FlatList
                      data={transactionListBitCoinUnconfirmed}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item, index }) => {
                        return (
                          <View style={{ padding: 10 }}>
                            <TouchableOpacity
                              onPress={() => {
                                let networkUrl = bitcoin_url;
                                props.navigation.navigate(
                                  "WalletHistoryWebView",
                                  {
                                    url: networkUrl + item.tx_hash,
                                  }
                                );
                              }}
                            >
                              <View>
                                <Text
                                  style={{
                                    fontFamily: Fonts.Bold,
                                    fontSize: 14,
                                    color: "#F45532",
                                  }}
                                >
                                  Pending
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 14,
                                    color: theme.text,
                                  }}
                                >
                                  Tx:{" "}
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 14,
                                    color: "grey",
                                  }}
                                >
                                  {item.tx_hash.substring(1, 10)}...
                                  {item.tx_hash.substring(20, 30)}
                                </Text>
                              </View>

                              <View>
                                <Text
                                  style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 12,
                                    color: "grey",
                                  }}
                                >
                                  {item.address}
                                </Text>
                              </View>
                              <View style={{ flexDirection: "row" }}>
                                <Text
                                  style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 14,
                                    color: theme.text,
                                  }}
                                >
                                  Date:{" "}
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 14,
                                    color: "grey",
                                  }}
                                >
                                  {moment(item.received).format(
                                    "YYYY-MM-DD hh:mm A"
                                  )}
                                </Text>
                              </View>

                              <View
                                style={{
                                  flexDirection: "row",
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 14,
                                    color: theme.text,
                                  }}
                                >
                                  Amount:{" "}
                                </Text>

                                <Text
                                  style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 14,
                                    color: "grey",
                                  }}
                                >
                                  {item.value / 100000000}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        );
                      }}
                    />
                    {/* </Card> */}
                  </>
                )}
              </>
            )}

            {/* {transactionListBitCoinUnconfirmed.length == 0 && (
          <> */}
            {/* bitcoin history shows here */}
            {walletDetailsFromRedux?.currency == "BTC" && (
              <>
                {transactionListBitCoin?.length == 0 ? (
                  <Card
                    containerStyle={{
                      width: "95%",
                      height: "100%",
                      alignSelf: "center",
                      borderRadius: 5,
                      elevation: 0,
                      borderColor: "transparent",
                      backgroundColor: "transparent",
                    }}
                  >
                    <View style={{ marginTop: 80, alignItems: "center" }}>
                      {/* <Icn
                        name="search"
                        type="MaterialIcons"
                        style={{
                          alignSelf: "center",
                        }}
                        color={theme.theme == "light" ? "#000" : "#fff"}
                        size={50}
                      /> */}
                      {/* <View style={{ alignItems: "center" }}>
                        {theme.theme == "light" ?
                          (<SearchLight width={windowWidth * 0.08} height={windowWidth * 0.08} style={{ resizeMode: "contain" }} />)
                          : (<SearchDark width={windowWidth * 0.08} height={windowWidth * 0.08} style={{ resizeMode: "contain" }} />)
                        }
                      </View> */}

                      <Text
                        style={{
                          fontFamily: Fonts.Regular,
                          fontSize: 14,
                          marginTop: "10%",
                          textAlign: "center",
                          color: theme.theme == "light" ? "#000" : "#000",
                        }}
                      >
                        You have no transactions!
                      </Text>
                    </View>
                  </Card>
                ) : (
                  <Card
                    containerStyle={{
                      width: "95%",
                      height: "100%",
                      alignSelf: "center",
                      borderRadius: 20,
                      borderColor:
                        theme.theme == "light" ? "#f6f6f6" : "#292929",
                      backgroundColor: theme.background,
                    }}
                  >
                    <FlatList
                      data={transactionListBitCoin}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item, index }) => {
                        return (
                          <View style={{ padding: 10 }}>
                            <TouchableOpacity
                              onPress={() => {
                                let networkUrl = bitcoin_url;
                                props.navigation.navigate(
                                  "WalletHistoryWebView",
                                  {
                                    url: networkUrl + item.tx_hash,
                                  }
                                );
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 14,
                                    color: theme.text,
                                  }}
                                >
                                  Tx:{" "}
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 14,
                                    color: "grey",
                                  }}
                                >
                                  {item.tx_hash.substring(1, 10)}...
                                  {item.tx_hash.substring(20, 30)}
                                </Text>
                              </View>
                              <View>
                                <Text
                                  style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 14,
                                    color: "grey",
                                  }}
                                >
                                  {moment(item.confirmed).format(
                                    "YYYY-MM-DD hh:mm A"
                                  )}
                                </Text>
                              </View>
                              {(item.spent != false ||
                                item.spent == undefined) && (
                                <View
                                  style={{
                                    flexDirection: "row",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontFamily: Fonts.Regular,
                                      fontSize: 14,
                                      color: "grey",
                                    }}
                                  >
                                    Amount:{" "}
                                  </Text>

                                  <Text
                                    style={{
                                      fontFamily: Fonts.Regular,
                                      fontSize: 14,
                                      color: "grey",
                                    }}
                                  >
                                    {item.ref_balance / 100000000}
                                  </Text>
                                </View>
                              )}
                            </TouchableOpacity>
                          </View>
                        );
                      }}
                    />
                  </Card>
                )}
              </>
            )}
            {/* </>
        )} */}
            {/* bitcoin address ends here */}

            {/* except bitcoin history */}
            {walletDetailsFromRedux?.currency != "BTC" && (
              <>
                {transactionList?.length == 0 ? (
                  <Card
                    containerStyle={{
                      width: "95%",
                      height: "100%",
                      alignSelf: "center",
                      borderColor: "transparent",
                      backgroundColor: "transparent",
                    }}
                  >
                    <View style={{ marginTop: 80 }}>
                      {/* <Icn
                    name="search"
                    type="MaterialIcons"
                    style={{
                      alignSelf: "center",
                      paddingBottom: 20
                    }}
                    color={theme.theme == "light" ? "#000" : "#fff"}
                    size={40}

                  /> */}
                      {/* <View style={{ alignItems: "center" }}>
                    {theme.theme == "light" ?
                      (<SearchLight width={windowWidth * 0.08} height={windowWidth * 0.08} style={{ resizeMode: "contain" }} />)
                      : (<SearchDark width={windowWidth * 0.08} height={windowWidth * 0.08} style={{ resizeMode: "contain" }} />)
                    }
                  </View> */}

                      <Text
                        style={{
                          fontFamily: Fonts.Regular,
                          fontSize: 14,
                          marginTop: "10%",
                          textAlign: "center",
                          color: theme.theme == "light" ? "#000" : "#000",
                        }}
                      >
                        You have no transactions!
                      </Text>
                    </View>
                  </Card>
                ) : (
                  <Card
                    containerStyle={{
                      width: "95%",
                      height: "100%",
                      alignSelf: "center",
                      backgroundColor: "none",
                      borderColor: "transparent",
                    }}
                  >
                    <FlatList
                      data={transactionList}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item, index }) => {
                        return (
                          <View style={{ padding: 10 }}>
                            <TouchableOpacity
                              onPress={() => {
                                let networkUrl =
                                  walletDetailsFromRedux.tokenType === "ERC20"
                                    ? eth_url
                                    : walletDetailsFromRedux.tokenType ===
                                      "TRC20"
                                    ? tron_url
                                    : walletDetailsFromRedux.tokenType ===
                                      "MAT20"
                                    ? mat_url
                                    : bnb_url;
                                props.navigation.navigate(
                                  "WalletHistoryWebView",
                                  {
                                    url: networkUrl + item.txid,
                                  }
                                );
                              }}
                            >
                              <View style={{ flexDirection: "row" }}>
                                {item.toaddress != undefined && (
                                  <>
                                    {item?.toaddress?.toUpperCase() ==
                                    walletDetailsFromRedux?.walletaddress?.toUpperCase() ? (
                                      <Icn
                                        name="align-bottom"
                                        type="entypo"
                                        style={{
                                          alignSelf: "center",
                                        }}
                                        color={ theme.theme == "light" ? "#000" : "#000"}
                                        size={25}
                                      />
                                    ) : (
                                      <Icn
                                        name="align-top"
                                        type="entypo"
                                        style={{
                                          alignSelf: "center",
                                        }}
                                        color={ theme.theme == "light" ? "#000" : "#000"}
                                        size={25}
                                      />
                                    )}
                                  </>
                                )}
                                {item.toaddress != undefined && (
                                  <>
                                    {item.toaddress.toUpperCase() ==
                                    walletDetailsFromRedux?.walletaddress?.toUpperCase() ? (
                                      <Text
                                        style={{
                                          marginHorizontal: 8,
                                          fontFamily: Fonts.Bold,
                                          fontSize: 16,
                                          color:  theme.theme == "light" ? "#000" : "#000",
                                        }}
                                      >
                                        Receive
                                      </Text>
                                    ) : (
                                      <Text
                                        style={{
                                          marginHorizontal: 8,
                                          fontFamily: Fonts.Bold,
                                          fontSize: 16,
                                          color:  theme.theme == "light" ? "#000" : "#000",
                                        }}
                                      >
                                        Send
                                      </Text>
                                    )}
                                  </>
                                )}
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginHorizontal: 30,
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: Fonts.Bold,
                                    fontSize: 14,
                                    color:  theme.theme == "light" ? "#000" : "#000",
                                  }}
                                >
                                  Amount:{" "}
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: Fonts.Bold,
                                    fontSize: 14,
                                    color: "grey",
                                  }}
                                >
                                  {item.amount}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginHorizontal: 30,
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 14,
                                    color:  theme.theme == "light" ? "#000" : "#000",
                                  }}
                                >
                                  Tx:{" "}
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: 14,
                                    color: "grey",
                                  }}
                                >
                                  {item.txid.substring(1, 10)}...
                                  {item.txid.substring(20, 30)}
                                </Text>
                              </View>
                              <View>{convert(item.timestamp)}</View>
                            </TouchableOpacity>
                          </View>
                        );
                      }}
                    />
                  </Card>
                )}
              </>
            )}
          </View>
        ) : (
          <View
            style={{
              // flexDirection: 'row',
              width: "100%",
              height: windowheight * 0.35,
              alignSelf: "center",
              marginTop: "2.5%",
              position: "relative",
            }}
          >
            <View
              style={{
                // position: "absolute",
                top: "5%",
                alignSelf:'center',
              paddingHorizontal:10,
                height: 50,
                
                borderRadius: 5,
                borderColor: "transparent",
                // backgroundColor: "rgba(155, 124, 220, 0.15)",
                alignItems: "center",
                justifyContent: "center",
                flexDirection:"row"

              }}
            >
              <Text
                style={{
                  fontSize: RFPercentage(2),
                  color: (Time == "1h"
                  ? walletDetailsFromRedux?.changePer
                  : ChangePer) < 0
                  ? "#F45532" : "#08c708",
                  fontFamily: Fonts.Medium,
                  marginRight:"0%"
                }}
              >
                {(fiatSymbol == "USD" && "$") ||
                  (fiatSymbol == "GBP" && "£") ||
                  (fiatSymbol == "EUR" && "€")}
                {formattedPrice(parseFloat(walletDetailsFromRedux?.singleValue).toFixed(2))}
              </Text>
              <Text
                style={{
                  fontSize: RFPercentage(2),
                  color:
                    (Time == "1h"
                      ? walletDetailsFromRedux?.changePer
                      : ChangePer) < 0
                      ? "#F45532" : "#08c708",
                  fontFamily: Fonts.Medium,
                  marginLeft:"1%"
                }}
              >
               ({Time == "1h"
                  ? walletDetailsFromRedux?.changePer?.toFixed(2)
                  : ChangePer?.toFixed(2)}
                %)
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                height: "40%",
                alignSelf: "center",
                marginTop: "8%",
                
              }}
            >
              {/* <YAxis
              style={{ width: apx(30) }}
              data={priceList}
              contentInset={verticalContentInset}
              svg={{ fontSize: apx(20), fill: '#617485' }}
            /> */}
              <View
                style={{ flex: 1, justifyContent: "center", marginTop: "15%", }}
              >
                {/* <View style={{ flex: 1, justifyContent: "center" }} {...panResponder.current.panHandlers}> */}
                {/* <View style={{ width: "95%", alignSelf: "center", paddingVertical: "2%", flexDirection: "row", alignItems: "center" }} /> */}
                {/* 
                <LineChart
                  style={{ flex: 1, backgroundColor: "transparent" }}
                  data={priceList}
                  curve={shape.curveNatural}
                  contentInset={{ ...verticalContentInset }}
                  showGrid={true}
                >
                  <CustomLine />
                  <CustomGradient />
                </LineChart> */}

                <AreaChart
                  style={{ height: 200, position: "relative" }}
                  data={priceList}
                  gridMin={-100}
                  gridMax={120}
                  start={-100}
                  contentInset={{ top: 30, bottom: 30 }}
                  svg={{ fill: "transparent" }}
                >
                  <CustomLine />

                  <Line />
                </AreaChart>
                <Image
                    style={{
                      width: "100%",
                      height: 1.5,
                      marginBottom: 10,
                      // marginTop: 10,
                      alignSelf: "center",
                      
                    }}
                    source={require("../../assets/img/devider.png")}
                    resizeMode="contain"
                  />
                <View
                  style={{
                    // position: "absolute",
                    // top: "55%",
                    alignSelf: "center",
                    // borderWidth:1
                  }}
                >
                  
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      width: "85%",
                      alignSelf: "center",
                    }}
                  >
                    {scheduledata.map((e, i) => (
                      <>
                        <Pressable
                          onPress={() => {
                            setSelectedindex(i);
                            setTime(e.toLowerCase());
                          }}
                          underlayColor={"rgba(211,211,211,0.2)"}
                          style={{
                            width: "16%",
                            justifyContent: "space-around",
                            marginLeft: 1,
                            height: 25,
                          }}
                        >
                          <View style={{ height: "80%" }}>
                            <Text
                              style={{
                                fontFamily: Fonts.Regular,
                                fontSize: RFValue(14),
                                color: theme.text,
                                textAlign: "center",
                                // marginLeft: "7.5%"
                                color:
                                  selectedindex == i
                                    ? "#A279FA"
                                    : theme.theme == "dark"
                                    ? "#fff"
                                    : "#000",
                                textAlign: "center",
                                fontFamily:
                                  selectedindex == i
                                    ? Fonts.Medium
                                    : Fonts.Regular,
                                fontSize: RFValue(12),
                              }}
                            >
                              {e}
                            </Text>
                          </View>
                        </Pressable>
                      </>
                    ))}
                  </View>
                </View>

                {/* <LineChart
              data={{
                // labels: Array.from({ length: chartData.length }, (_, i) => i.toString()),
                datasets: [{ data: chartData }],
              }}
              width={350}
              height={200}
              yAxisLabel="$"
              withVerticalLabels={false}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },

                // propsForDots: {
                //   r: '6',
                //   strokeWidth: '2',
                //   stroke: '#ffa726',
                // },
              }}
              withDots={false}
              // withScrollableDot={true}

              bezier
              style={{
                marginVertical: 8,
                borderRadius: 5,

              }}
            /> */}
              </View>
            </View>
            {/* <XAxis
            style={{
              alignSelf: 'stretch',
              width: apx(800),
              height: apx(60),
            }}
            numberOfTicks={5}
            data={dateList}
            // formatLabel={(value, index) => dateList[value]}
            contentInset={{
              left: apx(36),
              right: apx(130),
            }}
            svg={{
              fontSize: apx(20),
              fill: '#617485',
              y: apx(20),
              // originY: 30,
            }}
          /> */}
          </View>
        )}
        {/* except bitcoin history ends */}
        {/* </LinearGradient> */}
      </ImageBackground>
    </SafeAreaView>
  );
};
export default WalletHistory;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.background,
    },
  });
