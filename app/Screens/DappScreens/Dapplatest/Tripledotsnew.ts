import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Dappmodalupdate, Updatetripledotmodal, setButton, setNavigateAction, setPrivateMode } from "../../../Redux/Actions/DapplatetsActions";
import theme from "../../../utils/theme";
import themeContext from "../../../utils/themeContext";
import { Switch } from "react-native-switch";
import { Fonts } from "../../../utils/Fonts";
import { RFValue } from "react-native-responsive-fontsize";
import RefershDark from '../../../assets/icons/darktheme/Reset Passcode.svg';
import RefershLight from '../../../assets/icons/lighttheme/Reset Passcode_Menue.svg';
import Historylight from '../../../assets/icons/lighttheme/Browser History Black_Menue.svg';
import Historydark from '../../../assets/icons/darktheme/Browser History White.svg';
import Sharelight from '../../../assets/icons/lighttheme/Share_Manue.svg';
import ShareDark from '../../../assets/icons/darktheme/Share White.svg';
import InActivefavlight from '../../../assets/icons/lighttheme/inactive_star_light.svg';
import InActivefavDark from '../../../assets/icons/darktheme/inactive_star_dark.svg';
import BookmarkWhite from '../../../assets/icons/darktheme/Bookmarks White.svg';
import BookmarkBlack from '../../../assets/icons/lighttheme/Bookmarks_Menue.svg';
import DappsIconBlack from '../../../assets/icons/lighttheme/DApps Black_Menue.svg';
import DappsIconWhite from '../../../assets/icons/darktheme/DApps White.svg';
import Sendlight from '../../../assets/icons/lighttheme/Send_Menue.svg';
import SendDark from '../../../assets/icons/darktheme/Send.svg';
import Receivelight from '../../../assets/icons/lighttheme/Receive_Menue.svg';
import ReceiveDark from '../../../assets/icons/darktheme/Receive.svg'
import Activefavlight from '../../../assets/icons/darktheme/active_star_dark.svg'
import Activefavdark from '../../../assets/icons/lighttheme/active_star_light.svg'
import SellLight from '../../../assets/icons/lighttheme/Sell Black_Menue.svg'
import SellDark from '../../../assets/icons/darktheme/Sell White.svg'
import Buylight from '../../../assets/icons/lighttheme/Buy_Menue.svg';
import BuyDark from '../../../assets/icons/darktheme/Buy.svg';
import Earningslight from '../../../assets/icons/lighttheme/earning_light_Menue.svg';
import EarningsDark from '../../../assets/icons/darktheme/earning_dark.svg';
import Settingslight from '../../../assets/icons/lighttheme/Setting.svg'
import Settingsdark from '../../../assets/icons/darktheme/Setting.svg'
import Swapplight from '../../../assets/icons/lighttheme/Swap_Menue.svg'
import Swappdark from '../../../assets/icons/darktheme/Swap.svg'
import { CHAIN_INFO } from "../useWeb3";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import getRealm from "../../../localDb/RealmConfig";
import { customShare, findHostNameWithUrl } from "../../../utils/common";
import { ScrollView } from "react-native";
import { BackHandler } from "react-native";
import { ImageBackground } from "react-native";
import { Image } from "react-native-elements";

