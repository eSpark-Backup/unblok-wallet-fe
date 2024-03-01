import React, { useCallback, useContext, useEffect, useState } from "react";
import { Pressable, View, Text, TextInput, BackHandler, Image } from "react-native";
import themeContext from "../../../utils/themeContext";
import { borderRadius, windowheight } from "../../../utils/Dimensions";
import { Icon as Icn } from "react-native-elements";
import BackDark from '../../../assets/icons/darktheme/Back arrow.svg'
import BackLight from '../../../assets/icons/lighttheme/Back arrow.svg'
import PlusIcon from '../../../assets/icons/darktheme/plus_white.svg'
import PlusIconLight from '../../../assets/icons/lighttheme/plus_black.svg'
import DappIcon from '../../../assets/icons/darktheme/DApps.svg'
import DappIconLight from '../../../assets/icons/lighttheme/DApps.svg'
import SearchiconDark from '../../../assets/icons/darktheme/Security.svg'
import SearchiconLight from '../../../assets/icons/lighttheme/Security.svg'
import TrippledorLight from '../../../assets/icons/lighttheme/Trippledots.svg'
import TrippledorDark from '../../../assets/icons/darktheme/Trippledots.svg'

import InActiveBackDark from '../../../assets/icons/darktheme/Back arrow DApps.svg'
import InActiveBackLight from '../../../assets/icons/lighttheme/Back arrow DApps.svg'

