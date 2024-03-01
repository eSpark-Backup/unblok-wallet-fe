import React, { useContext, useState, useEffect, useCallback } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TouchableHighlight,
    ScrollView,
    BackHandler,
    ImageBackground,
    StatusBar
} from "react-native";
import themeContext from "../../utils/themeContext";
import getRealm from "../../localDb/RealmConfig";
import Header from "../../Components/Header";
import { Fonts } from "../../utils/Fonts";
import { Images } from "../../utils/Images";
import { Colors } from "../../utils/Colors";
import { RadioButton, Searchbar } from "react-native-paper";
import { Icon as Icn, Button } from "react-native-elements";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addWalletName } from "../../Redux/Actions/walletNameEditAction";
import LinearGradient from 'react-native-linear-gradient';
import ThreeDots from "../../assets/img/three-dots.svg";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { showImage } from "../../utils/showImage";
import isEmpty from "../../utils/isEmpty";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import WalletLight from '../../assets/icons/lighttheme/Wallet.svg'
import WalletDark from '../../assets/icons/darktheme/Wallet.svg'
import { SvgUri } from 'react-native-svg';
import ApiClient from "../../api/ApiClient";
import { ApiConstants } from "../../api/ApiConstants";
import axios from "axios"

const _ = require("lodash");
  

const PrimaryWallet = (props) => {
    const [checked, setChecked] = React.useState('first');

    const dispatch = useDispatch();
    const setSelectedWalletDetails = (item) => dispatch(addWalletName(item));

    //theme config
    const theme = useContext(themeContext);
    const style = styles(theme);

    const [mailAddress, setMailaddress] = useState("")
    const [addressArr, setAddressArr] = useState([]);
    const [profile, setProfile] = useState({});
    const [state, setState] = useState({
        data: [],
        loading: false,
    });
    const { data } = state;
    // console.log("wdata", JSON.stringify(data, null, 2));
    const navigation = useNavigation()

    const currencyListFromRedux = useSelector(
        (state) => state.selectedCurrencyListReducer.selectedList
    );

    const AllListFromRedux = useSelector(
        (state) => state.tokenListReducer.tokenList
    );

    const walletDetailss = useSelector(
        (state) => state.allCurrrencyReducer.Allcurrency
    );

    // console.log("walletDetailss",walletDetailss);
    // console.log("AllListFromRedux", AllListFromRedux);
    // console.log("currencyListFromRedux", currencyListFromRedux);

    useFocusEffect(
        React.useCallback(() => {
            getWalletData();
            return () => { };
        }, [])
    );

    const routes = props.navigation.getState()?.routes;
    console.log("routes111", props.navigation);
    const prevRoute = routes[routes.length - 2];
    console.log("prevRoute1111", prevRoute);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                // BackHandler.goBack()
                navigation.navigate("WalletHomeBottomTab");
                return true;
            };
            // Add Event Listener for hardwareBackPress
            BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () => {
                // Once the Screen gets blur Remove Event Listener
                // getPasscodeStatus();
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
            };
        }, [])
    );

    // useFocusEffect(
    //     useCallback(() => {
    //         setFormData()
    //     }, [walletDetails,profile])
    // )


    const getWalletData = () => {
        getRealm()
            .then(async (realm) => {
                var walletData = realm.objects("Wallet_array");
                var getMail = realm.objects("loginStatus");
                setMailaddress(getMail[0].mail)

                console.log("walletData", JSON.stringify(walletData, null, 2));
                var getData = walletData
                var getProfile = await ApiClient.get(ApiConstants.getUserBymail, {
                    params: {
                        mailAddress: getMail[0].mail
                    }
                })

                setProfile(getProfile.data.data ?? {})
                setState({ data: getData })
                var arr = []
                getData.map((val) => {
                    arr.push(val.wallets[0].walletaddress)
                })

                setAddressArr(arr)
                // console.log('getProfile', JSON.stringify(getProfile.data.data, null, 2))
                // console.log("getProfile", getProfile.data.data);
                return () => {
                    realm.close();
                };
            })
            .catch((err) => {
                console.log(err, "wallet data list err from localDb");
            });
    };

    const saveSelectedWalletIndex = async (data) => {
        // console.log("coming index---------------", index);
        var sendDate = { from: "primaryWallet", mailAddress, walletAddress: data }
        console.log("sendDate", sendDate);
        var findUpdate = await ApiClient.post(ApiConstants.changeFunction, sendDate);
        if (findUpdate.data.success) {
            getWalletData()
        } else {
            console.log("awdfawdawdawd", findUpdate.data.data);
        }

    };

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                props.navigation.goBack()
                return true;
            };
            BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () => {
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
            };
        }, [])
    );
