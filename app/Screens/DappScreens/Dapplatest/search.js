import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import WebView from "react-native-webview";
import Dappheader from "./Dappheader";
import { CHAIN_INFO } from "../useWeb3";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the FontAwesome icon set
import { Fonts } from "../../../utils/Fonts";
import themeContext from "../../../utils/themeContext";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import SearchIcon from "../../../assets/icons/lighttheme/Search.svg";
import SearchIconLight from "../../../assets/icons/darktheme/Search.svg";
import BackDark from "../../../assets/icons/darktheme/Back arrow.svg";
import BackLight from "../../../assets/icons/lighttheme/Back arrow.svg";
import VoiceTypeBlack from "../../../assets/icons/darktheme/Voice Typing.svg";
import VoiceTypeLight from "../../../assets/icons/lighttheme/Voice Typing.svg";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import FaviconIcon from "../../../assets/icons/darktheme/Favicon for App.svg";
import TrippledorLight from "../../../assets/icons/lighttheme/Trippledots.svg";
import TrippledorDark from "../../../assets/icons/darktheme/Trippledots.svg";
import SpeechRecognitionComponent from "../../OtherPages/voice";
import {
  Getmultitabs,
  SetSearchUrl,
  Updateweburl,
  selecteTab,
  setActiveTabId,
} from "../../../Redux/Actions/DapplatetsActions";
import getRealm from "../../../localDb/RealmConfig";
import { FavDappApi, getDapphistory, removeFavDappApi } from "../common/D_app";
import TokenClient from "../../../api/TokenClient";
import { ApiConstants } from "../../../api/ApiConstants";
import { Toastfn } from "../../../utils/toast";
import {
  borderRadius,
  windowWidth,
  windowheight,
} from "../../../utils/Dimensions";
import { Icon as Icn } from "react-native-elements";
import {
  copyToClipboard,
  customShare,
  findHostNameWithUrl,
} from "../../../utils/common";
import { ToastAndroid } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import isEmpty from "../../../utils/isEmpty";
import Iiconlight from "../../../assets/icons/lighttheme/About us.svg";
import IiconDark from "../../../assets/icons/darktheme/About us.svg";
import DeleteIconDark from "../../../assets/icons/darktheme/Delete.svg";
import DeleteIconLight from "../../../assets/icons/lighttheme/Delete.svg";
import GoogleIcon from "../../../assets/img/Google Icon.svg";
import { useFocusEffect } from "@react-navigation/native";
const Searchdapp = (props) => {
  const theme = useContext(themeContext);
  const style = styles(theme);

  const [searchenabled, setSearchenabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;
  const [historyData, setHistoryData] = useState([]);
  const [mailAddress, setMailaddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [errArr, setErrArr] = useState([]);
  const [voicevisible, setVoicevisible] = useState(false);
  const [searchtext, setSearchtext] = useState("");
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [stopLoad, setstopLoad] = useState(false);
  const [count, setCount] = useState();
  const [recClosed, setRecClosed] = useState([]);
  const [myfav, favdataList] = useState([]);

  const dispatch = useDispatch();

  const setsearchUrl = (item) => dispatch(SetSearchUrl(item));
  const setwebUrl = (item) => dispatch(Updateweburl(item));
  const setActivetabid = (item) => dispatch(setActiveTabId(item));
  const Multitabsdata = (item) => dispatch(Getmultitabs(item));
  const onChangeSearch = (query) => setSearchQuery(query);
  const selecteATab = (item) => dispatch(selecteTab(item));

  const filterFunction = () => {
    const filteredHistories = [];
    historyData.forEach((user) => {
      if (user.histories.length == 0) {
        return;
      }
      const userFilteredHistories = user.histories.filter(
                (history) => history.hostName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      filteredHistories.push({
        _id: user._id,
        histories: userFilteredHistories,
      });
    
        })
    // console.log("filteredHistories", filteredHistories);
    return filteredHistories
    }

  const filterdata = searchQuery ? filterFunction() : historyData;

  useEffect(() => {
    getHistoryFunc()
  }, [searchtext])

  useFocusEffect(
    useCallback(() => {
      getRecentDataRealm()
    }, [])
  );

  const getRecentDataRealm = () => {
    getRealm()
      .then((realm) => {
        var recentlyClosed = realm.objects("recentlyClosed");
        var newArr = new Array(...recentlyClosed).reverse();
        setRecClosed(newArr)

        let params = {
          mailAddress: global.mailAddress,
        };
        FavDappApi(params)
          .then(function (response) {
            const favData = response.data.data;
            favdataList(favData ?? []);
          })
          .catch(function (err) {
            console.log("dapps_fav err", err);
          });
      })
      .catch((err) => {
        console.log("errro on get history function", err);
      })
    }

  {/**Get history by mailAddress */ }
  const getHistoryFunc = async (data) => {
    getRealm()
      .then((realm) => {
        var getMail = realm.objects("loginStatus");
        setMailaddress(getMail[0].mail)
        // getDapphistory({ mailAddress: getMail[0].mail })
        //     .then((ress) => {
        //         console.log("resslslls", JSON.stringify(ress.data.data, null, 2));
        //         ress?.data?.data?.map((val) => {
        //             return val.histories = val.histories.reverse();
        //         })
        //         setHistoryData(ress?.data?.data ?? [])
        //         setLoading(false)
        //     })

        getDapphistory({ mailAddress: getMail[0].mail, skip: data ? data : skip, limit: 15, key: searchtext, from: "history" })
          .then((ress) => {
            // console.log("resslslls",ress.data.data);
            // ress?.data?.data?.map((val) => {
            //   return val.histories = val.histories.reverse();
            // })

            setstopLoad(ress.data.data.length == 0)
            if (ress.data.success) {
              setSkip(skip + 15);
              setCount(ress.data.totalCount);
              setLoading(false)
              setHistoryData(ress?.data?.data);
              // if (isEmpty(historyData)) { setHistoryData(ress?.data?.data); }
              // else {
              //     if (historyData[historyData.length - 1]._id == ress.data.data[0]._id) {
              //         var getData = [...historyData]
              //         getData[getData.length - 1].histories = [...getData[getData.length - 1].histories, ...ress.data.data[0].histories]
              //         // console.log('getDatagetData', JSON.stringify(getData, null, 2))
              //         getData = [...getData, ...ress.data.data.slice(1, ress.data.data.length)]
              //         setHistoryData(getData)

              //     } else { setHistoryData([...historyData, ...ress?.data?.data]) }
              // }

            } else {
              setCount(0)
              setstopLoad(true)
            }
          })
          .catch((err) => {
            console.log("erroro on gethistory", err);
          });
      })
      .catch((err) => {
        console.log("errro on get history function", err);
      })

    }

  const clearData = async (id, time, action) => {
    // var deleted = await props.clearHistory(val,time,data)
    // if(deleted) setIsModalVisible(false)

    try {
      var data = {}
      data.mailAddress = mailAddress;
      data._id = id;
      data.Time = time;
      if (action) data.action = action;
      var resp = await TokenClient.post(ApiConstants.clearDappHistory, data)
      if (resp?.data?.success) {
        setSkip(0)
        setHistoryData([])
        setTimeout(() => {
          getHistoryFunc(0)
        }, 1000)
      } else {
        Toastfn(resp?.data?.msg)
      }
      setIsModalVisible(false)
    } catch (error) {
      console.log("erororo on clear history", error);
    }
  
    }

  const pressHistory = (url) => {
    // if (props.multitab) props.setMultitab(false);
    console.log("vvvvvvvvvvvvvvvv", url);
    props.navigation.navigate("Dapplatest", {
      isEnabled: true,
    });
    setTimeout(() => {
      setwebUrl(url)
      setsearchUrl(url)
    }, 1500)

    }


  // console.log("filterdata", JSON.stringify(filterdata, null, 2));

  const remove_favourite = (data) => {
    let params = {
      mailAddress: global.mailAddress,
      dappId: data,
    };
    removeFavDappApi(params)
      .then(function (res) {
        getRecentDataRealm();
      })
      .catch(function (err) {
        console.log("remove_fav_dapp err", err);
      });
  };

  const redirectToweb = async (item) => {
    var setObj = { URL: item.url, hostName: item.title, id: '0' }
    getRealm()
      .then((realm) => {
        var dappVal1 = realm.objects("dappTabs");

        var TabID = String(Date.now())
        setActivetabid(TabID)
        setsearchUrl(setObj.URL)
        setwebUrl(setObj.URL)
        selecteATab(dappVal1.length)
        realm.write(() => {
          realm.create("dappTabs", {
            ImageUrl: "",
            TabId: TabID,
            TAB: [setObj]
          });
        });
        // console.log('dappVal1aaaaaaa', JSON.stringify(dappVal1, null, 2))
        Multitabsdata(dappVal1)
      })
      .catch((err) => {
        console.log("errro onn getdapppteabs", err);
      })

    setTimeout(() => {
      setSearchtext("")
    }, 1000)

    // props.navigation.navigate('DappWeb')
    props.navigation.navigate('Dapplatest')
    // setDappStatus({
    //   status: "true",
    //   item: item,
    // });
  }


  const redirecttoBrowser = async (data) => {
    console.log("datatatta", data, searchtext);
    try {
      if (isEmpty(searchtext) && isEmpty(data)) return ToastAndroid.showWithGravityAndOffset(
          "URL required",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      // if (searchtext.trim().slice(-4) != ".com") searchtext = searchtext.trim() + ".com"
      var regg = [".com", "https", "http"]
      var directUrl
      if ((regg.includes(searchtext?.trim().slice(0, 4))) || (regg.includes(data?.trim().slice(0, 4)))) directUrl = data || searchtext;
      else if ((regg.includes(searchtext?.trim().slice(-4))) || (regg.includes(data?.trim().slice(-4)))) directUrl = `https://${data ? data : searchtext}/`
      else directUrl = `https://www.google.com/search?q=${data ? data : searchtext}`
      // console.log("redididiididi", directUrl);

      
            var findHost = await findHostNameWithUrl(directUrl)
      // console.log("findHost", findHost);
      const url = { title: findHost.hostname, url: directUrl }
      // console.log("url", url);
      redirectToweb(url)
    } catch (error) {
      console.log('errr on cacacac', error);
    }
  };

  const receivefn = (value) => {
    // console.log("vaalalalal", value);
    // setUrl(value)
    redirecttoBrowser(value)

  }

    const [TabName, setTabName] = useState("history")

  const onRecentCloseDelete = (index) => {
    getRealm()
            .then((realm) => {
      var recentlyClosed = realm.objects("recentlyClosed");
      // console.log("rererere", recentlyClosed);
      const deleteRec = recentlyClosed[index];

      realm.write(() => {
        realm.delete(deleteRec)
      })
      setRecClosed(recentlyClosed)

      return () => {
        realm.close();
      }
    })
    }
    const imageSource = theme.theme === "dark"
    ? require("../../../assets/img/menueBackgroundDark.png")
    : require("../../../assets/img/menueBackgroung.png");
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: theme.theme == "light" ? "#FFF" : "rgb(25,14,47)",
      }}
    >
      <View style={{width:"90%",alignSelf:"center"}}>

      
      <View
        style={{
          flexDirection: "row",
          marginTop: "3%",
          alignItems: "center",
          justifyContent:"center"
        }}
      >
        <View style={{ width: "10%",marginRight:5,}}>
          <Pressable
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            {theme.theme == "light" ? (
              <BackLight
                width={28}
                height={28}
                style={{ resizeMode: "contain", alignSelf: "center" }}
              />
            ) : (
              <BackDark
                width={28}
                height={28}
                style={{ resizeMode: "contain", alignSelf: "center" }}
              />
            )}
          </Pressable>
        </View>
        <View style={style.custsearch}>
          <View
            style={{
            //   backgroundColor: theme.theme == "dark" ? "gray" : "#fff",
              width: "85%",
              flexDirection: "row",
              alignItems: "center",
              marginLeft: "4%",
            }}
          >
            <Pressable
              onPress={() => redirecttoBrowser("news.google.com")}
              style={{ width: "15%" }}
            >
              {/* <Image source={require("../../../assets/img/google.png")} style={{ width: 20, height: 20, resizeMode: "contain", alignSelf: "center" }} /> */}
              <GoogleIcon height={24} width={24}  />
            </Pressable>

            <View style={{ width: "70%" }}>
              <TextInput
                autoFocus={true}
                value={searchtext}
                onChangeText={(text) => setSearchtext(text)}
                placeholder="Search or type URL"
                style={{
                  paddingVertical: "3%",
                  fontFamily: Fonts.Regular,
                  color: theme.theme==="dark"?"black":"black",
                }}
                placeholderTextColor={theme.theme == "dark" ? "gray" : "gray"}
                onSubmitEditing={() => {
                  redirecttoBrowser();
                }}
              />
            </View>

            <Pressable onPress={() => setVoicevisible(true)}>
                        {theme.theme != "light" ? (
                          <Image
                            style={{
                              width: 23,
                              height: 23,
                            }}
                            source={require("../../../assets/img/voiceSearch.png")}
                            resizeMode="contain"
                          />
                        ) : (
                          <Image
                            style={{
                              width: 23,
                              height: 23,
                            }}
                            source={require("../../../assets/img/voiceSearch.png")}
                            resizeMode="contain"
                          />
                        )}
                      </Pressable>
                      <TouchableOpacity
                        onPress={() => {
                          global?.initialEnter == undefined
                            ? navigateSecurityPage("ScanAddress")
                            : props.navigation.navigate("ScanAddress", {
                                path: "WalletConnect",
                              });
                        }}
                      >
                        {theme.theme != "light" ? (
                          <Image
                            style={{
                              width: 23,
                              height: 23,
                              marginLeft: 10,
                            }}
                            source={require("../../../assets/img/scan.png")}
                            resizeMode="contain"
                          />
                        ) : (
                          <Image
                            style={{
                              width: 23,
                              height: 23,
                              marginLeft: 10,
                            }}
                            source={require("../../../assets/img/scan.png")}
                            resizeMode="contain"
                          />
                        )}
                      </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          paddingVertical: "4%",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setTabName("history");
          }}
          key={Math.random()}
          style={{
            width: "30%",
    backgroundColor:
    TabName == "history"
        ? "#612CD2"
        : theme.theme == "dark"
        ? "rgba(155, 124, 220, 0.15)"
        : "rgba(155, 124, 220, 0.15)",
    paddingVertical: "2.5%",
    justifyContent: "center",
    borderRadius: 5,
    borderColor: "rgba(162, 121, 250, 0.30)",
    borderWidth: 2,
          }}
        >
          <Text
           style={{
            color:
            TabName == "history"
        ? "white"
        : theme.theme == "light"
        ? "#612CD2"
        : "rgba(255, 255, 255, 0.30)",
    textAlign: "center",
    fontFamily:
    TabName == "history"
        ? Fonts.Regular
        : Fonts.Regular,
    fontSize: RFValue(11),
          }}
          >
            History
          </Text>
        </TouchableOpacity>

        <Pressable
          onPress={() => {
            setTabName("recDeleted");
          }}
          key={Math.random()}
          style={{
            width: "36%",
    backgroundColor:
    TabName == "recDeleted"
        ? "#612CD2"
        : theme.theme == "dark"
        ? "rgba(155, 124, 220, 0.15)"
        : "rgba(155, 124, 220, 0.15)",
    paddingVertical: "2.5%",
    justifyContent: "center",
    borderRadius: 5,
    borderColor: "rgba(162, 121, 250, 0.30)",
    borderWidth: 2,
          }}
        >
          <Text
           style={{
            color:
            TabName == "recDeleted"
        ? "white"
        : theme.theme == "light"
        ? "#612CD2"
        : "rgba(255, 255, 255, 0.30)",
    textAlign: "center",
    fontFamily:
    TabName == "recDeleted"
        ? Fonts.Regular
        : Fonts.Regular,
    fontSize: RFValue(11),
          }}
          >
            Recently closed
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setTabName("bookmarks");
          }}
          key={Math.random()}
          style={{
            width: "30%",
    backgroundColor:
    TabName == "bookmarks"
        ? "#612CD2"
        : theme.theme == "dark"
        ? "rgba(155, 124, 220, 0.15)"
        : "rgba(155, 124, 220, 0.15)",
    paddingVertical: "2.5%",
    justifyContent: "center",
    borderRadius: 5,
    borderColor: "rgba(162, 121, 250, 0.30)",
    borderWidth: 2,
          }}
        >
          <Text
           style={{
            color:
            TabName == "bookmarks"
        ? "white"
        : theme.theme == "light"
        ? "#612CD2"
        : "rgba(255, 255, 255, 0.30)",
    textAlign: "center",
    fontFamily:
    TabName == "bookmarks"
        ? Fonts.Regular
        : Fonts.Regular,
    fontSize: RFValue(11),
          }}
          >
            Bookmarks
          </Text>
        </Pressable>
      </View>

      <ScrollView style={{ height: "82.5%",width:"100%"}}>
        {TabName == "history"
          ? filterdata.length != 0 &&
            filterdata.map((item) => {
              return (
                <>
                  {item.histories.map((val) => {
                    var url = val.URL.split("/");
                    var getUrl = url[0] + "//" + url[2];
                    return (
                      <>
                        <View
                          style={{
                            width: "100%",
                            alignSelf: "center",
                            paddingVertical: "2.5%",
                            marginTop: "3%",
                            flexDirection: "row",
                           
                            justifyContent:"space-between"

                          }}
                        >
                          <View style={{flexDirection:"row",alignItems:"center"}}>

                          <Pressable
                            style={{ width: 22,
                              height: 22, marginTop: 5,backgroundColor:"white",alignItems:"center",justifyContent:"center",borderRadius:5,marginHorizontal:"3%",elevation:1,overflow:"hidden" }}
                            onPress={() => pressHistory(val.URL)}
                          >
                            {!errArr.includes(val.hostName) ? (
                              <Image
                                source={{ uri: `${getUrl}/favicon.ico` }}
                                onError={() => {
                                  if (!errArr.includes(val.hostName)) {
                                    setErrArr([...errArr, val.hostName]);
                                  }
                                }}
                                style={{
                                  width: 22,
                                  height: 22,
                                  alignSelf: "center",
                                }}
                              />
                            ) : (
                              <FaviconIcon
                                height={20}
                                width={20}
                                style={{ alignSelf: "center" }}
                              />
                            )}
                          </Pressable>
                          <Pressable
                            style={{ width: "75%" }}
                            onPress={() => pressHistory(val.URL)}
                          >
                            <Text
                              style={{
                                fontFamily: Fonts.Regular,
                                fontSize: RFValue(14),
                                color: theme.text,
                              }}
                              numberOfLines={1}
                            >
                              {val.URL}
                            </Text>
                          </Pressable>
                          </View>
                          <Menu
                            style={{ width: "10%", alignItems: "flex-end", }}
                          >
                            <MenuTrigger>
                              <View>
                                {theme.theme == "dark" ? (
                                  <TrippledorDark width={22} height={22} />
                                ) : (
                                  <TrippledorLight width={22} height={22} />
                                )}
                              </View>
                            </MenuTrigger>
                            <MenuOptions
                              optionsContainerStyle={{
                                backgroundColor:"transparent",
                                width: "30%",
                                
                              }}
                            >
                              

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

                              <MenuOption
                                onSelect={() => redirecttoBrowser(val.URL)}
                                
                              >
                                <Text
                                  style={{
                                    color:theme.theme==="light"? "#000":"#fff",
                                    fontFamily: Fonts.Regular,
                                    fontSize: RFValue(10),
                                    marginLeft: "5%",
                                    paddingVertical: "2.5%",
                                  }}
                                >
                                  Open in new tab
                                </Text>
                              </MenuOption>

                              <MenuOption
                                onSelect={() => copyToClipboard(val.URL)}
                              >
                                <Text
                                  style={{
                                    color: theme.theme == "light"
                                    ? "#000"
                                    : "#fff",
                                    fontFamily: Fonts.Regular,
                                    fontSize: RFValue(10),
                                    marginLeft: "5%",
                                    paddingVertical: "2.5%",
                                  }}
                                >
                                  Copy link
                                </Text>
                              </MenuOption>

                              <MenuOption
                                onSelect={() => customShare(val?.URL)}
                              >
                                <Text
                                  style={{
                                    color: theme.theme==="light"? "#000":"#fff",
                                    fontFamily: Fonts.Regular,
                                    fontSize: RFValue(10),
                                    marginLeft: "5%",
                                    paddingVertical: "2.5%",
                                  }}
                                >
                                  Share
                                </Text>
                              </MenuOption>

                              <MenuOption
                                onSelect={() =>
                                  clearData(item.id, val.Time, false)
                                }
                              >
                                <Text
                                  style={{
                                    color: theme.theme==="light"? "#000":"#fff",
                                    fontFamily: Fonts.Regular,
                                    fontSize: RFValue(10),
                                    marginLeft: "5%",
                                    paddingVertical: "2.5%",
                                  }}
                                >
                                  Delete
                                </Text>
                              </MenuOption>
                              </ImageBackground>
                              
                            </MenuOptions>
                          </Menu>
                        </View>
                      </>
                    );
                  })}
                </>
              );
            })
          : TabName == "recDeleted"
          ? recClosed.length != 0 &&
            recClosed.map((val, ind) => {
              var url = val.URL.split("/");
              var getUrl = url[0] + "//" + url[2];
              return (
                <>
                  <View
                    style={{
                      width: "100%",
                      alignSelf: "center",
                      paddingVertical: "2.5%",
                      marginTop: "3%",
                      flexDirection: "row",
                     
                      justifyContent:"space-between"
                    }}
                  >
                    <View style={{flexDirection:"row",alignItems:"center"}}>

                    <Pressable
                      style={{ width: 22,
                        height: 22, marginTop: 5,backgroundColor:"white",alignItems:"center",justifyContent:"center",borderRadius:5,marginHorizontal:"3%",elevation:1,overflow:"hidden"}}
                      onPress={() => pressHistory(val.URL)}
                    >
                      {!errArr.includes(val.hostName) ? (
                        <Image
                          source={{ uri: `${getUrl}/favicon.ico` }}
                          onError={() => {
                            if (!errArr.includes(val.hostName)) {
                              setErrArr([...errArr, val.hostName]);
                            }
                          }}
                          style={{ width: 22, height: 22, alignSelf: "center" }}
                        />
                      ) : (
                        <FaviconIcon
                          height={22}
                          width={22}
                          style={{ alignSelf: "center" }}
                        />
                      )}
                    </Pressable>
                    <Pressable
                      style={{ width: "75%" }}
                      onPress={() => pressHistory(val.URL)}
                    >
                      <Text
                        style={{
                          fontFamily: Fonts.Regular,
                          fontSize: RFValue(14),
                          color: theme.text,
                        }}
                        numberOfLines={1}
                      >
                        {val.URL}
                      </Text>
                    </Pressable>
                    </View>
                    <Menu style={{ width: "10%", alignItems: "flex-end" }}>
                      <MenuTrigger>
                        <View>
                          {theme.theme == "dark" ? (
                            <TrippledorDark width={22} height={22} />
                          ) : (
                            <TrippledorLight width={22} height={22} />
                          )}
                        </View>
                      </MenuTrigger>
                      <MenuOptions
                              optionsContainerStyle={{
                                backgroundColor:"transparent",
                                width: "30%",
                                
                              }}
                            >
                              

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
                        <MenuOption onSelect={() => redirecttoBrowser(val.URL)}>
                          <Text
                            style={{
                              color: theme.theme==="light"? "#000":"#fff",
                              fontFamily: Fonts.Regular,
                              fontSize: RFValue(10),
                              marginLeft: "5%",
                              paddingVertical: "2.5%",
                            }}
                          >
                            Open in new tab
                          </Text>
                        </MenuOption>

                        <MenuOption onSelect={() => copyToClipboard(val.URL)}>
                          <Text
                            style={{
                              color: theme.theme==="light"? "#000":"#fff",
                              fontFamily: Fonts.Regular,
                              fontSize: RFValue(10),
                              marginLeft: "5%",
                              paddingVertical: "2.5%",
                            }}
                          >
                            Copy link
                          </Text>
                        </MenuOption>

                        <MenuOption onSelect={() => customShare(val?.URL)}>
                          <Text
                            style={{
                              color: theme.theme==="light"? "#000":"#fff",
                              fontFamily: Fonts.Regular,
                              fontSize: RFValue(10),
                              marginLeft: "5%",
                              paddingVertical: "2.5%",
                            }}
                          >
                            Share
                          </Text>
                        </MenuOption>

                        <MenuOption onSelect={() => onRecentCloseDelete(ind)}>
                          <Text
                            style={{
                              color: theme.theme==="light"? "#000":"#fff",
                              fontFamily: Fonts.Regular,
                              fontSize: RFValue(10),
                              marginLeft: "5%",
                              paddingVertical: "2.5%",
                            }}
                          >
                            Delete
                          </Text>
                        </MenuOption>
                        </ImageBackground>
                      </MenuOptions>
                    </Menu>
                  </View>
                </>
              );
            })
          : TabName == "bookmarks" &&
            myfav.length != 0 && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {myfav.map((val) => {
                  // console.log("val", val);
                  var url = val.url.split("/");
                  var getUrl = url[0] + "//" + url[2];
                  return (
                    <>
                      <View
                        style={{
                          width: "100%",
                      alignSelf: "center",
                      paddingVertical: "2.5%",
                      marginTop: "3%",
                      flexDirection: "row",
                     
                      justifyContent:"space-between"
                        }}
                      >
                        <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Pressable
                          style={{ width: 22,
                            height: 22, marginTop: 5,backgroundColor:"white",alignItems:"center",justifyContent:"center",borderRadius:5,marginHorizontal:"3%",elevation:1,overflow:"hidden" }}
                          onPress={() => pressHistory(val.url)}
                        >
                          {!errArr.includes(val.title) ? (
                            <Image
                              source={{ uri: `${getUrl}/favicon.ico` }}
                              onError={() => {
                                if (!errArr.includes(val.title)) {
                                  setErrArr([...errArr, val.title]);
                                }
                              }}
                              style={{
                                width: 22,
                                height: 22,
                                alignSelf: "center",
                              }}
                            />
                          ) : (
                            <FaviconIcon
                              height={22}
                              width={22}
                              style={{ alignSelf: "center" }}
                            />
                          )}
                        </Pressable>
                        <Pressable
                          style={{ width: "75%" }}
                          onPress={() => pressHistory(val.url)}
                        >
                          <Text
                            style={{
                              fontFamily: Fonts.Regular,
                              fontSize: RFValue(14),
                              color: theme.text,
                            }}
                            numberOfLines={1}
                          >
                            {val.url}
                          </Text>
                        </Pressable>
                        </View>
                        <Menu style={{ width: "10%", alignItems: "flex-end" }}>
                          <MenuTrigger>
                            <View>
                              {theme.theme == "dark" ? (
                                <TrippledorDark width={22} height={22} />
                              ) : (
                                <TrippledorLight width={22} height={22} />
                              )}
                            </View>
                          </MenuTrigger>
                          <MenuOptions
                              optionsContainerStyle={{
                                backgroundColor:"transparent",
                                width: "30%",
                                
                              }}
                            >
                              

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
                            <MenuOption
                              onSelect={() => redirecttoBrowser(val.url)}
                            >
                              <Text
                                style={{
                                  color:  theme.theme==="light"? "#000":"#fff",
                                  fontFamily: Fonts.Regular,
                                  fontSize: RFValue(10),
                                  marginLeft: "5%",
                                  paddingVertical: "2.5%",
                                }}
                              >
                                Open in new tab
                              </Text>
                            </MenuOption>

                            <MenuOption
                              onSelect={() => copyToClipboard(val.url)}
                            >
                              <Text
                                style={{
                                  color:  theme.theme==="light"? "#000":"#fff",
                                  fontFamily: Fonts.Regular,
                                  fontSize: RFValue(10),
                                  marginLeft: "5%",
                                  paddingVertical: "2.5%",
                                }}
                              >
                                Copy link
                              </Text>
                            </MenuOption>

                            <MenuOption onSelect={() => customShare(val?.url)}>
                              <Text
                                style={{
                                  color:  theme.theme==="light"? "#000":"#fff",
                                  fontFamily: Fonts.Regular,
                                  fontSize: RFValue(10),
                                  marginLeft: "5%",
                                  paddingVertical: "2.5%",
                                }}
                              >
                                Share
                              </Text>
                            </MenuOption>

                            <MenuOption
                              onSelect={() => remove_favourite(val._id)}
                            >
                              <Text
                                style={{
                                  color:  theme.theme==="light"? "#000":"#fff",
                                  fontFamily: Fonts.Regular,
                                  fontSize: RFValue(10),
                                  marginLeft: "5%",
                                  paddingVertical: "2.5%",
                                }}
                              >
                                Delete
                              </Text>
                            </MenuOption>
                            </ImageBackground>
                          </MenuOptions>

                        </Menu>
                      </View>
                    </>
                  );
                })}
              </ScrollView>
            )}
        <SpeechRecognitionComponent
          visible={voicevisible}
          onhide={setVoicevisible}
          searchtext={(value) => receivefn(value)}
        />
      </ScrollView>

      <Modal
        transparent={true}
        animationType="fade"
        isVisible={isModalVisible}
        entry="bottom"
        backdropPressToClose={true}
        visible={isModalVisible}
        backdropColor={"#989898"}
        onBackButtonPress={() => setIsModalVisible(false)}
      >
        <View
          onStartShouldSetResponder={() => setIsModalVisible(false)}
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            width: deviceWidth,
            height: deviceHeight,
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <View
            style={
              theme.theme == "light"
                ? style.logoutpopup_light
                : style.logoutpopup_dark
            }
          >
            <View style={{ padding: 10, alignItems: "flex-end" }}></View>
            <View style={{ alignItems: "center" }}>
              {theme.theme == "light" ? (
                <Iiconlight
                  width={windowWidth * 0.2}
                  height={windowWidth * 0.2}
                  style={{ resizeMode: "contain" }}
                />
              ) : (
                <IiconDark
                  width={windowWidth * 0.2}
                  height={windowWidth * 0.2}
                  style={{ resizeMode: "contain" }}
                />
              )}

              <Text
                style={{
                  color: theme.text,
                  fontFamily: Fonts.Medium,
                  fontSize: RFPercentage(2.5),
                  marginTop: "6%",
                  alignSelf: "center",
                  textAlign: "center",
                }}
              >
                Clear all browing history?
              </Text>

              <View style={{ display: "flex", flexDirection: "row" }}>
                <Pressable
                  onPress={() => {
                    clearData(false, false, "clearAll");
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "transparent",
                      borderRadius: 300,
                      width: 100,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      marginRight: 10,
                      borderWidth: 1,
                      borderColor: theme.texttheme,
                      marginTop: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: theme.texttheme,
                        fontFamily: Fonts.Regular,
                        textAlign: "center",
                        width: "100%",
                        marginVertical: 10,
                        fontSize: RFPercentage(1.75),
                      }}
                    >
                      Yes
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setIsModalVisible(false);
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "transparent",
                      borderRadius: 300,
                      width: 100,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderWidth: 1,
                      borderColor: theme.texttheme,
                      marginTop: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: theme.texttheme,
                        fontFamily: Fonts.Regular,
                        textAlign: "center",
                        width: "100%",
                        marginVertical: 10,
                        fontSize: RFPercentage(1.75),
                      }}
                    >
                      No
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      </View>
    </View>
  );
};

