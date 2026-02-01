import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextView,
  Animated,
  Easing,
  Dimensions,
  ToastAndroid,
  TextInput,
  BackHandler,
  Pressable,
  Modal,
  StatusBar,
  NativeModules,
  KeyboardAvoidingView,
  Keyboard,
  RefreshControl,
  ScrollView,
  ImageBackground,
} from "react-native";
import themeContext from "../../utils/themeContext";
import { Fonts } from "../../utils/Fonts";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  dappCategoryList,
  dappitemList,
  FavDappApi,
  addFavDappApi,
  removeFavDappApi,
  getDapphistory,
} from "./common/D_app";
import { useDispatch } from "react-redux";
import { dappWeb } from "../../Redux/Actions/dappWebAction";
import getRealm from "../../localDb/RealmConfig";
const _ = require("lodash");
import isEmpty from "../../utils/isEmpty";
import { ApiConstants } from "../../api/ApiConstants";
import ActiveBookStarLight from "../../assets/icons/lighttheme/Trippledots.svg";
import ActiveBookStarDark from "../../assets/icons/darktheme/Trippledots.svg";
// import Modal from "react-native-modal";
import Close from "../../assets/img/close_icon.svg";
import LLogo from "../../assets/img/applogo2d.png";
import DLogo from "../../assets/img/applogo2l.png";
import Iiconlight from "../../assets/icons/lighttheme/About us.svg";
import IiconDark from "../../assets/icons/darktheme/About us.svg";

import Profilelight from "../../assets/icons/lighttheme/profile_light.svg";
import Profiledark from "../../assets/icons/darktheme/profile_dark.svg";

import { useFocusEffect } from "@react-navigation/native";
import { getProfileFunc } from "../OtherPages/common/Edit_Profile";
import { Images } from "../../utils/Images";
import Skeletondapp from "../Skeleton/skeletondapp";
import { assets_update_function } from "../WalletScreens/common/Wallet_Home";
import { selectedCurrencyList } from "../../Redux/Actions/selectedcurrencyListAction";
import { selectedTokenList } from "../../Redux/Actions/tokenListAction";
import { addCurrencyDetails } from "../../Redux/Actions/walletDetailsAction";
import { addAllcurrency } from "../../Redux/Actions/AllcurrencyAction";
import ScanIconBlack from "../../assets/icons/darktheme/Scan Wallet Address White.svg";
import ScanIconWhite from "../../assets/icons/lighttheme/Scan Wallet Address Black.svg";
import VoiceTypeBlack from "../../assets/icons/darktheme/Voice Typing.svg";
import VoiceTypeLight from "../../assets/icons/lighttheme/Voice Typing.svg";
import { footReducer } from "../../Redux/Actions/fiatDataAction";
import SpeechRecognitionComponent from "../OtherPages/voice";
import { copyToClipboard, customShare, findHostNameWithUrl, parseHtmlString } from "../../utils/common";
import { setActiveTabId } from "../../Redux/Actions/DapplatetsActions";
import FaviconIcon from "../../assets/icons/darktheme/Favicon for App.svg";
import GoogleIcon from "../../assets/img/Google Icon.svg";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import OptionPopup from "../OtherPages/OptionPopup";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Clipboard from "@react-native-community/clipboard";
import Share from "react-native-share";
import SearchIcon from "../../assets/icons/lighttheme/Search.svg";
import SearchIconLight from "../../assets/icons/darktheme/Search.svg";
import DeleteIconDark from "../../assets/icons/darktheme/Delete.svg";
import DeleteIconLight from "../../assets/icons/lighttheme/Delete.svg";
import BackDark from "../../assets/icons/darktheme/Back arrow.svg";
import BackLight from "../../assets/icons/lighttheme/Back arrow.svg";
import { Icon as Icn } from "react-native-elements";
import TokenClient from "../../api/TokenClient";
import { Toastfn } from "../../utils/toast";

import { parse } from "react-native-rss-parser";
import RssReaderList from "../OtherPages/rssReaderLIst";
import { TouchableHighlight } from "react-native";
import { windowheight } from "../../utils/Dimensions";

