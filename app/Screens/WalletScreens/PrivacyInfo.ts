import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  SafeAreaView,
  BackHandler,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-elements";
import Header from "../../Components/Header";
import { Images } from "../../utils/Images";
import { Colors } from "../../utils/Colors";
import themeContext from "../../utils/themeContext";
import { ScrollView } from "react-native";
import { Fonts } from "../../utils/Fonts";
import { CheckBox } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
// import { TOUCHABLE_STATE } from "react-native-gesture-handler/lib/typescript/components/touchables/GenericTouchable";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { get_CMS_function } from './common/privacy_info';
import RenderHTML from 'react-native-render-html';
import getRealm from "../../localDb/RealmConfig";
// import WalletIcon from '../../assets/img/Password Reset.webp'
// import Wallet from "../../assets/img/walletnew.png"
import { windowWidth } from "../../utils/Dimensions";



const PrivacyInfo = (props) => {
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [isSelected, setSelection] = useState(false);
  const [passwordLength, setPassword] = useState(0);
  const [contents, setContent] = useState([]);

  // const contents = [
  //   {
  //     txt: "The recovery phrase is the master key to your funds. Never share it with anyone else.",
  //     txt2: "The wallet will never ask you to share your recovery phrase",
  //     txt3: "If you lose your recovery phrase, not even the wallet can recovery your funds.",
  //   },
  // ];
  console.log("passwordLength",passwordLength);
  var root = props.route.params
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (root == "createWallet1") {
          setTimeout(() => {
            props.navigation.navigate("CreateWallet");
          }, 500);
        } else {
          props.navigation.goBack();
        }
      };
      // Add Event Listener for hardwareBackPress
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      getPasscodeStatus();
      return () => { };
    }, [])
  );

  //get passcode status
  const getPasscodeStatus = () => {
    getRealm()
      .then((realm) => {
        var passcodeVal = realm.objects("userPasscodeValue");
        console.log("passcodeVal",passcodeVal);
        passcodeVal.length != 0 ? setPassword(1) : setPassword(0)

        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "getPasscodeStatus err from localDb in createWallet");
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      getCmsContent()
    }, [])
  )

  const getCmsContent = async () => {
    console.log("ehuiehruhe");
    var params = {
      subject: ["privacy_policy1", "privacy_policy2", "privacy_policy3"],
      from: "privacy"
    }
    get_CMS_function(params)
      .then((res) => {
        setContent(res.data)
        console.log("resssss", res.data);
      })
      .catch((err) => {
        console.log("errro on getcms content");
      })
  }

  const mixedStyle = {

    p: {
      color: theme.theme == "light"?'#000':'#fff'
    }
  }
  
  
  return (
    <SafeAreaView style={style.container}>
      {/* <View style={style.mainView} /> */}
      <Header name={"Privacy"} leftImage={root == "after" ? "back" : "privacyInfoBack"} />
      <ScrollView>
        <View style={style.mainView2}>

        {/* <Image source={Wallet} resizeMode="contain" 
        style={style.imgStyle} 
        /> */}
        {/* <WalletIcon width={windowWidth * 0.070} height={windowWidth * 0.070} style={{ resizeMode: "contain", alignSelf: "center" }} /> */}

          {/* <Image source={Images.recoveryphrasePng} style={style.imgStyle} /> */}
          {/* <FlatList
            data={contents}
            renderItem={({ item }) => (
              <View style={{ marginHorizontal: 40, paddingTop: 30 }}>
                <Text style={style.txtStyle}>{item.txt}</Text>
                <View />
                <Text style={style.txt2Style}>{item.txt2}</Text>
                <View />
                <Text style={style.txt3}>{item.txt3}</Text>
              </View>
            )}
          /> */}
          <View
            style={style.txtStyle}
          >
            {contents && contents?.map((item) => (
              <RenderHTML
                source={{ html: `${item.content}` }}
                tagsStyles={mixedStyle}
              />
            ))}
          </View>




          <View style={{ marginTop: "3%", marginHorizontal: 20, flexDirection: "row", alignItems: 'center', justifyContent: "flex-start", marginLeft: 90 }}>
            {/* <CheckBox
              checkedColor={"#37BA00"}
              uncheckedColor={theme.text}
              containerStyle={style.checkContainer}
              textStyle={{
                fontSize: 18,
                color:  Colors.WHITE,
              }}
              fontFamily= "Orbitron-Bold"
              checked={isSelected}
              
              onPress={() => {
                if (isSelected == true) {
                  setSelection(false);
                } else {
                  setSelection(true);
                }
              }}
              /> */}
            <TouchableOpacity style={{
              width: 15, height: 15, borderWidth: 1,
              borderColor: "#707070", marginRight: 5, borderRadius: 2, marginLeft: 20
            }} onPress={() => {
              if (isSelected == true) {
                setSelection(false);
              } else {
                setSelection(true);
              }
            }}>
              {/* {isSelected == true ?
                (<Image source={require("../../assets/img/tick.png")} style={
                  { position: "relative", top: 3, left: 2 }} />)
                : (<></>)
              } */}
            </TouchableOpacity>
            <Text style={{ color: theme.text, fontFamily: Fonts.Medium, fontSize: RFPercentage(1.7) }}>I understand the risks</Text>
          </View>
          <View style={{
            marginHorizontal: 30, paddingTop: 20,
            flexDirection: "row", alignItems: "center", justifyContent: "center"
          }}>
            {isSelected == true ? (
              // <Button
              //   title="Continue"
              //   buttonStyle={style.continueBtn}
              //   titleStyle={{ fontFamily: Fonts.Regular,color:"#00B0FF",
              //   borderWidth:1,
              //   borderColor:"#00B0FF",width:250,borderRadius:30,height:50,
              //   lineHeight:45,fontSize:13 }}
              //   onPress={() => props.navigation.navigate("CopyWalletPharse")}
              //   raised={false}
              //   type="clear"
              // />
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity style={style.continueBtn}
                  onPress={() => {
                    if (passwordLength == 0) {
                      props.navigation.navigate("SetPasswordforCreate")
                    } else {
                      props.navigation.navigate("CopyWalletPharse")
                    }
                  }}
                >
                  <Text style={{
                    fontFamily: Fonts.Regular, color: theme.theme == "light" ? "black" :"white",
                    borderWidth: 2,
                    borderColor: theme.theme == "light" ? "black" :"white", width: 250, borderRadius: 30, height: 50,
                    lineHeight: 45, fontSize: 13, textAlign: "center"
                  }}>Continue</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // <Button
              // title="Continue"
              //   buttonStyle={style.continueBtn}
              //   titleStyle={{ fontFamily: Fonts.Regular,color:theme.search,
              //   borderWidth:1,
              //   borderColor:theme.search,width:250,borderRadius:30,height:50,
              //   lineHeight:45,fontSize:13 }}
              //   raised={false}
              //   type="clear"
              // />
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity style={style.continueBtn1}
                // onPress={() => {
                //   props.navigation.navigate("PrivacyInfo");
                // }}
                >
                  <Text style={{
                    fontFamily: Fonts.Regular,  color:"#808080",
                    borderWidth: 2,
                    borderColor:theme.theme == "light" ? "#999999" :"#808080", width: 250, borderRadius: 30, height: 50,
                    lineHeight: 45, fontSize: 13, textAlign: "center"
                  }}>Continue</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyInfo;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      flex: 1,
    },
    mainView: {
      backgroundColor: theme.blackandwhite,
      height: 60,
    },
    mainView2: {
      alignSelf: "center",
      justifyContent: "center",
      marginTop: "6%",
    },
    imgStyle: {
      alignSelf: "center",
      width: 150,
      height: 150,
    },
    txtStyle: {

      fontSize: RFPercentage(1.5),
      marginTop: 30,
      color: theme.text,
      fontFamily: Fonts.Regular,
      marginBottom: 20,
      marginHorizontal: 30,
    },
    txt2Style: {
      marginTop: 10,
      fontSize: RFPercentage(1.5),
      color: theme.text,
      fontFamily: Fonts.Regular,
      marginBottom: 20
    },
    txt3: {
      marginTop: 10,
      fontSize: RFPercentage(1.5),
      color: theme.text,
      fontFamily: Fonts.Regular,
      marginBottom: 20
    },
    checkContainer: {
      borderColor: "transparent",
      backgroundColor: "transparent",
    },
    continueBtn: {
      borderRadius: 10,
      width: 250,
      fontFamily: Fonts.Bold,
      backgroundColor: "transparent",
      color: theme.buttonclr,
      paddingTop: 10,
      paddingBottom: 10
    },
    continueBtn1: {
      borderRadius: 10,
      width: 250,
      fontFamily: Fonts.Bold,
      backgroundColor: "transparent",
      color: theme.buttonclr,
      paddingTop: 10,
      paddingBottom: 10
    },
  });
