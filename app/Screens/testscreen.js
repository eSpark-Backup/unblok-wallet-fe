import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { Dimensions, Text, View, Image, ScrollView, TextInput, Pressable, Animated, StyleSheet, Touchable, FlatList, SafeAreaView, ImageBackground, Platform } from 'react-native';
import { borderRadius, windowWidth, windowheight } from '../utils/Dimensions';
import { Fonts } from '../utils/Fonts';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import Searchdark from '../assets/icons/darktheme/Search.svg'
import Searchlight from '../assets/icons/lighttheme/Search.svg'
import Icon from 'react-native-vector-icons/Ionicons'
import themeContext from '../utils/themeContext';
import Modal from "react-native-modal";
import Iiconlight from "../assets/icons/lighttheme/About us.svg";
import IiconDark from "../assets/icons/darktheme/About us.svg";
import { TouchableOpacity } from 'react-native';
import TokenClient from '../api/TokenClient';
import { ApiConstants } from '../api/ApiConstants';
import axios from 'axios';
import { getDapphistory } from './DappScreens/common/D_app';
import { useFocusEffect } from '@react-navigation/native';
import getRealm from '../localDb/RealmConfig';
import { Toastfn } from '../utils/toast';
import { Getmultitabs, SetSearchUrl, Updateweburl, selecteTab, setActiveTabId } from '../Redux/Actions/DapplatetsActions';
import { useDispatch } from 'react-redux';
import FaviconIcon from '../assets/icons/darktheme/Favicon for App.svg';
import SearchIcon from '../assets/icons/lighttheme/Search_history.svg'
import SearchIconLight from '../assets/icons/darktheme/Search_history.svg'
import { Icon as Icn } from "react-native-elements";
import OptionPopup from './OtherPages/OptionPopup';
import isEmpty from '../utils/isEmpty';
import BackDark from '../assets/icons/darktheme/Back arrow.svg'
import BackLight from '../assets/icons/lighttheme/Back arrow.svg'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import ActiveBookStarLight from '../assets/icons/lighttheme/Trippledots.svg'
import ActiveBookStarDark from '../assets/icons/darktheme/Trippledots.svg'
import DeleteIconDark from '../assets/icons/darktheme/Delete.svg'
import DeleteIconLight from '../assets/icons/lighttheme/Delete.svg'
import { copyToClipboard, customShare } from '../utils/common';
import { Images } from '../utils/Images';

