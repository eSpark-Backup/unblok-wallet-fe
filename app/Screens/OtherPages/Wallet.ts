import React, { useState } from "react";
import {
  Animated, FlatList, View, Text, Image,
  Dimensions,
  Pressable,
  BackHandler,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import themeContext from "../../utils/themeContext";
import { Fonts } from "../../utils/Fonts";

import LLogo from "../../assets/img/applogo2d.png";
import DLogo from "../../assets/img/applogo2l.png";


import Modal from "react-native-modal";
import { RFPercentage } from "react-native-responsive-fontsize";
import getRealm from "../../localDb/RealmConfig";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addCurrencyDetails } from "../../Redux/Actions/walletDetailsAction";
import { selectedCurrencyList } from "../../Redux/Actions/selectedcurrencyListAction";
import { selectedTokenList } from "../../Redux/Actions/tokenListAction";
import { fiatData } from "../../Redux/Actions/fiatDataAction";
import { addAllcurrency } from "../../Redux/Actions/AllcurrencyAction";
import { assets_update_function } from "../WalletScreens/common/Wallet_Home";
import { windowheight } from "../../utils/Dimensions";
import Close from "../../assets/img/close_icon.svg";
import Profilelight from "../../assets/icons/lighttheme/Profile.svg";
import Profiledark from "../../assets/icons/darktheme/Profile.svg";
import Earningslight from "../../assets/icons/lighttheme/Earnings.svg";
import Earningsdark from "../../assets/icons/darktheme/Earnings.svg";
import Logoutlight from "../../assets/icons/lighttheme/Logout.svg";
import Logoutsdark from "../../assets/icons/darktheme/Logout.svg";
import Iiconlight from "../../assets/icons/lighttheme/About us.svg";
import IiconDark from "../../assets/icons/darktheme/About us.svg";
import { Images } from "../../utils/Images";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function Wallet(props) {
  const deviceHeight = Dimensions.get("window").height
  const deviceWidth = Dimensions.get("window").width
  const theme = React.useContext(themeContext);
  const style = styles(theme);
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalVisible1, setModalVisible2] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { width, height } = Dimensions.get('window');
  const isPhone = width < 600;


  const renderItem = ({ item }) => (
    <View>
      {item.image}
    </View>
  )
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  const setFiatData = (item) => dispatch(fiatData(item));
  const setSelectWalletCurrencies = (item) => dispatch(selectedCurrencyList(item));
  const setSelectWalletTokens = (item) => dispatch(selectedTokenList(item));
  const setWalletDetailsinRedux = (item) => dispatch(addCurrencyDetails(item));
  const setSelectedcurrecyinRedux = (item) => dispatch(addAllcurrency(item))
  const set_my_add = (item) => dispatch(my_add(item))


  const logoutFunction = async () => {
    setIsModalVisible(false)
    getRealm()
      .then((realm) => {
        var logoutStatus = realm.objects("loginStatus")
        var walletData = realm.objects("Wallet_array");
        var tokenData = realm.objects("Token_array");
        realm.write(() => {
          realm.delete(logoutStatus)
        })
        realm.write(() => {
          realm.delete(walletData)
        })
        if (tokenData.length != 0) {
          realm.write(() => {
            realm.delete(tokenData)
          })
        }

        props.navigation.navigate("Signin")
      })
      .catch((err) => {
        console.log("errri on lout function", err);
      })
  }

  useFocusEffect(
    React.useCallback(() => {
      if (global.newWallet == "import") { setModalMessage("Successfully imported!"); setModalVisible2(true); global.newWallet = "" }
      if (global.newWallet == "create") { setModalMessage("Successfully Created!"); setModalVisible2(true); global.newWallet = "" }
    }, [global.newWallet])
  )


  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      getWalletData()
      saveNotificationStatus()
      getPasscodeStatus()
      // Add Event Listener for hardwareBackPress
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        // Once the Screen gets blur Remove Event Listener
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );
  // console.log("tokenArr", JSON.stringify(tokenArr, null, 2));
  const getWalletData = () => {
    getRealm()
      .then(async (realm) => {
        var walletData = realm.objects("Wallet_array");
        // console.log("walletData", JSON.stringify(walletData, null, 2));
        var defaultCurrencyVal = realm.objects("defaultCurrency");

        var initialVal;
        if (defaultCurrencyVal.length == 0) {
          //for create defaultCurrency status first time

          realm.write(() => {
            initialVal = realm.create("defaultCurrency", {
              defaultCurrency: "USD",
            });
          });
        } else {
          //for update defaultCurrency value
          realm.write(() => {
            initialVal = defaultCurrencyVal[0].defaultCurrency = defaultCurrencyVal[0].defaultCurrency.toString();
          });
        }
        var arr = walletData.filter((item, index) => {
          return item.selected == "true"
        });

        global.walletName = arr[0].walletname
        setWalletDetailsinRedux(arr[0])
        // setWalletDetails(arr[0]);
        setSelectedcurrecyinRedux(arr[0])
        let paramss = {
          walletArr: arr[0],
          defaultCurrency: initialVal
        }
        var response_assest = await assets_update_function(paramss);
        // console.log("response_assest",response_assest);
        setSelectWalletCurrencies(response_assest.currencies)
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        // setIsLoad(false)
        // setRefreshing(false);
        console.log(err, "wallet data list err from localDb");
      });
  };

  const saveNotificationStatus = () => {
    getRealm()
      .then((realm) => {
        var pushNotificationVal = realm.objects("pushNotificationStatus");
        var value = true;
        if (pushNotificationVal.length == 0) {
          //for create notification status first time
          let initialVal;
          realm.write(() => {
            initialVal = realm.create("pushNotificationStatus", {
              notificationStatus: value.toString(),
            });
          });
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        // //console.log(err, "pushNotificationStatus err from localDb");
      });
  };

  const getPasscodeStatus = () => {
    getRealm()
      .then((realm) => {
        var passcodeVal = realm.objects("userPasscodeValue");
        var biometricVal = realm.objects("userBiometricStatus");
        if (biometricVal.length != 0) {
          if (biometricVal[0].userBiometricStatus == "false") {
            global.biometricStatus = 0;
          } else if (biometricVal[0].userBiometricStatus == "true") {
            global.biometricStatus = 1;
          }
        }
        // setYourPasscode(passcodeVal.length);
        global.passcodeStatus = passcodeVal.length;
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.error(err, "getPasscodeStatus err from localDb in walletHome");
      });
  };
  return (
    <>
      <View style={{ width: "100%", height: "100%", backgroundColor: theme.background, }} >

        <View
        style={{
          height: "20%", justifyContent: "center", justifyContent: "space-around",
          borderBottomWidth: 0.4, borderBottomColor: theme.darkgray
        }}
           >
          <View style={{ width: "100%", alignItems: "center" }} >
            {theme.theme == "light" ?
              (
                <Image source={LLogo} style={{ width: windowWidth * 0.5, height: windowHeight * 0.1 }} resizeMode="contain" />

              )
              : (
                <Image source={DLogo} style={{ width: windowWidth * 0.5, height: windowHeight * 0.1 }} resizeMode="contain" />
              )
            }
          </View>
          {/* <View style={{ position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 0.5, // Adjust the height as needed for the desired elevation effect
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Color of the bottom border
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 0.5,}} /> */}

        </View>
        <View style={{ height: "80%", justifyContent: "space-evenly", }} >
          <TouchableOpacity onPress={() => props.navigation.navigate("EditProfile")} style={{ width: "50%", height: "10%",  alignSelf: "center", flexDirection: "row" }} >
            <View style={{ width: "40%", height: "100%",  alignItems: "center", justifyContent: "center" }} >
              {theme.theme == 'light' ?
                <Profilelight width={windowWidth * 0.125} height={windowWidth * 0.125} style={{ resizeMode: "contain", alignSelf: "center" }} /> :
                <Profiledark width={windowWidth * 0.125} height={windowWidth * 0.125} style={{ resizeMode: "contain", alignSelf: "center" }} />
              }
            </View>
            <View style={{ width: "60%", height: "100%",  justifyContent: "center" }} >
              <Text style={{ color: theme.theme == 'light' ? "#000" : "#fff", fontSize: RFPercentage(2.5), marginLeft: "5%" }}>Profile</Text>
            </View>
          </TouchableOpacity >

          <TouchableOpacity onPress={() => props.navigation.navigate("Rewards")} style={{ width: "50%", height: "10%",  alignSelf: "center", flexDirection: "row" }} >
            <View style={{ width: "40%", height: "100%",  alignItems: "center", justifyContent: "center" }} >
              {theme.theme == 'light' ?
                <Earningslight width={windowWidth * 0.125} height={windowWidth * 0.125} style={{ resizeMode: "contain", alignSelf: "center" }} /> :
                <Earningsdark width={windowWidth * 0.125} height={windowWidth * 0.125} style={{ resizeMode: "contain", alignSelf: "center" }} />
              }
            </View>
            <View style={{ width: "60%", height: "100%",  justifyContent: "center" }} >
              <Text style={{ color: theme.theme == 'light' ? "#000" : "#fff", fontSize: RFPercentage(2.5), marginLeft: "5%" }}>Earnings</Text>
            </View>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => { setIsModalVisible(true) }} style={{ width: "50%", height: "10%",  alignSelf: "center", flexDirection: "row" }} >
            <View style={{ width: "40%", height: "100%",  alignItems: "center", justifyContent: "center" }} >
              {theme.theme == 'light' ?
                <Logoutlight width={windowWidth * 0.125} height={windowWidth * 0.125} style={{ resizeMode: "contain", alignSelf: "center" }} /> :
                <Logoutsdark width={windowWidth * 0.125} height={windowWidth * 0.125} style={{ resizeMode: "contain", alignSelf: "center" }} />
              }
            </View>
            <View style={{ width: "60%", height: "100%",  justifyContent: "center" }} >
              <Text style={{ color: theme.theme == 'light' ? "#000" : "#fff", fontSize: RFPercentage(2.5), marginLeft: "5%" }}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* <View style={{ height: "80%", justifyContent: "space-evenly", }} >
          <TouchableOpacity onPress={() => props.navigation.navigate("EditProfile")} style={{ alignItems: "center", flexDirection: "row", justifyContent: "center",width:"40%",backgroundColor:"red",alignSelf:"center" }}>
            <View style={{ width: "20%",backgroundColor:"orange"}} >
              {theme.theme == 'light' ?
                <Profilelight width={windowWidth * 0.125} height={windowWidth * 0.125} style={{ resizeMode: "contain", alignSelf: "center" }} /> :
                <Profiledark width={windowWidth * 0.125} height={windowWidth * 0.125} style={{ resizeMode: "contain", alignSelf: "center" }} />
              }
            </View>
            <Text style={{ color: theme.theme == 'light' ? "#000" : "#fff", fontSize: RFPercentage(2.5), marginLeft: 10 }}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => props.navigation.navigate("Rewards")} style={{ alignItems: "center",  flexDirection: "row",justifyContent:"center" }}>
            <View style={{ width: "20%",backgroundColor:"orange"}} >
              {theme.theme == 'light' ?
                <Earningslight width={windowWidth * 0.125} height={windowWidth * 0.125} style={{ resizeMode: "contain", alignSelf: "center" }} /> :
                <Earningsdark width={windowWidth * 0.125} height={windowWidth * 0.125} style={{ resizeMode: "contain", alignSelf: "center" }} />
              }
            </View>
            <Text style={{ color: theme.theme == 'light' ? "#000" : "#fff", fontSize: 20, marginLeft: 10 }}>Earnings</Text>

          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setIsModalVisible(true) }} style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", flexDirection: "row" }}>
            {theme.theme == 'light' ?
              <Logoutlight width={windowWidth * 0.125} height={windowWidth * 0.125} style={{ resizeMode: "contain", alignSelf: "center" }} /> :
              <Logoutsdark width={windowWidth * 0.125} height={windowWidth * 0.125} style={{ resizeMode: "contain", alignSelf: "center" }} />
            }
            <Text style={{ color: theme.theme == 'light' ? "#000" : "#fff", fontSize: 20, marginLeft: 10 }}>Logout</Text>

          </TouchableOpacity>
        </View> */}

        {/* <View style={{ height: "100%", justifyContent: "center" }} >
          <View style={{ width: "90%", alignSelf: "center" }} >


            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderBottomWidth: 1, borderColor: theme.bordercolor, height: windowHeight * 0.12 }} onPress={() => props.navigation.navigate("EditProfile")} >

              <View style={{ width: "30%", height: "70%", alignSelf: "center", justifyContent: "center" }} >
                {theme.theme == "light" ?
                  <Profilelight />:
                  <Profiledark />
                }
              </View>
              <View style={{ width: "30%", height: "70%", alignSelf: "center", justifyContent: "center" }} >
                <Text style={{
                  fontFamily: Fonts.Regular, fontSize: RFPercentage(2.1),
                  color: theme.theme == "light" ? "#000" : "#fff",

                }}>Profile</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderBottomWidth: 1, borderColor: theme.bordercolor, height: windowHeight * 0.12 }} onPress={() => props.navigation.navigate("Rewards")} >

              <View style={{ width: "30%", height: "70%", alignSelf: "center", justifyContent: "center" }} >
                <Image source={theme.theme == "light" ? require('../../assets/img/rewardsd1.png') : require('../../assets/img/rewardsl1.png')} style={{ width: windowWidth * 0.1, height: windowHeight * 0.06, resizeMode: "contain", aspectRatio: 1, alignSelf: "center" }} />
              </View>
              <View style={{ width: "30%", height: "70%", alignSelf: "center", justifyContent: "center" }} >
                <Text style={{
                  fontFamily: Fonts.Regular, fontSize: RFPercentage(2.1),
                  color: theme.theme == "light" ? "#000" : "#fff",

                }}>Earnings</Text>
              </View>

            </TouchableOpacity>


            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderBottomWidth: 1, borderColor: theme.bordercolor, height: windowHeight * 0.12 }} onPress={() => { setIsModalVisible(true) }} >
              <View style={{ width: "30%", height: "70%", alignSelf: "center", justifyContent: "center" }} >
                <Image source={theme.theme == "light" ? require('../../assets/img/logoutd1.png') : require('../../assets/img/logoutl1.png')} style={isPhone  ? { width: windowWidth * 0.1, height: windowHeight * 0.06, resizeMode: "contain", aspectRatio: 1,  marginLeft:"32.5%" }:{width: windowWidth * 0.1, height: windowHeight * 0.06, resizeMode: "contain", aspectRatio: 1,  marginLeft:"35%"}} />
              </View>
              <View style={{ width: "30%", height: "70%", alignSelf: "center", justifyContent: "center" }} >
                <Text style={{
                  fontFamily: Fonts.Regular, fontSize: RFPercentage(2.1),
                  color: theme.theme == "light" ? "#000" : "#fff",

                }}>Logout</Text>
              </View>

            </TouchableOpacity>


          </View>
        </View> */}

        <Modal
          isVisible={isModalVisible}
          entry="bottom"
          backdropPressToClose={true}
          visible={isModalVisible}
          backdropColor={"#989898"}
          onBackButtonPress={() => setIsModalVisible(false)}
        >

          <View onStartShouldSetResponder={() => setIsModalVisible(false)} style={{ backgroundColor: "rgba(0,0,0,0.5)", width: deviceWidth, height: deviceHeight * 1.2, justifyContent: "center", alignSelf: "center" }} >
            <View style={theme.theme == "light" ? style.logoutpopup_light : style.logoutpopup_dark} >
              <View style={{ padding: 10, alignItems: "flex-end" }}>
              </View>
              <View style={{ alignItems: "center" }}>
                {theme.theme == "light" ?
                  (<Iiconlight width={windowWidth * 0.2} height={windowWidth * 0.2} style={{ resizeMode: "contain" }} />)
                  : (<IiconDark width={windowWidth * 0.2} height={windowWidth * 0.2} style={{ resizeMode: "contain" }} />)
                }
                {/* <Text
                  style={{
                    fontFamily: Fonts.Regular,
                    fontSize: RFPercentage(2.3),
                    color: "red",
                    textAlign: "center",
                    marginTop: 5
                  }}
                >
                  If you logout all the credentials is will be deleted
                </Text> */}
                <Text

                  style={{
                    color: theme.text,
                    fontFamily: Fonts.Medium,
                    fontSize: RFPercentage(2.5),
                    marginTop: "6%",
                    alignSelf: "center",
                    textAlign: "center"
                  }}
                >
                  Logout?
                </Text>

                <View style={{ display: "flex", flexDirection: "row" }}>

                  <Pressable onPress={() => logoutFunction()}>
                    <View style={{
                      backgroundColor: "transparent", borderRadius: 300,
                      width: 100, paddingHorizontal: 10, paddingVertical: 5, marginRight: 10, borderWidth: 1, borderColor: theme.texttheme, marginTop: 20
                    }} >
                      <Text style={{
                        color: theme.texttheme, fontFamily: Fonts.Regular,
                        textAlign: "center", width: "100%", marginVertical: 10, fontSize: RFPercentage(1.75)
                      }}>
                        Yes
                      </Text>
                    </View>
                  </Pressable>
                  <Pressable onPress={() => { setIsModalVisible(false) }}>
                    <View style={{
                      backgroundColor: "transparent", borderRadius: 300,
                      width: 100, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: theme.texttheme, marginTop: 20
                    }}  >
                      <Text style={{
                        color: theme.texttheme, fontFamily: Fonts.Regular,
                        textAlign: "center", width: "100%", marginVertical: 10, fontSize: RFPercentage(1.75)
                      }}>
                        No
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

        </Modal>

        <Modal
          isVisible={isModalVisible1}
          entry="bottom"
          backdropPressToClose={true}
          visible={isModalVisible1}
          backdropColor={"#989898"}

        >
          <Pressable onPress={() => {
            setModalVisible2(prevIsModalVisible => !prevIsModalVisible)
          }}>
            <View
              style={{
                height: windowheight * 0.3,
                alignSelf: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80%",
                backgroundColor: theme.background,
                borderRadius: 10,
                paddingBottom: 20,
              }}
            >
              <Pressable style={{ padding: 10, alignItems: "flex-end", position: "absolute", right: 10, top: 10 }} onPress={() => {
                setModalVisible2(prevIsModalVisible => !prevIsModalVisible)
              }}>
                <View>
                  {theme.theme == 'light' ?
                    <Close fill="#000" width={20} height={20} />
                    :
                    <Close fill="#fff" width={20} height={20} />

                  }
                </View>
              </Pressable>
              <View style={{ alignItems: "center" }}>
                <Image source={{ uri: theme.theme == "light" ? Images.rightDark : Images.rightLight }} style={{ width: windowWidth * 0.135, height: windowheight * 0.08, resizeMode: "contain", aspectRatio: 1 }} />
                <Text
                  style={{
                    color: theme.text,
                    fontFamily: Fonts.Medium,
                    fontSize: RFPercentage(2.5),
                    marginTop: "6%",
                    alignSelf: "center",
                    textAlign: "center"
                  }}
                >
                  {modalMessage}
                </Text>
              </View>
            </View>
          </Pressable>
        </Modal>
      </View>
    </>
  )
}


const styles = (theme) =>
  StyleSheet.create({
    logoutpopup_light: {
      // height:windowHeight*0.3,
      alignSelf: "center",
      width: "80%",
      // backgroundColor: theme.blackandwhite,
      backgroundColor: theme.background,
      borderRadius: 10,
      padding: "5%"
    },
    logoutpopup_dark: {
      // height:windowHeight*0.3,
      alignSelf: "center",
      width: "80%",
      // backgroundColor: theme.blackandwhite,
      backgroundColor: theme.background,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.texttheme,
      padding: "5%"
    }
  })