export default Searchdapp;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.background,
    },
    seperatorLine: {
      marginTop: "3%",
    },
    dapp: {
      resizeMode: "contain",
      height: windowheight * 0.0625,
      width: windowWidth * 0.0625,
      aspectRatio: 0.65,
    },
    voice: {
      resizeMode: "contain",
      height: windowheight * 0.0435,
      width: windowWidth * 0.0435,
      aspectRatio: 0.65,
    },
    wallet: {
      resizeMode: "contain",
      height: windowheight * 0.06,
      width: windowWidth * 0.06,
      aspectRatio: 0.65,
    },
    word: {
      resizeMode: "contain",
      height: windowheight * 0.06,
      width: windowWidth * 0.06,
      aspectRatio: 0.65,
    },
    clipboard: {
      resizeMode: "contain",
      height: windowheight * 0.06,
      width: windowWidth * 0.06,
      aspectRatio: 0.65,
    },
    theme: {
      resizeMode: "contain",
      height: windowheight * 0.06,
      width: windowWidth * 0.06,
      aspectRatio: 0.65,
    },
    wallet1: {
      resizeMode: "contain",
      height: windowheight * 0.065,
      width: windowWidth * 0.065,
      aspectRatio: 0.65,
    },
    preference: {
      resizeMode: "contain",
      height: windowheight * 0.048,
      width: windowWidth * 0.048,
      aspectRatio: 0.65,
    },
    faq: {
      resizeMode: "contain",
      height: windowheight * 0.06,
      width: windowWidth * 0.06,
      aspectRatio: 0.65,
    },
    aboutus: {
      resizeMode: "contain",
      height: windowheight * 0.05,
      width: windowWidth * 0.05,
      aspectRatio: 0.65,
    },
    notification: {
      resizeMode: "contain",
      height: windowheight * 0.05,
      width: windowWidth * 0.05,
      aspectRatio: 0.65,
    },
    security: {
      resizeMode: "contain",
      height: windowheight * 0.05,
      width: windowWidth * 0.05,
      aspectRatio: 0.65,
    },
    importwallet: {
      resizeMode: "contain",
      height: windowheight * 0.05,
      width: windowWidth * 0.05,
      aspectRatio: 0.65,
    },
    logoutpopup_light: {
      // height:windowHeight*0.3,
      alignSelf: "center",
      width: "80%",
      // backgroundColor: theme.blackandwhite,
      backgroundColor: theme.background,
      borderRadius: 10,
      padding: "5%",
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
      padding: "5%",
    },
    custsearch: {
        borderRadius: 5,
        backgroundColor: "#fff",
        borderColor:theme.theme==="dark"? "transparent":"rgba(162, 121, 250, 0.15)",
        borderWidth: 1.5,
        width: "90%",
        alignSelf: "center",
        fontFamily: Fonts.Bold,
        fontSize: RFPercentage(2),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
  });