const Testscreen = (props) => {
    console.log("propopor",props);
    // console.log("history datat",JSON.stringify(props.datas,null,2));
    const [searchenabled, setSearchenabled] = useState(false)
    const theme = useContext(themeContext);
    const style = styles(theme);
    const [isModalVisible, setIsModalVisible] = useState(false)
    const deviceHeight = Dimensions.get("window").height
    const deviceWidth = Dimensions.get("window").width
    const [historyData, setHistoryData] = useState([])
    const [mailAddress,setMailaddress]=useState("")
    const [errArr,setErrArr]=useState([])
    const [showSearch,setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [skip,setSkip]=useState(0);
    const [stopLoad,setstopLoad]=useState(false)
    const [count,setCount]=useState()
    const [openPopup, setOpenPopup] = useState(false);
    const [optionValue, setOptionValue] = useState({});
    
  const [imageErr,setImageErr]=useState(false)

  const dispatch = useDispatch()

  const setwebUrl = (item) => dispatch(Updateweburl(item))
  const setsearchUrl = (item) => dispatch(SetSearchUrl(item))
  const setActivetabid = (item) => dispatch(setActiveTabId(item))
  const Multitabsdata = (item) => dispatch(Getmultitabs(item))
  const onChangeSearch = (query) => setSearchQuery(query)
  const selecteATab = (item) => dispatch(selecteTab(item))


  const filterFunction = () => { 
    console.log("fefefeefe");
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
    // console.log("filteredHistories",filteredHistories);
    return filteredHistories
   }

  const filterdata = searchQuery ? filterFunction(): historyData;

   useEffect(()=>{
    getHistoryFunc()
   },[])

    // useFocusEffect(
    //   useCallback(()=>{
    //     getHistoryFunc()
    //   },[])
    // )

  {/**Get history by mailAddress */ }
  const getHistoryFunc = async (data,EmptyArr) => {
    console.log("awddwdaw",data,skip,EmptyArr);
    getRealm()
    .then((realm)=>{
      var getMail = realm.objects("loginStatus");
      setMailaddress(getMail[0].mail)
      var params = { mailAddress: getMail[0].mail,skip: EmptyArr?data:skip ,limit:15 }
      console.log("params",params);
      getDapphistory(params)
      .then((ress) => {
        console.log("resslslls",ress.data);
        // console.log('ress.data.data1111', JSON.stringify(ress.data.data, null, 2))
        // console.log('Hissssssssssssssssssssss', JSON.stringify(historyData, null, 2))
        // ress?.data?.data?.map((val) => {
        //   return val.histories = val.histories.reverse();
        // })

        setstopLoad(ress.data.data.length == 0)
        if(ress.data.success) {
          setSkip(skip+15);
          setCount(ress.data.totalCount)
          if(isEmpty(historyData) || EmptyArr) {setHistoryData(ress?.data?.data);}
          else {
            if(historyData[historyData.length - 1]._id == ress.data.data[0]._id ){
              var getData = [...historyData]
              getData[getData.length - 1].histories = [...getData[getData.length - 1].histories,...ress.data.data[0].histories]
              // console.log('getDatagetData', JSON.stringify(getData, null, 2))
              getData=[...getData,...ress.data.data.slice(1,ress.data.data.length)]
              setHistoryData(getData)
              
            } else {setHistoryData([...historyData,...ress?.data?.data])}
          }
          
        }else{
          setCount(0)
          setstopLoad(true)
        }
      })
      .catch((err) => {
        console.log("erroro on gethistory", err);
      })
    })
    .catch((err)=>{
      console.log("errro on get history function",err);
    })
    
  }

    const clearData = async (id, time, action)=>{
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
              setSkip(0)
              getHistoryFunc(0,true)
              
            } else {
              Toastfn(resp?.data?.msg)
            }
            setIsModalVisible(false)
          } catch (error) {
            console.log("erororo on clear history", error);
          }

    }

    const pressHistory = (val) => {
      if(props.multitab) props.setMultitab(false);
      setwebUrl(val.URL)
      setsearchUrl(val.URL)
      props.setHistory(false)
  }


  const redirectToweb = async (item) => {
    var setObj = { URL: item.URL, hostName: item.hostName, id: '0' }
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
        props.setHistory(false)
        if(props.multitab) props.setMultitab(false);
    // props.navigation.navigate('Dapplatest')
}