console.log("profile",profile);
    return (
        <SafeAreaView style={style.container}>
            <ImageBackground
        source={theme.theme === "light" ? Images.backgroundWhite : Images.background}
        style={{
          width: windowWidth,
          height: windowheight,
          paddingTop: StatusBar.windowheight,
        }}
        resizeMode="cover"
      >
            <Header name={"Payout Wallet"} leftImage={"back"}
            // rightImage={"add"}
            />
            {/* <View style={{ marginHorizontal: "4.5%",flexDirection:"row",justifyContent:"space-between",width:"95%",alignItems:"center" }} >
                <Text style={{
                    color: theme.text,
                    fontFamily: Fonts.Regular,
                    fontSize: 18,
                    width:"25%"
                }} >Address : </Text>
                <Text numberOfLines={1} style={{
                    color: theme.text,
                    fontFamily: Fonts.Regular,
                    fontSize: 15,
                    width:"72%"
                }} >{profile?.userDetails?.primaryWallet}</Text>
            </View> */}

            <View style={{ height: "82.5%",width:"90%",alignSelf:"center",marginTop:"10%", }} >
                <ScrollView>

                    {/* {data && data.map((item, index) => ( */}
                    {data && _.map(data, (item, index) => (
                        <View
                            key={Math.random()}
                        >
                            {console.log("iteeeeeeeeeeeeeeteteeet", item)}
                            {item?.walletType != "SingleCoin" ? (
                                <View
                                    style={{
                                       
                                        justifyContent: "space-between",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        borderColor:"rgba(162, 121, 250, 0.30)",
                                        borderRadius:5,
                                        borderWidth:2,
                                        backgroundColor: (item.wallets[0]?.walletaddress == profile?.userDetails?.primaryWallet)  ?theme.theme==="dark"?"rgba(155, 124, 220, 0.30)":"#612CD2":"rgba(155, 124, 220, 0.10)",
                                        padding:5,
                                        marginTop:"3%"
                                    }}
                                >
                                    <View
                                        style={{
                                            alignItems: "center",
                                            flexDirection: "row",
                                            
                                        }}
                                    >
                                    
                                        <TouchableOpacity
                        style={{
                          width: 16,
                          height: 16,
                          borderColor:
                          (item.wallets[0]?.walletaddress == profile?.userDetails?.primaryWallet) 
                              ? "rgba(162, 121, 250, 0.30)"
                              : theme.theme == "light"
                              ? "#000"
                              : "#fff",
                          borderWidth:
                          (item.wallets[0]?.walletaddress == profile?.userDetails?.primaryWallet)  ? 0 : 0.5,
                          borderRadius: 2,
                          marginHorizontal:"2.5%",
                        }}
                        onPress={() => {
                            saveSelectedWalletIndex(item.wallets[0].walletaddress);
                        }}
                      >
                        {(item.wallets[0]?.walletaddress == profile?.userDetails?.primaryWallet)   ? (
                          <Text
                            style={{
                              backgroundColor: "#A279FA",
                              borderColor: "rgba(162, 121, 250, 0.30)",
                              borderRadius: 0.5,
                              width: 16,
                          height: 16,
                              position: "relative",
                            }}
                          ></Text>
                        ) : (
                          <></>
                        )}
                      </TouchableOpacity>
                                        {/* <Image source={theme.theme == "light" ?  require('../../assets/img/walletimportd1.png'):require('../../assets/img/walletimportl1.png') } style={{ width: windowWidth * 0.08, height: windowheight * 0.05, resizeMode: "contain",aspectRatio:1 }} /> */}
                                        {theme.theme == 'light' && (item.wallets[0]?.walletaddress !== profile?.userDetails?.primaryWallet) ?
                                            (<WalletLight style={{ aspectRatio: 0.8, marginLeft: 3 }} width={windowWidth * 0.095} height={windowWidth * 0.095} />)
                                            :
                                            (<WalletDark style={{ aspectRatio: 0.8, marginLeft: 3 }} width={windowWidth * 0.095} height={windowWidth * 0.095} />)
                                        }
                                        <View
                                            style={{ flexDirection: "column", marginHorizontal: 10 }}
                                        >
                                            <TouchableOpacity
                                            // onPress={() => {
                                            //     setSelectedWalletDetails({
                                            //         selectedIndexForEditName: index,
                                            //         item: item,
                                            //     });
                                            //     props.navigation.navigate("ShowWalletDetails");
                                            // }}
                                            >
                                                <Text
                                                    style={{color:(item.wallets[0]?.walletaddress == profile?.userDetails?.primaryWallet)?"white":theme.theme==="dark"?"white":"black",fontFamily:Fonts.Bold,fontWeight:"700"}}
                                                >
                                                    {item.walletname}
                                                    {/* MultiCoin Wallet */}
                                                </Text>

                                                <Text
                                                    style={{
                                                        color: "#A279FA",
                                                        fontFamily: Fonts.Regular,
                                                        fontSize: 10,
                                                        // marginLeft: 10,
                                                        width:"75%"
                                                    }}
                                                    numberOfLines={1}  
  ellipsizeMode="tail"
                                                >
                                                    {item.wallets[0].walletaddress}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedWalletDetails({
                                                selectedIndexForEditName: index,
                                                item: item,
                                            });
                                            props.navigation.navigate("ShowWalletDetails");
                                        }}
                                        style={{ marginTop: "5%", width: "4%", right: "10%" }}
                                    >


                                        {/* {theme.theme == 'light' ?
                                            (
                                                <ThreeDots style={{ alignSelf: "center" }} size={25} fill={"#000"} />
                                            ) :
                                            (
                                                <ThreeDots style={{ alignSelf: "center" }} size={25} fill={"#fff"} />
                                            )
                                        } */}

                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View
                                    style={{
                                        justifyContent: "space-between",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        borderColor:"rgba(162, 121, 250, 0.30)",
                                        borderRadius:5,
                                        borderWidth:2,
                                        backgroundColor:"rgba(155, 124, 220, 0.10)",
                                        padding:5
                                    }}
                                >
                                    <View
                                        style={{
                                            alignItems: "center",
                                            flexDirection: "row",
                                        }}
                                    >
                                       
                                        <TouchableOpacity
                        style={{
                          width: 16,
                          height: 16,
                          borderColor:
                          (item.wallets[0].walletaddress == profile?.userDetails?.primaryWallet) 
                              ? "rgba(162, 121, 250, 0.30)"
                              : theme.theme == "light"
                              ? "#000"
                              : "#fff",
                          borderWidth:
                          (item.wallets[0].walletaddress == profile?.userDetails?.primaryWallet)   ? 0 : 0.5,
                          borderRadius: 2,
                          marginHorizontal:"2.5%",
                        }}
                        onPress={() => {
                            saveSelectedWalletIndex(item.wallets[0].walletaddress);
                        }}
                      >
                        {(item.wallets[0].walletaddress == profile?.userDetails?.primaryWallet)   ? (
                          <Text
                            style={{
                              backgroundColor: "#A279FA",
                              borderColor: "rgba(162, 121, 250, 0.30)",
                              borderRadius: 0.5,
                              width: 16,
                          height: 16,
                              position: "relative",
                            }}
                          ></Text>
                        ) : (
                          <></>
                        )}
                      </TouchableOpacity>
                                        {/* {showImage(item.wallets[0].tokenType)} */}
                                        {console.log("lalalaall", item.wallets[0])}
                                        {!isEmpty(item.wallets[0].currencyimage)
                                            ?
                                            <SvgUri
                                                width={40}
                                                height={40}
                                                uri={`http:/192.53.121.26:8096/images/${item.wallets[0].currencyimage}`}
                                            />
                                            : showImage(item.wallets[0].tokenType)}
                                        <View style={{ marginHorizontal: 10 }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSelectedWalletDetails({
                                                        selectedIndexForEditName: index,
                                                        item: item,
                                                    });
                                                    props.navigation.navigate("ShowWalletDetails");
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: theme.theme == 'light' ? "#000" : "#fff",
                                                        fontFamily: Fonts.SemiBold,
                                                        fontSize: 18,
                                                        marginLeft: 5
                                                    }}
                                                >
                                                    {item?.walletname}
                                                </Text>
                                                <Text
                                                    style={{
                                                        color: "#A279FA",
                                                        fontFamily: Fonts.Regular,
                                                        fontSize: 10,
                                                        marginLeft: 5,
                                                        marginTop: 5
                                                    }}
                                                >
                                                    {item.wallets[0].walletaddress}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: "5%", left: -10 }}>
                                        <TouchableOpacity
                                        // onPress={() => {
                                        //     setSelectedWalletDetails({
                                        //         selectedIndexForEditName: index,
                                        //         item: item,
                                        //     });
                                        //     props.navigation.navigate("ShowWalletDetails");
                                        // }}
                                        >
                                            {/* {theme.theme == 'light' ?
                                                (
                                                    <ThreeDots size={25} fill={"#000"} />
                                                ) :
                                                (
                                                    <ThreeDots size={25} fill={"#fff"} />
                                                )
                                            } */}
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
            </View>
            </ImageBackground>
        </SafeAreaView>
    );
};
export default PrimaryWallet;

const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        seperatorLine: {
            height: 1,
            backgroundColor: "black",
        },
        customTokenTxt: {
            fontSize: RFPercentage(2.5),
            color: "#00B0FF",
            fontFamily: Fonts.Medium,
        },
        multiTxt: {
            fontFamily: Fonts.Regular,
            fontSize: RFPercentage(2.5),
            marginHorizontal: 10,
            // alignSelf: "center",
            color: theme.theme == 'light' ? "#000" : "#fff",
        },
        flex: {
            flexDirection: "row",
        },
        IcnView: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: "2%",
            marginHorizontal: 5,
        },
        custsearch: {
            borderRadius: 10,
            backgroundColor: theme.background,
            borderColor: theme.search,
            borderWidth: 1,
            margin: 15,
            elevation: 0,
            fontFamily: Fonts.Bold,
            color: theme.text
        },
    });