const Dapp = (props) => {

  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [tabindex, setTabIndex] = useState("Rss");
  const [mailAddress, setMailaddress] = useState("");
  const [myfav, favdataList] = useState([]);
  var [redirecturl, setUrl] = useState("");
  const [tabLength, setTabLength] = useState(0);
  const [userDetails, setUserDetails] = useState({});
  const [isModalVisible1, setModalVisible2] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalMessage2, setModalMessage2] = useState("");
  const [skeleton, setSkeleton] = useState(false);
  const [renamemodal, setRenamemodal] = useState(false);
  const [errArr, setErrArr] = useState([]);
  const [skip, setSkip] = useState(0);
  const [stopLoad, setstopLoad] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [count, setCount] = useState();
  const [PriventKeyboard, setPriventKeyboard] = useState(true);
  const [recClosed, setRecClosed] = useState([]);
  const [readLaterArr, setReadLater] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [optionValue, setOptionValue] = useState({});
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [searchQuery1, setSearchQuery1] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  const dispatch = useDispatch();

  const setDappStatus = (item) => dispatch(dappWeb(item));
  const setSelectWalletCurrencies = (item) => dispatch(selectedCurrencyList(item));
  // const setSelectWalletTokens = (item) => dispatch(selectedTokenList(item));
  const setWalletDetailsinRedux = (item) => dispatch(addCurrencyDetails(item));
  const setSelectedcurrecyinRedux = (item) => dispatch(addAllcurrency(item))
  const setSwapdatas = (item) => dispatch(footReducer(item));
  const setActivetabid = (item) => dispatch(setActiveTabId(item))
  useEffect(() => {
    StatusBar.setBarStyle(theme.theme === "light" ? "dark-content" : "light-content");
    StatusBar.setBackgroundColor(theme.theme === "dark" ? "rgb(25,14,47)" : "#fff");
  }, [theme.theme]);
  useFocusEffect(
    React.useCallback(() => {
      if (global.newWallet == "import") { setModalMessage("Successfully");setModalMessage2("imported!"), setModalVisible(true); global.newWallet = "" }
      if (global.newWallet == "create") { setModalMessage("Successfully");setModalMessage2("Created!"), setModalVisible(true); global.newWallet = "" }

      changeNavigationBarColor(theme.theme == "light" ? "#ffffff" : '#35225B', false, false)
    }, [global.newWallet, theme.theme])
  )


  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        // Once the Screen gets blur Remove Event Listener
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  const show_favourite_list = (mail) => {
    let params = {
      mailAddress: global.mailAddress,
    };
    FavDappApi(params)
      .then(function (response) {
        const favData = response.data.data;
        // console.log("favDatafjaojfapw", favData);
        favdataList(favData ?? []);
      })
      .catch(function (err) {
        console.log("dapps_fav err", err);
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
          show_favourite_list()
        }
      })
      .catch((e) => {
        console.log("eror", e);
      })
  }
  // console.log("adwdddddddd", props.route);
  const getWalletData = () => {
    setSkeleton(false)
    setSwapdatas('')
    getRealm()
      .then(async (realm) => {
        var walletData = realm.objects("Wallet_array");
        var defaultCurrencyVal = realm.objects("defaultCurrency");
        const recentlyClosed = realm.objects("recentlyClosed");
        setRecClosed(recentlyClosed)

        var arr = walletData.filter((item, index) => {
          return item.selected == "true"
        });

        global.walletName = arr[0].walletname
        setWalletDetailsinRedux(arr[0])
        setSelectedcurrecyinRedux(arr[0])
        let paramss = {
          walletArr: arr[0],
          defaultCurrency: defaultCurrencyVal[0].defaultCurrency
        }
        var response_assest = await assets_update_function(paramss);
        setSelectWalletCurrencies(response_assest.currencies)
        saveNotificationStatus()
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "wallet data list err from localDb");
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
        getPasscodeStatus()
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
        getDappTabs()
        global.passcodeStatus = passcodeVal.length;
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.error(err, "getPasscodeStatus err from localDb in walletHome");
      })
  };


  useFocusEffect(
    useCallback(() => {
      getRealm()
        .then((realm) => {
          var getMail = realm.objects("loginStatus")
          console.log("getMail", getMail);
          setMailaddress(getMail[0].mail)
          global.mailAddress = getMail[0].mail
          show_favourite_list(getMail[0].mail)
          getProfileFunc(getMail[0].mail)
            .then((val) => {
              setUserDetails(val.data.data)
            })
            .catch((err) => {
              console.log("errro on use", err);
            })
        })
        .catch((err) => {
          console.log("error on getRealm daopp", err);
        })
    }, [tabindex])
  )


  const getDappTabs = async () => {
    getRealm()
      .then((realm) => {
        var dappVal1 = realm.objects("dappTabs");
        console.log("dappTabs", JSON.stringify(dappVal1, null, 2));
        if (dappVal1.length != 0) setTabLength(dappVal1.length);
        else {
          var TabID = String(Date.now())
          var setObj = { URL: "https://www.google.com/", hostName: "www.google.com", id: "0" }
          realm.write(() => {
            realm.create("dappTabs", {
              ImageUrl: "",
              TabId: TabID,
              TAB: [setObj]
            });
          });
          setTabLength(1)
        }

      })
      .catch((err) => {
        console.log("errro onn getdapppteabs", err);
      })

  }


  const redirecttoBrowser = async (data) => {
    console.log("datatatta", data, redirecturl);
    try {
      if (isEmpty(redirecturl) && isEmpty(data)) return Toastfn("URL required")

      var regg = [".com", "https", "http"]
      var directUrl
      if ((regg.includes(redirecturl?.trim().slice(-4))) || (regg.includes(data?.trim().slice(-4)))) directUrl = `https://${data ? data : redirecturl}/`
      else if ((regg.includes(redirecturl?.trim().slice(0, 4))) || (regg.includes(data?.trim().slice(0, 4)))) directUrl = data || redirecturl;
      else directUrl = `https://www.google.com/search?q=${data ? data : redirecturl}`
      console.log("redididiididi", directUrl);

      var findHost = await findHostNameWithUrl(directUrl)
      console.log("findHost", findHost);
      const url = { title: findHost.hostname, url: directUrl }
      console.log("url", url);
      redirectToweb(url)
    } catch (error) {
      console.log('errr on cacacac', error);
    }

  };

  const redirectToweb = async (item) => {
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

      })
      .catch((err) => {
        console.log("errro onn getdapppteabs", err);
      })

    setTimeout(() => {
      setUrl("")
    }, 1000)

    // props.navigation.navigate('DappWeb')
    props.navigation.navigate('Dapplatest')
    // setDappStatus({
    //   status: "true",
    //   item: item,
    // });
  }

  const [voicevisible, setVoicevisible] = useState(false)
  const [searchenabled, setSearchenabled] = useState(false)
  const navigateSecurityPage = async (item) => {
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

  const receivefn = (value) => {
    console.log("vaalalalal", value);
    setUrl(value)
    redirecttoBrowser(value)

  }

  const [TabName, setTabName] = useState("history")
  // console.log('optionValue11111111', JSON.stringify(optionValue, null, 2))

  useFocusEffect(
    useCallback(() => {
      getHistoryFunc()
      setKeyboardVisible(false)
      getWalletData()
      getRssUrl()
      getReadLater()
    }, [])
  )

  useEffect(() => {
    getHistoryFunc()
  }, [redirecturl]);

  const getHistoryFunc = async (data, EmptyArr) => {
    getRealm()
      .then((realm) => {
        var getMail = realm.objects("loginStatus");
        getDapphistory({ mailAddress: getMail[0].mail, skip: EmptyArr ? 0 : skip, limit: 15, key: redirecturl, from: "history" })
          .then((ress) => {
            
            setstopLoad(ress.data.data.length == 0)
            if (ress.data.success) {
              setSkip(EmptyArr ? 0 : skip + 15);
              setCount(ress.data.totalCount);
              setHistoryData(ress?.data?.data);

            } else {
              setCount(0)
              setstopLoad(true)
            }
          })
          .catch((err) => {
            console.log("erroro on gethistory", err);
          })
      })
      .catch((err) => {
        console.log("errro on get history function", err);
      })

  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );

    return () => {
      // keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  const onChangeSearch = (query) => setSearchQuery1(query)


  const filterFunction = () => {
    console.log("fefefeefe");
    const filteredHistories = [];
    historyData.forEach((user) => {
      if (user.histories.length == 0) {
        return;
      }
      const userFilteredHistories = user.histories.filter(
        (history) => history.hostName.toLowerCase().includes(searchQuery1.toLowerCase())
      );
      filteredHistories.push({
        _id: user._id,
        histories: userFilteredHistories,
      });
    
    })
    console.log("filteredHistories", filteredHistories);
    return filteredHistories
  }

  const filterdata = searchQuery1 ? filterFunction() : historyData;

  const clearData = async (id, time, action) => {
    // var deleted = await props.clearHistory(val,time,data)
    // if(deleted) setIsModalVisible(false)

    try {
      console.log("valaction", id, action);
      var data = {}
      data.mailAddress = mailAddress;
      data._id = id;
      data.Time = time;
      if (action) data.action = action;
      console.log("clrea data", data);
      var resp = await TokenClient.post(ApiConstants.clearDappHistory, data)
      console.log("ressssssppp", resp.data);
      if (resp?.data?.success) {
        // setSkip(0)
        // setHistoryData([])
        getHistoryFunc(0, true)
      } else {
        Toastfn(resp?.data?.msg)
      }
      setIsModalVisible(false)
    } catch (error) {
      console.log("erororo on clear history", error);
    }
  
  }

  const onRecentCloseDelete = (index) => {
    getRealm()
      .then((realm) => {
      var recentlyClosed = realm.objects("recentlyClosed");
      console.log("rererere", recentlyClosed);
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

  const [rssList, setRssList] = useState()



  const getRssUrl = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("https://cointelegraph.com/rss");
      // console.log("resp", response.data);

      const responseText = await response.text();
      // console.log("responseText", responseText);

      const parsedRss = await parse(responseText);

      setRssList(parsedRss.items ?? [])

    } catch (error) {
      setRefreshing(false)
      console.log("Error on getRssUrl", error);
      Toastfn("Rss Can't able to connect please Refresh")
    } finally {
      setRefreshing(false)
      setSkeleton(true)
      setSwapdatas(true)
    }
  }

  const getReadLater = async () => {
    try {
      getRealm()
        .then((realm) => {
          var RssReadLater = realm.objects("RssReadLater");
          console.log('RssReadLater', JSON.stringify(RssReadLater, null, 2))
          setReadLater(RssReadLater ?? [])
        })
        .catch((e) => {
          console.log("err on getReadLater ", e);
        })
    } catch (error) {
      console.log("err on getReadLater");
    }
  }

  const AddReadLater = async (items) => {
    try {
      getRealm()
        .then((realm) => {
          realm.write(() => {
            realm.create("RssReadLater", items);
          });
          getReadLater()
        })
        .catch((e) => {
          console.log("err on getReadLater ", e);
        })
    } catch (error) {
      console.log("err onaddread later", error);
    }
  }

  const deleteReadLater = async (url) => {
    try {
      getRealm()
        .then((realm) => {
          var RssReadLater = realm.objects("RssReadLater");
          console.log('RssReadLater', JSON.stringify(RssReadLater, null, 2))
          const delItem = RssReadLater.filter(val => val.RssUrl == url)
          realm.write(() => {
            realm.delete(delItem)
          })
          getReadLater()
        })
        .catch((e) => {
          console.log("err on getReadLater ", e);
        })
    } catch (error) {
      console.log("er on deleteReadLater", error);
    }
  }

  const imageSource = theme.theme === "dark"
  ? require("../../assets/img/menueBackgroundDark.png")
  : require("../../assets/img/menueBackgroung.png");
  return (
    <SafeAreaView style={style.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: StatusBar.currentHeight,
        }}
      >
        <View
          style={{
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ windowHeight, justifyContent: "flex-start" }}>
            <ImageBackground
              source={theme.theme === "dark" ? Images.background :  Images.backgroundWhite}
              style={{
                width: windowWidth,
                height: windowHeight,
                paddingTop: 10,
              }}
              resizeMode="cover"
            >

                
              <ScrollView showsVerticalScrollIndicator={false}
                                nestedScrollEnabled={true}
                                refreshControl={
                                  <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={() => {
                                      getRssUrl();
                                      setSkeleton(true);
                                      setSwapdatas(true);
                                    }}
                                    style={{ fontFamily: Fonts.Regular }}
                                  />
                                }>
              {voicevisible && (
                <SpeechRecognitionComponent
                  visible={voicevisible}
                  onhide={setVoicevisible}
                  searchtext={(value) => receivefn(value)}
                />
              )}

              {!skeleton ? (
                <Skeletondapp />
              ) : (
                <>
                  {/* <Header name={"Dapps"} /> */}
                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      height: windowHeight * 0.1,
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        {/* <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            style={{ width: 32, height: 32 }}
                            source={require("../../assets/img/appicon.png")}
                            resizeMode="contain"
                          />
                        </View> */}
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 8,
                          }}
                        >
                          <Image
                            style={{ width: 55, height: 25 }}
                            source={require("../../assets/img/keyboard3.0.png")}
                            resizeMode="contain"
                          />
                        </View>
                      </View>
                      <View style={{}}>
                        <TouchableOpacity
                          onPress={() =>
                            props.navigation.navigate("EditProfile")
                          }
                        >
                          {userDetails && !isEmpty(userDetails?.profilePic) ? (
                            <Image
                              source={{
                                uri:
                                  `${ApiConstants.URL}images/` +
                                  userDetails?.profilePic,
                              }}
                              style={{
                                width: 32,
                                height: 32,
                                resizeMode: "contain",
                                borderRadius: 18,
                              }}
                            />
                          ) : theme.theme == "light" ? (
                            <View
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 17,
                                borderWidth: 2,
                                borderColor: "#A279FA",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow:"hidden",
                              }}
                            >
                              <Image
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 16,
                                }}
                                source={require("../../assets/img/avataricon.png")}
                                resizeMode="cover"
                              />
                            </View>
                          ) : (
                            // <Profilelight width={32} height={32} style={{ resizeMode: "contain", borderRadius: 18 }} />
                            <View
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 17,
                                borderWidth: 2,
                                borderColor: "#A279FA",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow:"hidden",
                              }}
                            >
                              <Image
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 16,
                                }}
                                source={require("../../assets/img/avataricon.png")}
                                resizeMode="cover"
                              />
                            </View>
                            // <Profiledark width={32} height={32} style={{ resizeMode: "contain", borderRadius: 18 }} />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                    {/* <View style={{ width: "100%", alignItems: "center" }} >
                      {theme.theme == "light" ?
                        (
                          <Image source={LLogo} style={{ width: windowWidth * 0.5, height: windowHeight * 0.1 }} resizeMode="contain" />

                        )
                        : (
                          <Image source={DLogo} style={{ width: windowWidth * 0.5, height: windowHeight * 0.1 }} resizeMode="contain" />
                        )
                      }
                    </View> */}
                    {/* <Text style={{ marginLeft: "7.5%", fontSize: RFPercentage(3), color: theme.text, fontFamily: Fonts.Regular, fontWeight: "100" }} >Browser</Text> */}
                  </View>
                  <View style={{width:"90%",alignSelf:"center"}}>
                  <View style={{
                    flexDirection: "row",
                    marginTop: "8%",
                    alignItems: "center",
                    justifyContent:"center",
                    marginBottom: 15,
                    alignSelf: "center",
                  
                  }}>

                  {isKeyboardVisible && PriventKeyboard && (
                  <View style={{ width: "10%",marginRight:5,}}>
          <Pressable
             onPress={() => {
              if (!searchenabled) {
                setKeyboardVisible(false);
                setSearchenabled(false);
                setSearchQuery1("");
              } else {
                setSearchenabled(false);
              }
            }}
            style={{alignItems:"flex-start"}}
          >
            {theme.theme == "light" ? (
              <BackLight
                width={35}
                height={35}
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
                  )}
                  <View style={{ borderRadius: 5,
      backgroundColor: "#fff",
      borderColor: "rgba(162, 121, 250, 0.30)",
      borderWidth: 2,
      width: isKeyboardVisible && PriventKeyboard ?"90%":"100%",
      alignSelf: "center",
      // marginTop: "8%",
      // marginBottom: 15,
      fontFamily: Fonts.Bold,
      fontSize: RFPercentage(2),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",}}>
                    <View
                      style={{
                        width: "70%",
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: "4%",
                    
                      }}
                    >
                      <View>
                        <Pressable
                          onPress={() => redirecttoBrowser("news.google.com")}
                        >
                          {/* <GoogleIcon height={25} width={25} style={{ marginLeft: 5 }} /> */}
                          <Image
                            style={{ width: 25, height: 25, marginRight: 10 }}
                            source={require("../../assets/img/google.png")}
                            resizeMode="contain"
                          />
                        </Pressable>
                      </View>

                      <TextInput
                        value={redirecturl}
                        placeholder="Search or type URL"
                        style={{
                          color: "black",
                          fontFamily: Fonts.Regular,
                          fontSize: RFPercentage(2),
                          width:"85%",
                          
                        }}
                        placeholderTextColor={"rgba(0, 0, 0, 0.30)"}
                        onChangeText={(redirecturl) => setUrl(redirecturl)}
                        returnKeyType="search"
                        caretColor="red"
                        onSubmitEditing={() => {
                          redirecttoBrowser();
                        }}
                      />
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        marginRight: "4%",
                      }}
                    >
                      <Pressable onPress={() => setVoicevisible(true)}>
                        {theme.theme != "light" ? (
                          <Image
                            style={{
                              width: 25,
                              height: 25,
                            }}
                            source={require("../../assets/img/voiceSearch.png")}
                            resizeMode="contain"
                          />
                        ) : (
                          <Image
                            style={{
                              width: 25,
                              height: 25,
                            }}
                            source={require("../../assets/img/voiceSearch.png")}
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
                              width: 25,
                              height: 25,
                              marginLeft: 10,
                            }}
                            source={require("../../assets/img/scan.png")}
                            resizeMode="contain"
                          />
                        ) : (
                          <Image
                            style={{
                              width: 25,
                              height: 25,
                              marginLeft: 10,
                            }}
                            source={require("../../assets/img/scan.png")}
                            resizeMode="contain"
                          />
                        )}
                      </TouchableOpacity>
                    </View>

                    {/* <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        borderColor: theme.theme == "dark" ? "#fff" : "#000",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 21,
                        height: 21,
                        borderRadius: 5,
                        marginRight: 8,
                        backgroundColor: "#fffff",
                      }}
                      onPress={() => {
                        props.navigation.navigate("Dapplatest", {
                          isEnabled: false,
                        });
                      }}
                      disabled={tabLength == 0}
                    >
                      <Text
                        style={{
                          color: theme.theme == "dark" ? "#fff" : "#000",
                          fontSize: RFValue(12),
                        }}
                      >
                        {Number(tabLength) >= 100 ? "D" : tabLength}
                      </Text>
                    </TouchableOpacity> */}
                  </View>
                  </View>