const imageSource = theme.theme === "dark"
? require("../assets/img/menueBackgroundDark.png")
: require("../assets/img/menueBackgroung.png");
    console.log("filterdata",JSON.stringify(filterdata,null,2));
    return (
        <SafeAreaView style={{ flex: 1,backgroundColor:theme.background}} >
          <ImageBackground
              source={theme.theme === "dark" ? Images.background : Images.backgroundWhite}
              style={{
                width: windowWidth,
                height: windowheight,
                paddingTop:"2%"
                
              }}
              resizeMode="cover"
            >
          <OptionPopup openPopup={openPopup} setOpenPopup={setOpenPopup} value={optionValue} redirectToweb={pressHistory} setOptionValue={setOptionValue} />
          <View style={{width:"95%",justifyContent:"space-around",flexDirection:"row",height:80,alignItems:"center",alignSelf:"center",
       
        }}>
            <View >

          <Pressable onPress={() => props.setHistory(false)}>
                            {theme.theme == "light" ?
                                <BackLight width={25} height={25} style={{ resizeMode: "contain",marginTop:"3.3%" }} />

                                :
                                <BackDark width={25} height={25} style={{ resizeMode: "contain",marginTop:"3.3%"  }} />}
                        </Pressable>
            </View>

         
             
                    
                         
                          
                           <View style={{ width: "75%",marginRight:"3%"}} >
                               <View style={{ width: "100%", alignSelf: "center", backgroundColor:theme.theme==="dark"?"rgba(155, 124, 220, 0.15)":"rrgba(162, 121, 250, 0.10)",borderRadius:5, flexDirection: "row", paddingVertical: "2.5%", alignItems: "center",}} >
                                   <View style={{ width: "15%" }} >
                                       {theme.theme == "light" ?
                                           <SearchIcon width={16} height={16} style={{ alignSelf: "center", resizeMode: "contain" }} />
                                           :
                                           <SearchIconLight width={16} height={16} style={{ alignSelf: "center", resizeMode: "contain" }} />
                                       }
                                   </View>

                                   <View style={{ width: "70%" }} >
                                   <TextInput
                               theme={{ colors: { placeholder: theme.theme == "light" ? "#000" : "#fff", text: theme.theme == "light" ? "#000" : "#fff", primary: "transparent", underlineColor: 'transparent', } }}
                               text={theme.theme == "light" ? "#612CD2" : "#612CD2"}
                               underlineColor='transparent'
                               style={{ width: "90%", color: theme.theme == "light" ? "#000" : "#fff", backgroundColor: "transparent", borderWidth: 0, borderRadius: 0, borderColor: "transparent", fontSize: RFValue(12), paddingVertical: "2%" }}
                               placeholder="Search History"
                               returnKeyType="search"
                               value={searchQuery}
                               onChangeText={(e) => { onChangeSearch(e) }}
                               placeholderTextColor={theme.theme == "light" ? "#A279FA" : "#A279FA"}
                               autoFocus
                           />
                                   </View>

                                   <Pressable onPress={() => { setSearchQuery("") }} style={{ width: "15%" }} >
                                       {searchQuery.length != 0 && <Icn size={20} type="material" color={theme.theme == "light" ? "#A279FA" : "#A279FA"} name="close" />}
                                   </Pressable>
                               </View>
                           </View>
                               <View>

                               <Pressable onPress={()=>setIsModalVisible(true)}  >
                               {theme.theme == "dark" ?
                               <DeleteIconDark width={22} height={22} style={{  resizeMode: "contain",marginRight:"3%" }} />
                               :
                               <DeleteIconLight width={22} height={22} style={{  resizeMode: "contain",marginRight:"3%" }} />
                           }
                            
                               </Pressable>
                               </View>
                               
                         
                       
                      
                   {/* <Pressable onPress={() => {
                  
                   }} elevation={1} style={{ borderWidth: 0, marginLeft: 10, paddingHorizontal: 10, width: "75%", height: "70%", backgroundColor: theme.theme == "light" ? "#fff" : "gray", borderRadius: borderRadius * 1, flexDirection: "row" }} >
                       <View style={{ width: "10%", height: "100%", justifyContent: "center", paddingHorizontal: 20, borderWidth: 0 }} >
                           {theme.theme == "light" ?
                               <SearchIcon width={20} height={20} style={{ alignSelf: "center", resizeMode: "contain" }} />
                               :
                               <SearchIconLight width={20} height={20} style={{ alignSelf: "center", resizeMode: "contain" }} />
                           }
                       </View>
                       <View style={{ flexDirection: "row", alignItems: "center", width: "85%", backgroundColor: "transparent", height: "100%", justifyContent: "center", borderWidth: 0, borderColor: "transparent", elevation: 0 }} >
                           <TextInput
                               theme={{ colors: { placeholder: theme.theme == "light" ? "#000" : "#fff", text: theme.theme == "light" ? "#000" : "#fff", primary: "transparent", underlineColor: 'transparent', } }}
                               text={theme.theme == "light" ? "#000" : "#fff"}
                               underlineColor='transparent'
                               style={{ width: "90%", color: theme.theme == "light" ? "#000" : "#fff", backgroundColor: "transparent", borderWidth: 0, borderRadius: 0, borderColor: "transparent", fontSize: RFValue(12), paddingVertical: "2%" }}
                               placeholder="Search History"
                               returnKeyType="search"
                               value={searchQuery}
                               onChangeText={(e) => { onChangeSearch(e) }}
                               placeholderTextColor={theme.theme == "light" ? "#000" : "#fff"}
                               autoFocus
                           />
                           <Pressable style={{ marginLeft: 0 }} onPress={() => { setSearchQuery("") }}>
                               <Icn size={20} type="material" color={theme.theme == "light" ? "#000" : "#fff"} name="close" />
                           </Pressable>
                       </View>


                   </Pressable>

                   <Pressable onPress={() =>{setSearchenabled(false)}} style={{ marginLeft: "5%" }} >
                       <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Cancel</Text>
                   </Pressable> */}


                     
          </View>
          <Image
                      style={{ width: "100%",height:1.8 }}
                      source={require("../assets/img/devider.png")}
                      resizeMode="contain"
                    />
         
                <>
               
                          {console.log("stopLoad",stopLoad)}
                    <FlatList 
                      data={filterdata}
                      showsVerticalScrollIndicator={false}
                      onEndReached={()=>{ if(!stopLoad) getHistoryFunc();}}
                      renderItem={({item})=>{
                        // console.log("histrprpr",item);
                        return(
                          <>
                                    {item.histories.length != 0 && <Text key={Math.random()} style={{ fontFamily: Fonts.Medium, fontSize: RFValue(11), color:theme.text, marginLeft: "5%", marginTop: "5%" }}>{new Date(item._id).toDateString()}</Text>}
                                    {item.histories.map((val,i) =>{ 
                                      var url = val.URL.split( '/' );
                                      var getUrl = url[0]+'//'+url[2];
                                      // setImageErr(false)
                                      return(
                                        <View key={Math.random()} style={{ width: "90%", alignSelf: "center", marginTop: "4%", flexDirection: "row", alignItems: "center", paddingVertical: "0.75%" }} >
                                            
                                            <View style={{ width: "15%" }} >
                                                <View  style={{ justifyContent: "center", width: 21, height: 21,borderRadius:5,backgroundColor:"white",overflow:"hidden",elevation:1 }} >
                                                    {/* {!imageErr? */}
                                                    {!errArr.includes(val.hostName) ?
                                                     <Image source={{uri:`${getUrl}/favicon.ico`}}
                                                     onError={()=>{
                                                      if(!errArr.includes(val.hostName)){
                                                        console.log("errororo",val.hostName);
                                                        setErrArr([...errArr,val.hostName])
                                                      }
                                                      }} style={{ width: 22, height: 22, alignSelf: "center" }}/>
                                                    : 
                                                    <FaviconIcon height={20} width={20} style={{ alignSelf: "center" }}/>
                                                    }
                                                    {/* :
                                                    <Image source={require('../assets/img/appicon.png')}  style={{ width: 22, height: 22, alignSelf: "center" }}/>} */}
                                                </View>
                                            </View>
                                            <TouchableOpacity  style={{ width: "75%", height: 30 }}  onPress={()=>{pressHistory(val)}}>
                                            <View style={{width:"80%"}}>
                                                <Text numberOfLines={1} style={{ fontFamily: Fonts.Regular, fontSize: RFValue(12), color: theme.theme==="dark"?"white":"black", marginLeft: "2%" }}>{val.URL}</Text>
                                                <Text numberOfLines={1} style={{ fontFamily: Fonts.Regular, fontSize: RFValue(12), color:theme.theme==="dark"? "rgba(255, 255, 255, 0.20)":"rgba(0, 0, 0, 0.20)", marginLeft: "2%" }}>{val.hostName}</Text>
                                            </View>
                                            </TouchableOpacity>

                                                <Menu style={{ width: "10%", alignItems: "flex-end", }}  >
                                <MenuTrigger >
                                  <View >
                                    {theme.theme == 'light' ?
                                      <ActiveBookStarLight width={windowWidth * 0.06} height={windowWidth * 0.06} style={{ resizeMode: "contain", alignSelf: "center" }} /> :
                                      <ActiveBookStarDark width={windowWidth * 0.06} height={windowWidth * 0.06} style={{ resizeMode: "contain", alignSelf: "center" }} />
                                    }
                                  </View>
                                </MenuTrigger>
                                <MenuOptions  optionsContainerStyle={{
                                backgroundColor:"transparent",
                                width: "30%",
                                
                              }}>
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
                                  <MenuOption onSelect={() => redirectToweb(val)}>
                                    <Text style={{ color:theme.theme==="light"? "#000":"#fff",
                                    fontFamily: Fonts.Regular,
                                    fontSize: RFValue(10),
                                    marginLeft: "5%",
                                    paddingVertical: "2.5%", }} >Open in new tab</Text>
                                  </MenuOption>

                                  <MenuOption onSelect={() => copyToClipboard(val.URL)}>
                                    <Text style={{ color:theme.theme==="light"? "#000":"#fff",
                                    fontFamily: Fonts.Regular,
                                    fontSize: RFValue(10),
                                    marginLeft: "5%",
                                    paddingVertical: "2.5%", }} >Copy link</Text>
                                  </MenuOption>

                                  <MenuOption onSelect={() => customShare(val.URL)}>
                                    <Text style={{ color:theme.theme==="light"? "#000":"#fff",
                                    fontFamily: Fonts.Regular,
                                    fontSize: RFValue(10),
                                    marginLeft: "5%",
                                    paddingVertical: "2.5%", }} >Share</Text>
                                  </MenuOption>

                                  <MenuOption onSelect={() => clearData(item.id,val.Time,false)}>
                                    <Text style={{ color:theme.theme==="light"? "#000":"#fff",
                                    fontFamily: Fonts.Regular,
                                    fontSize: RFValue(10),
                                    marginLeft: "5%",
                                    paddingVertical: "2.5%",}} >Delete</Text>
                                  </MenuOption>
</ImageBackground>
                                </MenuOptions>
                              </Menu>
                                            </View>
                                    )})}
                                    </>
                        )
                      }}
                    />
                    </>
                 {/* :
                <>
                    <View style={{ width: "100%", height: windowheight * 0.075, justifyContent: "center", }} >
                    <View style={{ overflow: 'hidden' }}>
                            <View style={{ height: windowheight * 0.06,alignSelf: "center", backgroundColor: 'rgba(125,125,125,0.2)', borderRadius: 50, flexDirection: "row", alignItems: "center",width:"90%" }}>
                                <Pressable onPress={() => setSearchenabled(false)} style={{ width: "12.5%", }} >
                                    <Icon name='ios-arrow-back' size={25} color={theme.text} style={{ alignSelf: "center" }} />
                                </Pressable>
                                <View style={{ width: "80%", }} >
                                    <TextInput
                                        autoFocus={true}
                                        placeholder='Search'
                                        placeholderTextColor={"gray"}
                                        style={{ fontFamily: Fonts.Regular, fontSize: RFValue(12), color: theme.text, marginLeft: "2%"}}
                                    />
                                </View>
                            </View>
                        </View>

                    </View>
                    <View style={{ height: "90%", }} >
                        <ScrollView showsVerticalScrollIndicator={false} >
                            {data.map(e => (
                                <>
                                    <Text key={Math.random()} style={{ fontFamily: Fonts.Medium, fontSize: RFValue(11), color: theme.text, marginLeft: "5%", marginTop: "7%" }}>{e.date}</Text>
                                    {e.data.map(e => (
                                        <View key={Math.random()} style={{ width: "90%", alignSelf: "center", marginTop: "4%", flexDirection: "row", alignItems: "center", paddingVertical: "0.75%" }} >
                                            <View style={{ width: "15%", }} >
                                                <View style={{ backgroundColor: "rgba(125,125,125,0.2)", borderRadius: 100, justifyContent: "center", width: 40, height: 40, }} >
                                                    <Image source={require("../assets/img/appicon.png")} style={{ width: 22, height: 22, alignSelf: "center" }} />
                                                </View>
                                            </View>
                                            <View style={{ width: "75%" }} >
                                                <Text numberOfLines={1} style={{ fontFamily: Fonts.Regular, fontSize: RFValue(12), color:theme.text, marginLeft: "2%" }}>{e.url}</Text>
                                                <Text numberOfLines={1} style={{ fontFamily: Fonts.Regular, fontSize: RFValue(12), color: "gray", marginLeft: "2%" }}>{e.domain}</Text>

                                            </View>
                                            <View style={{ width: "10%", justifyContent: "center" }} >
                                                <View style={{ width: 18, height: 18, backgroundColor:theme.text, alignSelf: "center", justifyContent: "center", borderRadius: 999 }} >
                                                    <Icon name='close' size={13} color={theme.theme == "dark" ? "#000":"#fff"} style={{ alignSelf: "center" }} />
                                                </View>

                                            </View>
                                        </View>
                                    ))}
                                </>
                            ))}
                        </ScrollView>
                    </View>
                </>
            } */}

<Modal
        isVisible={isModalVisible}
        entry="bottom"
        backdropPressToClose={true}
        visible={isModalVisible}
        backdropColor={"rgba(14, 4, 36, 0.80)"}
        onBackButtonPress={() => setIsModalVisible(false)}
      >

        <View onStartShouldSetResponder={() => setIsModalVisible(false)} style={{ backgroundColor:theme.theme==="dark"? "rgba(14, 4, 36, 0.80)":"rgba(68, 68, 68, 0.95)", width: deviceWidth, height: deviceHeight * 1.2, justifyContent: "center", alignSelf: "center" }} >
          <View style={theme.theme == "light" ? style.logoutpopup_light : style.logoutpopup_dark} >
            <View style={{ padding: 10, alignItems: "flex-end" }}>
            </View>
            <View style={{ alignItems: "center" }}>
              {/* {theme.theme == "light" ?
                (<Iiconlight width={windowWidth * 0.2} height={windowWidth * 0.2} style={{ resizeMode: "contain" }} />)
                : (<IiconDark width={windowWidth * 0.2} height={windowWidth * 0.2} style={{ resizeMode: "contain" }} />)
              } */}
               <Image
                      style={{ width: "90%",height:190,marginLeft:"10%" }}
                      source={require("../assets/img/Delete.png")}
                      resizeMode="contain"
                    />
            
              <Text

                style={{
                  color: theme.theme==="dark"?"white":"black",
                  fontFamily: Fonts.Bold,
                  fontWeight:"700",
                  fontSize: RFPercentage(2.8),
                  marginTop: "6%",
                  alignSelf: "center",
                  textAlign: "center"
                }}
              >
                Are you sure
              </Text>
              <Text

                style={{
                  color: theme.theme==="dark"?"white":"black",
                  fontFamily: Fonts.Bold,
                  fontSize: RFPercentage(2.8),
                  fontWeight:"700",
                  alignSelf: "center",
                  textAlign: "center"
                }}
              >
                you want to Delete?
              </Text>
              <Image
                      style={{ width: "100%",height:1.8,marginVertical:20}}
                      source={require("../assets/img/devider.png")}
                      resizeMode="contain"
                    />

              <View style={{ display: "flex", flexDirection: "row",width:"100%",justifyContent:"space-between" }}>

                <Pressable onPress={() => {clearData(false,false,"clearAll")}} style={{width:"49%"}}>
                  <View style={{
                    backgroundColor: "rgba(155, 124, 220, 0.15)", borderRadius: 5,borderColor:"rgba(162, 121, 250, 0.30)",
                    width: "100%", paddingHorizontal: 5, paddingVertical: 2,  borderWidth: 1,  
                  }} >
                    <Text style={{
                      color: theme.theme==="dark"?"white":"black", fontFamily: Fonts.Regular,
                      textAlign: "center", width: "100%", marginVertical: 10, fontSize: RFPercentage(1.75)
                    }}>
                      Yes
                    </Text>
                  </View>
                </Pressable>
                <Pressable onPress={() => { setIsModalVisible(false) }} style={{width:"49%"}}>
                  <View style={{
                    backgroundColor:theme.theme==="dark"?"#FFF600": "#612CD2", borderRadius: 5,borderColor:theme.theme==="dark"?"#FFF600": "#612CD2",
                    width: "100%", paddingHorizontal: 5, paddingVertical: 2, marginRight: 10, borderWidth: 1,  
                  }}  >
                    <Text style={{
                      color: theme.theme==="light"?"white":"black", fontFamily: Fonts.Regular,
                      textAlign: "center", width: "100%", marginVertical: 10, fontSize: RFPercentage(1.75)
                    }}>
                      No
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

      </Modal>
      </ImageBackground>
        </SafeAreaView>
    );
};

