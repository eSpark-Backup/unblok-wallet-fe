import React, { useContext, useState, useEffect } from "react";
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
import ThreeDotsLight from "../../assets/img/three-dots-light.svg";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { showImage } from "../../utils/showImage";
import isEmpty from "../../utils/isEmpty";
import { windowWidth, windowheight } from "../../utils/Dimensions";
import WalletLight from '../../assets/icons/lighttheme/Wallet.svg'
import WalletDark from '../../assets/icons/darktheme/Wallet1.svg'
import { SvgUri } from 'react-native-svg';
import { GetChainid } from "../../api/common";
import { selectedCurrencyList } from "../../Redux/Actions/selectedcurrencyListAction";

const _ = require("lodash");


const WalletList = (props) => {
  const [checked, setChecked] = React.useState('first');

  const dispatch = useDispatch();
  const setSelectedWalletDetails = (item) => dispatch(addWalletName(item));

  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);

  const setSelectWalletCurrencies = (item) => dispatch(selectedCurrencyList(item));

  const [walletDetails, setWalletDetails] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  const getWalletData = () => {
    getRealm()
      .then((realm) => {
        var walletData = realm.objects("Wallet_array");
        setState({ data: walletData })

        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "wallet data list err from localDb");
      });
  };

  const saveSelectedWalletIndex = (index) => {
    // console.log("coming index---------------", index);
    getRealm()
      .then((realm) => {

        var walletData = realm.objects("Wallet_array");
        console.log('walletData',index, JSON.stringify(walletData, null, 2))
        var arr = walletData.filter((item) => {
          return item.selected == "true"
        });

        realm.write(() => {
          arr[0].selected = "false"
        })

        var selectedChangeWallet = walletData[index]
        console.log("selectedChangeWallet",selectedChangeWallet);
        var Address = selectedChangeWallet.wallets[0].walletaddress
        global.walletName = selectedChangeWallet.walletname
        console.log("selectedChangeWallet.currency",selectedChangeWallet.currency);
        var chain = GetChainid(selectedChangeWallet.wallets[0].currency)
        console.log("-------------->",chain);
        setSelectWalletCurrencies([selectedChangeWallet])
        dispatch({
          type: "Session",
          data: {
            Type_Emit: 'accountsChanged',
            Address,chain
          },
        });
        realm.write(() => {
          selectedChangeWallet.selected = "true"
        })
        // props.navigation.goBack()
        props.navigation.dispatch(props.navigation.push("WalletHome",{screen:"WalletHomeBottomTab",params:{path:"select"}}));
        return () => {
          realm.close();
        };
      })
      .catch((error) => {
        console.log(error, "localdb selected index err");
      });
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
      <Header name={"Import Wallet"} leftImage={"customBack"}
        rightImage={"add"}
      />
      <View style={{ height: "82.5%",marginTop:"5%", }} >
        <ScrollView>
          {/* <Searchbar
        placeholder="Search"
        style={style.custsearch}
        backgroundColor={"transparent"}
        iconColor={theme.search}
        inputStyle={{color: theme.text,fontFamily:Fonts.Regular,fontSize:13}}
        placeholderTextColor={theme.search}
      /> */}
          {/* <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("CreateWallet2");
        }}
      >
        <View style={style.IcnView}>
          <Icn
            name="add-circle-outline"
            type="MaterialIcons"
            style={{
              alignSelf: "center",
              marginHorizontal: 5,
            }}
            color={theme.text}
            size={30}
          />
          <Text style={style.customTokenTxt}>Add Custom Token</Text>
        </View>
      </TouchableOpacity> */}

          {/* old */}
          {/* <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        marginHorizontal: 20, marginTop: 20
      }}>
        <TouchableOpacity onPress={() => props.navigation.navigate("ShowSecretPhrase")}>
          <View style={style.flex}>
            {theme.theme == 'light' ?
              (<MainWallet width={25} height={25} fill={"#000"} />)
              : (<MainWallet width={25} height={25} fill={"#fff"} />)
            }
            <Text style={style.multiTxt}>Main Wallet</Text>
          </View>
        </TouchableOpacity>
        <View>
          <TouchableOpacity
          // onPress={() => props.navigation.navigate("ShowWalletDetails")}
          >
            {theme.theme == 'light' ?
              (
                <ThreeDots fill={"#000"} />
              ) :
              (
                <ThreeDots fill={"#fff"} />
              )
            }
          </TouchableOpacity>
        </View>
      </View> */}

          {/* {data && data.map((item, index) => ( */}
          {data && _.map(data, (item, index) => (
            <View
              key={Math.random()}
              style={{
                borderColor:"rgba(162, 121, 250, 0.30)",
                borderWidth:2,
                backgroundColor:item.selected == "true" ?theme.theme==="dark"?"rgba(155, 124, 220, 0.30)":"#612CD2":"rgba(155, 124, 220, 0.10)",
                borderRadius:5,
                width:"95%",
                padding:10,
                alignSelf:"center",
                paddingVertical:"3%",
                marginBottom:"3%",
              }}
            >
              {/* {console.log("iteeeeeeeeeeeeeeteteeet", item)} */}
              {item.walletType != "SingleCoin" ? (
                <View
                  style={{
                    marginHorizontal: 5,
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      // marginTop: "5%",
                    }}
                  >
                    {/* {console.log("selectedindex1", selectedIndex)} */}
                    {/* {item.selected == "true" ? (
                      <RadioButton
                        color={theme.theme == 'light' ? "#A279FA" : "#A279FA"}
                        uncheckedColor={theme.text}
                        status={"checked"}
                        onPress={() => {
                          saveSelectedWalletIndex(index);
                        }}
                      />
                    ) : (
                      <RadioButton
                        color={theme.theme == 'light' ? "#000" : "#fff"}
                        uncheckedColor={theme.theme == 'light' ? "#000" : "#fff"}
                        status={"unchecked"}
                        onPress={() => {
                          saveSelectedWalletIndex(index);
                        }}
                      />
                    )} */}
                    <TouchableOpacity
                        style={{
                          width: 16,
                          height: 16,
                          borderColor:
                          item.selected == "true" 
                              ? "rgba(162, 121, 250, 0.30)"
                              : theme.theme == "light"
                              ? "#000"
                              : "#fff",
                          borderWidth:
                          item.selected == "true"  ? 0 : 0.5,
                          borderRadius: 2,
                          marginRight:"5%"
                        }}
                        onPress={() => {
                          saveSelectedWalletIndex(index);
                        }}
                      >
                        {item.selected == "true"  ? (
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
                    {theme.theme == 'light' && item.selected !== "true"  ?
                      (<WalletLight style={{ aspectRatio: 0.8 }} width={windowWidth * 0.085} height={windowWidth * 0.085} />)
                      :
                      (<WalletDark style={{ aspectRatio: 0.8 }} width={windowWidth * 0.085} height={windowWidth * 0.085} />)
                    }
                    <View
                      style={{ flexDirection: "column", marginHorizontal: 5 }}
                    >
                      <TouchableOpacity onPress={() => {
                        setSelectedWalletDetails({
                          selectedIndexForEditName: index,
                          item: item,
                        });
                        props.navigation.navigate("ShowWalletDetails");
                      }}>
                        <Text
                          style={{
                            color:item.selected == "true"?"white":theme.theme==="dark"?"white":"black",
                            width:"100%"
                          }}
                          numberOfLines={1}
                        >
                          {item.walletname}
                        </Text>

                        <Text
                        numberOfLines={1}
                          style={{
                            color:theme.theme==="dark"?"#A279FA":"#A279FA",
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(1.5),
                            marginLeft: 10,
                            width:"75%"
                          }}
                        >
                          MultiCoin Wallet
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => {
                    setSelectedWalletDetails({
                      selectedIndexForEditName: index,
                      item: item,
                    });
                    props.navigation.navigate("ShowWalletDetails");
                  }} style={{  width: "4%", right: "10%" }}>


                    {theme.theme == 'light' && item.selected !== "true" ?
                      (
                        <ThreeDotsLight style={{ alignSelf: "center" }} size={25} fill={"#000"} />
                      ) :
                      (
                        <ThreeDots style={{ alignSelf: "center" }} size={25} fill={"#fff"} />
                      )
                    }

                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    marginHorizontal: 5,
                    justifyContent: "space-between",
                    flexDirection: "row",
                    // marginTop: "2%",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      // marginTop: "5%",
                    }}
                  >
                    {/* {console.log("selectedindex",selectedIndex)} */}

                    {/* {item.selected == "true" ? (
                      <RadioButton
                        color={theme.theme == 'light' ? "#532CA6" : "#532CA6"}
                        uncheckedColor="grey"
                        status={"checked"}
                        onPress={() => {
                          saveSelectedWalletIndex(index);
                        }}
                      />
                    ) : (
                      <RadioButton
                        color={theme.theme == 'light' ? "#000" : "#fff"}
                        uncheckedColor={theme.theme == 'light' ? "#000" : "#fff"}
                        status={"unchecked"}
                        onPress={() => {
                          saveSelectedWalletIndex(index);
                        }}
                      />
                    )} */}
                     <TouchableOpacity
                        style={{
                          width: 16,
                          height: 16,
                          borderColor:
                          item.selected == "true" 
                              ? "rgba(162, 121, 250, 0.30)"
                              : theme.theme == "light"
                              ? "#000"
                              : "#fff",
                          borderWidth:
                          item.selected == "true"  ? 0 : 0.5,
                          borderRadius: 2,
                          marginRight:"5%"
                        }}
                        onPress={() => {
                          saveSelectedWalletIndex(index);
                        }}
                      >
                        {item.selected == "true"  ? (
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
                    {console.log("lalalaall",item.wallets[0])}
                    {/* {!isEmpty(item.wallets[0].currencyimage)
                      ?
                      <SvgUri
                      width={40}
                      height={40}
                      uri={`http:/192.53.121.26:8096/images/${item.wallets[0].currencyimage}`}
                    />
                      : showImage(item.wallets[0].tokenType,"walletlist")} */}
                    <View style={{ marginHorizontal: 10 }}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedWalletDetails({
                            selectedIndexForEditName: index,
                            item: item,
                          });
                          props.navigation.navigate("ShowWalletDetails");
                        }}>
                        <Text
                        numberOfLines={1}
                          style={{
                            color:item.selected == "true"?"white":theme.theme==="dark"?"white":"black",
                            fontFamily: Fonts.SemiBold,
                            fontSize: 18,
                            marginLeft: 5,
                            width:"75%"
                          }}
                        >
                          {item?.walletname}
                        </Text>
                        <Text
                        numberOfLines={1}
                          style={{
                            color:theme.theme==="dark"?"#A279FA":"#A279FA",
                            fontFamily: Fonts.Regular,
                            fontSize: 10,
                            marginLeft: 5,
                            width:"75%"
                          }}
                        >
                          {item.wallets[0].walletaddress}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{  left: -10 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedWalletDetails({
                          selectedIndexForEditName: index,
                          item: item,
                        });
                        props.navigation.navigate("ShowWalletDetails");
                      }}
                    >
                     {theme.theme == 'light' && item.selected !== "true" ?
                      (
                        <ThreeDotsLight  size={25} fill={"#000"} />
                        ) :
                        (
                          <ThreeDots size={25} fill={"#fff"} />
                        )
                      }
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
export default WalletList;

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
      fontFamily: Fonts.Medium,
      fontSize: RFPercentage(2.2),
      marginHorizontal: 10,
      color: theme.text,
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