const Tripledotsnew = ({ multitab, history, myfav, add_favourite, remove_favourite, onWebviewReload }) => {
    const theme = useContext(themeContext)
    const modalY = useRef(new Animated.Value(-500)).current;
    const { Session } = useSelector(
        (state) => state.wcreducer
    );
    const current_chain = (chainId) => CHAIN_INFO.filter(
        (it) => it.chainId == chainId
    )?.pop();

    const dispatch = useDispatch()
    const navigation = useNavigation()

    const [findMyfav, setMyFav] = useState([]);
    const [tostShow, setTostShow] = useState(false);
    const [tostMessage, setTostMessage] = useState("");
    // const [privateMode, setPrivateMode] = useState(false)
    const setnavigateAction = (item) => dispatch(setNavigateAction(item));
    const setPrivMode = (item) => dispatch(setPrivateMode(item));
    const setNewButton = (item) => dispatch(setButton(item));

    const {
        selectednetwork,
        tripledotmodal,
        multitabs,
        weburl,
        searchUrl,
        selectedTab,
        currenttabId,
        Maddress,
        privateMode
    } = useSelector(state => ({
        selectednetwork: state.DapplatestReducer.selectednetwork,
        tripledotmodal: state.DapplatestReducer.tripledotmodal,
        multitabs: (state.DapplatestReducer.multitabs),
        weburl: state.DapplatestReducer.weburl,
        searchUrl: state.DapplatestReducer.searchUrl,
        selectedTab: state.DapplatestReducer.selectedTab,
        currenttabId: state.DapplatestReducer.currenttabId,
        Maddress: state.DapplatestReducer.Maddress,
        privateMode: state.DapplatestReducer.privateMode
    }));

    console.log(tripledotmodal, "testgal");


    const Modalupdate = (item) => dispatch(Dappmodalupdate(item))
    const navigateSecurityPage = async (item) => {
        try {
            getRealm()
                .then((realm) => {
                    var passcodeVal = realm.objects("userPasscodeValue");
                    var biometricVal = realm.objects("userBiometricStatus");
                    console.log("passcodeVal", passcodeVal, item, global.biometricStatus == 0);
                    if (passcodeVal.length == 0 && global.biometricStatus == 0) {
                        navigation.navigate("commonRbSheet", params = item);
                    } else if (
                        (global.passcodeStatus == 1 || global.passcodeStatus == 0) &&
                        global.biometricStatus != 0
                    ) {
                        global.bioPage = "EnterPasscode"
                        navigation.push("CheckBiometric", item);
                    } else if (passcodeVal.length == 1 || global.biometricStatus == 0) {
                        navigation.navigate("EnterPasscode", item);
                    }

                })
                .catch((err) => {
                    console.log("errror on navigagtet", err);
                })


        } catch (error) {
            console.log("errror on navigatepage", error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            myFavv()
        }, [searchUrl, myfav])
    )
    console.log("searchUrl", searchUrl);

    const myFavv = async () => {
        var findHostNa = await findHostNameWithUrl(searchUrl)
        // console.log("multitabs[selectedTab]?.TAB",JSON.stringify(myfav,null,2),myfav.filter(item => item.title == findHostNa.hostname),findHostNa.hostName);
        let findMyFav = myfav.filter(item => item.title == findHostNa.hostname)
        setMyFav(findMyFav ?? [])
        console.log("findMyFav", findMyFav);
    }

    const onHistoryPress = () => { setNewButton(""); setnavigateAction("back"); history(true); dispatch(Updatetripledotmodal(false)) }

    const onOtherPress = (val) => { setNewButton(""); setnavigateAction("back"); dispatch(Updatetripledotmodal(false)); global?.initialEnter == undefined ? navigateSecurityPage(val) : navigation.navigate(val) }

    const onReceivePress = () => { setNewButton(""); setnavigateAction("back"); dispatch(Updatetripledotmodal(false)); global?.initialEnter == undefined ? navigateSecurityPage("Receive") : navigation.navigate("commonRbSheet", params = "Receive") }

    const onDappsPress = (val) => { setNewButton(""); setnavigateAction("back"); dispatch(Updatetripledotmodal(false)); navigation.navigate("DappList", val) }

    const onPressCommon = (val) => { setNewButton(""); setnavigateAction("back"); dispatch(Updatetripledotmodal(false)); global?.initialEnter == undefined ? navigateSecurityPage(val) : navigation.navigate("commonRbSheet", params = val) }


    const onClickSwitch = () => {
        setPrivMode(!privateMode)
        setTostShow(true)
        privateMode === true ? setTostMessage("Browsing History Disabled") : setTostMessage("Browsing History Enabled");
        setTimeout(() => {
            setTostShow(false);
          }, 3000);
    }

    const onClickAddBlocker = () => {
        setTostShow(true)
        setTostMessage("Ad Blocker Coming Soon");
        setTimeout(() => {
            setTostShow(false);
          }, 3000);
    }

    const closeModal = () => {
        setNewButton("");
        dispatch(Updatetripledotmodal(false));
      };

    return (
        <>
        <Modal
            visible={tripledotmodal}
            transparent={true}
            // onRequestClose={() => {
            //     Updatetripledotmodal(false)
            //   }}
            style={{
                position: "relative", zIndex: 999,
                borderRadius: 50
            }}>
                <Pressable style={styles.overlay} onPress={closeModal} />
            <View style={styles.modalContentContainer}  >
                <View style={{ width: "55%", backgroundColor: theme.theme == "light" ? '#fffffff5' : '#fffffff5', position: "absolute", alignSelf: "center", bottom: "8.5%", right: "2%", height: "65%",borderRadius:5, }} >
                <ImageBackground
              source={require("../../../assets/img/Menue_Background.png")}
              style={{
                width: "100%",
                height: "100%",
                borderColor:"rgba(162, 121, 250, 0.30)",
                borderWidth:2,
                borderRadius:5,
                overflow: "hidden",
                
              }}
              resizeMode="cover"
            >
                    <ScrollView showsVerticalScrollIndicator={false} style={{paddingHorizontal:"5%"}}>
                    <Pressable onPress={() => Modalupdate(true)} style={{ width: "100%", flexDirection: "row", alignItems: "center",  marginVertical: "5%" , }} >
                    <View style={{width: "25%", backgroundColor:'transparent', alignItems:'center', borderRadius:2}}>
                    {(Session && Session?.chainId) ? current_chain((Session?.chainId))?.img ?? CHAIN_INFO[selectednetwork].img : CHAIN_INFO[selectednetwork].img}
                    </View>
                    <View style={{ width: "75%" }} >
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(11), color: "#612CD2" }} > {(Session && Session?.chainId) ? current_chain((Session?.chainId))?.name ?? CHAIN_INFO[selectednetwork].name : CHAIN_INFO[selectednetwork].name}</Text>
                            </View>
                  
                </Pressable>
                <Image
                      style={{ width: "90%",height:1.5,marginLeft:"4%",marginVertical: "3%"  }}
                      source={require("../../../assets/img/deviderPNG.png")}
                      resizeMode="contain"
                    />
                        <Pressable onPress={() => onClickSwitch()} style={{ width: "100%", flexDirection: "row", alignItems: "center", marginVertical: "5%" }} >
                            <View style={{ width: "25%", alignItems: "center" }} >

                                <Switch
                                    onValueChange={(val) => onClickSwitch()}
                                    value={privateMode}
                                    disabled={false}
                                    activeText={'On'}
                                    inActiveText={'Off'}
                                    circleSize={17}
                                    barHeight={13}
                                    circleBorderWidth={0}
                                    backgroundActive={
                                        theme.theme === "dark" ? "#612CD2" : "#612CD2"
                                      }
                                      backgroundInactive={
                                        theme.theme === "dark" ? "#612CD2" : "#612CD2"
                                      }
                                      circleActiveColor={"#A279FA"}
                                      circleInActiveColor={"#A279FA"}
                                    changeValueImmediately={true}
                                    innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                                    outerCircleStyle={{}}
                                    renderActiveText={false}
                                    renderInActiveText={false}
                                    switchLeftPx={2.5}
                                    switchRightPx={2.5}
                                    switchWidthMultiplier={1.5}
                                    switchBorderRadius={30}
                                />
                            </View>

                            <View style={{ width: "75%" }} >
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(11), color: "black"}} >Private Mode</Text>
                            </View>
                        </Pressable>
                        <Image
                      style={{ width: "90%",height:1.5,marginLeft:"4%",marginVertical: "3%"  }}
                      source={require("../../../assets/img/deviderPNG.png")}
                      resizeMode="contain"
                    />
                        <Pressable onPress={() => { }} style={{ width: "100%", flexDirection: "row", alignItems: "center", marginVertical: "5%" }} >
                            <View style={{ width: "25%", alignItems: "center" }} >

                                <Switch
                                    onValueChange={(val) => onClickAddBlocker()}
                                    value={false}
                                    disabled={false}
                                    activeText={'On'}
                                    inActiveText={'Off'}
                                    circleSize={17}
                                    barHeight={13}
                                    circleBorderWidth={0}
                                    backgroundActive={
                                        theme.theme === "dark" ? "#612CD2" : "#612CD2"
                                      }
                                      backgroundInactive={
                                        theme.theme === "dark" ? "#612CD2" : "#612CD2"
                                      }
                                      circleActiveColor={"#A279FA"}
                                      circleInActiveColor={"#A279FA"}
                                    changeValueImmediately={true}
                                    innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                                    outerCircleStyle={{}}
                                    renderActiveText={false}
                                    renderInActiveText={false}
                                    switchLeftPx={2.5}
                                    switchRightPx={2.5}
                                    switchWidthMultiplier={1.5}
                                    switchBorderRadius={30}
                                />
                            </View>

                            <View style={{ width: "75%" }} >
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(11), color: "black" }} >Ad Blocker</Text>
                            </View>
                        </Pressable>
                        <Image
                      style={{ width: "90%",height:1.5,marginLeft:"4%",marginVertical: "3%"  }}
                      source={require("../../../assets/img/deviderPNG.png")}
                      resizeMode="contain"
                    />
                        <Pressable onPress={() => { setNewButton(""); dispatch(Updatetripledotmodal(false)); onWebviewReload(); }} style={{ width: "100%", flexDirection: "row", alignItems: "center", marginVertical: "5%" }} >
                            <View style={{ width: "25%", alignItems: "center" }} >
                                {theme.theme == "dark" ? <RefershLight width={16} height={16} /> : <RefershLight width={16} height={16} />}
                            </View>

                            <View style={{ width: "75%" }} >
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(11), color: "black" }} >Refresh</Text>
                            </View>
                        </Pressable>
                        <Image
                      style={{ width: "90%",height:1.5,marginLeft:"4%",marginVertical: "3%"  }}
                      source={require("../../../assets/img/deviderPNG.png")}
                      resizeMode="contain"
                    />
                        <Pressable onPress={() => { setNewButton(""); dispatch(Updatetripledotmodal(false)); onHistoryPress(); }} style={{ width: "100%", flexDirection: "row", alignItems: "center", marginVertical: "5%" }} >
                            <View style={{ width: "25%", alignItems: "center" }} >
                                {theme.theme == "dark" ? <Historylight width={16} height={16} /> : <Historylight width={16} height={16} />}
                            </View>

                            <View style={{ width: "75%" }} >
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(11), color: "black"}} >History</Text>
                            </View>
                        </Pressable>
                        <Image
                      style={{ width: "90%",height:1.5,marginLeft:"4%",marginVertical: "3%"  }}
                      source={require("../../../assets/img/deviderPNG.png")}
                      resizeMode="contain"
                    />
                        <Pressable onPress={() => { setNewButton(""); customShare(searchUrl); dispatch(Updatetripledotmodal(false)); }} style={{ width: "100%", flexDirection: "row", alignItems: "center", marginVertical: "5%" }} >
                            <View style={{ width: "25%", alignItems: "center" }} >
                                {theme.theme == "dark" ? <Sharelight width={18} height={18} /> : <Sharelight width={18} height={18} />}
                            </View>

                            <View style={{ width: "75%" }} >
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(11), color: "black"}} >Share</Text>
                            </View>
                        </Pressable>
                        <Image
                      style={{ width: "90%",height:1.5,marginLeft:"4%",marginVertical: "3%"  }}
                      source={require("../../../assets/img/deviderPNG.png")}
                      resizeMode="contain"
                    />
                        {!multitab ? (findMyfav?.length != 0 ?
                            (<>
                                <Pressable onPress={() => { remove_favourite(findMyfav[0]._id) }} style={{ width: "100%", flexDirection: "row", alignItems: "center", marginVertical: "5%" }} >
                                    <View style={{ width: "25%", alignItems: "center" }} >
                                        {theme.theme == "dark" ? <Activefavdark  width={16} height={16} /> : <Activefavdark  width={16} height={16} />}
                                    </View>

                                    <View style={{ width: "75%" }} >
                                        <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(11), color: "black" }} >Remove bookmark</Text>
                                    </View>
                                </Pressable>
                            </>) :
                            (<>
                                <Pressable onPress={() => { add_favourite(searchUrl) }} style={{ width: "100%", flexDirection: "row", alignItems: "center", marginVertical: "5%" }} >
                                    <View style={{ width: "25%", alignItems: "center" }} >
                                        {theme.theme == "dark" ? <InActivefavlight width={16} height={16} /> : <InActivefavlight width={16} height={16} />}
                                    </View>

                                    <View style={{ width: "75%" }} >
                                        <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(11), color: "black" }} >Add to bookmark</Text>
                                    </View>
                                </Pressable>
                            </>)) : (<></>)}
                            <Image
                      style={{ width: "90%",height:1.5,marginLeft:"4%",marginVertical: "3%"  }}
                      source={require("../../../assets/img/deviderPNG.png")}
                      resizeMode="contain"
                    />


                        <Pressable onPress={() => onDappsPress("fav")} style={{ width: "100%", flexDirection: "row", alignItems: "center", marginVertical: "5%" }} >
                            <View style={{ width: "25%", alignItems: "center" }} >
                                {theme.theme == "dark" ? <BookmarkBlack width={18} height={18} /> : <BookmarkBlack width={18} height={18} />}
                            </View>

                            <View style={{ width: "75%" }} >
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(11), color: "black" }} >Bookmarks</Text>
                            </View>
                        </Pressable>
                        <Image
                      style={{ width: "90%",height:1.5,marginLeft:"4%",marginVertical: "3%"  }}
                      source={require("../../../assets/img/deviderPNG.png")}
                      resizeMode="contain"
                    />

                        <Pressable onPress={() => onDappsPress("Dapps")} style={{ width: "100%", flexDirection: "row", alignItems: "center", marginVertical: "5%" }} >
                            <View style={{ width: "25%", alignItems: "center" }} >
                                {theme.theme == "dark" ? <DappsIconBlack width={20} height={20} /> : <DappsIconBlack width={20} height={20} />}
                            </View>

                            <View style={{ width: "75%" }} >
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(11), color: "black" }} >Dapps</Text>
                            </View>
                        </Pressable>
                        <Image
                      style={{ width: "90%",height:1.5,marginLeft:"4%",marginVertical: "3%"  }}
                      source={require("../../../assets/img/deviderPNG.png")}
                      resizeMode="contain"
                    />

                        <Pressable onPress={() => onPressCommon("Send")} style={{ width: "100%", flexDirection: "row", alignItems: "center", marginVertical: "5%" }} >
                            <View style={{ width: "25%", alignItems: "center" }} >
                                {theme.theme == "dark" ? <Sendlight width={12} height={12} /> : <Sendlight width={12} height={12} />}
                            </View>

                            <View style={{ width: "75%" }} >
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(11), color: "black"}} >Send Crypto</Text>
                            </View>
                        </Pressable>

                        <Image
                      style={{ width: "90%",height:1.5,marginLeft:"4%",marginVertical: "3%"  }}
                      source={require("../../../assets/img/deviderPNG.png")}
                      resizeMode="contain"
                    />
                        <Pressable onPress={() => onPressCommon("Receive")} style={{ width: "100%", flexDirection: "row", alignItems: "center", marginVertical: "5%" }} >
                            <View style={{ width: "25%", alignItems: "center" }} >
                                {theme.theme == "dark" ? <Receivelight width={12} height={12} /> : <Receivelight width={12} height={12} />}
                            </View>

                            <View style={{ width: "75%" }} >
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(11), color: "black" }} >Receive Crypto</Text>
                            </View>
                        </Pressable>
                        <Image
                      style={{ width: "90%",height:1.5,marginLeft:"4%",marginVertical: "3%"  }}
                      source={require("../../../assets/img/deviderPNG.png")}
                      resizeMode="contain"
                    />
                        <Pressable onPress={() => onPressCommon("Buy")} style={{ width: "100%", flexDirection: "row", alignItems: "center", marginVertical: "5%" }} >
                            <View style={{ width: "25%", alignItems: "center" }} >
                                {theme.theme == "dark" ? <Buylight width={12} height={12} /> : <Buylight width={12} height={12} />}
                            </View>

                            <View style={{ width: "75%" }} >
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(11), color: "black" }} >Buy Crypto</Text>
                            </View>
                        </Pressable>
                        <Image
                      style={{ width: "90%",height:1.5,marginLeft:"4%",marginVertical: "3%"  }}
                      source={require("../../../assets/img/deviderPNG.png")}
                      resizeMode="contain"
                    />
                        <Pressable onPress={() => onPressCommon("Sell")} style={{ width: "100%", flexDirection: "row", alignItems: "center", marginVertical: "5%" }} >
                            <View style={{ width: "25%", alignItems: "center" }} >
                                {theme.theme == "dark" ? <SellLight width={12} height={12} /> : <SellLight width={12} height={12} />}
                                {/* <Text style={{fontWeight:"400",color:"black",fontSize:RFValue(20)}}>-</Text> */}
                            </View>

                            <View style={{ width: "75%" }} >
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(11), color: "black" }} >Sell Crypto</Text>
                            </View>
                        </Pressable>
                        <Image
                      style={{ width: "90%",height:1.5,marginLeft:"4%",marginVertical: "3%"  }}
                      source={require("../../../assets/img/deviderPNG.png")}
                      resizeMode="contain"
                    />
                        <Pressable onPress={() => onOtherPress("Earnscreen")} style={{ width: "100%", flexDirection: "row", alignItems: "center", marginVertical: "5%" }} >
                            <View style={{ width: "25%", alignItems: "center" }} >
                                {theme.theme == "dark" ? <Earningslight width={14} height={14} /> : <Earningslight width={14} height={14} />}
                            </View>

                            <View style={{ width: "75%" }} >
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(11), color: "black" }} >Earn Crypto</Text>
                            </View>
                        </Pressable>
                        <Image
                      style={{ width: "90%",height:1.5,marginLeft:"4%",marginVertical: "3%"  }}
                      source={require("../../../assets/img/deviderPNG.png")}
                      resizeMode="contain"
                    />
                        <Pressable onPress={() => onOtherPress("SwapBottomTab")} style={{ width: "100%", flexDirection: "row", alignItems: "center", marginVertical: "5%" }} >
                            <View style={{ width: "25%", alignItems: "center" }} >
                                {theme.theme == "dark" ? <Swapplight width={18} height={18} /> : <Swapplight width={18} height={18} />}
                            </View>

                            <View style={{ width: "75%" }} >
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(11), color: "black" }} >Swap</Text>
                            </View>
                        </Pressable>
                        <Image
                      style={{ width: "90%",height:1.5,marginLeft:"4%",marginVertical: "3%"  }}
                      source={require("../../../assets/img/deviderPNG.png")}
                      resizeMode="contain"
                    />
                        <Pressable onPress={() => onOtherPress("SettingsHome")} style={{ width: "100%", flexDirection: "row", alignItems: "center", marginVertical: "5%" }} >
                            <View style={{ width: "25%", alignItems: "center" }} >
                                {theme.theme == "dark" ? <Settingslight width={20} height={20} /> : <Settingslight width={20} height={20} />}
                            </View>

                            <View style={{ width: "75%" }} >
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(11), color: "black" }} >Settings</Text>
                            </View>
                        </Pressable>
                       

                    </ScrollView>
</ImageBackground>
                </View>
            </View>
        </Modal>

            <Modal
                visible={tostShow}
                transparent={true}
                animationType="slide"
                style={{

                    borderRadius: 5,
                    backgroundColor: "black",

                }}>
                <View style={{ width: "75%", height: 45,backgroundColor: theme.theme == "dark" ? "#F8F4FF" : "#34205c", alignItems: "center", justifyContent: "center", alignSelf: "center", borderRadius: 22.5 }}>
                    <Text style={{ fontFamily: Fonts.Regular, fontSize: RFValue(12), color:theme.theme==="light"?"white": "black" }}>
                        {tostMessage}
                    </Text>
                </View>
            </Modal>
        </>
    )

}
export default Tripledotsnew;
const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent', 
    },
    modalContentContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
   
});