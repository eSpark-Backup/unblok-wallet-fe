import React, { useCallback, useContext, useEffect, useState } from "react";
import { BackHandler, Pressable, StyleSheet, Text, TouchableHighlight, View } from "react-native"
import Ethlogo from '../../../assets/img/ethLogo.svg'
import Shareblocklight from '../../../assets/icons/lighttheme/Share Black.svg'
import Shareblockdark from '../../../assets/icons/darktheme/Share White.svg'
import themeContext from "../../../utils/themeContext";
import Lockdark from '../../../assets/icons/darktheme/Passcode.svg'
import Locklight from '../../../assets/icons/lighttheme/Passcode.svg'
import { Fonts } from "../../../utils/Fonts";
import { RFValue } from "react-native-responsive-fontsize";
import BackDark from '../../../assets/icons/darktheme/Back arrow.svg'
import BackDarkDisable from '../../../assets/icons/darktheme/Back_arrow_Disable.svg'
import BackLight from '../../../assets/icons/lighttheme/Back arrow.svg'
import BackLightDisable from '../../../assets/icons/lighttheme/Back_arrow_Disable.svg'
import SearchiconDark from '../../../assets/icons/darktheme/Search1.svg'
import SearchiconLight from '../../../assets/icons/lighttheme/Search1.svg'
import PlusIcon from '../../../assets/icons/darktheme/plus_white.svg'
import PlusIconLight from '../../../assets/icons/lighttheme/plus_black.svg'
import DappIcon from '../../../assets/icons/darktheme/DApps.svg'
import DappIconLight from '../../../assets/icons/lighttheme/DApps.svg'
import TrippledorLight from '../../../assets/icons/lighttheme/Trippledots.svg'
import TrippledorDark from '../../../assets/icons/darktheme/Trippledots.svg'
import InActiveBackDark from '../../../assets/icons/darktheme/Back arrow DApps.svg'
import InActiveBackLight from '../../../assets/icons/lighttheme/Back arrow DApps.svg'

