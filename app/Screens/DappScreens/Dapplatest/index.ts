import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, ImageBackground, Keyboard, Pressable, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import WebView from "react-native-webview";
import Dappheader from "./Dappheader";
import Networklist from "./networklist";
import Dappwebviewcomp from "./webviewcomp";
import Dappmultitabs from "./Multitabs";
import { useDispatch, useSelector } from "react-redux";
import { CurrenTabId, Getmultitabs, SetSearchUrl, Updateweburl, selecteTab, setActiveTabId, setMAddress } from "../../../Redux/Actions/DapplatetsActions";
import getRealm from "../../../localDb/RealmConfig";
import Tripledots from "./Tripledots";
import HistoryComp from '../../testscreen';
import { FavDappApi, addFavDappApi, removeFavDappApi } from "../common/D_app";
import { findHostNameWithUrl } from "../../../utils/common";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import { useFocusEffect } from "@react-navigation/native";
import Refershiconlight from '../../../assets/icons/lighttheme/Reset Passcode.svg'
import Refershicondark from '../../../assets/icons/darktheme/Reset Passcode.svg'
import { Fonts } from "../../../utils/Fonts";
import { RFValue } from "react-native-responsive-fontsize";
import { windowWidth, windowheight } from "../../../utils/Dimensions";
import * as Progress from 'react-native-progress';
import Dappheadernew from "./Dappheadernew";
import Dappfooter from "./Dappfooter";
import Tripledotsnew from "./Tripledotsnew";
import themeContext from "../../../utils/themeContext";

const height = Dimensions.get("window").height
const HEADER_HEIGHT = height * 0.08;
const CONTAINER_HEIGHT = height * 0.06;


const INJECTED_JS = `
  window.onscroll = function() {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        scrollTop: document.documentElement.scrollTop || document.body.scrollTop
      }),     
    )
  }
`;

