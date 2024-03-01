import React, { useContext, useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import WebView from 'react-native-webview';
import getRealm from '../../../localDb/RealmConfig';
import { borderRadius, borderWidth, windowWidth } from '../../../utils/Dimensions';
import { Images } from '../../../utils/Images';
import { useDispatch, useSelector } from 'react-redux';
import { Addtab, CurrenTabId, Getmultitabs, SetSearchUrl, Updateweburl, selecteTab, setActiveTabId, setInitialDapp } from '../../../Redux/Actions/DapplatetsActions';
import themeContext from '../../../utils/themeContext';
import { Fonts } from '../../../utils/Fonts';
import { useNavigation } from "@react-navigation/native";
import isEmpty from '../../../utils/isEmpty';
import { ApiConstants } from '../../../api/ApiConstants';
import PlusIcon from '../../../assets/icons/darktheme/plus_white.svg'
import PlusIconLight from '../../../assets/icons/lighttheme/plus_black.svg'
import TokenClient from '../../../api/TokenClient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
const Dappmultitabs = ({ multitab,DappHome}) => {
    const theme = useContext(themeContext)
    const dispatch = useDispatch()
    const navigation = useNavigation()
console.log("DappHome",DappHome)
    const selecteATab = (item) => dispatch(selecteTab(item))
    const setsearchUrl = (item) => dispatch(SetSearchUrl(item))
    const setwebUrl = (item) => dispatch(Updateweburl(item))
    const setCurrentTabId = (item) => dispatch(CurrenTabId(item));
    const Multitabsdata = (item) => dispatch(Getmultitabs(item))
    const setInitialDappValues = (item) => dispatch(setInitialDapp(item))
    const setActivetabid = (item) => dispatch(setActiveTabId(item))

    const { multitabs, selectedTab, weburl, Maddress } = useSelector(state => ({
        multitabs: state.DapplatestReducer.multitabs,
        selectedTab: state.DapplatestReducer.selectedTab,
        weburl: state.DapplatestReducer.weburl,
        Maddress: state.DapplatestReducer.Maddress,
    }));
    // const  = reduxstate
console.log("multitabs",multitabs)
    const deleteFolderinBack = async (tabs) => {
        const params = { mailAddress: global.mailAddress, TabIds: tabs }

        await TokenClient.post(ApiConstants.removeFolderFunction, params)
    }

    const recentlyClosedFunc = (arr) => {
        if (arr.length == 0) return false;
        if (arr.length > 10) arr = arr.slice(0, 10)
        getRealm()
            .then(async (realm) => {
                const recentlyClosed = realm.objects("recentlyClosed");
                if (recentlyClosed.length == 10) {
                    var deletedFiles = recentlyClosed.slice(0, arr.length);
                    realm.write(() => {
                        realm.delete(deletedFiles)
                    })
                } else {
                    const newLength = 10 - recentlyClosed.length
                    arr = arr.slice(0, newLength)
                }

                await Promise.all(arr.map((val) => {
                    realm.write(() => {
                        realm.create("recentlyClosed", val)
                    })
                }))


                return () => {
                    realm.close();
                };

            })
            .catch((e) => {
                console.log("errro on recently clsed", e);
            })
    }

    const deleteTab = async (i) => {
        try {
            // console.log("multitabs", multitabs, selectedTab, i);
            if ((multitabs.length != 1) && selectedTab == i) {
                var newUrl = multitabs[selectedTab - 1].TAB[multitabs[selectedTab - 1]?.TAB?.length - 1].URL ?? "";
                var newId = multitabs[selectedTab - 1].TAB[multitabs[selectedTab - 1]?.TAB?.length - 1].id ?? "";
                var newTabId = multitabs[selectedTab - 1].TabId ?? "";
                console.log("newUrl", newUrl);
                selecteATab(selectedTab - 1)
                setsearchUrl(newUrl)
                setwebUrl(newUrl)
                setCurrentTabId(Number(newId))
                setActivetabid(newTabId)
            }
            var removeUrl = multitabs.filter((item, ii) => i != ii);
            dispatch(Getmultitabs(removeUrl))
            getRealm()
                .then((realm) => {
                    var dappVal1 = realm.objects("dappTabs");
                    var deleteTab = dappVal1[i]
                    deleteFolderinBack([deleteTab.TabId])
                    recentlyClosedFunc([deleteTab.TAB[deleteTab.TAB.length - 1]])
                    realm.write(() => {
                        realm.delete(deleteTab)
                    })
                    // console.log("dappVal1", dappVal1);

                    if (dappVal1.length == 0) navigation.navigate("WalletHome");
                })
                .catch((err) => {
                    console.log("errro  iopn aadad delete tab", err);
                })


        } catch (error) {
            console.log("ayuwrawsde", error);
        }
    }

    const pressTab = (index, url) => {
        setCurrentTabId(multitabs[index].TAB.length - 1)
        selecteATab(index)
        setActivetabid(multitabs[index].TabId)
        setwebUrl(url)
        setsearchUrl(url)
        multitab(false)
        navigation.navigate('Dapplatest');
    }
    const closeallTab = async () => {
        const TabIds = multitabs.map(item => item.TabId)
        console.log("TabIds", TabIds);
        const filterLastTab = multitabs.map(item => { return item.TAB[item.TAB.length - 1] })
        console.log('filterLastTab', JSON.stringify(filterLastTab, null, 2))
        deleteFolderinBack(TabIds)
        recentlyClosedFunc(filterLastTab)
        getRealm()
            .then((realm) => {
                var dappTabs = realm.objects("dappTabs");
                realm.write(() => {
                    realm.delete(dappTabs)
                });
                setTimeout(() => {
                    setInitialDappValues()
                    navigation.navigate("WalletHome")
                }, 1000)

            })
            .catch(() => {
                console.log("errro on cllose tab", err);
            })
    }
    // console.log("multitabs", JSON.stringify(multitabs, null, 2), selectedTab);

    const CreateTab = () => {
        var TabID = String(Date.now())
        dispatch(Addtab(TabID))
        multitab(false);
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

    return (
        <SafeAreaView style={{flex:1}}>
        <View style={{ height: "100%", backgroundColor:theme.theme == "light" ? "#fff" : "rgb(25,14,47)" }} >
            <ScrollView>
                <View style={{
                    flexDirection: "row", flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "flex-start", alignContent: "flex-start", marginTop: "1%",
                }}>
                    {multitabs.map((e, i) =>
                        <View key={Math.random()} style={{
                            backgroundColor: "white",
                            height: windowWidth * 0.6,
                            width: windowWidth * 0.46,
                            margin: windowWidth * 0.020,
                            borderColor: "#ffffff1a",
                            borderRadius: 5,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 }, 
                            shadowOpacity: 0.1, 
                            shadowRadius: 10, 
                            elevation: 3,
                            overflow:"hidden"
                        }}>
                            <Pressable onPress={() => pressTab(i, e?.TAB[e?.TAB?.length - 1]?.URL)}>
                            {/* <View> */}

                            

                                <View style={{ backgroundColor: "#612CD2", height: "25%", width: "100%", justifyContent: "space-between", flexDirection: "row", alignItems: "center", borderTopLeftRadius: 5, borderTopRightRadius: 5,paddingHorizontal:"5%", }}>
                                    <Pressable onPress={() => pressTab(i, e?.TAB[e?.TAB?.length - 1]?.URL)} style={{justifyContent: "center",alignItems:"center",width:"80%",}}>

                                    <View style={{ justifyContent: "center",alignItems:"center", }} >
                                        <Text numberOfLines={1} style={{ color: "#fff", textAlign: "left",  width: "100%" }}>{e?.TAB[e?.TAB?.length - 1]?.hostName}</Text>
                                    </View>
                                    </Pressable>
                                        <Pressable onPress={() => deleteTab(i)} style={{ alignItems:"center",justifyContent: "center", height:25,width:25 }}>
                                    <View style={{  justifyContent: "center",alignItems:"center",}} >
                                            {/* <Image source={{ uri: Images.close }} style={{ height: 20, width: 20, marginTop: -10, tintColor: "#fff" }} /> */}
                                            <Text  onPress={() => deleteTab(i)} style={{ fontSize: RFValue(15), color: "#fff"  }}>X</Text>
                                    </View>
                                        </Pressable>

                                </View>
                                {/* {console.log("multiitiitt", e, `${ApiConstants.URL}images/${Maddress}/${e.TabId}/${e.ImageUrl}`)} */}

                                <View style={{ backgroundColor: "transparent", height: "75%", width: "100%", borderBottomLeftRadius: borderRadius * 1, borderBottomRightRadius: borderRadius * 1 }}>
                                    {/* <WebView source={{ uri: e?.TAB[e?.TAB?.length - 1]?.URL }} scrollEnabled={false}
                                        // scalesPageToFit={false}
                                        automaticallyAdjustContentInsets={false}
                                        style={{ overflow: "hidden" }} /> */}
                                    <ImageBackground
                                        source={require('../../../assets/img/nolink.png')}
                                        style={{ height: "100%", width: "100%", justifyContent: "center" }}
                                        imageStyle={{
                                            height: 80, width: 80, margin: "25%"
                                        }}
                                        resizeMode='cover'
                                    >
                                        <Image source={{ uri: `${ApiConstants.URL}images/${Maddress}/${e.TabId}/${e.ImageUrl}` }} style={{ height: "100%", width: "100%", resizeMode: "cover",   }} />
                                    </ImageBackground>
                                </View>
                                {/* </View> */}
                            </Pressable>
                        </View>
                    )}

                </View>

            </ScrollView>

            <View style={{
                backgroundColor:theme.theme == "light" ? "#fff" : "rgb(25,14,47)", height: 55, width: "100%", flexDirection: 'row', justifyContent: "space-around", alignItems: "center",
                padding:10
            }}>
                <TouchableOpacity onPress={() => { closeallTab(); }} style={{width:"42%", height:40, border:1, borderRadius:2, borderColor:"rgba(162, 121, 250, 0.20)",backgroundColor:'rgba(155, 124, 220, 0.20)', alignItems:'center', justifyContent:'center'}}>
                    <Text style={{ color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Medium }}>Close all</Text>
                </TouchableOpacity>

                <Pressable onPress={() => CreateTab()} style={{ width: "14.25%", height: 40, justifyContent: "center" }} >
                    <View style={{ width: 40, height: 40, borderRadius: 2, backgroundColor: "rgba(155, 124, 220, 0.20)", alignSelf: "center", justifyContent: "center", border:1, borderColor:'rgba(162, 121, 250, 0.20)' }} >
                        {theme.theme == "light" ?
                            <PlusIconLight width={12} height={12} style={{ alignSelf: "center", resizeMode: "contain" }} />
                            :
                            <PlusIcon width={12} height={12} style={{ alignSelf: "center", resizeMode: "contain" }} />
                        }
                    </View>
                </Pressable>

                <TouchableOpacity style={{width:"42%", height:40, border:1, borderRadius:2, borderColor:"rgba(162, 121, 250, 0.20)",backgroundColor:'rgba(155, 124, 220, 0.20)', alignItems:'center', justifyContent:'center'}} disabled={isEmpty(weburl) || (multitabs.length == 0)} onPress={() => {
                    multitab(false);
                    DappHome?
                    navigation.navigate(DappHome):null
                }}>
                    <Text style={{ color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Medium }}>Done</Text>
                </TouchableOpacity>
            </View>
        </View>
        </SafeAreaView>
    );
};

export default Dappmultitabs;