import { useDispatch, useSelector } from "react-redux";
import { Addtab, CurrenTabId, Dappmodalupdate, SetSearchUrl, Updatetripledotmodal, Updateweburl, selecteTab, setActiveTabId, setButton, setNavigateAction } from "../../../Redux/Actions/DapplatetsActions";
import getRealm from "../../../localDb/RealmConfig";
import { useFocusEffect } from "@react-navigation/native";
const Dappfooter = ({ dappnavigation, search, setMultitab, multitab,dappHome }) => {
    const theme = useContext(themeContext)
    const dispatch = useDispatch()

    const Modalupdate = (item) => dispatch(Dappmodalupdate(item))
    const setsearchUrl = (item) => dispatch(SetSearchUrl(item))
    const setwebUrl = (item) => dispatch(Updateweburl(item))
    const selecteATab = (item) => dispatch(selecteTab(item))
    const setCurrentTabId = (item) => dispatch(CurrenTabId(item));
    const setActivetabid = (item) => dispatch(setActiveTabId(item))
    const setnavigateAction = (item) => dispatch(setNavigateAction(item));
    const setNewButton = (item) => dispatch(setButton(item));

    const modaldata = useSelector(state => ({
        selectednetwork: state.DapplatestReducer.selectednetwork,
        tablength: (state.DapplatestReducer.multitabs).length,
        multitabs: (state.DapplatestReducer.multitabs),
        tripledotmodal: state.DapplatestReducer.tripledotmodal,
        weburl: state.DapplatestReducer.weburl,
        searchUrl: state.DapplatestReducer.searchUrl,
        selectedTab: state.DapplatestReducer.selectedTab,
        currenttabId: state.DapplatestReducer.currenttabId,
        button: state.DapplatestReducer.button,
    }));

    const {
        selectednetwork,
        tablength,
        multitabs,
        tripledotmodal,
        weburl,
        searchUrl,
        selectedTab,
        currenttabId,
        button
    } = modaldata
    // console.log("modaldata", JSON.stringify(modaldata));
    const [Tabs, setTabs] = useState("")

    {/** This function triggers when user click forword(>) button on header */ }
    const goForwordFunction = async () => {
        console.log("multitab", JSON.stringify(multitabs, null, 2), selectedTab, currenttabId);
        try {

            var returnVal = multitabs[selectedTab]?.TAB[parseInt(currenttabId) + 1]
            // console.log("returnVal", returnVal, currenttabId);
            if (returnVal) {
                setnavigateAction("forword")
                setsearchUrl(returnVal.URL);
                setwebUrl(returnVal.URL);
                setCurrentTabId(Number(returnVal.id))
            }
            // console.log("returnVal", returnVal);
        } catch (error) {
            console.log("aaaaaaaaaaaaaa", error);
        }

    }

    {/** This function triggers when user click back(<) button on header */ }
    const gobackFunction = async () => {
        try {
            console.log("multitab", JSON.stringify(multitabs, null, 2), selectedTab, currenttabId);
            var val = multitabs[selectedTab]?.TAB

            var decreaseValue = 1;

            const GetBackword = () => {

                if (multitabs[selectedTab]?.TAB.length == 1) return false;
                var mathIncrease = currenttabId - decreaseValue
                if (mathIncrease < 0) return false;
                if (multitabs[selectedTab]?.TAB.length < decreaseValue) return false;
                var findValue = multitabs[selectedTab]?.TAB[mathIncrease]
                if (findValue) {
                    decreaseValue = 1
                    return findValue;
                } else {

                    decreaseValue = decreaseValue + 1;
                    return GetBackword();
                }
            }

            const getData = GetBackword()
            if (getData) {
                setnavigateAction("back")
                setCurrentTabId(Number(getData.id))
                setsearchUrl(getData.URL);
                setwebUrl(getData.URL);
            }
        } catch (error) {
            console.log("aaaaaaaaaaaaaa", error);
        }

    }

    const CreateTab = () => {
        var TabID = String(Date.now())
        dispatch(Addtab(TabID))
        setMultitab(false)
        selecteATab(selectedTab + 1)
        var setObj = { URL: "https://www.google.com/", hostName: "www.google.com", id: "0" }
        getRealm()
            .then((realm) => {
                setActivetabid(TabID)
                realm.write(() => {
                    realm.create("dappTabs", {
                        ImageUrl: "",
                        TabId: TabID,
                        TAB: [setObj]
                    });
                });
            })
            .catch((err) => {
                console.log("errro  iopn aadad create tab", err);
            })
    }


    useFocusEffect(
        useCallback(() => {
            const onBackPress = async () => {
                console.log("hardwareBackPress");
                console.log("multitab", JSON.stringify(multitabs, null, 2), selectedTab, currenttabId);
                // var val = multitabs[selectedTab]?.TAB
                

                var decreaseValue = 1;

                const GetBackword = async () => {
                    var dappVal1
                    const getDa = await getRealm()
                        .then((realm) => {
                            dappVal1 = realm.objects("dappTabs");
                            if (dappVal1[selectedTab]?.TAB.length == 1) return false;
                            if (dappVal1[selectedTab]?.TAB.length < decreaseValue) return false;
                            var mathIncrease = currenttabId - decreaseValue
                            if (mathIncrease < 0) return false;
                            var findValue = dappVal1[selectedTab]?.TAB[mathIncrease]
                            if (findValue) {
                                decreaseValue = 1
                                console.log("findValue", findValue);
                                return findValue;
                            } else {
                                console.log("comimng else");
                                decreaseValue = decreaseValue + 1;
                                return GetBackword();
                            }
                        })
                        .catch((err) => {
                            console.error("errro  iopn aadad savedapp realm", err);
                        })
                    return getDa
                }

                const getData = await GetBackword()
                if (getData) {
                    setnavigateAction("back")
                    setCurrentTabId(Number(getData.id))
                    setsearchUrl(getData.URL);
                    setwebUrl(getData.URL);
                }
                return true;
            };
            // Add Event Listener for hardwareBackPress
            BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () => {
                // Once the Screen gets blur Remove Event Listener
                // getPasscodeStatus();
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
            };
        }, [BackHandler, weburl, currenttabId])
    );

    const GetForword = multitabs[selectedTab]?.TAB[currenttabId + 1];
    const GetBackword = multitabs[selectedTab]?.TAB[currenttabId - 1];
console.log("GetForword, GetBackword",GetForword,GetBackword)
    return (

        <View style={{ alignItems: "center", height: 55.5, flexDirection: "row", backgroundColor: theme.theme == "light" ? "white" : "#34205c", borderTopWidth: 0.3 ,borderColor:"gray",}} >
            <View style={{ width: "14.25%", height: "100%", justifyContent: "center", }} >
                <TouchableHighlight activeOpacity={1} underlayColor={"rgba(155, 124, 220, 0.20)"} onPress={() =>  gobackFunction()} style={{ width: "70%", height: "70%", borderRadius: 5, alignSelf: "center", justifyContent: "center", }} >
                    {theme.theme == "light" ?(
// currenttabId.length === 1 || currenttabId ===0 ?<BackLightDisable width={25} height={25}  style={{ resizeMode: "contain", alignSelf: "center" }} />:
                        <BackLight width={25} height={25}  style={{ resizeMode: "contain", alignSelf: "center" }} />
                    )
                        :
                        (
                          
                            <BackDark width={25} height={25}  style={{ resizeMode: "contain", alignSelf: "center" }} />
                        )
                    }
                    {/* <BackDark width={30} height={30} style={{ resizeMode: "contain", alignSelf: "center" }} /> */}
                </TouchableHighlight>
            </View>

            <View style={{ width: "14.25%", height: "100%", justifyContent: "center" }} >
                <TouchableHighlight onPress={() => goForwordFunction()} activeOpacity={1} underlayColor={"rgba(155, 124, 220, 0.20)"} style={{ width: "70%", height: "70%", borderRadius: 5, alignSelf: "center", justifyContent: "center" }} >
                    {theme.theme == "light" ?(
                        // currenttabId.length - 1 === currenttabId?
                        // <BackLightDisable width={25} height={25} style={{ resizeMode: "contain", alignSelf: "center", transform: [{ rotate: "180deg" }] }} />:
                        <BackLight width={25} height={25} style={{ resizeMode: "contain", alignSelf: "center", transform: [{ rotate: "180deg" }] }} />
                    )
                        :(
                           
                            <BackDark width={25} height={25} style={{ resizeMode: "contain", alignSelf: "center", transform: [{ rotate: "180deg" }] }} />
                        )
                    }
                        {/* <BackDark width={30} height={30} style={{ resizeMode: "contain", alignSelf: "center", transform: [{ rotate: "180deg" }] }} /> */}
                </TouchableHighlight>
            </View>

            <View style={{ width: "14.25%", height: "100%", justifyContent: "center" }}>
                <TouchableHighlight onPress={() => search()} activeOpacity={1} underlayColor={"rgba(155, 124, 220, 0.20)"} style={{ width: "70%", height: "70%", borderRadius: 5, alignSelf: "center", justifyContent: "center" }} >
                    {theme.theme == "light" ?
                        <SearchiconLight width={22} height={22} style={{ alignSelf: "center", resizeMode: "contain" }} />
                        :
                        <SearchiconDark width={22} height={22} style={{ alignSelf: "center", resizeMode: "contain" }} />
                    }
                        {/* <SearchiconDark width={22} height={22} style={{ alignSelf: "center", resizeMode: "contain" }} /> */}
                </TouchableHighlight>
            </View>

            <View style={{ width: "14.25%", height: "100%", justifyContent: "center" }}>
                <TouchableHighlight onPress={() => CreateTab()} activeOpacity={1} underlayColor={"rgba(155, 124, 220, 0.20)"} style={{ width: 40, height: 40, borderRadius: 2, alignSelf: "center", justifyContent: "center", backgroundColor:"rgba(155, 124, 220, 0.20)", borderColor:"rgba(162, 121, 250, 0.20)", borderWidth:2 }}  >
                    <View style={{ width: "65%", height: "70%", alignSelf: "center", justifyContent: "center" }} >
                        {theme.theme == "light" ?
                            <PlusIconLight width={12} height={12} style={{ alignSelf: "center", resizeMode: "contain" }} />
                            :
                            <PlusIcon width={12} height={12} style={{ alignSelf: "center", resizeMode: "contain" }} />
                        }
                            {/* <PlusIcon width={22} height={22} style={{ alignSelf: "center", resizeMode: "contain" }} /> */}
                    </View>
                </TouchableHighlight>
            </View>


            <Pressable onPress={() => {
                setnavigateAction("forword")
                setMultitab(!multitab)
                setTabs("triple");
            }} style={{ width: "14.25%", height: "100%", justifyContent: "center" }} >
                <View style={{ width: 25, height: 25, borderRadius: 5, alignSelf: "center", justifyContent: "center", borderWidth: 1.2, borderColor: theme.theme == "dark" ? "#fff" : "#2F2448" }} >
                    <Text style={{ textAlign: "center", color:theme.theme==="dark"? "#fff":"#2F2448", fontFamily: Fonts.Medium, fontSize: RFValue(12) }} >{tablength}</Text>
                </View>
            </Pressable>

            <View style={{ width: "14.25%", height: "100%", justifyContent: "center" }}>
                <TouchableHighlight onPress={() => { setTabs("home"); dappHome() }} activeOpacity={1} underlayColor={"rgba(155, 124, 220, 0.20)"} style={{ width: "70%", height: "70%", borderRadius: 5, alignSelf: "center", justifyContent: "center" }} >
                    {theme.theme == "light" ?
                        <DappIconLight width={24} height={24} style={{ alignSelf: "center", resizeMode: "contain" }} />
                        :
                        <DappIcon width={24} height={24} style={{ alignSelf: "center", resizeMode: "contain" }} />
                    }
                        {/* <DappIcon width={22} height={22} style={{ alignSelf: "center", resizeMode: "contain" }} /> */}
                </TouchableHighlight>
            </View>


            <View style={{ width: "14.25%", height: "100%", justifyContent: "center" }} >
                <TouchableHighlight activeOpacity={1} underlayColor={"rgba(155, 124, 220, 0.20)"}  style={{ width: "70%", height: "70%", borderRadius: 5, backgroundColor: "transparent", alignSelf: "center", justifyContent: "center" }} onPress={() => { setNewButton("triple"); dispatch(Updatetripledotmodal(true)) }} >
                    {theme.theme == "light" ?
                        <TrippledorLight width={24} height={24} style={{ alignSelf: "center", resizeMode: "contain", transform: [{ rotate: "90deg" }] }} />
                        :
                        <TrippledorDark width={24} height={24} style={{ alignSelf: "center", resizeMode: "contain", transform: [{ rotate: "90deg" }] }} />
                    }
                        {/* <TrippledorDark width={24} height={24} style={{ alignSelf: "center", resizeMode: "contain", transform: [{ rotate: "90deg" }] }} /> */}
                </TouchableHighlight>
            </View>

        </View>
    )
}

export default Dappfooter;