const Dapplatest = (props) => {
    const dispatch = useDispatch()
    const [multitab, setMultitab] = useState(false)
    const [history, setHistory] = useState(false)
    const [myfav, favdataList] = useState([]);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const Multitabsdata = (item) => dispatch(Getmultitabs(item))
    const setsearchUrl = (item) => dispatch(SetSearchUrl(item))
    const setwebUrl = (item) => dispatch(Updateweburl(item))
    const selecteATab = (item) => dispatch(selecteTab(item))
    const setMailAddress = (item) => dispatch(setMAddress(item))
    const setActivetabid = (item) => dispatch(setActiveTabId(item))
    const setCurrentTabId = (item) => dispatch(CurrenTabId(item));
    const [lastScrollY, setLastScrollY] = useState(0);
    const theme = useContext(themeContext);
    // console.log("props?.route?.params?",props?.route?.params.params)
    useFocusEffect(
        useCallback(() => {
            if (props?.route?.params?.isEnabled == false) {
                setMultitab(true)
            } else {
                setMultitab(false)
            }

            console.log("props?.route?.params?.isEnabled", props?.route?.params?.isEnabled);
        }, [props?.route?.params?.isEnabled])
    )


    // useEffect(() => {
    //     setWebUrlFunc()
    // }, [])

    useFocusEffect(
        useCallback(() => {
            setWebUrlFunc()
        }, [])
    )
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          () => {
            setKeyboardVisible(true); 
          }
        );
        const keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          () => {
            setKeyboardVisible(false); 
          }
        );
      
        return () => {
          keyboardDidShowListener.remove();
          keyboardDidHideListener.remove();
        };
      }, []);

      console.log("isKeyboardVisible",isKeyboardVisible)
    const setWebUrlFunc = async () => {
        getRealm()
            .then((realm) => {
                const dappVal1 = realm.objects("dappTabs");
                var getMail = realm.objects("loginStatus")
                var getUrl = dappVal1[dappVal1.length - 1]

                console.log("dappVal1", JSON.stringify(dappVal1, null, 2), getUrl.TAB[getUrl.TAB.length - 1].URL);

                setMailAddress(getMail[0].mail)
                show_favourite_list(getMail[0].mail)

                Multitabsdata(dappVal1)
                // setActivetabid(getUrl[getUrl.length - 1].TabId)
                setCurrentTabId(getUrl.TAB[getUrl.TAB.length - 1].id)
                setsearchUrl(getUrl.TAB[getUrl.TAB.length - 1].URL)
                setwebUrl(getUrl.TAB[getUrl.TAB.length - 1].URL)
                selecteATab(dappVal1.length - 1)
            })
            .catch((err) => {
                console.log("errro  iopn aadad setweburl", err);
            })
    }

    const reduxstate = useSelector(state => ({
        weburl: state.DapplatestReducer.weburl,
        Maddress: state.DapplatestReducer.Maddress,
    }));

    const {
        weburl,
        Maddress
    } = reduxstate


    {/**get all the favorite list on database by mailaddress */ }
    const show_favourite_list = (mail) => {
        // console.log("mailiala", mail);
        let params = {
            mailAddress: mail ?? Maddress,
        };
        FavDappApi(params)
            .then(function (response) {
                const favData = response.data.data;
                // console.log("favData", favData);
                favdataList(favData ?? []);
            })
            .catch(function (err) {
                console.log("dapps_fav err", err);
            });
    };

    //for remove favourite
    const remove_favourite = (data) => {
        let params = {
            mailAddress: Maddress,
            dappId: data,
        };
        removeFavDappApi(params)
            .then(function (res) {
                show_favourite_list();
            })
            .catch(function (err) {
                console.log("remove_fav_dapp err", err);
            });
    };

    const add_favourite = async (data) => {
        var findHostNa = await findHostNameWithUrl(data)
        let params = {
            mailAddress: Maddress,
            from: "web",
            hostName: findHostNa.hostname,
            URL: data
        };
        addFavDappApi(params)
            .then(function (res) {
                console.log("ressssss", res.data.data);
                show_favourite_list();
            })
            .catch(function (err) {
                console.log("add_fav_dapp err", err);
            });
    };


    const scrollY = useRef(new Animated.Value(0)).current;
    const offsetAnim = useRef(new Animated.Value(0)).current;
    const clampedScroll = Animated.diffClamp(
        Animated.add(
            scrollY.interpolate({
                inputRange: [0, 3],
                outputRange: [0, 1],
                extrapolateLeft: 'clamp',
            }),
            offsetAnim,
        ),
        0,
        CONTAINER_HEIGHT
    )

    const headerTranslate = offsetAnim.interpolate({
        inputRange: [0, CONTAINER_HEIGHT],
        outputRange: [0, -HEADER_HEIGHT],
        extrapolate: 'clamp',
    });

    const bottomTabTranslate = offsetAnim.interpolate({
        inputRange: [0, CONTAINER_HEIGHT],
        outputRange: [0, 55], 
        extrapolate: 'clamp',
    });

    const handleScroll = (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        setLastScrollY(currentScrollY);
        
        const isScrollingDown = currentScrollY > lastScrollY;
        const isScrollingUp = currentScrollY < lastScrollY;

        Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
        )(event);

        Animated.timing(offsetAnim, {
            toValue: isScrollingDown ? CONTAINER_HEIGHT : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };


    const webRef = useRef(null)

    const [isPullToRefreshEnabled, setPullToRefreshEnabled] = useState(false);
    const [scrollViewHeight, setScrollViewHeight] = useState(0);


    const onRefresh = () => webRef.current.reload();

    const onWebViewMessage = (event) => {
        const { data } = event.nativeEvent;

        try {
            const { scrollTop } = JSON.parse(data);
            setPullToRefreshEnabled(scrollTop === 0);
        } catch (error) { }
    };

    const setWebViewRef = (ref) => {
        webRef.current = ref;
    };

    const postMessageToWebView = (result) => {
        if (webRef && webRef.current) {
            webRef.current.postMessage(JSON.stringify(result));
        }
    };

    // const onWebviewReload = () => {
    //     if (webRef && webRef.current) {
    //         webRef.current.reload()
    //     }
    // }

    const [progress, setProgress] = useState(0);
    const [load, setLoad] = useState()

    const onProgress = ({ nativeEvent }) => {
        console.log("nativeEvent", nativeEvent);
        setProgress(nativeEvent.progress);
    };
    console.log("multitabmultitab", multitab);
    return (
                  <View style={{ flex: 1, overflow: 'hidden', backgroundColor:"transparent"}} >

{!history ?
    <>
        {!multitab ?
            <>

                {/* <Pressable style={{ height: windowheight * 0.064, flexDirection: "row", alignItems: "center", justifyContent: "center" ,}}
                >
                   
                </Pressable>
                <Animated.View style={{ height: windowheight * 0.92, }} >

                    {load && <Progress.Bar
                        progress={progress}
                        borderWidth={0}
                        height={3}
                        width={windowWidth}
                    />}

                    <Dappwebviewcomp sethandlescroll={handleScroll} webRef={webRef} postMessageToWebView={postMessageToWebView} onWebviewReload={onWebviewReload} onProgress={onProgress} setLoad={setLoad} />
                </Animated.View>
                <Animated.View style={[styles.view, { top: 0, transform: [{ translateY: headerTranslate }] }]}>
                    <Dappheader webRef={webRef} formultitab={false} search={() => { props.navigation.navigate("Searchdapp"); }} dappnavigation={() => props.navigation.goBack()} setMultitab={setMultitab} onWebviewReload={onWebviewReload} />
                </Animated.View> */}

                <Animated.View style={{ height: "100%", transform: [{ translateY: headerTranslate }] }} >

                    <Animated.View style={{  backgroundColor:theme.theme == "light" ? "#FFF" : "rgb(25,14,47)" , elevation: 0.5, justifyContent: "center",height:50,borderBottomWidth:0.3, borderColor:"gray",}} >
                        <Dappheadernew search={() => { props.navigation.navigate("Searchdapp"); }} />
                    </Animated.View>
                    {load && <Progress.Bar
                        progress={progress}
                        borderWidth={0}
                        height={3}
                        width={windowWidth}
                        // color="#2F2448" 
                    />}
                    <View style={{ height: "102.5%", }} >
                        <ScrollView
                            onLayout={(event) => setScrollViewHeight(event.nativeEvent.layout.height)}
                            scrollEventThrottle={16}
                            showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={false}
                                    enabled={isPullToRefreshEnabled}
                                    onRefresh={onRefresh}
                                    tintColor="#2F2448"
                                    colors={["#2F2448"]}
                                    style={{ backgroundColor: "transparent" }}
                                />
                                
                            }
                            >
                            <Dappwebviewcomp
                                sethandlescroll={handleScroll}
                                webRef={webRef}
                                postMessageToWebView={postMessageToWebView}
                                onWebviewReload={null}
                                onProgress={onProgress}
                                setLoad={setLoad}
                                height={scrollViewHeight}
                                onWebViewMessage={onWebViewMessage}
                                injectedjs={INJECTED_JS}
                            />
                            
                        </ScrollView>
                    </View>

                </Animated.View>
                {!isKeyboardVisible && (
                <Animated.View style={{ position: "absolute", bottom: 0, left: 0, right: 0, transform: [{ translateY: bottomTabTranslate }], elevation: 0.5,   height:55,overflow:"hidden"}} >
                    <Dappfooter search={() => props.navigation.navigate("Searchdapp")} setMultitab={setMultitab} multitab={multitab} dappnavigation={() => props.navigation.goBack()} dappHome={() => props.navigation.navigate("DappBottomTab")}/>
                </Animated.View>
                )}
            </>
            :
            <>
                {/* <View style={{ height: height * 0.06, backgroundColor: theme.theme == "light" ? "#fff" : "rgb(25,14,47)" , elevation: 0.5, justifyContent: "center", height:'12%' }} >
                    <Dappheadernew search={() => { props.navigation.navigate("Searchdapp"); }} />
                </View> */}
                <Dappmultitabs multitab={setMultitab} DappHome={props?.route?.params?.params}/>
            </>}

    </> :
    <>
        <HistoryComp multitab={multitab} setMultitab={setMultitab} setHistory={setHistory} />
    </>
}
{/*************************MODALS *********************************/}
<Networklist />
{/* <Tripledots multitab={multitab} history={setHistory} myfav={myfav} add_favourite={add_favourite} remove_favourite={remove_favourite}

/> */}
<Tripledotsnew multitab={multitab} history={setHistory} myfav={myfav} add_favourite={add_favourite} remove_favourite={remove_favourite} onWebviewReload={onRefresh} />
</View >
           
    )
}

export default Dapplatest;

const styles = StyleSheet.create({
        view: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
    },
  })