</View>
                  {/* {console.log("dadwdawdwdawdawdadawdaw", PriventKeyboard, isKeyboardVisible)} */}
                  {isKeyboardVisible && PriventKeyboard ? (
                    <SafeAreaView style={style.container}>
                      <ImageBackground
                        source={
                          theme.theme === "dark" ? Images.background : "white"
                        }
                        style={{
                          width: windowWidth,
                          height: windowHeight,
                         
                        }}
                        resizeMode="cover"
                      >
                        <View
                          style={{
                            // justifyContent: "center",
                            height: "100%",
                          
                          }}
                        >
                          {/* <View
                            style={{
                              width: "6%",
                              marginBottom: "1%",
                              alignItems: "flex-start",
                              justifyContent: "flex-start",
                            }}
                          >
                            
                            <Pressable
                              onPress={() => {
                                if (!searchenabled) {
                                  setKeyboardVisible(false);
                                  setSearchenabled(false);
                                  setSearchQuery1("");
                                } else {
                                  setSearchenabled(false);
                                }
                              }}
                            >
                              {theme.theme == "light" ? (
                                <BackLight
                                  width={35}
                                  height={35}
                                  style={{ resizeMode: "contain" }}
                                />
                              ) : (
                                <BackDark
                                  width={28}
                                  height={28}
                                  style={{ resizeMode: "contain" }}
                                />
                              )}
                            </Pressable>
                          </View> */}
                          <View
                            style={{
                              width: "95%",
                              backgroundColor:
                                theme.theme == "light" ? "#f1f1f1" : "transparent",
                              alignItems: "flex-start",
                              alignSelf: "center",
                            }}
                          >
                            {/* <View style={{ width: "100%", height: windowheight * 0.11, borderBottomColor: "gray", borderBottomWidth: 0.5, justifyContent: "space-between" }} > */}
                            {!searchenabled ? (
                              <View
                                style={{
                                  width: "100%",
                                  alignSelf: "center",
                                  justifyContent: "space-evenly",
                                  flexDirection: "row",
                                }}
                              >
                                {/* <View style={{ width: "90%", flexDirection: "row", alignItems: "center", justifyContent: 'space-around', paddingVertical: "2%" }} > */}

                                <Pressable
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
                                </Pressable>

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
                                : theme.theme == "light"
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
                                    setTabName("BookMark");
                                  }}
                                  key={Math.random()}
                                  style={{
                                    width: "30%",
                                    backgroundColor:
                                    TabName == "BookMark"
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
                                      TabName == "BookMark"
                                  ? "white"
                                  : theme.theme == "light"
                                  ? "#612CD2"
                                  : "rgba(255, 255, 255, 0.30)",
                              textAlign: "center",
                              fontFamily:
                              TabName == "BookMark"
                                  ? Fonts.Regular
                                  : Fonts.Regular,
                              fontSize: RFValue(11),
                                    }}
                                  >
                                    Bookmarks
                                  </Text>
                                </Pressable>
                              </View>
                            ) : (
                              <>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <View style={{ width: "100%" }}>
                                    <View
                                      style={{
                                        width: "93%",
                                        backgroundColor:
                                          theme.theme == "light"
                                            ? "rgba(0,0,0,0.09)"
                                            : "gray",
                                        flexDirection: "row",
                                        borderRadius: 30,
                                        alignItems: "center",
                                        alignSelf: "center",
                                        marginLeft: "2%",
                                        paddingVertical: "1%",
                                      }}
                                    >
                                      <Pressable
                                        onPress={() => {
                                          setSearchenabled(false);
                                        }}
                                        style={{ width: "15%" }}
                                      >
                                        {theme.theme == "light" ? (
                                          <SearchIcon
                                            width={20}
                                            height={20}
                                            style={{
                                              alignSelf: "center",
                                              resizeMode: "contain",
                                            }}
                                          />
                                        ) : (
                                          <SearchIconLight
                                            width={20}
                                            height={20}
                                            style={{
                                              alignSelf: "center",
                                              resizeMode: "contain",
                                            }}
                                          />
                                        )}
                                      </Pressable>

                                      <View style={{ width: "73%" }}>
                                        <TextInput
                                          theme={{
                                            colors: {
                                              placeholder:
                                                theme.theme == "light"
                                                  ? "#000"
                                                  : "#fff",
                                              text:
                                                theme.theme == "light"
                                                  ? "#000"
                                                  : "#fff",
                                              primary: "transparent",
                                              underlineColor: "transparent",
                                            },
                                          }}
                                          text={
                                            theme.theme == "light"
                                              ? "#000"
                                              : "#fff"
                                          }
                                          underlineColor="transparent"
                                          style={{
                                            width: "90%",
                                            color:
                                              theme.theme == "light"
                                                ? "#000"
                                                : "#fff",
                                            backgroundColor: "transparent",
                                            borderWidth: 0,
                                            borderRadius: 0,
                                            borderColor: "transparent",
                                            fontSize: RFValue(12),
                                            paddingVertical: "2%",
                                          }}
                                          placeholder="Search History"
                                          returnKeyType="search"
                                          value={searchQuery1}
                                          onChangeText={(e) => {
                                            onChangeSearch(e);
                                          }}
                                          placeholderTextColor={
                                            theme.theme == "light"
                                              ? "#000"
                                              : "#fff"
                                          }
                                          autoFocus
                                        />
                                      </View>

                                      <Pressable
                                        onPress={() => {
                                          setSearchQuery1("");
                                        }}
                                        style={{ width: "12%" }}
                                      >
                                        {searchQuery1.length != 0 && (
                                          <Icn
                                            size={20}
                                            type="material"
                                            color={
                                              theme.theme == "light"
                                                ? "#000"
                                                : "#fff"
                                            }
                                            name="close"
                                          />
                                        )}
                                      </Pressable>
                                    </View>
                                  </View>
                                </View>
                              </>
                            )}
                          </View>

                          {
                            <View style={{ height: "80%", marginTop: "1%" }}>
                              <ScrollView>
                                {TabName == "history" ? (
                                  <View>
                                    {filterdata.length != 0 &&
                                      filterdata.map((item) => {
                                        console.log("item", item);
                                        return (
                                          <>
                                            {item.histories.map((val, i) => {
                                              var url = val.URL.split("/");
                                              var getUrl =
                                                url[0] + "//" + url[2];
                                              return (
                                                <View
                                                  key={Math.random()}
                                                  style={{
                                                    width: "90%",
                                                    alignSelf: "center",
                                                    marginTop: "3%",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    paddingVertical: "1.5%",
                                                  }}
                                                >
                                                  <View
                                                    style={{ width: "15%" }}
                                                  >
                                                    <View
                                                      style={{
                                                        width: 22,
                                                        height: 22, marginTop: 5,backgroundColor:"white",alignItems:"center",justifyContent:"center",borderRadius:5,marginHorizontal:"3%",elevation:1,overflow:"hidden"
                                                      }}
                                                    >
                                                      {/* {!imageErr? */}
                                                      {!errArr.includes(
                                                        val.hostName
                                                      ) ? (
                                                        <Image
                                                          source={{
                                                            uri: `${getUrl}/favicon.ico`,
                                                          }}
                                                          onError={() => {
                                                            if (
                                                              !errArr.includes(
                                                                val.hostName
                                                              )
                                                            ) {
                                                              console.log(
                                                                "errororo",
                                                                val.hostName
                                                              );
                                                              setErrArr([
                                                                ...errArr,
                                                                val.hostName,
                                                              ]);
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
                                                          style={{
                                                            alignSelf: "center",
                                                          }}
                                                        />
                                                      )}
                                                    </View>
                                                  </View>
                                                  <TouchableOpacity
                                                    style={{
                                                      width: "75%",
                                                      height: 30,
                                                      // borderWidth:1
                                                    }}
                                                    onPress={() => {
                                                      redirecttoBrowser(
                                                        val.URL
                                                      );
                                                    }}
                                                  >
                                                    
                                                      <Text
                                                        numberOfLines={1}
                                                        style={{
                                                          fontFamily:
                                                            Fonts.Regular,
                                                          fontSize: RFValue(12),
                                                          color: theme.text,
                                                          marginLeft: "2%",
                                                        }}
                                                      >
                                                        {val.URL}
                                                      </Text>
                                                      <Text
                                                        numberOfLines={1}
                                                        style={{
                                                          fontFamily:
                                                            Fonts.Regular,
                                                          fontSize: RFValue(12),
                                                          color: "gray",
                                                          marginLeft: "2%",
                                                        }}
                                                      >
                                                        {val.hostName}
                                                      </Text>
                                                   
                                                  </TouchableOpacity>

                                                  <Menu
                                                    style={{
                                                      width: "10%",
                                                      alignItems: "flex-end",
                                                    }}
                                                  >
                                                    <MenuTrigger>
                                                      <View>
                                                        {theme.theme ==
                                                        "light" ? (
                                                          <ActiveBookStarLight
                                                            width={
                                                              windowWidth * 0.06
                                                            }
                                                            height={
                                                              windowWidth * 0.06
                                                            }
                                                            style={{
                                                              resizeMode:
                                                                "contain",
                                                              alignSelf:
                                                                "center",
                                                            }}
                                                          />
                                                        ) : (
                                                          <ActiveBookStarDark
                                                            width={
                                                              windowWidth * 0.06
                                                            }
                                                            height={
                                                              windowWidth * 0.06
                                                            }
                                                            style={{
                                                              resizeMode:
                                                                "contain",
                                                              alignSelf:
                                                                "center",
                                                            }}
                                                          />
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
              }}
              resizeMode="cover"
            >
                                                      <MenuOption
                                                        onSelect={() =>
                                                          copyToClipboard(
                                                            val.URL
                                                          )
                                                        }
                                                      >
                                                        <Text
                                                          style={{
                                                            color:theme.theme==="dark"?"white": "black",
                                                            fontFamily:
                                                              Fonts.Regular,
                                                            fontSize:
                                                              RFValue(10),
                                                            marginLeft: "5%",
                                                            paddingVertical:
                                                              "2.5%",
                                                          }}
                                                        >
                                                          Copy link
                                                        </Text>
                                                      </MenuOption>

                                                      <MenuOption
                                                        onSelect={() =>
                                                          customShare(val?.URL)
                                                        }
                                                      >
                                                        <Text
                                                          style={{
                                                            color: theme.theme==="dark"?"white": "black",
                                                            fontFamily:
                                                              Fonts.Regular,
                                                            fontSize:
                                                              RFValue(10),
                                                            marginLeft: "5%",
                                                            paddingVertical:
                                                              "2.5%",
                                                          }}
                                                        >
                                                          Share
                                                        </Text>
                                                      </MenuOption>

                                                      <MenuOption
                                                        onSelect={() =>
                                                          clearData(
                                                            item.id,
                                                            val.Time,
                                                            false
                                                          )
                                                        }
                                                      >
                                                        <Text
                                                          style={{
                                                            color: theme.theme==="dark"?"white": "black",
                                                            fontFamily:
                                                              Fonts.Regular,
                                                            fontSize:
                                                              RFValue(10),
                                                            marginLeft: "5%",
                                                            paddingVertical:
                                                              "2.5%",
                                                          }}
                                                        >
                                                          Delete
                                                        </Text>
                                                      </MenuOption>
                                                      </ImageBackground>
                                                    </MenuOptions>
                                                  </Menu>
                                                </View>
                                              );
                                            })}
                                          </>
                                        );
                                      })}
                                  </View>
                                ) : TabName == "recDeleted" ? (
                                  <View>
                                    {recClosed.length != 0 ? (
                                      recClosed.map((item, ind) => {
                                        var url = item.URL.split("/");
                                        var getUrl = url[0] + "//" + url[2];
                                        return (
                                          <View
                                            key={Math.random()}
                                            style={{
                                              width: "90%",
                                              alignSelf: "center",
                                              marginTop: "3%",
                                              flexDirection: "row",
                                              alignItems: "center",
                                              paddingVertical: "1.5%",
                                            }}
                                          >
                                            <View style={{ width: "15%" }}>
                                              <View
                                                style={{
                                                  width: 22,
                                                  height: 22, marginTop: 5,backgroundColor:"white",alignItems:"center",justifyContent:"center",borderRadius:5,marginHorizontal:"3%",elevation:1,overflow:"hidden"
                                                }}
                                              >
                                                {/* {!imageErr? */}
                                                {!errArr.includes(
                                                  item.hostName
                                                ) ? (
                                                  <Image
                                                    source={{
                                                      uri: `${getUrl}/favicon.ico`,
                                                    }}
                                                    onError={() => {
                                                      if (
                                                        !errArr.includes(
                                                          item.hostName
                                                        )
                                                      ) {
                                                        console.log(
                                                          "errororo",
                                                          item.hostName
                                                        );
                                                        setErrArr([
                                                          ...errArr,
                                                          item.hostName,
                                                        ]);
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
                                                    style={{
                                                      alignSelf: "center",
                                                    }}
                                                  />
                                                )}
                                              </View>
                                            </View>
                                            <TouchableOpacity
                                              style={{
                                                width: "75%",
                                                height: 30,
                                                
                                              }}
                                              onPress={() => {
                                                redirecttoBrowser(item.URL);
                                              }}
                                            >
                                              <View style={{}}>
                                                <Text
                                                  numberOfLines={1}
                                                  style={{
                                                    fontFamily: Fonts.Regular,
                                                    fontSize: RFValue(12),
                                                    color: theme.text,
                                                    marginLeft: "2%",
                                                  }}
                                                >
                                                  {item.URL}
                                                </Text>
                                                <Text
                                                  numberOfLines={1}
                                                  style={{
                                                    fontFamily: Fonts.Regular,
                                                    fontSize: RFValue(12),
                                                    color: "gray",
                                                    marginLeft: "2%",
                                                  }}
                                                >
                                                  {item.hostName}
                                                </Text>
                                              </View>
                                            </TouchableOpacity>

                                            <Menu
                                              style={{
                                                width: "10%",
                                                alignItems: "flex-end",
                                              }}
                                            >
                                              <MenuTrigger>
                                                <View>
                                                  {theme.theme == "light" ? (
                                                    <ActiveBookStarLight
                                                      width={windowWidth * 0.06}
                                                      height={
                                                        windowWidth * 0.06
                                                      }
                                                      style={{
                                                        resizeMode: "contain",
                                                        alignSelf: "center",
                                                      }}
                                                    />
                                                  ) : (
                                                    <ActiveBookStarDark
                                                      width={windowWidth * 0.06}
                                                      height={
                                                        windowWidth * 0.06
                                                      }
                                                      style={{
                                                        resizeMode: "contain",
                                                        alignSelf: "center",
                                                      }}
                                                    />
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
              }}
              resizeMode="cover"
            >
                                                <MenuOption
                                                  onSelect={() =>
                                                    redirecttoBrowser(item.URL)
                                                  }
                                                >
                                                  <Text
                                                    style={{
                                                      color: theme.theme==="dark"?"white": "black",
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
                                                  onSelect={() =>
                                                    copyToClipboard(item.URL)
                                                  }
                                                >
                                                  <Text
                                                    style={{
                                                      color: theme.theme==="dark"?"white": "black",
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
                                                  onSelect={() =>
                                                    customShare(item?.URL)
                                                  }
                                                >
                                                  <Text
                                                    style={{
                                                      color: theme.theme==="dark"?"white": "black",
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
                                                    onRecentCloseDelete(ind)
                                                  }
                                                >
                                                  <Text
                                                    style={{
                                                      color: theme.theme==="dark"?"white": "black",
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
                                        );
                                      })
                                    ) : (
                                      <>
                                        <View
                                          style={{
                                            height: windowHeight * 0.5,
                                            justifyContent: "center",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Text style={{ color: theme.theme==="dark"?"white":"black" }}>
                                            Recently closed is empty
                                          </Text>
                                        </View>
                                      </>
                                    )}
                                  </View>
                                ) : (
                                  <View>
                                    {myfav.length != 0 ? (
                                      _.map(myfav, (item, i) => {
                                        var url = item.url.split("/");
                                        var getUrl = url[0] + "//" + url[2];
                                        return (
                                          <View
                                            style={{
                                              width: "90%",
                                              alignSelf: "center",
                                              marginTop: "3%",
                                              flexDirection: "row",
                                              alignItems: "center",
                                              paddingVertical: "1.5%",
                                              justifyContent:"space-between"
                                            }}
                                            key={Math.random()}
                                          >
                                            <View style={{flexDirection:"row",maxWidth:"70%"}}>
                                            <View style={{ }}>
                                              <Pressable
                                                style={{
                                                  width: 22,
                                                  height: 22, marginTop: 5,backgroundColor:"white",alignItems:"center",justifyContent:"center",borderRadius:5,marginHorizontal:"3%",elevation:1,overflow:"hidden" 
                                                }}
                                                onPress={() =>
                                                  redirectToweb(item)
                                                }
                                              >
                                                {!errArr.includes(
                                                  item.title
                                                ) ? (
                                                  <Image
                                                    source={{
                                                      uri: `${getUrl}/favicon.ico`,
                                                    }}
                                                    onError={() => {
                                                      if (
                                                        !errArr.includes(
                                                          item.title
                                                        )
                                                      ) {
                                                        console.log(
                                                          "errororo",
                                                          item.title
                                                        );
                                                        setErrArr([
                                                          ...errArr,
                                                          item.title,
                                                        ]);
                                                      }
                                                    }}
                                                    style={{
                                                      width: 24,
                                                      height: 24,
                                                      alignSelf: "center",
                                                      // borderRadius: 400 / 5,
                                                    }}
                                                  />
                                                ) : (
                                                  <FaviconIcon
                                                    height={22}
                                                    width={22}
                                                    style={{
                                                      alignSelf: "center",
                                                    }}
                                                  />
                                                )}
                                              </Pressable>
                                            </View>
                                            

<TouchableOpacity
  onPress={() =>
    redirectToweb(item)
  }
  style={{
    height: 30,
    justifyContent: "center",
    marginLeft:5
  }}
>
  <Text
    numberOfLines={1}
    style={{
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(2.2),
      color: theme.text,
      marginTop: 0,
    }}
  >
    {item.siteName}
  </Text>
</TouchableOpacity>

                                            </View>
                                            


                                            {myfav?.find(
                                              (na) => na._id == item._id
                                            ) && (
                                              <Menu
                                                style={{
                                                  width: "10%",
                                                  alignItems: "flex-end",
                                                }}
                                              >
                                                <MenuTrigger>
                                                  <View>
                                                    {theme.theme == "light" ? (
                                                      <ActiveBookStarLight
                                                        width={
                                                          windowWidth * 0.06
                                                        }
                                                        height={
                                                          windowWidth * 0.06
                                                        }
                                                        style={{
                                                          resizeMode: "contain",
                                                          alignSelf: "center",
                                                        }}
                                                      />
                                                    ) : (
                                                      <ActiveBookStarDark
                                                        width={
                                                          windowWidth * 0.06
                                                        }
                                                        height={
                                                          windowWidth * 0.06
                                                        }
                                                        style={{
                                                          resizeMode: "contain",
                                                          alignSelf: "center",
                                                        }}
                                                      />
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
              }}
              resizeMode="cover"
            >
                                                  <MenuOption
                                                    onSelect={() =>
                                                      redirectToweb(item)
                                                    }
                                                  >
                                                    <Text
                                                      style={{
                                                        color: theme.theme==="dark"?"white": "black",
                                                        fontFamily:
                                                          Fonts.Regular,
                                                        fontSize: RFValue(10),
                                                        marginLeft: "5%",
                                                        paddingVertical: "2.5%",
                                                      }}
                                                    >
                                                      Open in new tab
                                                    </Text>
                                                  </MenuOption>

                                                  <MenuOption
                                                    onSelect={() =>
                                                      copyToClipboard(item?.url)
                                                    }
                                                  >
                                                    <Text
                                                      style={{
                                                        color: theme.theme==="dark"?"white": "black",
                                                        fontFamily:
                                                          Fonts.Regular,
                                                        fontSize: RFValue(10),
                                                        marginLeft: "5%",
                                                        paddingVertical: "2.5%",
                                                      }}
                                                    >
                                                      Copy link
                                                    </Text>
                                                  </MenuOption>

                                                  <MenuOption
                                                    onSelect={() =>
                                                      customShare(item?.url)
                                                    }
                                                  >
                                                    <Text
                                                      style={{
                                                        color: theme.theme==="dark"?"white": "black",
                                                        fontFamily:
                                                          Fonts.Regular,
                                                        fontSize: RFValue(10),
                                                        marginLeft: "5%",
                                                        paddingVertical: "2.5%",
                                                      }}
                                                    >
                                                      Share
                                                    </Text>
                                                  </MenuOption>

                                                  <MenuOption
                                                    onSelect={() => {
                                                      setOptionValue(item);
                                                      setRenamemodal(true);
                                                    }}
                                                  >
                                                    <Text
                                                      style={{
                                                        color: theme.theme==="dark"?"white": "black",
                                                        fontFamily:
                                                          Fonts.Regular,
                                                        fontSize: RFValue(10),
                                                        marginLeft: "5%",
                                                        paddingVertical: "2.5%",
                                                      }}
                                                    >
                                                      Rename
                                                    </Text>
                                                  </MenuOption>

                                                  <MenuOption
                                                    onSelect={() =>
                                                      remove_favourite(
                                                        item?._id
                                                      )
                                                    }
                                                  >
                                                    <Text
                                                      style={{
                                                        color:theme.theme==="dark"?"white": "black",
                                                        fontFamily:
                                                          Fonts.Regular,
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
                                            )}
                                          </View>
                                        );
                                      })
                                    ) : (
                                      <>
                                        <View
                                          style={{
                                            height: windowHeight * 0.5,
                                            justifyContent: "center",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Text style={{ color: theme.theme==="dark"?"white":"black" }}>
                                            Bookmarks is empty
                                          </Text>
                                        </View>
                                      </>
                                    )}
                                  </View>
                                )}
                              </ScrollView>
                            </View>
                          }
                        </View>
                      </ImageBackground>
                    </SafeAreaView>
                  ) : (
                    <>
                      <View
                        style={{
                          width: "90%",
                          alignSelf: "center",
                          justifyContent: "space-between",
                          flexDirection: "row",
                        }}
                      >
                        <Pressable
                          onPress={() => {
                            setTabIndex("Rss");
                          }}
                          key={Math.random()}
                          style={{
                            width: "49%",
                            backgroundColor:
                              tabindex == "Rss"
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
                                tabindex == "Rss"
                                  ? "white"
                                  : theme.theme == "dark"
                                  ? "rgba(255, 255, 255, 0.30)"
                                  : "#612CD2",
                              textAlign: "center",
                              fontFamily:
                                tabindex == "Rss" ? Fonts.Regular : Fonts.Regular,
                              fontSize: RFValue(12),
                            }}
                          >
                            Headlines
                          </Text>
                        </Pressable>

                        <Pressable
                          onPress={() => {
                            setTabIndex("ReadLater");
                          }}
                          key={Math.random()}
                          style={{
                            width: "49%",
                            backgroundColor:
                              tabindex == "ReadLater"
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
                                tabindex == "ReadLater"
                                  ? "white"
                                  : theme.theme == "dark"
                                  ? "rgba(255, 255, 255, 0.30)"
                                  : "#612CD2",
                              textAlign: "center",
                              fontFamily:
                                tabindex == "ReadLater"
                                  ? Fonts.Regular
                                  : Fonts.Regular,
                              fontSize: RFValue(12),
                            }}
                          >
                            Read Later
                          </Text>
                        </Pressable>
                      </View>

                      {refreshing ? (
                        <>
                          <View style={{height:400,justifyContent:"center",alignItems:"center",}}>
                            <ActivityIndicator
                              size="large"
                              color={theme.theme == "light" ? "#000" : "#fff"}
                            />
                          </View>
                        </>
                      ) : tabindex == "Rss" ? (
                        rssList?.length == 0 ? (
                          <>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "60%",
                                marginTop: "10%",
                              }}
                            >
                              <View>
                                <View>
                                  <Text
                                    style={{
                                      fontFamily: Fonts.Regular,
                                      fontSize: RFPercentage(2.2),
                                      color: "#fff",
                                      width: "100%",
                                      textAlign: "center",
                                    }}
                                  >
                                    Rss is Empty
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </>
                        ) : (
                          <>
                            <View
                              style={{
                                backgroundColor: "transparent",
                                width: "100%",
                                padding: "2.5%",
                                height: "68%",
                                marginTop: "1%",
                                paddingBottom:"18%",
                              }}
                            >
                              <View
                                nestedScrollEnabled={true}
                                refreshControl={
                                  <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={() => {
                                      getRssUrl();
                                      setSkeleton(true);
                                      setSwapdatas(true);
                                    }}
                                    style={{ fontFamily: Fonts.Regular }}
                                  />
                                }
                              >
                                {_.map(rssList, (item, i) => {
                                  // console.log('item', JSON.stringify(item, null, 2))
                                  const domainName =
                                    item?.links?.[0]?.url
                                      ?.match(/^(?:https?:\/\/)?([^/]+)/)?.[1]
                                      ?.split('.')
                                      .slice(-2)
                                      .join('.')
                                      .replace(/^\w/, c => c.toUpperCase()) ?? '';
                                  const description = item?.description || item?.content
                                  const parsedDescription = description ? parseHtmlString(description) : '';
                                  const URL = item?.enclosures[0]?.url
                                  return (
                                    <RssReaderList
                                      ImageUrl={URL}
                                      RssTitle={item.title}
                                      parsedDescription={parsedDescription}
                                      domainName={domainName}
                                      publishedAt={item.published}
                                      RssUrl={item?.links[0]?.url}
                                      redirecttoBrowser={redirecttoBrowser}
                                      AddReadLater={AddReadLater}
                                      readLater={readLaterArr?.filter(val => val.RssUrl == item?.links[0]?.url)?.length != 0 ?? false}
                                      deleteReadLater={deleteReadLater}
                                    />
                                  );
                                })}
                              </View>
                            </View>
                          </>
                        )
                      ) : readLaterArr.length != 0 ? (
                        <>
                          <View
                            style={{
                              backgroundColor: "transparent",
                              width: "100%",
                              padding: "2.5%",
                              height: "60%",
                              marginTop: "1%",
                              paddingBottom:"18%",
                            }}
                          >
                            <View
                              showsVerticalScrollIndicator={false}
                              nestedScrollEnabled={true}
                            >
                              {_.map(readLaterArr, (item, i) => {
                                return (
                                  <RssReaderList
                                    ImageUrl={item.ImageUrl}
                                    RssTitle={item.RssTitle}
                                    parsedDescription={item.parsedDescription}
                                    domainName={item.domainName}
                                    publishedAt={item.publishedAt}
                                    RssUrl={item?.RssUrl}
                                    redirecttoBrowser={redirecttoBrowser}
                                    AddReadLater={AddReadLater}
                                    readLater={true}
                                    deleteReadLater={deleteReadLater}
                                  />
                                );
                              })}
                            </View>
                          </View>
                        </>
                      ) : (
                        <>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "60%",
                              marginTop: "10%",
                            }}
                          >
                            <View>
                              <View>
                                <Text
                                  style={{
                                    fontFamily: Fonts.Regular,
                                    fontSize: RFPercentage(2.2),
                                    color: theme.text,
                                    width: "100%",
                                    textAlign: "center",
                                  }}
                                >
                                  Read later is empty
                                </Text>
                              </View>
                            </View>
                          </View>
                        </>
                      )}
                    </>
                  )}
                </>
              )}

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
                    <View
                      style={{ padding: 10, alignItems: "flex-end" }}
                    ></View>
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

              {/* <Modal
                isVisible={isModalVisible1}
                entry="bottom"
                backdropPressToClose={true}
                visible={isModalVisible1}
                backdropColor={"#989898"}
                transparent={true}

              >
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" }} >
                <Pressable onPress={() => {
                      setModalVisible2(prevIsModalVisible => !prevIsModalVisible)
                    }}>
                    <View
                      style={{
                        height: windowHeight * 0.4,
                        alignSelf: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "80%",
                        backgroundColor:theme.theme==="dark"?"rgba(155, 124, 220, 0.15)": "#EDEDED",
                        borderRadius: 5,
                        paddingBottom: 5,
                      }}
                    >
                      <TouchableOpacity
                  style={style.buttonClose}
                  onPress={() => {
                    setModalVisible2(prevIsModalVisible => !prevIsModalVisible)
                  }}
                >
                  <Text style={style.createTextX}>X</Text>
                </TouchableOpacity>
                      <View style={{ alignItems: "center" }}>
                      {theme.theme === "dark" ? (
                    <Image
                      style={{ width: windowWidth * 0.4, height: windowHeight * 2,marginBottom:20}}
                      source={require("../../assets/img/model_image.png")}
                      resizeMode="contain"
                    />
                  ) : (
                    <Image
                      style={{ width: windowWidth * 0.4, height: windowHeight * 0.2,marginBottom:20 }}
                      source={require("../../assets/img/model_image_light.png")}
                      resizeMode="contain"
                    />
                  )}
                        <Text
                          style={style.modelText}
                        >
                          {modalMessage}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                                </View>
              </Modal> */}
              {modalVisible && (
          <ImageBackground
            source={theme.theme === "light" ? "transparent" : Images.background}
            style={{
              width: windowWidth,
              height: windowheight,
              paddingTop: StatusBar.windowheight,
              position: "absolute",
              backgroundColor:
                theme.theme === "light"
                  ? "rgba(68, 68, 68, 0.95)"
                  : "transparent",
            }}
            resizeMode="cover"
          >
            <View style={style.modelContainer}>
              <View style={style.centeredView}>
                <TouchableOpacity
                  style={style.buttonClose}
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <Text style={style.createTextX}>X</Text>
                </TouchableOpacity>
                <View style={style.modalView}>
                  {theme.theme === "dark" ? (
                    <Image
                      style={{ width: "80%",height:"70%", marginLeft:"10%"}}
                      source={require("../../assets/img/model_image.png")}
                      resizeMode="contain"
                    />
                  ) : (
                    <Image
                      style={{ width: "80%",height:"70%", marginLeft:"10%"}}
                      source={require("../../assets/img/model_image_light.png")}
                      resizeMode="contain"
                    />
                  )}

                  <Text style={style.createText}>{modalMessage}</Text>
                  <Text style={style.modelText}>{modalMessage2}</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        )}


              <Modal
                transparent={true}
                visible={renamemodal}
                animationType="fade"
              >
                <View
                  onStartShouldSetResponder={() => {
                    setRenamemodal(false);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor:"rgba(9, 3, 22, 0.90)",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor:theme.theme==="dark" ? "rgba(155, 124, 220, 0.411)":"#f1f1f1", borderRadius: 5,borderColor:"rgba(162, 121, 250, 0.30)",borderWidth:2,alignSelf: "center",
                      width: "75%",
                      justifyContent: "space-evenly",
                      paddingVertical: "10%",
                    }}
                  >
                    <Pressable
                      style={{
                        padding: 10,
                        alignItems: "flex-end",
                        position: "absolute",
                        right: 10,
                        top: 5,
                      }}
                      onPress={() => {
                        setRenamemodal(false);
                      }}
                    >
                      <View>
                        {theme.theme == "light" ? (
                          <Close fill="#000" width={18} height={18} />
                        ) : (
                          <Close fill="#fff" width={18} height={18} />
                        )}
                      </View>
                    </Pressable>
                    <Text
                      style={{
                        color: theme.theme==="dark"?"white":"black",
                        fontFamily: Fonts.Medium,
                        fontSize: RFValue(15),
                        textAlign: "center",
                        fontWeight:"bold"
                      }}
                    >
                      Edit bookmark
                    </Text>
                    <View
                      style={{
                        borderWidth: 2,
                        borderColor: "rgba(162, 121, 250, 0.30)",
                        width: "90%",
                        alignSelf: "center",
                        borderRadius: 5,
                        marginTop: "7.5%",
                        backgroundColor:"rgba(155, 124, 220, 0.15)",
                      }}
                    >
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
                        onChangeText={(e) => {
                          setOptionValue({ ...optionValue, siteName: e });
                        }}
                      />
                    </View>
                    {isEmpty(optionValue?.siteName) && (
                      <Text
                        style={{
                          color: "red",
                          fontFamily: Fonts.Medium,
                          paddingHorizontal: "5.5%",
                          fontSize: RFValue(12),
                          textAlign: "left",
                        }}
                      >
                        Please Enter Bookmark Name
                      </Text>
                    )}
                    <Pressable
                      onPress={() => {
                        if (isEmpty(optionValue?.siteName)) return;
                        changeFavName();
                        setRenamemodal(false);
                      }}
                      style={{
                        width: "75%",
                        paddingVertical: "2.5%",
                        alignSelf: "center",
                        borderWidth: 1,
                        borderColor: theme.theme==="dark"?"#FFF600":"#612CD2",
                        backgroundColor:theme.theme==="dark"?"#FFF600":"#612CD2",
                        borderRadius: 5,
                        marginTop: "7.5%",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: RFValue(12),
                          fontFamily: Fonts.Regular,
                          textAlign: "center",
                          color: theme.theme==="light"?"white":"black",
                        }}
                      >
                        Rename
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
              </ScrollView>
              
            </ImageBackground>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Dapp;

const styles = (theme,isKeyboardVisible, PriventKeyboard ) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
    },
    custsearch: {
      borderRadius: 5,
      backgroundColor: "#fff",
      borderColor: "rgba(162, 121, 250, 0.30)",
      borderWidth: 2,
      width: (isKeyboardVisible && PriventKeyboard)?"":"100%",
      alignSelf: "center",
      marginTop: "8%",
      marginBottom: 15,
      fontFamily: Fonts.Bold,
      fontSize: RFPercentage(2),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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

    buttonClose: {
      position: "absolute",
      right: 5,
      top: 5,
      borderRadius: 2,
      borderWidth: 2,
      borderColor: "rgba(162, 121, 250, 0.30)",
      backgroundColor:
        theme.theme === "dark" ? "rgba(155, 124, 220, 0.15)" : "#612CD2",
      justifyContent: "center",
      textAlign: "center",
      width: 42,
      height: 42,
    },
    modelContainer: {
      position: "absolute",
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    centeredView: {
      position: "relative",
      width: "75%",
      height: "50%",
      borderRadius: 5,
      borderWidth: 2,
      borderColor: "rgba(162, 121, 250, 0.30)",
      backgroundColor:
        theme.theme === "light" ? "#EDEDED" : "rgba(155, 124, 220, 0.15)",
    },
    modalView: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    createText: {
      color: theme.theme === "dark" ? "white" : "#000000",
      textAlign: "center",
      fontSize: RFPercentage(3),
      fontFamily: Fonts.Bold,
      marginBottom: 5,
      fontWeight:"bold"
    },

    modelText: {
      color: theme.theme === "dark" ? "#FFF600" : "#612CD2",
      textAlign: "center",
      fontSize: RFPercentage(3),
      fontFamily: Fonts.Bold,
      textShadowColor: theme.theme === "light" ? "#000" : "#612CD2",
      textShadowOffset: { width: -1.5, height: 2.5 },
      textShadowRadius: 1,
      width:"100%",
      fontWeight:"bold"
      // textShadowColor: theme.theme === "light" ? "black" : "#612CD2",
      // textShadowOffset: { width: -2, height: 2.5 },
      // textShadowRadius: 2,
    },
    createTextX: {
      color: theme.theme === "dark" ? "white" : "white",
      textAlign: "center",
      fontSize: RFPercentage(3),
      fontFamily: Fonts.Bold,
    },
    buttonClose: {
      position: "absolute",
      right: 5,
      top: 5,
      borderRadius: 2,
      borderWidth: 2,
      borderColor: "rgba(162, 121, 250, 0.30)",
      backgroundColor:
        theme.theme === "dark" ? "rgba(155, 124, 220, 0.15)" : "#612CD2",
      justifyContent: "center",
      textAlign: "center",
      width: 42,
      height: 42,
    },
  });