export default Testscreen;

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
      aspectRatio: 0.65
    },
    voice: {
      resizeMode: "contain",
      height: windowheight * 0.0435,
      width: windowWidth * 0.0435,
      aspectRatio: 0.65
    },
    wallet: {
      resizeMode: "contain",
      height: windowheight * 0.06,
      width: windowWidth * 0.06,
      aspectRatio: 0.65
    },
    word: {
      resizeMode: "contain",
      height: windowheight * 0.06,
      width: windowWidth * 0.06,
      aspectRatio: 0.65
    },
    clipboard: {
      resizeMode: "contain",
      height: windowheight * 0.06,
      width: windowWidth * 0.06,
      aspectRatio: 0.65
    },
    theme: {
      resizeMode: "contain",
      height: windowheight * 0.06,
      width: windowWidth * 0.06,
      aspectRatio: 0.65
    },
    wallet1: {
      resizeMode: "contain",
      height: windowheight * 0.065,
      width: windowWidth * 0.065,
      aspectRatio: 0.65
    },
    preference: {
      resizeMode: "contain",
      height: windowheight * 0.048,
      width: windowWidth * 0.048,
      aspectRatio: 0.65
    },
    faq: {
      resizeMode: "contain",
      height: windowheight * 0.06,
      width: windowWidth * 0.06,
      aspectRatio: 0.65
    },
    aboutus: {
      resizeMode: "contain",
      height: windowheight * 0.05,
      width: windowWidth * 0.05,
      aspectRatio: 0.65
    },
    notification: {
      resizeMode: "contain",
      height: windowheight * 0.05,
      width: windowWidth * 0.05,
      aspectRatio: 0.65
    },
    security: {
      resizeMode: "contain",
      height: windowheight * 0.05,
      width: windowWidth * 0.05,
      aspectRatio: 0.65
    },
    importwallet: {
      resizeMode: "contain",
      height: windowheight * 0.05,
      width: windowWidth * 0.05,
      aspectRatio: 0.65
    },
    logoutpopup_light: {
      // height:windowHeight*0.3,
      alignSelf: "center",
      width: "70%",
      // backgroundColor: theme.blackandwhite,
      backgroundColor: "#EDEDED",
      borderColor: "rgba(162, 121, 250, 0.30)",
      borderRadius: 5,
      padding: "5%"
    },
    logoutpopup_dark: {
      // height:windowHeight*0.3,
      alignSelf: "center",
      width: "70%",
      // backgroundColor: theme.blackandwhite,
      backgroundColor: "rgba(155, 124, 220, 0.15)",
      borderRadius: 5,
      borderWidth: 1,
      borderColor: "rgba(162, 121, 250, 0.30)",
      padding: "5%"
    }
  });
