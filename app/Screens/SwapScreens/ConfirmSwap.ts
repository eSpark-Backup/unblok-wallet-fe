import React, { useContext, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Modal
} from "react-native";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { Colors } from "../../utils/Colors";
import { Fonts } from "../../utils/Fonts";
import { useDispatch, useSelector } from "react-redux";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { swapData } from "../../Redux/Actions/fiatDataAction";
import { swapApiFun } from './common/confirm_swap'
import isEmpty from "../../utils/isEmpty";
import { showImage } from "../../utils/showImage";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import SwapArrowLight from '../../assets/icons/lighttheme/Swap arrow up down.svg'
import SwapArrowDark from '../../assets/icons/darktheme/Swap arrow up down.svg';
import TickLight from '../../assets/icons/lighttheme/Check to logout.svg';
import TickDark from '../../assets/icons/darktheme/Check to logout.svg';
import { Toastfn } from "../../utils/toast";
const Swap = (props) => {
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);

  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setloading] = useState(false);
  const [msg, setMsg] = useState("");

  const {
    youpaytoken,
    yougettoken,
    youpay,
    youget,
    youget18,
    youpay18,
    walletaddress,
    privKey,
    tokenBalancePay,
    tokenBalanceGet,
    balance,
  } = useSelector((state) => state.fiatDataReducer.swapdata);

  const dispatch = useDispatch();
  const setSwapdatas = (item) => dispatch(swapData(item));

  // useFocusEffect(useCallback(() => {
  var clear = () => {
    // const unsubscribe = props.navigation.addListener("focus", async (e) => {
    // props.navigation.dispatch(state => {
    // console.log("state", state)
    setSwapdatas({
      youpaytoken: '',
      yougettoken: '',
      youget: '',
      youpay: '',
      youpay18: '',
      youget18: '',
      tokenBalanceGet: "",
      tokenBalancePay: "",
    });
    // return props.navigation.navigate('Swap')
    // })

    // return () => unsubscribe();
  }

  // }, []))

  const swapApi = (data) => {
    setloading(true);
    if (tokenBalancePay >= youpay) {
      let params = {
        privateKey: privKey,
        walletaddress: walletaddress,
        firstcurrency: youpaytoken.currencySymbol,
        secondcurrency: yougettoken.currencySymbol,
        amount1: youpay18,
        amount2: youget18,
        tokenType: youpaytoken.tokenType,
      };
      swapApiFun(params)
        .then(function (response) {
          // console.log("resspspspspspspsp", response, response.status);
          if (response?.data?.status == true) {
            setMsg("Swap Completed");
            setModalVisible(true);
            setloading(false);
          } else if (response?.data?.status == false) {
            ToastAndroid.showWithGravityAndOffset(
              response.data.message.toString(),
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
            setMsg(response?.data?.message.toString());
            // setModalVisible(true);
            setloading(false);
          }
          if (response.status == false) {
            console.log("afgawufaw");
            Toastfn("Can't able to swap")

            setMsg("Can't able to swap");
          }
          setloading(false);
        })
        .catch(function (err) {
          // console.log("errrr on swap", err);
          setloading(false);
        });
    } else {
      ToastAndroid.showWithGravityAndOffset(
        `Token Balance is Low!`,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      setloading(false);
    }
  };


  return (
    <SafeAreaView style={style.container}>
      <Header name={"Swap"} leftImage={"back"} />
      <View style={{ margin: "5%", }}>
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "flex-start", marginTop: "2.5%" }}>
          {!isEmpty(youpaytoken) && youpay ?
            (<>
              <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "center" }}>
                {/* {showImage(youpaytoken.tokenType)} */}
                {!isEmpty(youpaytoken.currencyimage)
                  ?
                  (<Image source={{
                    uri: "http:/192.53.121.26:8096/images/" + youpaytoken.currencyimage,
                  }} style={{ width: 35, height: 35 }} />)
                  : showImage(youpaytoken.tokenType)}
                <Text style={{ marginLeft: 10, color: theme.text, fontFamily: Fonts.Bold, fontSize: RFPercentage(1.9) }}> {youpay + "     " + youpaytoken.currencySymbol}</Text>

              </View>
            </>)
            : (<></>)}
        </View>
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "center", marginTop: "5%" }}>
          {/* <Image style={{ width: windowWidth * 0.125, height: windowheight * 0.065, aspectRatio: 1, resizeMode: "contain" }} source={theme.theme == "light" ? require("../../assets/img/swapd1.png") : require("../../assets/img/swapl1.png")} /> */}
          {theme.theme == "light" ?
            (<SwapArrowLight width={windowWidth * 0.13} height={windowWidth * 0.13} style={{ resizeMode: "contain" }} />)
            : (<SwapArrowDark width={windowWidth * 0.13} height={windowWidth * 0.13} style={{ resizeMode: "contain" }} />)
          }
        </View>
        <View>
          {!isEmpty(yougettoken) && youget ?
            (<>
              <View style={{
                flexDirection: 'row', alignItems: "center", justifyContent: "space-between", marginTop: "5%"
              }}>
                <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "center" }}>
                  {!isEmpty(yougettoken.currencyimage)
                    ?
                    (<Image source={{
                      uri: "http:/192.53.121.26:8096/images/" + yougettoken.currencyimage,
                    }} style={{ width: 35, height: 35 }} />)
                    : showImage(yougettoken.tokenType)}
                  <Text style={{ marginLeft: 10, color: theme.text, fontFamily: Fonts.Bold, fontSize: RFPercentage(1.9) }}>{youget + "     " + yougettoken.currencySymbol}</Text>

                </View>
              </View>
            </>)
            :
            (<></>)}

        </View>
        {/* {balance == 0 ? (
          <TouchableOpacity style={style.button1}>
            <View
              style={{
                flexDirection: "row",
                marginLeft: "8%",
                marginRight: "5%",
              }}
            >
              <Text style={{ color: "red" }}>
                you don't have enough balance
              </Text>
              <View style={styles.DownArrow}></View>
            </View>
          </TouchableOpacity>
        ) : null} */}


        <View style={{
          backgroundColor: theme.background, borderRadius: 10, padding: "2%",
          borderWidth: 1, borderColor: theme.phrase, marginTop: "10%"
        }}>
          <View style={{
            flexDirection: "row", alignItems: "center",
            justifyContent: "space-between", padding: "2%",
          }}>
            <Text style={{ color: theme.text, fontFamily: Fonts.Regular, fontSize: RFPercentage(2) }}>From : </Text>
            <Text style={{ color: theme.search, fontFamily: Fonts.Bold, fontSize: RFPercentage(1.7), width: "85%" }}>{walletaddress}</Text>
          </View>
        </View>


        <View style={{
          backgroundColor: theme.background, borderRadius: 10, padding: "4.5%", marginTop: "10%",
          borderWidth: 1, borderColor: theme.phrase, flexDirection: "row", alignItems: "center",

        }}>

          <Text style={{ color: theme.text, fontFamily: Fonts.Regular, fontSize: RFPercentage(2) }}>Type : </Text>
          <Text style={{ color: theme.search, fontFamily: Fonts.Regular, fontSize: RFPercentage(2) }}>{youpaytoken.tokenType}</Text>

          {/* <View style={{
              flexDirection: "row", alignItems: "center",
              justifyContent: "space-between", padding: 10, borderBottomColor: theme.phrase, borderBottomWidth: 1
            }}>
              <Text style={{ color: theme.text, fontFamily: Fonts.Regular, fontSize: RFPercentage(2) }}>Max Slippage</Text>
              <Text style={{ color: theme.search, fontFamily: Fonts.Regular, fontSize: RFPercentage(2) }}>2.0%</Text>
            </View>
            <View style={{
              flexDirection: "row", alignItems: "center",
              justifyContent: "space-between", padding: 10
            }}>
              <Text style={{ color: theme.text, fontFamily: Fonts.Regular, fontSize: RFPercentage(2) }}>Network Fees</Text>
              <Text style={{ color: theme.search, fontFamily: Fonts.Regular, fontSize: RFPercentage(2) }}>0.000052 WAN</Text>
            </View> */}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          {loading ?
            (<>
              <View style={{ width: 200 }}>
                <TouchableOpacity style={{
                  backgroundColor: "transparent", borderRadius: 300,
                  width: 200, padding: 5, marginVertical: 10, marginTop: 30, borderColor: theme.text,
                  borderWidth: 1
                }}>
                  <Text style={{
                    color: theme.text, fontSize: RFPercentage(2.1), fontFamily: Fonts.Regular,
                    textAlign: "center", width: "100%", marginVertical: 10
                  }}>Processing...</Text>
                </TouchableOpacity>
              </View>
            </>)
            :
            (<>
              <View style={{ width: 200 }}>
                <TouchableOpacity style={{
                  backgroundColor: "transparent", borderRadius: 300,
                  width: 200, padding: 5, marginVertical: 10, marginTop: 30, borderColor: theme.text,
                  borderWidth: 1
                }} onPress={swapApi}>
                  <Text style={{
                    color: theme.text, fontSize: RFPercentage(2.1), fontFamily: Fonts.Regular,
                    textAlign: "center", width: "100%", marginVertical: 10
                  }}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </>)}

        </View>
      </View>
      <Modal
        entry="bottom"
        onRequestClose={() => {
          // closeModel();
        }}
        backdropPressToClose={true}
        visible={isModalVisible}
        style={{ elevation: 10 }}
        transparent={true}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" }} >
          <View
            style={{
              alignSelf: "center",
              width: "75%",
              backgroundColor: theme.background,
              borderRadius: 30,
              borderColor: theme.text,
              borderWidth: 2,
              paddingVertical: 30,
            }}
          >
            <View style={{ padding: 10, alignItems: "flex-end" }}>
              {/* <TouchableOpacity onPress={() => {
              setModalVisible(false);
              props.navigation.navigate("WalletHomeBottomTab");
            }}>
              <Icn name="close" type="antDesign" color={theme.text} size={30} />
            </TouchableOpacity> */}
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <Image source={Images.successTick} style={{ width: 151, height: 151 }} /> */}
              {theme.theme == "light" ?
                (<TickLight width={windowWidth * 0.3} height={windowWidth * 0.3} style={{ resizeMode: "contain" }} />)
                : (<TickDark width={windowWidth * 0.3} height={windowWidth * 0.3} style={{ resizeMode: "contain" }} />)
              }
            </View>
            <View style={{ padding: 10, alignItems: "flex-end" }}>
              <Text
                style={{
                  color: theme.text,
                  fontFamily: Fonts.Regular,
                  fontSize: 20,
                  marginTop: "6%",
                  alignSelf: "center",
                  textAlign: "center",
                }}
              >
                {msg}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                // setTimeout(() => {
                //   clear()
                // }, 1000)
                setModalVisible(false);
                props.navigation.navigate("WalletHome");
              }}
            >
              <Text
                style={{
                  color: theme.text,
                  fontFamily: Fonts.Bold,
                  fontSize: 20,
                  marginTop: "6%",
                  alignSelf: "center",
                  textAlign: "center",
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );

};
export default Swap;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    seperatorLine: {
      height: 0.5,
      backgroundColor: "grey",
    },
    Text1: {
      fontSize: RFPercentage(2),
      fontWeight: "bold",
      color: "#787878",
    },
    Text2: {
      fontSize: RFPercentage(2),
      fontWeight: "bold",
      color: "#787878",
      //marginLeft: "20%",
    },
    Text3: {
      fontSize: RFPercentage(2),
      fontWeight: "bold",
      color: "#3443ce",
      marginLeft: "1%",
    },
    Text4: {
      fontSize: RFPercentage(2),
      fontWeight: "bold",
      color: "#787878",
      marginLeft: "1%",
    },
    plceimg: {
      alignItems: "center",
      marginTop: "8%",
    },
    btn: {
      height: 35,
      width: 60,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      margin: 10,
      backgroundColor: "#F6921E",
      borderColor: "#787878",
      borderRadius: 10,
    },
    centericon: {
      //height: 40,
      // width: 60,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      marginLeft: "5%",
      //borderColor: "#787878",
      //borderWidth: 1,
      backgroundColor: "transparent",
      width: 50,
      height: 50,
      borderRadius: 60 / 2,
    },
    btntxt: {
      fontSize: RFPercentage(2),
      color: theme.buttonclr,
      alignSelf: "center",
      fontFamily: Fonts.Medium,
      justifyContent: "center",
    },
    Text5: {
      fontSize: RFPercentage(2),
      fontFamily: Fonts.Medium,
      textAlign: "center",
      marginTop: "3%",
    },
    loginStyle: {
      shadowRadius: 6,
      shadowOpacity: 0.26,
      elevation: 8,
      backgroundColor: "#3443ce",
      width: 160,
      height: 40,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      marginTop: "5%",
    },
    logintextstyle: {
      color: "white",
      fontSize: RFPercentage(2),
      fontFamily: Fonts.Bold,
      alignSelf: "center",
      marginTop: "4%",
    },
    dropdown: {
      width: "40%",
      borderBottomColor: "gray",
      // borderBottomWidth: 0.5,
      marginTop: "-19%",
      marginLeft: "55%",
      marginRight: "10%",
    },
    modaldropdown: {
      width: "40%",

      borderBottomColor: "gray",
      // borderBottomWidth: 0.5,
      marginTop: "-19%",
      marginLeft: "55%",
      marginRight: "10%",
    },
    dropdown2: {
      backgroundColor: "white",
      borderColor: "gray",
      borderWidth: 0.5,
      marginTop: 20,
      padding: 8,
    },
    icon: {
      marginRight: 5,
      width: 18,
      height: 18,
    },
    icon1: {
      marginLeft: "15%",
      marginRight: "5%",
      marginTop: "3%",
    },
    modalicon: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: "3%",
    },
    icon2: {
      marginLeft: "15%",
      marginRight: "5%",
    },
    item: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginRight: "5%",
    },
    textItem: {
      flex: 1,
      fontSize: RFPercentage(3),
      color: "#3443ce",
      alignItems: "center",
      marginLeft: 5,
    },
  });
