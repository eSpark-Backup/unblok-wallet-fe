

import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Header from "../../Components/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  convertHexToNumber,
  getSignParamsMessage,
  toExpo,
} from "../../api/common";

import themeContext from "../../utils/themeContext";
import { Card } from "react-native-shadow-cards";
import { Image } from "react-native-elements";
import { Fonts } from "../../utils/Fonts";
import { CHAIN_INFO, useWeb3WithRPC } from "../DappScreens/useWeb3";
import Info from "../../assets/img/infob.svg";
import Infowhite from "../../assets/img/infobwhite.svg";

import { useFocusEffect } from "@react-navigation/native";
import { getSdkError } from "@walletconnect/utils";
import { Toastfn } from "../../utils/toast";
import {
  ApproveReq_WC2,
  eth_sendTransaction_WC2,
  personal_sign_WC2,
  tokenBlanace,
  _rejectsession,
} from "./WC2";




const SignPage = (props) => {
  const { DefaultCurrencys, fiatData } = useSelector(
    (state) => state.fiatDataReducer
  );
  const { type, page, Session, payload, Site_Detail, current_session, All_Session } = useSelector(
    (state) => state.wcreducer
  );

  const selectedWallet = useSelector(
    (state) => state.selectedCurrencyListReducer.selectedList
  );

  const currencyListFromRedux = useSelector(
    (state) => state.walletDetailReducer.currencyList
);

  console.log("current_session", type, page, Session, payload, Site_Detail, current_session);
  var current = All_Session.filter(it => it.topic == payload.topic)[0]
  var site = All_Session.filter(it => it.topic == payload.topic)[0]?.peer?.metadata
  // console.log("hellllllllllllo", current, site);
  var chainid = current?.namespaces?.eip155?.accounts[0]?.split(':')[1]
  // console.log("DefaultCurrencys, fiatData", DefaultCurrencys, chainid)
  const current_chain = () => CHAIN_INFO.filter(
    (it) => it.chainId == chainid
  )?.pop();

  const wallet = useSelector(
    (state) => state.selectedCurrencyListReducer.selectedList
  );

  // const current_chain = CHAIN_INFO.filter(
  //   (it) => it.currency == Session?.lp?.currency
  // )?.pop();
  if (payload?.params?.request?.method != "personal_sign") {
    var { gasPrice, gas, value, to, data, from } =
      payload?.params?.request?.params[0];
  }
  console.log("agagaggggaa",payload?.params?.request?.params[0]);

  useFocusEffect(useCallback(() => {
    getbalance()
  }, []))
  const [bln, setbln] = useState(0)
  const getbalance = async () => {
    var getbln = await tokenBlanace(chainid, Session?.lp?.walletaddres)
    setbln(getbln)
  }
  console.log("bln", bln)
  const Approve = async () => {
    try {
      setisload(true);
      var response = await transaction();
      console.log("response", response)
      var app = await ApproveReq_WC2({ topic: payload.topic, response });
      if (app === true) {
        setisload(false);
        // props.navigation.navigate("WalletConnect");
        props.navigation.goBack();
        Toastfn(`Transaction Executed Successfully`);

      } else {
        setisload(false);
        Toastfn(`${app}`);
      }
    } catch (e) {
      setisload(false);
      console.error("uwteqweuqwt", e);
      Toastfn(`${e.toString().split("Error:")[1]}`);

    }
  };
  const [_Gas, SetGas] = useState({});
  const [isload, setisload] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const rpcurl = CHAIN_INFO.filter(
        (item) => item.currency == Session?.lp?.currency
      )?.pop()?.rpc;
      const web3 = useWeb3WithRPC(rpcurl);
      var gasPrice_custom, gas_custom;
      if (payload?.params?.request?.method != "personal_sign") {
        if (gasPrice == undefined) {
          (async () => {
            gasPrice_custom = await web3.eth.getGasPrice();
            SetGas({ ..._Gas, ...{ gasPrice_custom } });
          })();
        }

        // Estimate gas with { to, data } when gas is null
        if (gas == undefined) {
          // //console.log("dsdsadsa>>>>>>>>>>>")
          (async () => {
            //console.log("lp MANDAYA SEKIRAM VA", gas, gasPrice);
            try {
              gas_custom = await web3.eth.estimateGas({
                from,
                to,
                data,
                value,
              });
            } catch (E) {
              console.error("mlmlmlmlm", E);
            }
            // //console.log("dsdsadsa",gas_custom);
            //console.log("kosu part 2", gas, gas_custom);
            SetGas({ ..._Gas, ...{ gas_custom } });
          })();
        }
      }
    }, [gas, gasPrice])
  );

  const fiatdata = fiatData
    ?.map(
      (it) =>
        it[
        Object.keys(it)
          .filter(
            (item) =>
              item ==
              current_chain()?.currency?.toString()?.toLowerCase()
          )
          .pop()
        ]
    )
    .filter((it) => it && it)
    ?.pop();
    console.log("fiatData",fiatData);
  const Current_Fiat = useMemo(() => {
    var values = value
      ? toExpo(
        (convertHexToNumber(value) / 1e18) *
        fiatData
          .map(
            (it) =>
              it[
              Object.keys(it)
                .filter(
                  (item) =>
                    item ==
                    current_chain()?.currency
                      ?.toString()
                      ?.toLowerCase()
                )
                .pop()
              ]
          )
          .filter((it) => it && it)
          ?.pop()
      )
      : 0;
    console.log("Current_Fiat", Current_Fiat);
    gas = toExpo(
      (((gas ? convertHexToNumber(gas) : _Gas?.gas_custom) *
        (gasPrice ? convertHexToNumber(gasPrice) : _Gas?.gasPrice_custom)) /
        1e18) *
      fiatdata
    );
    return {
      value: values,
      gas: gas,
      total: parseFloat(value) + parseFloat(gas),
    };
  }, [_Gas]);
  // //console.log("Current_Fiat",Current_Fiat)
  const transaction = async (Coming_Type) => {
    try {
      var message = getSignParamsMessage(payload?.params?.request?.params);
      console.log("messagecccccccccc",page, message);
      const getWallet = wallet.filter(val => val.walletaddress.toLowerCase() == message?.from?.toLowerCase())[0] ?? currencyListFromRedux ?? selectedWallet
      console.log("getWallet",getWallet);
      var result =
        page == "personal_sign"
          ? personal_sign_WC2(getWallet, message, payload?.id, chainid)
          : await eth_sendTransaction_WC2(
            getWallet,
            payload,
            Coming_Type,
            _Gas,
            chainid
          );
      console.log("result", page, result);
      return result;
    } catch (e) {
      console.error("failed result", e);
      return false;
    }
  };
  const Reject = async () => {
    try {
      setisload(true);
      var result = await transaction("cancel");
      console.log("Welcom to my ", result.id,payload.id,Session?.connector);
      var app = await _rejectsession(
        {
          id: payload.id, // required
          reason: getSdkError("USER_REJECTED"),
          // {
          //   code: getSdkError("USER_REJECTED"), // optional
          //   message: getSdkError("USER_REJECTED"), // optional
          // },
          // js
        },
        payload.topic
      );

      //console.log("app",app)
      if (app === true) {
        setisload(false);

        // props.navigation.navigate("WalletConnect");
        props.navigation.goBack();
      } else {
        setisload(false);
        Toastfn(`${app}`);
      }
    } catch (E) {
      setisload(false);
      console.error("E", E);
      Toastfn(`${E.toString().split("Error:")[1]}`);
    }
  };

  const theme = useContext(themeContext);
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  return page == "personal_sign" ? (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background
      }}
    >
      <Header name={type} leftImage={"back"} />

      <View style={{ height: "70%", justifyContent: "center", marginTop: 30, paddingBottom: 30, }}>
        <ScrollView>
          <Card
            style={{
              width: "90%",
              marginTop: "5%",
              alignSelf: "center",
              borderWidth: 0.5,
              borderColor: "gray",
              paddingVertical: "2.5%",
              borderRadius: 10,
              justifyContent: "space-evenly",
              backgroundColor: theme.background

            }}
          >
            <View
              style={{
                width: "90%",
                marginTop: "5%",
                alignSelf: "center",
                borderWidth: 0.5,
                borderColor: "gray",
                paddingVertical: "2.5%",
                borderRadius: 10,
                justifyContent: "space-evenly",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  // justifyContent: "space-between",
                  paddingVertical: "4%",
                  width: "100%",
                }}
              >
                <View style={{ width: "30%", }} >

                  <Text
                    style={{
                      fontFamily: Fonts.Medium,
                      fontSize: 16,
                      marginLeft: "10%",
                      color: theme.text,
                    }}
                  >
                    From
                  </Text>
                </View>
                <View style={{ width: "70%", }} >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: Fonts.Medium,
                      fontSize: 16,
                      color: theme.search,
                      width: "70%",
                    }}
                  >
                    {Session?.lp?.walletname}
                  </Text>
                </View>

              </View>

              <View
                style={{
                  // alignItems: "center",
                  flexDirection: "row",
                  // justifyContent: "space-between",
                  paddingVertical: "4%",
                  width: "100%",
                }}
              >
                <View style={{ width: "30%", }} >
                  <Text
                    style={{
                      fontFamily: Fonts.Medium,
                      fontSize: 16,
                      color: theme.text,
                      marginLeft: "10%"
                    }}
                  >
                    DApp
                  </Text>
                </View>
                <View style={{ width: "70%", }} >

                  <Text
                    style={{
                      fontFamily: Fonts.Medium,
                      fontSize: 16,
                      color: theme.search,
                    }}
                  >
                    {site?.name}-
                  </Text>
                </View>
              </View>
            </View>
          </Card>
          {/* <Card style={{ width: "90%", marginTop: "5%", alignSelf: "center", borderWidth: 0.5, borderColor: "gray", paddingVertical: "2.5%", borderRadius: 10, justifyContent: "space-evenly", }}  >
              <View style={{ alignItems: "center", flexDirection: "row", width: "100%", paddingVertical: "4%", borderBottomWidth: 0.5, borderColor: "gray", paddingHorizontal: "4%" }} >
                <View style={{ width: "30%" }} >
                  <Text style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,

                    color: "#000",
                  }} >From</Text>
                </View>
                <View style={{ width: "70%", alignItems: "flex-end" }} >
                  <Text
                    style={{
                      fontFamily: Fonts.Medium,
                      fontSize: 16,
                      color: "gray",
                    }} >
                     {Session?.lp?.walletname}
                      </Text>
                </View>
              </View>


              <View style={{ alignItems: "center", flexDirection: "row", width: "100%", paddingVertical: "4%", paddingHorizontal: "4%" }} >
                <View style={{ width: "30%" }} >
                  <Text style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,

                    color: "#000",
                  }} >DApp</Text>
                </View>
                <View style={{ width: "70%", alignItems: "flex-end", }} >
                  <Text
                    style={{
                      fontFamily: Fonts.Medium,
                      fontSize: 16,
                      color: "gray",
                    }} >
                   {Site_Detail?.name}
                  </Text>
                </View>
              </View>

              </Card> */}

          <Card
            style={{
              width: "90%",
              marginTop: "5%",
              alignSelf: "center",
              borderWidth: 0.5,
              borderColor: "gray",
              paddingVertical: "2.5%",
              borderRadius: 10,
              justifyContent: "space-evenly",
              marginBottom: "5%",
              backgroundColor: theme.background

            }}
          >
            <View style={{ padding: "5%" }}>
              <Text
                style={{
                  fontFamily: Fonts.Medium,
                  fontSize: 16,
                  color: theme.search,
                  width:"100%"
                }}
              >
                {getSignParamsMessage(payload?.params?.request?.params)}
              </Text>
            </View>
          </Card>
        </ScrollView>
      </View>
      {isload ? (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "90%", marginLeft: "5%" }}>

          <TouchableOpacity
            style={{
              backgroundColor: "transparent", borderColor: theme.texttheme, borderWidth: 1,
              borderRadius: 30, width: 150, padding: 15, marginTop: 10, marginBottom: 10, paddingVertical: 15, alignSelf: "center"
            }}
          >
            <ActivityIndicator color={"#000"} size={"small"} />
          </TouchableOpacity>
        </View>
      ) :

        (
          <View style={{ flexDirection: "row", alignItems: "center", width: "90%", marginLeft: "5%", justifyContent: "space-around" }}>

            <TouchableOpacity
              style={{
                backgroundColor: "transparent", borderColor: theme.texttheme, borderWidth: 1,
                borderRadius: 30, width: 150, padding: 15, marginTop: 10, marginBottom: 10, paddingVertical: 15, alignSelf: "center"
              }}
              onPress={() => {
                Approve();
              }}
            >
              <Text
                style={{
                  width: "100%", textAlign: "center",
                  fontFamily: Fonts.Regular, color: theme.texttheme
                }}
              >
                Sign
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "transparent", borderColor: theme.texttheme, borderWidth: 1,
                borderRadius: 30, width: 150, padding: 15, marginTop: 10, marginBottom: 10, paddingVertical: 15, alignSelf: "center"
              }}
              onPress={() => {
                Reject();
              }}
            >
              <Text
                style={{
                  width: "100%", textAlign: "center",
                  fontFamily: Fonts.Regular, color: theme.texttheme
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
            style={{
              width: "90%",
              justifyContent: "center",
              alignSelf: "center",
              height: 50,
              backgroundColor: theme.theme == "dark" ? "#fff" : "#fc0",
              borderRadius: 10,
              position: "absolute",
              bottom: "3%",
            }}
            onPress={() => {
              Reject();
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.Medium,
                fontSize: 16,
                color: "#000",
                textAlign: "center",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity> */}
          </View>
        )}
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <Header name={"Smart Contract Call"} leftImage={"back"} />

      <View style={{ height: "85%", marginTop: 30, paddingBottom: 30 }}>
        <ScrollView>
          <Text
            style={{
              fontFamily: Fonts.Medium,
              fontSize: 22,
              color: theme.text,
              textAlign: "center",
              marginTop: 30,
            }}
          >
            {toExpo(convertHexToNumber(value) / 1e18)}{" "}
            {current_chain()?.currency}
          </Text>

          <Text
            style={{
              fontFamily: Fonts.Medium,
              fontSize: 16,
              color: theme.search,
              textAlign: "center",
              marginTop: 10
            }}
          >
            = {DefaultCurrencys} {Current_Fiat?.value}
          </Text>

          <Card
            style={{
              width: "90%",
              marginTop: 10,
              alignSelf: "center",
              borderWidth: 0.5,
              borderColor: "gray",
              paddingVertical: "2.5%",
              borderRadius: 10,
              justifyContent: "space-evenly",
              marginBottom: 20,

              backgroundColor: theme.background

            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                paddingVertical: "4%",
                borderBottomWidth: 0.5,
                borderColor: "gray",
                paddingHorizontal: "4%",
              }}
            >
              <View style={{ width: "30%" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,

                    color: theme.text,
                  }}
                >
                  Asset
                </Text>
              </View>
              <View style={{ width: "70%", alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,
                    color: theme.search,
                  }}
                >
                  {current_chain()?.name} (
                  {current_chain()?.currency})
                </Text>
              </View>
              {console.log("kaakakakakak", current_chain()?.name, (current_chain()?.currency))}
            </View>

            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                paddingVertical: "4%",
                borderBottomWidth: 0.5,
                borderColor: "gray",
                paddingHorizontal: "4%",
              }}
            >
              <View style={{ width: "30%" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,

                    color: theme.text,
                  }}
                >
                  From
                </Text>
              </View>
              <View style={{ width: "70%", alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,
                    color: theme.search,
                  }}
                >
                  {Session?.lp?.walletname}{" "}
                  {Session?.lp?.walletaddres
                    ?.toString()
                    ?.substr(0, 3)
                    .concat("...")
                    .concat(
                      Session?.lp?.walletaddres?.toString()?.substr(0, 3)
                    )}
                </Text>
              </View>
            </View>

            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                paddingVertical: "4%",
                paddingHorizontal: "4%",
              }}
            >
              <View style={{ width: "30%" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,

                    color: theme.text,
                  }}
                >
                  DApp
                </Text>
              </View>
              <View style={{ width: "70%", alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,
                    color: theme.search,
                  }}
                >
                  {site?.name ??
                    site?.name}
                </Text>
              </View>
            </View>
          </Card>

          <Card
            style={{
              width: "90%",
              marginTop: 10,
              marginBottom: 20,
              alignSelf: "center",
              borderWidth: 0.5,
              borderColor: "gray",
              paddingVertical: "2.5%",
              borderRadius: 10,
              justifyContent: "space-evenly",
              backgroundColor: theme.background

            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                paddingVertical: "4%",
                borderBottomWidth: 0.5,
                borderColor: "gray",
                paddingHorizontal: "4%",
              }}
            >
              <View
                style={{
                  width: "40%",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,
                    color: theme.text,
                  }}
                >
                  Network Fee
                </Text>
                {
                  theme.theme == "dark" ?
                    <Infowhite width={15} height={15} style={{ marginLeft: "3%" }} />
                    :
                    <Info width={15} height={15} style={{ marginLeft: "3%" }} />

                }

              </View>
              <View style={{ width: "60%", alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,
                    color: theme.search,
                  }}
                >
                  {toExpo(
                    ((gas ? convertHexToNumber(gas) : _Gas?.gas_custom) *
                      (gasPrice
                        ? convertHexToNumber(gasPrice)
                        : _Gas?.gasPrice_custom)) /
                    1e18
                  )}{" "}
                  {current_chain()?.name} (
                  {current_chain()?.currency}) = {DefaultCurrencys}{" "}
                  {Current_Fiat?.gas}
                </Text>
              </View>
            </View>

            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                paddingVertical: "4%",
                paddingHorizontal: "4%",
              }}
            >
              <View style={{ width: "30%" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,

                    color: theme.text,
                  }}
                >
                  Max Total
                </Text>
              </View>
              <View style={{ width: "70%", alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontFamily: Fonts.Medium,
                    fontSize: 16,
                    color: theme.search,
                  }}
                >
                  {DefaultCurrencys} {Current_Fiat?.total}
                </Text>
              </View>
            </View>
          </Card>






        </ScrollView>


        {isload ? (
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "90%", marginLeft: "5%" }}>

            <TouchableOpacity
              style={{
                backgroundColor: "transparent", borderColor: theme.texttheme, borderWidth: 1,
                borderRadius: 30, width: 150, padding: 15, marginTop: 10, marginBottom: 10, paddingVertical: 15
              }}
            >
              <ActivityIndicator color={"#000"} size={"small"} />
            </TouchableOpacity>
          </View>
        ) :

          // bln < toExpo(
          //   ((gas ? convertHexToNumber(gas) : _Gas?.gas_custom) *
          //     (gasPrice
          //       ? convertHexToNumber(gasPrice)
          //       : _Gas?.gasPrice_custom)) /
          //   1e18
          // ) ?
          (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "90%", marginLeft: "5%" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "transparent", borderColor: theme.texttheme, borderWidth: 1,
                  borderRadius: 30, width: 150, padding: 15, marginTop: 10, marginBottom: 10, paddingVertical: 15
                }}
                onPress={() => Approve()}
              >
                <Text
                  style={{
                    width: "100%", textAlign: "center",
                    fontFamily: Fonts.Regular, color: theme.texttheme
                  }}
                >
                  Sign
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "transparent", borderColor: theme.texttheme, borderWidth: 1,
                  borderRadius: 30, width: 150, padding: 15, marginTop: 10, marginBottom: 10, paddingVertical: 15
                }}
                onPress={() => Reject()}
              >
                <Text
                  style={{
                    width: "100%", textAlign: "center",
                    fontFamily: Fonts.Regular, color: theme.texttheme
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          )


          // :
          // (
          //   <>
          //     <TouchableOpacity
          //       style={{
          //         width: "90%",
          //         justifyContent: "center",
          //         alignSelf: "center",
          //         height: 50,
          //         backgroundColor: theme.theme == "dark" ? "#fff" : "#fc0",
          //         borderRadius: 10,
          //         bottom: "7%",
          //       }}
          //       onPress={() => Approve()}
          //     >
          //       <Text
          //         style={{
          //           fontFamily: Fonts.Medium,
          //           fontSize: 16,
          //           color: "#000",
          //           textAlign: "center",
          //         }}
          //       >
          //         Balance too Low
          //       </Text>
          //     </TouchableOpacity>

          //   </>
          // )
        }
      </View>
    </View>
  );
};
export default SignPage;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.theme == "dark" ? "#000" : "#fff",
    },
    invalidPhraseTxt: {
      fontFamily: Fonts.Medium,
      fontSize: 12,
      color: "red",
      alignSelf: "flex-start",
    },
  });
