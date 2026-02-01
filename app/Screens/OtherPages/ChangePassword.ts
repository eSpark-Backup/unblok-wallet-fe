import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput, Linking,
  Dimensions,
  ToastAndroid,
  Pressable,
  ImageBackground,
  StatusBar
} from "react-native";
import { Images } from "../../utils/Images";
import themeContext from "../../utils/themeContext";
import { Fonts } from "../../utils/Fonts";
import Header from "../../Components/Header";
import Modal from "react-native-modal";
import { formValidation, changePasswordFun } from "./common/Change_Password";
import isEmpty from "../../utils/isEmpty";
import { RFPercentage } from "react-native-responsive-fontsize";
import { borderRadius, windowheight } from "../../utils/Dimensions";
import Eye from "../../assets/img/eye.svg";
import Eyeon from '../../assets/img/eyeon.svg'

//   import PasswordInputText from 'react-native-hide-show-password-input';
export default function ChangePassword(props) {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newpassword, setNewpassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = useState({})
  const [userDetails, setUserDetails] = useState("");
  const [show, setShow] = useState(true);
  const [show2, setShow2] = useState(true);
  const [show3, setShow3] = useState(true);
  const theme = React.useContext(themeContext);
  const style = styles(theme);
  const [modalVisible, setModalVisible] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;



  // console.log("sjuerguiwer");
  useEffect(() => {
    setError({})
  }, [currentPassword, newpassword, confirmPassword])

  useEffect(() => {
    if (props?.route?.params?.userDetails) setUserDetails(props?.route?.params?.userDetails)
  }, [props?.route?.params?.userDetails])

  const submitFunc = async () => {
    var params = {
      currentPassword,
      newpassword,
      confirmPassword,
      mailAddress: userDetails.mailAddress,
      from: "changePassword"
    }
    var validate = await formValidation(params)
    console.log("validate", validate);
    if (!isEmpty(validate)) {
      return setError(validate)
    } else {
      // console.log("else")
      changePasswordFun(params)
        .then((res) => {
          // console.log("resssss", res.data);
          if (res.data.error) {
            ToastAndroid.showWithGravityAndOffset(
              res.data?.msg,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
          }
          if (res.data.success) {
            // ToastAndroid.showWithGravityAndOffset(
            //   res.data?.msg,
            //   ToastAndroid.LONG,
            //   ToastAndroid.BOTTOM,
            //   25,
            //   50
            // );
            setModalVisible(true);
            setTimeout(() => {
              props.navigation.goBack()
            }, 1000);
          }
        })
        .catch((err) => {
          console.log("error on submit functiom", err);
        })
    }
  }


  return (
    <>
      <SafeAreaView style={style.container}>
      <ImageBackground
                source={theme.theme==="dark"?Images.background:Images.backgroundWhite}
                style={{
                  width: windowWidth,
                  height: windowheight,
                  paddingTop: StatusBar.windowheight,
                }}
                resizeMode="cover"
              >
        {/* <View style={{ marginHorizontal: 20 }}>
        <Header name={"Change Password"} leftImage={"back"} />
        <View style={{ marginHorizontal: 25, marginTop: 25 }}>
          <ScrollView style={{ height: 500 }}>
            <View style={{ marginBottom: 30 }}>
              <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.theme == "light" ? "#000" : "#fff", marginBottom: 15 }}>Current Password</Text>
              <View style={{
                borderColor: theme.phrase1, borderWidth: 1, paddingHorizontal: 10,
                borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "space-between",
              }}>
                <TextInput
                  secureTextEntry={show}
                  selectionColor={theme.text}
                  onChangeText={setCurrentPassword}
                  value={currentPassword}
                  placeholder="Enter Current Password"
                  placeholderTextColor={theme.theme == "light" ? "#000" : "#fff"}
                  style={{ fontFamily: Fonts.Regular, paddingLeft: 10, color: theme.theme == "light" ? "#000" : "#fff" }}
                  maxLength={25}
                />

                <TouchableOpacity
                  onPress={() => setShow(!show)}
                >
                  {theme.theme == "light" ?
                    <Eye fill={"#000"} /> :
                    <Eye fill={"#fff"} />
                  }
                </TouchableOpacity>
              </View>
              {error && error?.currentPassword && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red" }}>{error.currentPassword}</Text>}
            </View>
            <View style={{ marginBottom: 30 }}>
              <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.theme == "light" ? "#000" : "#fff", marginBottom: 15 }}>New Password*</Text>
              <View style={{
                borderColor: theme.phrase1, borderWidth: 1, paddingHorizontal: 10,
                borderRadius: 5, fontFamily: Fonts.Regular, flexDirection: "row", alignItems: "center", justifyContent: "space-between",
              }}>
                <TextInput
                  secureTextEntry={show2}
                  selectionColor={theme.text}
                  onChangeText={setNewpassword}
                  value={newpassword}
                  placeholder="Enter New Password"
                  placeholderTextColor={theme.theme == "light" ? "#000" : "#fff"}
                  style={{ paddingLeft: 10, color: theme.theme == "light" ? "#000" : "#fff" }}
                  maxLength={25}
                />

                <TouchableOpacity
                  onPress={() => setShow2(!show2)}
                >
                  {theme.theme == "light" ?
                    <Eye fill={"#000"} /> :
                    <Eye fill={"#fff"} />
                  }
                </TouchableOpacity>
              </View>
              {error && error?.newpassword && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red" }}>{error.newpassword}</Text>}

            </View>
            <View style={{ marginBottom: 30 }}>
              <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.theme == "light" ? "#000" : "#fff", marginBottom: 15 }}>Confirm Password*</Text>
              <View style={{
                borderColor: theme.phrase1, borderWidth: 1, paddingHorizontal: 10, fontFamily: Fonts.Regular,
                borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "space-between",
              }}>
                <TextInput
                  secureTextEntry={show3}
                  selectionColor={theme.text}
                  onChangeText={setConfirmPassword}
                  value={confirmPassword}
                  placeholderTextColor={theme.theme == "light" ? "#000" : "#fff"}
                  placeholder="Enter Confirm Password"
                  style={{ paddingLeft: 10, color: theme.theme == "light" ? "#000" : "#fff" }}
                  maxLength={25}
                />

                <TouchableOpacity
                  onPress={() => setShow3(!show3)}
                >
                  {theme.theme == "light" ?
                    <Eye fill={"#000"} /> :
                    <Eye fill={"#fff"} />
                  }
                </TouchableOpacity>
              </View>
              {error && error?.confirmPassword && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red" }}>{error.confirmPassword}</Text>}
              {error && error?.sameError && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red" }}>{error.sameError}</Text>}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity style={{
                backgroundColor: "transparent", borderColor: "#00B0FF", borderWidth: 1,
                borderRadius: 30, paddingVertical: 15, width: 170, marginTop: 30
              }}
                onPress={() => { submitFunc() }}
              >
                <Text style={{
                  fontFamily: Fonts.Regular, fontSize: 13, textAlign: "center",
                  width: "100%", color: "#00B0FF"
                }}>Update</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View> */}

        <View style={{ width: "100%", height: "100%" }} >
          <View style={{ width: "94%", height: "10%", alignSelf: "center", justifyContent: "space-around" }} >
            <Header name={"Change Password"} leftImage={"back"} />
          </View>
          <View style={{ width: "85%", alignSelf: "center", height: "85%" }} >
            <View style={{ marginTop: "5%" }}>
              <Text style={style.title_text}>Current Password*</Text>
              <View style={style.box_container}>
                <View style={{ marginLeft: "4%", width: "90%", height: windowHeight * 0.07, justifyContent: "space-between", flexDirection: "row", alignItems: "center" }} >

                  <TextInput
                    secureTextEntry={show}
                    onChangeText={setCurrentPassword}
                    value={currentPassword}
                    placeholder="Enter Current Password"
                    selectionColor={"#612CD2"}
                    placeholderTextColor={"#A279FA"}
                    style={style.input_container}
                    maxLength={35}
                  />
                  <Pressable
                    onPress={() => setShow(!show)}
                  >
                    {!show ?
                      <Eyeon style={{ alignSelf: "center", aspectRatio: 1 }} width={windowWidth * 0.05} height={windowWidth * 0.05} /> :
                      <Eye style={{ alignSelf: "center", aspectRatio: 1 }} width={windowWidth * 0.05} height={windowWidth * 0.05} />}
                  </Pressable>
                </View>

              </View>
              {error && error?.currentPassword && <Text style={style.error_container}>{error.currentPassword}</Text>}
            </View>

            <View style={{ marginTop: "5%" }}>
              <Text style={style.title_text}>New Password*</Text>
              <View style={style.box_container}>
                <View style={{ marginLeft: "4%", width: "90%", height: windowHeight * 0.07, justifyContent: "space-between", flexDirection: "row", alignItems: "center" }} >
                  <TextInput
                    secureTextEntry={show2}
                    onChangeText={setNewpassword}
                    placeholder="Enter New Password"
                    selectionColor={"#612CD2"}
                    placeholderTextColor={"#A279FA"}
                    style={style.input_container}
                    maxLength={35}
                  />

                  <Pressable
                    onPress={() => setShow2(!show2)}
                  >
                    {!show2 ?
                      <Eyeon style={{ alignSelf: "center", aspectRatio: 1 }} width={windowWidth * 0.05} height={windowWidth * 0.05} /> :
                      <Eye style={{ alignSelf: "center", aspectRatio: 1 }} width={windowWidth * 0.05} height={windowWidth * 0.05} />}
                  </Pressable>

                </View>
              </View>
              {error && error?.newpassword && <Text style={style.error_container}>{error.newpassword}</Text>}
            </View>

            <View style={{ marginTop: "5%" }}>
              <Text style={style.title_text}>Confirm Password*</Text>
              <View style={style.box_container}>
                <View style={{ marginLeft: "4%", width: "90%", height: windowHeight * 0.07, justifyContent: "space-between", flexDirection: "row", alignItems: "center" }} >
                  <TextInput
                    secureTextEntry={show3}
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                    placeholder="Enter Password"
                    selectionColor={"#612CD2"}
                    placeholderTextColor={"#A279FA"}
                    style={style.input_container}
                    maxLength={35}
                  />

                  <Pressable
                     onPress={() => setShow3(!show3)}
                  >
                    {!show3 ?
                      <Eyeon style={{ alignSelf: "center", aspectRatio: 1 }} width={windowWidth * 0.05} height={windowWidth * 0.05} /> :
                      <Eye style={{ alignSelf: "center", aspectRatio: 1 }} width={windowWidth * 0.05} height={windowWidth * 0.05} />}
                  </Pressable>

                </View>
              </View>
              {error && error?.confirmPassword && <Text style={style.error_container}>{error.confirmPassword}</Text>}
              {error && error?.sameError && !error?.confirmPassword && <Text style={style.error_container}>{error.sameError}</Text>}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: "5%"  }}>
              <TouchableOpacity style={{
              width: "85%", height: 49, backgroundColor:theme.theme==="dark"? 'yellow':"#612CD2", alignContent: 'center', alignItems: 'center', justifyContent: 'center', border: 1, borderRadius: 2
              }}
                onPress={() => { submitFunc() }}
              >
                <Text style={{
                  fontFamily: Fonts.Bold, fontSize: RFPercentage(2), textAlign: "center",
                  width: "100%", color: theme.theme == "dark" ? "#000" : "#fff", fontWeight:'400'
                }}>Update</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>

        {/* <Modal
        isVisible={true}
        entry="bottom"
        onRequestClose={() => {
          closeModel();
        }}
        backdropPressToClose={true}
        //visible={isModalVisible}
      >
        <View
          style={{
            height: 290,
            alignSelf: "center",
            width: "80%",
            backgroundColor: theme.blackandwhite,
            borderRadius: 10,
          }}
        >
          <View style={{ padding: 10, alignItems: "flex-end" }}>
      
          </View>
          <View style={{ alignItems: "center" }}>

             <Image source={require("../../assets/img/question-mark.png")} style={{ alignSelf: "center", width: 80, height: 80 }} /> 
            <Text
              style={{
                color: theme.text,
                fontFamily: Fonts.Regular,
                fontSize: 20,
                marginTop: "6%",
                alignSelf: "center",
                textAlign:"center",
                width:200
              }}
            >
             Are you sure
            </Text>
            <Text
              style={{
                color: theme.text,
                fontFamily: Fonts.Regular,
                fontSize: 20,
                alignSelf: "center",
                textAlign:"center",
                width:200
              }}
            >
             you want to logout?
            </Text>
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                <TouchableOpacity style={{backgroundColor:"transparent",borderColor:"#00B0FF",
            borderWidth:1,borderRadius:30,paddingHorizontal:30,marginTop:30}}
            onPress={() => props.navigation.navigate("NLanguages")}>
                    <Text style={{paddingVertical:15,paddingHorizontal:15}}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor:"transparent",borderColor:"#989898",
            borderWidth:1,borderRadius:30,paddingHorizontal:30,marginTop:30,marginLeft:10}}
            onPress={() => props.navigation.navigate("ChangePassword")}>
                    <Text style={{paddingVertical:15,paddingHorizontal:15}}>No</Text>
                </TouchableOpacity>
            </View>
          </View>
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

                  <Text style={style.createText}>Password Reset</Text>
                  <Text style={style.modelText}>Successful</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        )}
      </ImageBackground>
      </SafeAreaView>
    </>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    title_text: {
      fontFamily: Fonts.Medium,
      fontSize: RFPercentage(1.9),
      color: theme.theme==="dark"? "#fff":"#000000",
      marginLeft: "5%"
    },
    box_container: {
      borderColor: 'rgba(162, 121, 250, 0.30)', borderWidth: 1,
            backgroundColor: 'rgba(155, 124, 220, 0.15)',
            borderRadius: 5, marginTop: "2.5%"
    },
    input_container: {
      fontFamily: Fonts.Regular,
      color: "#A279FA",
      fontSize: RFPercentage(1.9),
    },
    error_container: {
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(1.6),
      color: "red",
      marginTop: "1%"
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