import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Dimensions,
} from "react-native";
import { Fonts } from "../../utils/Fonts";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { Modal, Searchbar } from "react-native-paper";
import { Images } from "../../utils/Images";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { GaslimitFun, approveFun } from './common/Approve_'
import Netnotify from '../../assets/img/netnotify.svg';
import { covert18 } from "../../utils/convertInto18";
import TickLight from '../../assets/icons/lighttheme/Check to logout.svg';
import TickDark from '../../assets/icons/darktheme/Check to logout.svg';
import { windowWidth } from "../../utils/Dimensions";

export default function Approve(props) {
  const theme = useContext(themeContext);
  const style = styles(theme);
  const width = Dimensions.get("window").width
  const height = Dimensions.get("window").height
  const [isModalVisible, setModalVisible] = useState(false);
  const [content, setContent] = useState({})
  const [forSwap, setForSwap] = useState({})
  const [loading, setloading] = useState(false)

  const [msg, setMsg] = useState("")
  const [confirmSwap, setConfirmSwap] = useState(false);


  const { youpaytoken, walletaddress, privKey } = useSelector(
    (state) => state.fiatDataReducer.swapdata
  );
  console.log("youpaytoken", youpaytoken, walletaddress, privKey);
  console.log("walletaddress", walletaddress);
  console.log("privKey", privKey);
  useEffect(() => {
    if (props.route.params) {
      setContent(props.route.params)
      setForSwap(props.route.params?.ForSwap)
    }
  }, [content])

  useFocusEffect(
    useCallback(() => {
      gasLimit()
    }, []))
  console.log("youpaytoken", youpaytoken);
  const [GasLimit, setGasLimit] = useState(0)
  const gasLimit = async () => {
    let params = { type: youpaytoken?.tokenType }
    GaslimitFun(params)
      .then(async(response) => {
        // console.log("seifhtwegtherhgtergt", response.data);
        // var con = await covert18(response.data.block)
        // console.log("con",con);
        setGasLimit(response.data.block)
      })
      .catch((e) => {
      });
  }
  console.log("GasLimit", GasLimit);
  // console.log("youpaytoken", youpaytoken);

  const Approveapi = async () => {
    setloading(true)
    var params = {
      walletaddress: walletaddress,
      privateKey: privKey,
      currency: youpaytoken.currencySymbol,
      tokenType: youpaytoken.tokenType
    };
    approveFun(params)
      .then((response) => {
        console.log("responseresponse", response.data);
        if (response.data.status == false) {
          setloading(false)
          ToastAndroid.showWithGravityAndOffset(
            response.data.messages,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
          setMsg(response.data.messages)
          // setModalVisible(true)
        } else {
          setConfirmSwap(true);
          setMsg("Approved");
          setModalVisible(true);
        }
      })
      .catch((e) => {
        console.log("eeeeeeee ", e);
        setloading(false)
      });
  }

  // const convertFuction = async (data) => {
  //   var helllo = covert18(data)
  //   return helllo
  // }

  return (
    <>
      <SafeAreaView style={style.container}>
        <Header name={"Swap"} leftImage={"back"} />
        <View>
          <Text style={{
            color: theme.text, fontSize: RFPercentage(2.5), fontFamily: Fonts.Medium,
            width: "100%", textAlign: "center", marginTop: 30
          }}>Approve: {youpaytoken?.currencyName}</Text>
        </View>
        <View style={{ marginHorizontal: 20, marginTop: "10%" }}>
          <View style={{
            backgroundColor: theme.background, borderRadius: 10, padding: 10,
            borderWidth: 1, borderColor: theme.phrase1
          }}>
            <View style={{
              flexDirection: "row", alignItems: "center",
              justifyContent: "space-between", padding: 10, borderBottomColor: theme.phrase1, borderBottomWidth: 1
            }}>
              <Text style={{ color: theme.text, fontFamily: Fonts.Regular, fontSize: RFPercentage(2) }}>From </Text>
              <Text style={{ color: theme.search, fontFamily: Fonts.Regular, fontSize: RFPercentage(1.7) }}>({walletaddress?.substring(0, 10)}...{walletaddress?.substring(32, 42)})</Text>
            </View>
            <View style={{
              flexDirection: "row", alignItems: "center",
              justifyContent: "space-between", padding: 10
            }}>
              <Text style={{ color: theme.text, fontFamily: Fonts.Regular, fontSize: RFPercentage(2) }}>Contract Address</Text>
              <Text style={{ color: theme.search, fontFamily: Fonts.Regular, fontSize: RFPercentage(1.7) }}>({youpaytoken?.contractAddress?.substring(0, 10)}...{youpaytoken?.contractAddress?.substring(32, 42)})</Text>
            </View>
          </View>
          <View style={{
            backgroundColor: theme.background, borderRadius: 10, padding: 10,
            borderWidth: 1, borderColor: theme.phrase1, marginTop: 30
          }}>
            <View style={{
              flexDirection: "row", alignItems: "center",
              justifyContent: "space-between", padding: 10, borderBottomColor: theme.phrase1, borderBottomWidth: 1
            }}>
              <Text style={{ color: theme.text, fontFamily: Fonts.Regular, fontSize: RFPercentage(2) }}>Type</Text>
              <Text style={{ color: theme.search, fontFamily: Fonts.Regular, fontSize: RFPercentage(2) }}>{youpaytoken?.tokenType}</Text>
            </View>
            <View style={{
              flexDirection: "row", alignItems: "center",
              padding: 10,
            }}>
              <View style={{ width: "45%", flexDirection: "row", alignItems: "center" }} >
                <Text style={{ color: theme.text, fontFamily: Fonts.Regular, fontSize: RFPercentage(2) }}>Network Fee</Text>
                <Netnotify style={{ marginLeft: "5%" }} width={width * 0.035} height={height * 0.035} fill={theme.theme == 'light' ? "#000" : "#ffff"} />
                {/* <Image style={{width:30,height:30}} source={Images.leftarrow}   /> */}
              </View>
              <View style={{width:"55%",alignItems:"flex-end"}} >
              <Text style={{ color: theme.search, fontFamily: Fonts.Regular, fontSize: RFPercentage(2) }}>{GasLimit} {youpaytoken?.tokenType?.includes('BEP') ? 'BNB' : youpaytoken?.tokenType?.includes('ERC') ? 'ETH' : youpaytoken?.tokenType?.includes('MAT') ? 'MAT' : ''}</Text>

              </View>
              {/* <Text style={{ color: theme.text, fontFamily: Fonts.Regular, fontSize: RFPercentage(2) }}>Network Fee</Text> */}
              {/* <Image style={{width:30,height:30}} source={Images.gactiveexchange}   /> */}

            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: 200 }}>
            {loading ?
              (<>
                <TouchableOpacity style={{
                  backgroundColor: "transparent", borderRadius: 300,
                  width: 200, padding: 5, marginVertical: 10, marginTop: 30, borderColor: theme.texttheme,
                  borderWidth: 1
                }} onPress={() => props.navigation.navigate("Swap")}>
                  <Text style={{
                    color: theme.texttheme, fontSize: 13, fontFamily: Fonts.Regular,
                    textAlign: "center", width: "100%", marginVertical: 10
                  }}>Processing...</Text>
                </TouchableOpacity>
              </>)
              :
              (<>
                <TouchableOpacity style={{
                  backgroundColor: "transparent", borderRadius: 300,
                  width: 200, padding: 5, marginVertical: 10, marginTop: 30, borderColor: theme.texttheme,
                  borderWidth: 1
                }} onPress={() => { Approveapi() }}>
                  <Text style={{
                    color: theme.texttheme, fontSize: RFPercentage(1.9), fontFamily: Fonts.Regular,
                    textAlign: "center", width: "100%", marginVertical: 10
                  }}>Confirm</Text>
                </TouchableOpacity>
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
        >
          <View
            style={{
              alignSelf: "center",
              width: "80%",
              backgroundColor: "#fff",
              borderRadius: 30,
              borderColor: "#000000",
              borderWidth: 2,
              paddingVertical: 30,
            }}
          >
            <View style={{ padding: 10, alignItems: "flex-end" }}>
              {/* <TouchableOpacity onPress={() => {
                // setModalVisible(false);
                // props.navigation.navigate("WalletHomeBottomTab");
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
              {theme.theme == "light" ?
                (<TickLight width={windowWidth * 0.3} height={windowWidth * 0.3} style={{ resizeMode: "contain" }} />)
                : (<TickDark width={windowWidth * 0.3} height={windowWidth * 0.3} style={{ resizeMode: "contain" }} />)
              }
            </View>
            {/* <View style={{ padding: 10, alignItems: "flex-end" }}>
              <Text
                style={{
                  color: "#000",
                  fontFamily: Fonts.Regular,
                  fontSize: 20,
                  marginTop: "6%",
                  alignSelf: "center",
                  textAlign: "center",
                }}
              >
                {msg}
              </Text>
            </View> */}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!isModalVisible)
                confirmSwap
                  ?
                  (props.navigation.navigate({
                    name: 'ConfirmSwap',
                    params: forSwap
                    // merge: true,
                  }))
                  :
                  (props.navigation.navigate("WalletHome"))
              }}
            >
              <Text
                style={{
                  color: "#000",
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
        </Modal>
      </SafeAreaView>
    </>
  )
}
const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    custsearch: {
      borderRadius: 30,
      backgroundColor: theme.background,
      margin: 15,
      shadowOffset: 0,
      fontFamily: Fonts.Bold
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