// import React, { useState, useRef, useEffect } from 'react';
// import { View, TextInput, TouchableOpacity, Animated, Text } from 'react-native';

// const Testscreen = () => {
//     const [isSearchExpanded, setIsSearchExpanded] = useState(false);
//     const animation = useRef(new Animated.Value(50)).current;
  
//     const toggleSearch = () => {
//       const newWidth = isSearchExpanded ? 50 : 200;
  
//       setIsSearchExpanded(!isSearchExpanded);
//       Animated.timing(animation, {
//         toValue: newWidth,
//         duration: 300,
//         useNativeDriver: false,
//       }).start();
//     };
  

//   return (
//     <View style={{ flex: 1 }}>
//       <TouchableOpacity onPress={toggleSearch}>
//        <Text style={{color:"#000",textAlign:"center",marginTop:"5%"}} >hiiiii</Text>
//       </TouchableOpacity>
//       <View style={{ flexDirection: 'row', overflow: 'hidden',marginTop:"5%" }}>
//         <Animated.View style={{ width: animation }}>
//           <TextInput
//             style={{ borderWidth: 1, paddingHorizontal: 10,color:"#000"}}
//             placeholder="Search..."
//           />
//         </Animated.View>
//       </View>
//     </View>
//   );
// };

// export default Testscreen;

const boxShadowStyle = Platform.select({
  ios: {
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 10,
    shadowRadius: 0,
  },
  android: {
    elevation: 3,
  },
});