import React, { useCallback, useContext, useState } from "react";
import { ImageBackground, SafeAreaView } from "react-native";
import themeContext from "../../utils/themeContext";
import { StyleSheet } from "react-native";
import { Fonts } from "../../utils/Fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { FavDappApi, addFavDappApi, dappitemList, removeFavDappApi } from "./common/D_app";
import { useFocusEffect } from "@react-navigation/native";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { Pressable } from "react-native";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import ActiveBookStarLight from '../../assets/icons/lighttheme/Trippledots.svg'
import ActiveBookStarDark from '../../assets/icons/darktheme/Trippledots.svg'
import { Modal } from "react-native";
import isEmpty from "../../utils/isEmpty";
import { Images } from "../../utils/Images";
import { copyToClipboard, customShare, findHostNameWithUrl } from "../../utils/common";
import getRealm from "../../localDb/RealmConfig";
import { setActiveTabId } from "../../Redux/Actions/DapplatetsActions";
import { useDispatch } from "react-redux";
import { Text } from "react-native";
const _ = require("lodash");
import Close from "../../assets/img/close_icon.svg";
import { TextInput } from "react-native";
import { ApiConstants } from "../../api/ApiConstants";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import FaviconIcon from '../../assets/icons/darktheme/Favicon for App.svg'
import Header from "../../Components/Header";
import { ActivityIndicator } from "react-native-paper";

