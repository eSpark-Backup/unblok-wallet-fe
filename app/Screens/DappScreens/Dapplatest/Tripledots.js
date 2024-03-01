import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Modal, Pressable, StatusBar, Text, View } from "react-native";
import WebView from "react-native-webview";
import Dappheader from "./Dappheader";
import { borderRadius, windowWidth, windowheight } from "../../../utils/Dimensions";
import { CHAIN_INFO } from "../useWeb3";
import { useDispatch, useSelector } from "react-redux";
import { Icon as Icn } from "react-native-elements";
import { Fonts } from "../../../utils/Fonts";
import { Dappmodalupdate, Updatenetwork, Updatetripledotmodal, setNavigateAction, setPrivateMode } from "../../../Redux/Actions/DapplatetsActions";
import themeContext from "../../../utils/themeContext";

import Historylight from '../../../assets/icons/lighttheme/Browser History Black.svg'
import Historydark from '../../../assets/icons/darktheme/Browser History White.svg'
import Activefavlight from '../../../assets/icons/darktheme/active_star_dark.svg'
import Activefavdark from '../../../assets/icons/lighttheme/active_star_light.svg'
import InActivefavlight from '../../../assets/icons/lighttheme/inactive_star_light.svg'
import InActivefavDark from '../../../assets/icons/darktheme/inactive_star_dark.svg'
import Sendlight from '../../../assets/icons/lighttheme/Send.svg';
import SendDark from '../../../assets/icons/darktheme/Send.svg';
import Receivelight from '../../../assets/icons/lighttheme/Receive.svg';
import ReceiveDark from '../../../assets/icons/darktheme/Receive.svg';
import Sharelight from '../../../assets/icons/lighttheme/Share Black.svg';
import ShareDark from '../../../assets/icons/darktheme/Share White.svg';

import RefreshIconLight from '../../../assets/icons/lighttheme/Reset Passcode.svg'
import RefreshIconDark from '../../../assets/icons/darktheme/Reset Passcode.svg'
import DappsIconBlack from '../../../assets/icons/lighttheme/DApps Black.svg'
import DappsIconWhite from '../../../assets/icons/darktheme/DApps White.svg'
import BookmarkWhite from '../../../assets/icons/darktheme/Bookmarks White.svg'
import BookmarkBlack from '../../../assets/icons/lighttheme/Bookmarks.svg'

import { RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import getRealm from "../../../localDb/RealmConfig";
import { customShare, findCommonObjectsById, findHostNameWithUrl } from "../../../utils/common";
import { FavDappApi } from "../common/D_app";
import { Switch } from 'react-native-switch';


const Tripledots = ({ multitab, history, myfav, add_favourite, remove_favourite, onWebviewReload }) => {
    const theme = useContext(themeContext)

    const dispatch = useDispatch()
    const navigation = useNavigation()

    const [findMyfav, setMyFav] = useState([]);
    // const [privateMode, setPrivateMode] = useState(false)
    const setnavigateAction = (item) => dispatch(setNavigateAction(item));
    const setPrivMode = (item) => dispatch(setPrivateMode(item));

    const {
        tripledotmodal,
        multitabs,
        weburl,
        searchUrl,
        selectedTab,
        currenttabId,
        Maddress,
        privateMode
    } = useSelector(state => ({
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

    const onHistoryPress = () => { setnavigateAction("back"); history(true); dispatch(Updatetripledotmodal(false)) }

    const onSendPress = () => { setnavigateAction("back"); dispatch(Updatetripledotmodal(false)); global?.initialEnter == undefined ? navigateSecurityPage("Send") : navigation.navigate("commonRbSheet", params = "Send") }

    const onReceivePress = () => { setnavigateAction("back"); dispatch(Updatetripledotmodal(false)); global?.initialEnter == undefined ? navigateSecurityPage("Receive") : navigation.navigate("commonRbSheet", params = "Receive") }

    const onDappsPress = (val) => { setnavigateAction("back"); dispatch(Updatetripledotmodal(false)); navigation.navigate("DappList", val) }

    const onChangeFunction = async (val) => {

    }
    console.log("privateMode", privateMode);
    const onClickSwitch = () => {
        setPrivMode(!privateMode)
    }
    return (

        <Modal
            visible={tripledotmodal}
            transparent={true}
            style={{
                position: "relative", zIndex: 999,
                borderRadius: 50
            }}>
            <View onStartShouldSetResponder={() => dispatch(Updatetripledotmodal(false))} style={{ flex: 1, backgroundColor: 'transparent' }} >
                <View style={{ width: "50%", backgroundColor: theme.theme == "light" ? '#fff' : '#323234', position: "absolute", top: "4%", right: 0, paddingVertical: "5%", borderRadius: borderRadius * 1, borderWidth: 1, borderColor: theme.theme == "light" ? "#ccc" : "grey" }} >

                    <Pressable onPress={() => onClickSwitch()} >
                        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: "5%" }}>
                            <View style={{ width: "25%", alignSelf: "center", alignItems: "center" }} >
                                <Switch
                                    onValueChange={(val) => { onClickSwitch(val) }}
                                    value={privateMode}
                                    disabled={false}
                                    activeText={'On'}
                                    inActiveText={'Off'}
                                    circleSize={15}
                                    barHeight={10}
                                    circleBorderWidth={0}
                                    // backgroundActive={theme.switchcolor}
                                    // backgroundInactive={'#D5D5D5'}
                                    // circleActiveColor={'#000'}
                                    // circleInActiveColor={'#000'}
                                    backgroundActive={theme.theme == "light" ? "#cdd0d1" : '#000'}
                                    backgroundInactive={theme.theme == "light" ? "#000" : '#fff'}
                                    circleActiveColor={theme.theme == "light" ? "#000" : '#cdd0d1'}
                                    circleInActiveColor={theme.theme == "light" ? "#cdd0d1" : '#000'}
                                    changeValueImmediately={true}
                                    innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                                    outerCircleStyle={{}} // style for outer animated circle
                                    renderActiveText={false}
                                    renderInActiveText={false}
                                    switchLeftPx={2.5}
                                    switchRightPx={2.5}
                                    switchWidthMultiplier={1.5}
                                    switchBorderRadius={30}
                                />
                            </View>
                            <View style={{ width: "75%", justifyContent: "center" }} >
                                <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Private Mode</Text>

                            </View>
                        </View>
                    </Pressable>

                    <Pressable onPress={() => { dispatch(Updatetripledotmodal(false)); onWebviewReload(); }}>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: "5%" }}>
                            <View style={{ width: "25%", }} >
                                {theme.theme == "light" ?
                                    <RefreshIconLight width={21} height={21} style={{ alignSelf: "center", fill: theme.theme == "light" ? "#000" : "#fff", color: "#fff" }} />
                                    :
                                    <RefreshIconDark width={21} height={21} style={{ alignSelf: "center", fill: theme.theme == "light" ? "#000" : "#fff", color: "#fff" }} />
                                }
                            </View>
                            <View style={{ width: "75%", justifyContent: "center" }} >
                                <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Refresh</Text>

                            </View>
                        </View>
                    </Pressable>

                    <Pressable onPress={() => onHistoryPress()}>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: "5%" }}>
                            <View style={{ width: "25%", }} >
                                {theme.theme == "light" ?
                                    <Historylight width={22} height={22} style={{ alignSelf: "center", fill: theme.theme == "light" ? "#000" : "#fff", color: "#fff" }} />
                                    :
                                    <Historydark width={22} height={22} style={{ alignSelf: "center", fill: theme.theme == "light" ? "#000" : "#fff", color: "#fff" }} />
                                }
                            </View>
                            <View style={{ width: "75%", justifyContent: "center" }} >
                                <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >History</Text>

                            </View>
                        </View>
                    </Pressable>

                    <Pressable onPress={() => { customShare(weburl); dispatch(Updatetripledotmodal(false)); }}>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: "5%" }}>
                            <View style={{ width: "25%", }} >
                                {theme.theme == "light" ?
                                    <Sharelight width={22} height={22} style={{ alignSelf: "center", fill: theme.theme == "light" ? "#000" : "#fff", color: "#fff" }} />
                                    :
                                    <ShareDark width={22} height={22} style={{ alignSelf: "center", fill: theme.theme == "light" ? "#000" : "#fff", color: "#fff" }} />
                                }
                            </View>
                            <View style={{ width: "75%", justifyContent: "center" }} >
                                <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Share</Text>

                            </View>
                        </View>
                    </Pressable>

                    {!multitab ? (findMyfav?.length != 0 ?
                        (<>
                            <Pressable onPress={() => remove_favourite(findMyfav[0]._id)}>
                                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: "5%" }}>
                                    <View style={{ width: "25%", }} >

                                        {/* <Image source={Images.acivestar} style={{ width: windowWidth * 0.09, height: windowheight * 0.035, alignSelf: "center", resizeMode: "contain", }} /> */}
                                        {theme.theme != "light" ?
                                            <Activefavlight width={23} height={23} style={{ alignSelf: "center" }} />
                                            :
                                            <Activefavdark width={23} height={23} style={{ alignSelf: "center" }} />
                                        }

                                    </View>
                                    <View style={{ width: "75%", justifyContent: "center" }} >
                                        <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Remove Bookmark</Text>

                                    </View>
                                </View>
                            </Pressable>
                        </>) :
                        (<>
                            <Pressable onPress={() => add_favourite(searchUrl)}>
                                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: "5%" }}>
                                    <View style={{ width: "25%", }} >

                                        {/* <Image source={Images.inacivestar} style={{ width: windowWidth * 0.09, height: windowheight * 0.035, alignSelf: "center", resizeMode: "contain", tintColor: "#fff" }} /> */}
                                        {theme.theme == "light" ?
                                            <InActivefavlight width={23} height={23} style={{ alignSelf: "center" }} />
                                            :
                                            <InActivefavDark width={23} height={23} style={{ alignSelf: "center" }} />}

                                    </View>
                                    <View style={{ width: "75%", justifyContent: "center" }} >
                                        <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Add to Bookmark</Text>

                                    </View>
                                </View>
                            </Pressable>
                        </>)) : (<></>)}

                    <Pressable onPress={() => onDappsPress("fav")}>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: "5%" }}>
                            <View style={{ width: "25%", }} >
                                {theme.theme == "light" ?
                                    (<BookmarkBlack width={25} height={25} style={{ alignSelf: "center" }} />)
                                    : (<BookmarkWhite width={25} height={25} style={{ alignSelf: "center" }} />)
                                }
                            </View>
                            <View style={{ width: "75%", justifyContent: "center" }} >
                                <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Bookmarks</Text>

                            </View>
                        </View>
                    </Pressable>

                    <Pressable onPress={() => onDappsPress("Dapps")}>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: "5%" }}>
                            <View style={{ width: "25%", }} >
                                {theme.theme == "light" ?
                                    (<DappsIconBlack width={25} height={25} style={{ alignSelf: "center" }} />)
                                    : (<DappsIconWhite width={25} height={25} style={{ alignSelf: "center" }} />)
                                }
                            </View>
                            <View style={{ width: "75%", justifyContent: "center" }} >
                                <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Dapps</Text>

                            </View>
                        </View>
                    </Pressable>

                    <Pressable onPress={() => onSendPress()}>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: "5%" }}>
                            <View style={{ width: "25%", }} >
                                {theme.theme == "light" ?
                                    (<Sendlight width={25} height={25} style={{ alignSelf: "center" }} />)
                                    : (<SendDark width={25} height={25} style={{ alignSelf: "center" }} />)
                                }
                            </View>
                            <View style={{ width: "75%", justifyContent: "center" }} >
                                <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Send Crypto</Text>

                            </View>
                        </View>
                    </Pressable>

                    <Pressable onPress={() => onReceivePress()}>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: "5%" }}>
                            <View style={{ width: "25%", }} >
                                {theme.theme == "light" ?
                                    (<Receivelight width={25} height={25} style={{ alignSelf: "center" }} />)
                                    : (<ReceiveDark width={25} height={25} style={{ alignSelf: "center" }} />)
                                }
                            </View>
                            <View style={{ width: "75%", justifyContent: "center" }} >
                                <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Receive Crypto</Text>

                            </View>
                        </View>
                    </Pressable>
                </View>
            </View>
        </Modal >
    )
}

export default Tripledots;