import { Fonts } from "../../../utils/Fonts";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import { Addtab, CurrenTabId, Dappmodalupdate, Getmultitabs, SetSearchUrl, Updatetripledotmodal, Updateweburl, selecteTab, setActiveTabId, setNavigateAction } from "../../../Redux/Actions/DapplatetsActions";
import { CHAIN_INFO } from "../useWeb3";
import getRealm from "../../../localDb/RealmConfig";
import { Toastfn } from "../../../utils/toast";
import isEmpty from "../../../utils/isEmpty";
import { Images } from "../../../utils/Images";
import { findHostNameWithUrl } from "../../../utils/common";
import Refershiconlight from '../../../assets/icons/lighttheme/Reset Passcode.svg'
import Refershicondark from '../../../assets/icons/darktheme/Reset Passcode.svg'
import { useFocusEffect } from "@react-navigation/native";
const Dappheader = ({ dappnavigation, multitab, setMultitab, search, onWebviewReload, webRef }) => {
    const dispatch = useDispatch()
    const theme = useContext(themeContext)
    const Modalupdate = (item) => dispatch(Dappmodalupdate(item))
    const setsearchUrl = (item) => dispatch(SetSearchUrl(item))
    const setwebUrl = (item) => dispatch(Updateweburl(item))
    const selecteATab = (item) => dispatch(selecteTab(item))
    const setCurrentTabId = (item) => dispatch(CurrenTabId(item));
    const setActivetabid = (item) => dispatch(setActiveTabId(item))
    const setnavigateAction = (item) => dispatch(setNavigateAction(item));

    const { Session, version, namespaces, payload, from, Site_Detail } = useSelector(
        (state) => state.wcreducer
    );

    const [network, setNetwork] = useState("");
    const initialstate = {
        searchdisplay: false
    }
    const [statevalues, setStatevalues] = useState(initialstate)
    const {
        searchdisplay
    } = statevalues

    const current_chain = (chainId) => CHAIN_INFO.filter(
        (it) => it.chainId == chainId
      )?.pop();


    const modaldata = useSelector(state => ({
        selectednetwork: state.DapplatestReducer.selectednetwork,
        tablength: (state.DapplatestReducer.multitabs).length,
        multitabs: (state.DapplatestReducer.multitabs),
        tripledotmodal: state.DapplatestReducer.tripledotmodal,
        weburl: state.DapplatestReducer.weburl,
        searchUrl: state.DapplatestReducer.searchUrl,
        selectedTab: state.DapplatestReducer.selectedTab,
        currenttabId: state.DapplatestReducer.currenttabId,
    }));
    console.log("weburl", weburl);
    const {
        selectednetwork,
        tablength,
        multitabs,
        tripledotmodal,
        weburl,
        searchUrl,
        selectedTab,
        currenttabId
    } = modaldata

    const updatestatevalue = (key) => {
        switch (key) {
            case "enablesearch":
                setStatevalues((prevstate) => ({
                    ...prevstate,
                    ["searchdisplay"]: true
                }))
                break;
            case "disablesearch":
                setStatevalues((prevstate) => ({
                    ...prevstate,
                    ["searchdisplay"]: false
                }))
                break;
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

    console.log("searchUrl", searchUrl);

    {/** This function trggers when the user search something on search bar and click the search icon */ }
    const redirecttoBrowser = () => {
        updatestatevalue("disablesearch")
        if (isEmpty(searchUrl)) return Toastfn("URL required")
        //console.log("urlForSearch", urlForSearch);
        if (searchUrl.trim().slice(0, 8) == "https://") return setwebUrl(searchUrl)
        if (searchUrl.trim().slice(-4) != ".com") return setwebUrl(`https://www.google.com/search?q=${searchUrl}`)
        else setwebUrl(urlForSearch)
    };

    {/** This function triggers when user click forword(>) button on header */ }
    const goForwordFunction = async () => {
        console.log("multitab", JSON.stringify(multitabs, null, 2), selectedTab, currenttabId);
        try {

            // var val = multitabs[selectedTab]?.TAB
            // var returnVal = val.filter((int) => {
            //     var num = parseInt(currenttabId) + 1
            //     return int.id == num
            // })
            // console.log("returnVal", JSON.stringify(returnVal, null, 2));

            var returnVal = multitabs[selectedTab]?.TAB[parseInt(currenttabId) + 1]
            console.log("returnVal", returnVal, currenttabId);
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
            // var val = multitabs[selectedTab]?.TAB
            // console.log("val", val);


            var decreaseValue = 1;

            const GetBackword = () => {
                if (multitabs[selectedTab]?.TAB.length == 1) return false;
                var mathIncrease = currenttabId - decreaseValue
                if (mathIncrease < 0) return false;
                var findValue = multitabs[selectedTab]?.TAB[mathIncrease]
                if (findValue) {
                    decreaseValue = 1
                    return findValue;
                } else {
                    decreaseValue = decreaseValue + 1;
                    return GetBackword();
                }
            }

            console.log("GetBackword", GetBackword());

            // var returnVal = val.filter((int) => {
            //     var num = parseInt(currenttabId) - 1
            //     return int.id == num
            // })

            // console.log("returnVal", JSON.stringify(returnVal, null, 2));
            if (GetBackword()) {
                setnavigateAction("back")
                setCurrentTabId(Number(GetBackword().id))
                setsearchUrl(GetBackword().URL);
                setwebUrl(GetBackword().URL);
            }
        } catch (error) {
            console.log("aaaaaaaaaaaaaa", error);
        }

    }

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                // BackHandler.goBack()
                // gobackFunction()
                return true
            };
            BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () => {
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
            };
        }, [])
    )

    var GetForword = multitabs[selectedTab]?.TAB[currenttabId + 1];
    var GetBackword = multitabs[selectedTab]?.TAB[currenttabId - 1];
        console.log("Session.img",Session?.chainId,selectednetwork);
    // console.log('GetBackword', currenttabId, JSON.stringify(GetBackword, null, 2))
    // console.log('GetForword', currenttabId, JSON.stringify(GetForword, null, 2))
    return (
        <View style={{
            width: "100%",
            height: windowheight * 0.065,
            backgroundColor: theme.theme == "light" ? "#f1f1f1" : "#323234",
            flexDirection: "row",
            alignItems: "center",
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            elevation: 4,
        }} >
            <>
                {!searchdisplay ?
                    <>
                        <View style={{ width: "17.5%", flexDirection: "row", justifyContent: "space-around", alignItems: "center" }} >
                            {GetBackword ?
                                <Pressable onPress={() => { multitab ? setMultitab(false) : gobackFunction() }}>
                                    {theme.theme == "light" ?
                                        <BackLight width={30} height={30} style={{ resizeMode: "contain", alignSelf: "center" }} />
                                        :
                                        <BackDark width={25} height={25} style={{ resizeMode: "contain", alignSelf: "center" }} />
                                    }

                                </Pressable>
                                :
                                <View>

                                    {theme.theme == "light" ?
                                        <InActiveBackLight width={25} height={25} style={{ resizeMode: "contain", alignSelf: "center" }} />
                                        :
                                        <InActiveBackDark width={25} height={25} style={{ resizeMode: "contain", alignSelf: "center" }} />
                                    }
                                </View>}
                            {GetForword ?
                                <Pressable disabled={multitab} onPress={() => { goForwordFunction() }}>
                                    {theme.theme == "light" ?
                                        <BackLight width={30} height={30} style={{ resizeMode: "contain", alignSelf: "center", transform: [{ rotate: "180deg" }] }} />
                                        :
                                        <BackDark width={25} height={25} style={{ resizeMode: "contain", alignSelf: "center", transform: [{ rotate: "180deg" }] }} />

                                    }

                                </Pressable>
                                :
                                <View>

                                    {theme.theme == "light" ?
                                        <InActiveBackLight width={25} height={25} style={{ resizeMode: "contain", alignSelf: "center", transform: [{ rotate: "180deg" }] }} />
                                        :
                                        <InActiveBackDark width={25} height={25} style={{ resizeMode: "contain", alignSelf: "center", transform: [{ rotate: "180deg" }] }} />
                                    }
                                </View>}
                        </View>
                        <Pressable onPress={() => {
                            search()
                            // updatestatevalue("enablesearch")
                        }} elevation={1} style={{ paddingHorizontal: 10, width: "47%", height: "60%", backgroundColor: theme.theme == "light" ? "#fff" : "gray", borderRadius: borderRadius * 1, flexDirection: "row", }} >
                            <View style={{ width: "15%", height: "100%", justifyContent: "center", }} >
                                {theme.theme == "light" ?
                                    <SearchiconLight width={20} height={20} style={{ alignSelf: "center", resizeMode: "contain" }} />
                                    :
                                    <SearchiconDark width={20} height={20} style={{ alignSelf: "center", resizeMode: "contain" }} />
                                }
                            </View>
                            <View style={{ width: "67%", height: "100%", justifyContent: "center" }} >
                                {/* {console.log("findHostNameWithUrl(searchUrl).hostName", findHostNameWithUrl(searchUrl))} */}
                                <Text style={{ fontSize: RFValue(11), fontFamily: Fonts.Medium, color: theme.theme == "light" ? "#000" : "#fff" }} numberOfLines={1} >
                                    {findHostNameWithUrl(searchUrl)?.hostname?.slice(0, 4) == "www." ? findHostNameWithUrl(searchUrl)?.hostname?.slice(4) : findHostNameWithUrl(searchUrl)?.hostname}
                                </Text>
                            </View>
                            <View style={{ width: "17%", height: "100%", justifyContent: "center", }} >
                                <Pressable
                                    style={{
                                        borderWidth: 1,
                                        borderColor: theme.theme == "light" ? "#000" : "#fff",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 22,
                                        height: 22,
                                        borderRadius: 8,
                                        alignSelf: "flex-end"
                                    }}
                                    onPress={() => {
                                        setnavigateAction("forword")
                                        setMultitab(!multitab)
                                    }}
                                >

                                    <Text style={{ color: theme.theme == "light" ? "#000" : "#fff", fontSize: RFValue(10) }}>{tablength}</Text>
                                </Pressable>
                            </View>
                        </Pressable>

                        <View style={{ width: "35%", height: "70%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", }} >
                            <Pressable style={{ marginLeft: 7 }} onPress={() => Modalupdate(true)} >
                                {(Session && Session?.chainId) ? current_chain((Session?.chainId))?.img ?? CHAIN_INFO[selectednetwork].img : CHAIN_INFO[selectednetwork].img}
                            </Pressable>

                            <Pressable
                                onPress={() => {
                                    // props.navigation.navigate("WalletHome");
                                    // setDappStatus({
                                    //     status: "true",
                                    //     item: "",
                                    // });
                                    dappnavigation()
                                }}
                                style={{ alignSelf: "center", marginLeft: 1 }}
                            >
                                {theme.theme == "light" ?

                                    <DappIconLight width={22} height={22} style={{ resizeMode: "contain" }} />
                                    :
                                    <DappIcon width={22} height={22} style={{ resizeMode: "contain" }} />

                                }
                            </Pressable>

                            <Pressable
                                onPress={() => CreateTab()}
                            >
                                {theme.theme == "light" ?
                                    <PlusIconLight width={23} height={23} style={{ resizeMode: "contain" }} />
                                    :

                                    <PlusIcon width={23} height={23} style={{ resizeMode: "contain" }} />
                                }
                            </Pressable>


                            <Pressable onPress={() => dispatch(Updatetripledotmodal(!tripledotmodal))} style={{ marginLeft: 0, right: "20%" }}>
                                {/* <Icn size={25} type="material" color={theme.theme == "light" ? "#000" : "#fff"} name="more-vert" /> */}
                                {theme.theme == "dark" ?
                                    <TrippledorDark width={22} height={22} /> :
                                    <TrippledorLight width={22} height={22} />
                                }
                            </Pressable>
                        </View>
                    </> :
                    <>
                        <Pressable onPress={() => {
                            // props.navigation.navigate("Dappsearch");
                            // setIssearhEnabled(true)
                            setMultitab(false)
                        }} elevation={1} style={{ borderWidth: 0, marginLeft: 10, paddingHorizontal: 10, width: "75%", height: "70%", backgroundColor: theme.theme == "light" ? "#fff" : "gray", borderRadius: borderRadius * 1, flexDirection: "row" }} >
                            <View style={{ width: "10%", height: "100%", justifyContent: "center", paddingHorizontal: 20, borderWidth: 0 }} >
                                {theme.theme == "light" ?
                                    <SearchiconLight width={20} height={20} style={{ alignSelf: "center", resizeMode: "contain" }} />
                                    :
                                    <SearchiconDark width={20} height={20} style={{ alignSelf: "center", resizeMode: "contain" }} />
                                }
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", width: "85%", backgroundColor: "transparent", height: "100%", justifyContent: "center", borderWidth: 0, borderColor: "transparent", elevation: 0 }} >
                                <TextInput
                                    theme={{ colors: { placeholder: theme.theme == "light" ? "#000" : "#fff", text: theme.theme == "light" ? "#000" : "#fff", primary: "transparent", underlineColor: 'transparent', } }}
                                    text={theme.theme == "light" ? "#000" : "#fff"}
                                    // selectionColor={"purple"}
                                    underlineColor='transparent'
                                    style={{ width: "90%", color: theme.theme == "light" ? "#000" : "#fff", backgroundColor: "transparent", borderWidth: 0, borderRadius: 0, borderColor: "transparent", fontSize: RFValue(12), paddingVertical: "2%" }}
                                    placeholder="Search or type URL"
                                    returnKeyType="search"
                                    onSubmitEditing={() => { redirecttoBrowser() }}
                                    value={searchUrl}
                                    onChangeText={(e) => { setsearchUrl(e) }}
                                    placeholderTextColor={theme.theme == "light" ? "#000" : "#fff"}
                                    autoFocus
                                />
                                <Pressable style={{ marginLeft: 0 }} onPress={() => { setsearchUrl("") }}>
                                    <Icn size={20} type="material" color={theme.theme == "light" ? "#000" : "#fff"} name="close" />
                                </Pressable>
                            </View>


                        </Pressable>

                        <Pressable onPress={() => { if (isEmpty(searchUrl)) setsearchUrl(weburl); updatestatevalue("disablesearch") }} style={{ marginLeft: "5%" }} >
                            <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Cancel</Text>
                        </Pressable>
                    </>

                }
            </>
        </View>
    )
}

export default Dappheader;