export default function DappList(props) {

    // console.log("proppspssssss", props);

    const theme = useContext(themeContext);
    const style = styles(theme);

    const dispatch = useDispatch();
    const setActivetabid = (item) => dispatch(setActiveTabId(item))
    const [IsLoad, setIsLoad] = useState(true);
    const [tabindex, setTabIndex] = useState(props?.route?.params ?? "fav");
    const [myfav, favdataList] = useState([]);
    const [state, setState] = useState({ data: [], loading: false }); // only one data source
    const { data, loading } = state;

    const [errArr, setErrArr] = useState([])
    const [favIndex, setFavIndex] = useState(null)
    const [openPopup, setOpenPopup] = useState(false);
    const [optionValue, setOptionValue] = useState({});
    const [rename, setRename] = useState(false);
    const [TabName, setTabName] = useState("history")
    const [renamemodal, setRenamemodal] = useState(false)
    const [itemid, setItemFunc] = useState([]);
    const [imageError, setImageError] = useState(false);

    useFocusEffect(
        useCallback(() => {
            show_favourite_list()
            dappItemList()
        }, [])
    )

    //dapp items
    const dappItemList = async () => {
        // console.log("itemid", itemid);
        let params = {
            deviceId: global.deviceId,
            categoryId: itemid == "" ? "615fd60a15ce72294f6af43d" : itemid,
            from: "dapps"
        };
        // console.log(params); 
        await dappitemList(params)
            .then(function (response) {
                // console.log("response.data.data", response.data.data);
                setState({ data: response.data.data, loading: false });
            })
            .catch((e) => {
                console.log("dapp err", e);
            });
    };

    const show_favourite_list = (mail) => {
        
        let params = {
            mailAddress: global.mailAddress,
        };
        FavDappApi(params)
            .then(function (response) {
                const favData = response.data.data;
                // console.log("favDatafjaojfapw", favData);
                favdataList(favData ?? []);
                setIsLoad(false)
            })
            .catch(function (err) {
                console.log("dapps_fav err", err);
            });
    };



    //add favourite
    const add_favourite = (data) => {
        let params = {
            mailAddress: global.mailAddress,
            dappId: data,
        };
        addFavDappApi(params)
            .then(function (res) {
                // console.log("ressssss", res.data.data);
                show_favourite_list();
            })
            .catch(function (err) {
                console.log("add_fav_dapp err", err);
            });
    };

    //for remove favourite
    const remove_favourite = (data) => {
        let params = {
            mailAddress: global.mailAddress,
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

    const changeFavName = async () => {
        let params = { from: "edit", id: optionValue._id, sitename: optionValue.siteName }
        addFavDappApi(params)
            .then((res) => {
                // console.log("resssss", res.data);
                if (res.data.success) {
                    setRename(false)
                    setFavIndex(null)
                    show_favourite_list()
                }
            })
            .catch((e) => {
                console.log("eror", e);
            })
    }

    const redirectToweb = async (item) => {
        try {
            var findHost = await findHostNameWithUrl(item.url ?? item.URL)
            var setObj = { URL: item.url, hostName: findHost.hostname, id: '0' }
            getRealm()
                .then((realm) => {
                    var dappVal1 = realm.objects("dappTabs");

                    var TabID = String(Date.now())
                    setActivetabid(TabID)
                    realm.write(() => {
                        realm.create("dappTabs", {
                            ImageUrl: "",
                            TabId: TabID,
                            TAB: [setObj]
                        });
                    });
                    console.log("dappVal1", dappVal1);
                })
                .catch((err) => {
                    console.log("errro onn getdapppteabs", err);
                })


            // props.navigation.navigate('DappWeb')
            props.navigation.navigate('Dapplatest')
            // setDappStatus({
            //   status: "true",
            //   item: item,
            // });
        } catch (error) {
            console.log("err on redirectToweb", error);
        }

    }
    const imageSource = theme.theme === "dark"
    ? require("../../assets/img/menueBackgroundDark.png")
    : require("../../assets/img/menueBackgroung.png");

    return (
        <SafeAreaView style={style.container}>
 <ImageBackground
              source={theme.theme === "dark" ? Images.background : Images.backgroundWhite}
              style={{
                width: windowWidth,
                height: windowheight,
                paddingTop:"2%"
                
              }}
              resizeMode="cover"
            >
            <Header name={tabindex == "fav" ? "Bookmarks" : "DApps"} leftImage={"customBack"} />
            <Image
                      style={{ width: "100%",height:1.8 }}
                      source={require("../../assets/img/devider.png")}
                      resizeMode="contain"
                    />
            {/* <View style={{ backgroundColor: "transparent", width: "100%", padding: "2.5%", height: "10%", marginTop: "1%", marginBottom: "2.5%" }} >
                <Text
                    style={{ marginLeft: "4.5%", fontSize: RFPercentage(3), color: theme.text, fontFamily: Fonts.Regular, fontSize: RFPercentage(2.75), }}
                >
                    Dapps
                </Text>
            </View> */}
            {(tabindex == "fav" && myfav.length == 0) ?
                (<>
                {/* <View>
                    <ActivityIndicator size="small" color={theme.theme == "light" ? "#000" : "#fff"} />
                  </View> */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: "85%", marginTop: "10%" }}>
                        <View>
                            <View>
                                <Text style={{
                                    fontFamily: Fonts.Regular, fontSize: RFPercentage(2.2), color: theme.text,
                                    width: "100%", textAlign: "center"
                                }}>Bookmarks Empty</Text>
                            </View>
                        </View>
                    </View>
                </>)
                : data.length != 0 ?
                    (<>
                        <View style={{ backgroundColor: "transparent", width: "90%",alignSelf:"center", paddingVertical: "2.5%", height: "85%", marginTop: "1%", marginBottom: "2.5%" }}>
                            <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true} >

                                {_.map(tabindex == "fav" ? myfav : data, (item, i) => {
                                    var url = item.url.split('/');
                                    var getUrl = url[0] + '//' + url[2];
                                    return (

                                        <View style={{
                                            flexDirection: "row",
                                            marginVertical: 15, width: "100%",
                                            justifyContent:"space-between"
                                        }} key={Math.random()}>
                                            <View style={{width:"60%",flexDirection:"row",alignItems:"center"}}>

                                            {
                                                tabindex == "fav" ?
                                                    <Pressable style={{ width: 23, marginTop: 5,backgroundColor:"white",alignItems:"center",justifyContent:"center",borderRadius:5,marginHorizontal:"3%",elevation:1,overflow:"hidden", height:23}} onPress={() => redirectToweb(item)} >
                                                        {!errArr.includes(item.title) ?
                                                            <Image source={{ uri: `${getUrl}/favicon.ico` }}
                                                                onError={() => {
                                                                    if (!errArr.includes(item.title)) {
                                                                        console.log("errororo", item.title);
                                                                        setErrArr([...errArr, item.title])
                                                                    }
                                                                }} style={{ width: 23, height: 23, alignSelf: "center", }} />
                                                            :
                                                            <FaviconIcon height={23} width={23} style={{ alignSelf: "center" }} />
                                                        }
                                                    </Pressable>

                                                    :

                                                    <Pressable style={{ width: 24, marginTop: 5,backgroundColor:"white",alignItems:"center",padding:5,justifyContent:"center",borderRadius:5,marginHorizontal:"3%",elevation:1,overflow:"hidden",height:24   }} onPress={() => redirectToweb(item)} >
                                                        {/* {console.log("itemImage component",`${ApiConstants.URL}images/` + item.appimage)} */}
                                                        {!errArr.includes(item.appimage ) ?
                                                            <Image source={{ uri: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(item.url)}`, }}
                                                                onError={(error) => {
                                                                    if (!errArr.includes(item.appimage )) {
                                                                        console.log("errororo", item.appimage );
                                                                        setErrArr([...errArr, item.appimage])
                                                                    }
                                                                }} style={{ width: "100%", height: "100%", alignSelf: "center", }} />
                                                            :
                                                            // <FaviconIcon height={"100%"} width={"100%"} style={{ alignSelf: "center" }} />
                                                            <Image source={require('../../assets/img/star1.png')} style={{ width: "100%", height: "100%", resizeMode: "contain",alignSelf: "center", borderRadius: 2, tintColor: theme.theme == "light" ? "#000" : "#000" }} />
                                                        }
                                                        {/* {item.appimage  ?
                                                            <Image source={{
                                                                uri: `${ApiConstants.URL}images/` + item.appimage,
                                                            }} style={{ width: "100%", height: "100%",borderRadius:2, resizeMode: "contain",  alignSelf: "center" }}  
                                                            onError={(error) => {
                                                                console.error('Image loading error:', error.nativeEvent.error);
                                                              }}
                                                            />
                                                            :
                                                            <Image source={require('../../assets/img/star1.png')} style={{ width: 24, height: 24, marginLeft: 8, resizeMode: "contain", borderRadius: 5, tintColor: theme.theme == "light" ? "#000" : "#fff" }} />
                                                        } */}
                                                    </Pressable>

                                            }

                                            <TouchableOpacity onPress={() => redirectToweb(item)}
                                                style={{  }} >

                                                <Text numberOfLines={1} style={{ fontFamily: Fonts.Regular, fontSize: RFPercentage(2.2), color: theme.theme==="dark"?"white":"black", marginTop: 0 }}>{tabindex == "fav" ? item.siteName : item.title}</Text>
                                                {tabindex != "fav" &&
                                                    <Text textBreakStrategy="simple" style={{
                                                        fontFamily: Fonts.Regular, fontSize: RFPercentage(1.6), color:theme.theme==="dark"? "#A279FA":"#612CD2",
                                                    }} numberOfLines={1} 
                                                    ellipsizeMode="tail">{item.description.replace(/ {2,}/g, ' ')}</Text>}
                                            </TouchableOpacity>
                                            </View>



<View style={{}}>
                                            {tabindex == "fav" ? myfav?.find(
                                                (na) => na._id == item._id
                                            ) &&
                                                (
                                                    <Menu style={{  alignItems: "flex-end",}}  >
                                                        <MenuTrigger >
                                                            <View >
                                                                {theme.theme == 'light' ?
                                                                    <ActiveBookStarLight width={windowWidth * 0.06} height={windowWidth * 0.06} style={{ resizeMode: "contain", alignSelf: "center" }} /> :
                                                                    <ActiveBookStarDark width={windowWidth * 0.06} height={windowWidth * 0.06} style={{ resizeMode: "contain", alignSelf: "center" }} />
                                                                }
                                                            </View>
                                                        </MenuTrigger>
                                                        <MenuOptions optionsContainerStyle={{backgroundColor:"transparent",
                                width: "30%", }} >
                                                        <ImageBackground
              source={imageSource}
              style={{
                width: "100%",
                height: "100%",
                borderColor:"rgba(162, 121, 250, 0.30)",
                borderWidth:2,
                borderRadius:5,
                overflow: "hidden",
                opacity:0.979
              }}
              resizeMode="cover"
            >
                                                            <MenuOption onSelect={() => redirectToweb(item)}>
                                                                <Text style={{ color:theme.theme==="light"? "#000":"#fff",
                                    fontFamily: Fonts.Regular,
                                    fontSize: RFValue(10),
                                    marginLeft: "5%",
                                    paddingVertical: "2.5%",}} >Open in new tab</Text>
                                                            </MenuOption>

                                                            <MenuOption onSelect={() => copyToClipboard(item?.url)}>
                                                                <Text style={{ color:theme.theme==="light"? "#000":"#fff",
                                    fontFamily: Fonts.Regular,
                                    fontSize: RFValue(10),
                                    marginLeft: "5%",
                                    paddingVertical: "2.5%", }} >Copy link</Text>
                                                            </MenuOption>

                                                            <MenuOption onSelect={() => customShare(item?.url)}>
                                                                <Text style={{ color:theme.theme==="light"? "#000":"#fff",
                                    fontFamily: Fonts.Regular,
                                    fontSize: RFValue(10),
                                    marginLeft: "5%",
                                    paddingVertical: "2.5%",}} >Share</Text>
                                                            </MenuOption>

                                                            <MenuOption onSelect={() => {
                                                                setOptionValue(item);
                                                                setFavIndex(i);
                                                                setRenamemodal(true);
                                                            }}>
                                                                <Text style={{ color:theme.theme==="light"? "#000":"#fff",
                                    fontFamily: Fonts.Regular,
                                    fontSize: RFValue(10),
                                    marginLeft: "5%",
                                    paddingVertical: "2.5%", }} >Rename</Text>
                                                            </MenuOption>

                                                            <MenuOption onSelect={() => remove_favourite(item?._id)}>
                                                                <Text style={{color:theme.theme==="light"? "#000":"#fff",
                                    fontFamily: Fonts.Regular,
                                    fontSize: RFValue(10),
                                    marginLeft: "5%",
                                    paddingVertical: "2.5%", }} >Delete</Text>
                                                            </MenuOption>
</ImageBackground>
                                                        </MenuOptions>
                                                    </Menu>

                                                ) : <></>
                                            }
</View>
                                        </View>

                                    )
                                })}
                            </ScrollView>

                        </View>
                    </>)
                    :
                    (<>
                    {IsLoad?(
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: "85%", marginTop: "10%" }}>
                        <ActivityIndicator size="small" color={theme.theme == "light" ? "#000" : "#fff"} />
                      </View>
                    ):(
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <View>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <Image source={{ uri: Images.nodata }} style={{ width: 120, height: 120, resizeMode: "contain", marginTop: 50 }} />
                            </View>
                            <View>
                                <Text style={{
                                    fontFamily: Fonts.Regular, fontSize: RFPercentage(2.5), marginTop: 20, color: theme.text,
                                    width: "100%", textAlign: "center"
                                }}>No data Found</Text>
                            </View>
                        </View>
                    </View>
                    )}
                       
                    </>)}

            <Modal
                transparent={true}
                visible={renamemodal}
                animationType="fade"
            >
                <View onStartShouldSetResponder={() => {
                    setRenamemodal(false);

                }} style={{ flex: 1, backgroundColor:"rgba(9, 3, 22, 0.90)", justifyContent: "center" }} >
                    <View style={{  backgroundColor:theme.theme==="dark" ? "rgba(155, 124, 220, 0.411)":"#f1f1f1", borderRadius: 5,borderColor:"rgba(162, 121, 250, 0.30)",borderWidth:2,alignSelf: "center",
                      width: "75%",
                      justifyContent: "space-evenly",
                      paddingVertical: "10%", }} >
                        <Pressable style={{ padding: 10, alignItems: "flex-end", position: "absolute", right: 10, top: 5 }}
                            onPress={() => {
                                setRenamemodal(false);
                            }}>
                            <View>
                                {theme.theme == 'light' ?
                                    <Close fill="#000" width={18} height={18} />
                                    :
                                    <Close fill="#fff" width={18} height={18} />

                                }
                            </View>
                        </Pressable>
                        <Text style={{ color: theme.theme==="dark"?"white":"black",
                        fontFamily: Fonts.Medium,
                        fontSize: RFValue(15),
                        textAlign: "center",
                        fontWeight:"bold"}} >Edit bookmark</Text>
                        <View  style={{
                        borderWidth: 2,
                        borderColor: "rgba(162, 121, 250, 0.30)",
                        width: "90%",
                        alignSelf: "center",
                        borderRadius: 5,
                        marginTop: "7.5%",
                        backgroundColor:"rgba(155, 124, 220, 0.15)",
                      }}>
                            <TextInput
                                placeholder="Enter name"
                                placeholderTextColor={"#A279FA"}
                                style={{
                                  paddingVertical: "3%",
                                  fontSize: RFValue(12),
                                  fontFamily: Fonts.Regular,
                                  marginLeft: "5%",
                                  color: theme.theme==="dark"?"white":"black",
                                }}
                                value={optionValue?.siteName}
                                onChangeText={(e) => { setOptionValue({ ...optionValue, siteName: e }) }}
                            />
                        </View>
                        {isEmpty(optionValue?.siteName) && <Text style={{ color: "red", fontFamily: Fonts.Medium, paddingHorizontal: "5.5%", fontSize: RFValue(12), textAlign: "left" }} >Please Enter Bookmark Name</Text>}
                        <Pressable onPress={() => {
                            if (isEmpty(optionValue?.siteName)) return;
                            changeFavName()
                            setRenamemodal(false);
                        }} style={{  width: "75%",
                        paddingVertical: "2.5%",
                        alignSelf: "center",
                        borderWidth: 1,
                        borderColor: theme.theme==="dark"?"#FFF600":"#612CD2",
                        backgroundColor:theme.theme==="dark"?"#FFF600":"#612CD2",
                        borderRadius: 5,
                        marginTop: "7.5%", }} >
                            <Text style={{ fontSize: RFValue(12),
                          fontFamily: Fonts.Regular,
                          textAlign: "center",
                          color: theme.theme==="light"?"white":"black",}} >Rename</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        custsearch: {
            borderRadius: 30,
            backgroundColor: theme.searchbarbackground,
            borderColor: theme.background,
            borderWidth: 1,
            width: "90%",
            alignSelf: "center",
            // marginHorizontal: 15,1
            marginTop: 15,
            marginBottom: 15,
            fontFamily: Fonts.Bold,
            elevation: 0,
            fontSize: RFPercentage(2),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around"
        },
        logoutpopup_light: {
            // height:windowHeight*0.3,
            alignSelf: "center",
            width: "80%",
            // backgroundColor: theme.blackandwhite,
            backgroundColor: theme.background,
            borderRadius: 10,
            padding: "5%"
        },
        logoutpopup_dark: {
            // height:windowHeight*0.3,
            alignSelf: "center",
            width: "80%",
            // backgroundColor: theme.blackandwhite,
            backgroundColor: theme.background,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.texttheme,
            padding: "5%"
        }
    });