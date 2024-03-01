import React, { useEffect, useRef, useState } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    ImageBackground,
    StatusBar,
    BackHandler,

} from "react-native";
import themeContext from "../../utils/themeContext";
import { Fonts } from "../../utils/Fonts";
import Header from "../../Components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import getRealm from "../../localDb/RealmConfig";
import WebView from "react-native-webview";
import { ApiConstants, buyApi, sellApi } from "../../api/ApiConstants";
import { Images } from "../../utils/Images";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { overlay } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

export default function BuyBTC(props) {

    var walletConnectStatus = false;

    var root = props.route.params
    console.log("roooooot", root);
    const theme = React.useContext(themeContext);
    const [connectWalletUrl, setConnectWalletUrl] = useState(false);


const dispatch = useDispatch();
    //   const style = styles(theme);
    const currencyListFromRedux = useSelector(
        (state) => state.walletDetailReducer.currencyList
    );

    console.log("currencyListFromRedux", JSON.stringify(currencyListFromRedux, null, 2));


    const navigateSecurityPage = (item) => {
        try {
        getRealm()
            .then((realm) => {
                var passcodeVal = realm.objects("userPasscodeValue");
                    var biometricVal = realm.objects("userBiometricStatus");
                console.log("passcodeVal", passcodeVal);
                    if (passcodeVal.length == 0 && global.biometricStatus == 0) {
                    props.navigation.navigate(item);
                } else if (
                        (global.passcodeStatus == 1 || global.passcodeStatus == 0) &&
                        global.biometricStatus != 0
                    ) {
                        global.bioPage = "EnterPasscode"
                        props.navigation.push("CheckBiometric", item);
} else if (passcodeVal.length == 1 || global.biometricStatus == 0) {
                        props.navigation.navigate("EnterPasscode", item);
                    }
                
            })
            .catch((err) => {
                console.log("errror on navigagtet", err);
            })


        } catch (error) {
            console.log("errror on navigatepage", error);
        }
    }

    const network =
        currencyListFromRedux.currencyName == "Smart Chain"
            ? "BSC"
            : currencyListFromRedux.tokenType == "TRC20"
                ? "Tron"
                : currencyListFromRedux.tokenType == "ERC20"
                    ? "Ethereum"
                    : currencyListFromRedux.tokenType == "BEP20"
                        ? "BSC"
                        : currencyListFromRedux.currencyName;

    const checkCurrency =
        network == "Tron" || currencyListFromRedux.tokenType == "TRC20"
            ? "USDC"
            : currencyListFromRedux.tokenType == "TRC20"
                ? "Tron"
                : currencyListFromRedux.tokenType == "ERC20"
                    ? "Ethereum"
                    : currencyListFromRedux.tokenType == "BEP20"
                        ? "BNB"
                        : currencyListFromRedux.currency;

    const webViewRef = useRef(null);

    console.log("afijasofijawof", `${root == "Buy" ? buyApi : sellApi}&walletAddress=${currencyListFromRedux.walletaddress}`);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                webViewRef.current.goBack()
                return true;
            };

            BackHandler?.addEventListener("hardwareBackPress", onBackPress);

            return () => {
                // Once the Screen gets blur Remove Event Listener
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
            };
        }, [])
    );

    const handleNavigation = (navigationEvent) => {
        const { url } = navigationEvent;
        if (url.slice(0, 2) == "wc") {
            setConnectWalletUrl(true);
            walletConnectStatus = true;

            if (global?.initialEnter == undefined) {
                navigateSecurityPage(url)
            } else {
                dispatch({
                    type: "Session",
                    data: {
                        url: url, StopAction: true, Loader: true,
                        from: ""
                    }
                })
            }
            return false; // block navigation to other domains
        } else {
            setConnectWalletUrl(false);
            walletConnectStatus = false;
            return true; // allow navigation
        }
    };


    return (
        <>
         <StatusBar barStyle={theme.theme == "light" ? "dark-content" : "light-content"} backgroundColor={theme.theme==="dark"?"rgb(25,14,47)":"#ffffff"} />
            <SafeAreaView style={{ backgroundColor: theme.background, height: "100%" }}>
            <ImageBackground
        source={theme.theme === "light" ? Images.backgroundWhite : Images.background}
        style={{
          width: windowWidth,
          height: windowheight,
          paddingTop: StatusBar.windowheight,
        }}
        resizeMode="cover"
      >
                <View style={{ height: "12%" }} >
                    <Header name={`${root} Crypto`} leftImage={"back"} />
                </View>
                <View style={{ height: "82%", marginTop: 5,borderRadius: 12,overflow:"scroll" }} >
                {root == "Buy" ?
                        <WebView
                        ref={webViewRef}
                        style={{ flex: 1, height: "85%", }}
                            source={{ uri: `${buyApi}&walletAddress=${currencyListFromRedux.walletaddress}` }}
                        />
                        :
                        <WebView
                            ref={webViewRef}
                            style={{ flex: 1, height: "85%", }}
                        source={{ uri: `${root == "Buy" ? buyApi : sellApi}&walletAddress=${currencyListFromRedux.walletaddress}` }}
setSupportMultipleWindows={connectWalletUrl}
                            onShouldStartLoadWithRequest={handleNavigation}
                            originWhitelist={["*"]}
                            javaScriptEnabled
                            domStorageEnabled={true}
                            javaScriptEnabledAndroid
                            cacheEnabled
                            canGoBack={true}
                            sendCookies
                            javascriptEnabled
                            allowFileAccess
                            useWebkit
                            testID={'browser-webview'}
                            applicationNameForUserAgent={'WebView MetaMaskMobile'}
                        />}


                </View>
                </ImageBackground>
            </SafeAreaView>
        </>
    )
}