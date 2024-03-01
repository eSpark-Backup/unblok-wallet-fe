import React, { useState } from "react";
import {
    Animated, FlatList, View, Text, Image, Switch, ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    BackHandler,
    Pressable
} from "react-native";
import { Fonts } from "../../utils/Fonts";
import { Dimensions } from 'react-native';
import Header from "../../Components/Header";
import themeContext from "../../utils/themeContext";
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
import { RFPercentage } from "react-native-responsive-fontsize";
import Modal from "react-native-modal";
import Close from "../../assets/img/close_icon.svg";
import { Images } from "../../utils/Images";
export default function WalletSettings(props) {
    const [isEnabled, setIsEnabled] = React.useState(false);
    const theme = React.useContext(themeContext);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [number, onChangeNumber] = React.useState('');
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [isModalVisible1, setModalVisible2] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const dispatch = useDispatch();
    const setFiatData = (item) => dispatch(fiatData(item));
    const setSelectWalletCurrencies = (item) => dispatch(selectedCurrencyList(item));
    const setSelectWalletTokens = (item) => dispatch(selectedTokenList(item));
    const setWalletDetailsinRedux = (item) => dispatch(addCurrencyDetails(item));
    const setSelectedcurrecyinRedux = (item) => dispatch(addAllcurrency(item))
    const set_my_add = (item) => dispatch(my_add(item))


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
            saveDappStatus()
            saveNotificationStatus()
            getPasscodeStatus()
            setTimeout(()=>{
                props.navigation.navigate("WalletHome");
            },2000)
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

        
                var arr = walletData.filter((item, index) => {
                    return item.selected == "true"
                });

                global.walletName = arr[0].walletname
                setWalletDetailsinRedux(arr[0])
                // setWalletDetails(arr[0]);
                setSelectedcurrecyinRedux(arr[0])
                let paramss = {
                    walletArr: arr[0],
                    defaultCurrency: defaultCurrencyVal[0].defaultCurrency
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

    const saveDappStatus = () => {
        getRealm()
            .then((realm) => {
                var dappVal = realm.objects("dappAppStatus");
                // var dappVal1 = realm.objects("dappTabs");
                // console.log("dappTabs", JSON.stringify(dappVal1, null, 2));
                // if (dappVal1.length == 0) {
                //     realm.write(() => {
                //         realm.create("dappTabs", {
                //             tabs: "first",
                //         });
                //     });
                // } else {
                //     realm.write(() => {
                //         realm.create("dappTabs", {
                //             tabs: "second",
                //         });
                //     });
                // }

                var value = true;
                if (dappVal.length == 0) {
                    //for create dapp status first time
                    let initialVal;
                    realm.write(() => {
                        initialVal = realm.create("dappAppStatus", {
                            dappAppStatus: value.toString(),
                        });
                    });
                    global.Dapp = true;
                } else {
                    global.Dapp = dappVal[0].dappAppStatus == "true" ? true : false
                }
                //console.log("global.Dapp", global.Dapp);
                return () => {
                    realm.close();
                };
            })
            .catch((err) => {
                console.log(err, "dappAppStatus err from localDb");
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
            <View style={{ marginHorizontal: 20 }}>
                {/* <Header name={"Wallet"} leftImage={"back"} /> */}
                <View style={{ height: "100%", justifyContent: "center" }}>
                    <ActivityIndicator size={"large"} />
                </View>
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

