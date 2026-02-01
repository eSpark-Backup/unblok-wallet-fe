import React, { useContext, useEffect, useState } from "react";
import {
    Linking,
} from "react-native";
import themeContext from "../../utils/themeContext";
import DeviceInfo from "react-native-device-info";
import EncryptedStorage from "react-native-encrypted-storage";
import getRealm from "../../localDb/RealmConfig";
import { useNavigation } from "@react-navigation/native";
import { linking } from "../../api/common";

const StartupScreen = (props) => {
    //theme config
    const theme = useContext(themeContext);
    console.log(theme.theme, "theme check")
    const navigation = useNavigation()
    const [RouteName, setRoutName] = useState("")

    useEffect(() => {
        global.resumePath = "Splash";
        console.log("splash here")
        getWalletData()
    }, []);


    const retrieveData = async () => {
        try {
            const newUserToken = await EncryptedStorage.getItem("UserToken");
            if (
                newUserToken !== null &&
                newUserToken != undefined &&
                newUserToken != ""
            ) {
                global.token = newUserToken;
                // navigation.navigate("GetStarted");
                setRoutName("GetStarted")
            }
        } catch (error) {
            console.log("err while saving token", error);
        } finally {
            setIsLoading(false);
        }
    };

    //check if user is created a wallet already if not means calls getUserToken
    const getWalletData = async () => {
        getRealm()
            .then(async (realm) => {
                var deviceId = DeviceInfo.getUniqueId();
                global.deviceId = deviceId;
                var walletData = realm.objects("Wallet_array");
                // global.walletArray = walletData;

                var loginStatus = realm.objects("loginStatus")
                console.log("loginStatus", loginStatus);
                if (loginStatus != undefined && loginStatus.length != 0) {
                    // getPasscodeStatus();
                    // props.navigation.navigate("Wallet");
                    navigateToWallet()
                } else {
                    retrieveData()
                }
                return () => {
                    realm.close();
                };
            })
            .catch((err) => {
                console.log(err, "wallet data list err from localDb stacknavigator");
            });
    };

    const [isLoading, setIsLoading] = useState(true);
    const [url, SetUrl] = useState(true)



    const navigateToWallet = async () => {
        getRealm()
            .then(async (realm) => {
                var walletStatus = realm.objects("Wallet_array")
                if (walletStatus != undefined && walletStatus.length != 0) {
                    setRoutName("WalletHome")
                } else {
                    setRoutName("CreateWallet")
                }
            })
            .catch((err) => {
                console.log("error on navigateWallet", err);
            }).finally(() => {
                setIsLoading(false);
            })
    }


    useEffect(() => {
        const handleDeepLink = ({ url }) => {
            console.log("----------------------------------------------------->");
            SetUrl(false)
            if (url) {
                console.log("url", url);
                const route = url.replace(/.*?:\/\//g, '');
                const routeName = route.split('/')[0];
                const params = route.split('/').slice(1);
                console.log("route", route);
                console.log("routeName", routeName);
                console.log("params", params);
                if (routeName) {
                    navigation.navigate(routeName, params.length > 0 ? { id: params[0] } : null);
                }
            }
        };
        
        Linking.addEventListener('url', handleDeepLink);

        return () => {
            Linking.removeEventListener('url', handleDeepLink);
        };
    }, []);

    if (!isLoading) navigation.navigate(RouteName)

    console.log("RoutesgsefgsefsefsefName", RouteName);
    return (<></>);
};
export default StartupScreen;
