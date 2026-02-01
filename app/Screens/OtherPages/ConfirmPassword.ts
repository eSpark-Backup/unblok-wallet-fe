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
  TextInput, Linking, ToastAndroid, ImageBackground, StatusBar
} from "react-native";
import { Images } from "../../utils/Images";
import themeContext from "../../utils/themeContext";
import { Fonts } from "../../utils/Fonts";
import Modal from "react-native-modal";
// import LLogo from "../../assets/img/llogo.svg";
// import DLogo from "../../assets/img/dlogo.svg";

import LLogo from "../../assets/img/applogo2d.png";
import DLogo from "../../assets/img/applogo2l.png";
import Eyeoff from "../../assets/img/eye.svg";
import Eyeon from '../../assets/img/eyeon.svg'


import Eye from "../../assets/img/eye.svg";
import { formValidation, ChangePassword } from "./common/Confirm_Password";
import isEmpty from "../../utils/isEmpty";
import { borderRadius, windowWidth, windowheight } from "../../utils/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import Header from "../../Components/Header";
//   import PasswordInputText from 'react-native-hide-show-password-input';
export default function ConfirmPassword(props) {
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = useState({})
  const [show1, setShow1] = useState(true);
  const [show2, setShow2] = useState(true);
  const [isSelected1, setSelection1] = useState(false);
  const theme = React.useContext(themeContext);
  const style = styles(theme);
  useEffect(() => {
    setError({})
  }, [newPassword, confirmPassword])

  const submitFunction = async () => {
    var validate = await formValidation({ newPassword, confirmPassword })
    if (!isEmpty(validate)) setError(validate);
    else {
      var params = {
        mailAddress: global.verifimail,
        newpassword: newPassword,
        from: "forgetPassword"
      }
      ChangePassword(params)
        .then((res) => {
          console.log("resssss", res.data);
          if (res.data.success) {
            // ToastAndroid.showWithGravityAndOffset(
            //   res.data.msg,
            //   ToastAndroid.LONG,
            //   ToastAndroid.BOTTOM,
            //   25,
            //   50
            // );
            props.navigation.navigate("Signin")
          } else {
            ToastAndroid.showWithGravityAndOffset(
              res.data.msg,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
          }
        })
        .catch((err) => {
          console.log("errr", err);
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
      {/* <View style={{ marginHorizontal: 25, marginTop: 50 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>

          <View style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>

            {theme.theme == "light" ?
              (
                <Image source={LLogo} resizeMode="contain" />
              )
              : (
                <Image source={DLogo} resizeMode="contain" />
              )
            }

          </View>


        </View>
        <Text style={{
          fontFamily: Fonts.Regular, fontSize: 20, color: "#000",
          marginBottom: 10, marginTop: 30
        }}>Password Recovery</Text>
      
        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: "#000", marginBottom: 15 }}>New Password*</Text>
          <View style={{
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            borderColor: theme.phrase1, borderWidth: 1, paddingHorizontal: 10,
            borderRadius: 5
          }}>
            <TextInput
              secureTextEntry={show1}
              selectionColor={theme.text}
              onChangeText={setNewPassword}
              value={newPassword}
              placeholder="Enter New Password"
              placeholderTextColor={"grey"}
              style={{ fontFamily: Fonts.Regular, paddingLeft: 10, width: "95%", color: theme.text }}
            />
            <TouchableOpacity onPress={() => setShow1(!show1)}>
              {theme.theme == "light" ?
                <Eye fill={"#000"} />
                : <Eye fill={"#fff"} />
              }
            </TouchableOpacity>
          </View>
          {error && error?.newPasswordError && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red" }}>{error.newPasswordError}</Text>}

        </View>
        <View style={{ marginBottom: 30 }}>
          <Text style={{
            fontFamily: Fonts.Regular, fontSize: 15, color: "#000",
            marginBottom: 15
          }}>Confirm Password*</Text>
         

          <View style={{
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            borderColor: theme.phrase1, borderWidth: 1, paddingHorizontal: 10,
            borderRadius: 5
          }}>
            <TextInput
              secureTextEntry={show2}
              selectionColor={theme.text}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              placeholder="ConfirmPassword"
              placeholderTextColor={"grey"}
              style={{ fontFamily: Fonts.Regular, paddingLeft: 10, width: "95%", color: theme.text }}
            />
            <TouchableOpacity onPress={() => setShow2(!show2)}>
              {theme.theme == "light" ?
                <Eye fill={"#000"} />
                : <Eye fill={"#fff"} />
              }
            </TouchableOpacity>
          </View>
          {error && error?.confirmPasswordError && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red" }}>{error.confirmPasswordError}</Text>}
          {error && error?.sameError && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red", marginTop: 10 }}>{error.sameError}</Text>}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <TouchableOpacity style={{
            backgroundColor: "transparent", borderColor: "#00B0FF", borderWidth: 1,
            borderRadius: 30, width: 150, padding: 15, marginTop: 30
          }}
            onPress={() => submitFunction()}
          >
            <Text style={{
              width: "100%", textAlign: "center",
              fontFamily: Fonts.Regular, color: "#00B0FF"
            }}>Continue</Text>
          </TouchableOpacity>
        </View>
        <View style={{
          marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "center",
          marginTop: 30
        }}>
          <TouchableOpacity onPress={() => props.navigation.navigate("Signin")}>
            <Text style={{
              width: "100%", textAlign: "center", borderBottomColor: theme.search,
              borderBottomWidth: 1, color: theme.text
            }}>Back To Login</Text>
          </TouchableOpacity>
        </View>
      </View> */}

      <View style={{ width: "100%", height: "100%" }} >
        <ScrollView showsVerticalScrollIndicator={false} >
       
          <View style={{ height: windowheight * 0.25, justifyContent: "flex-end",}} >
          <Header name={""} leftImage={"back"} />
            {theme.theme == "light" ?
              (
                <Image source={LLogo} style={{ width: windowWidth * 0.45, height: windowheight * 0.08, resizeMode: "contain", alignSelf: "center" }} />

              )
              : (
                <Image source={DLogo} style={{ width: windowWidth * 0.45, height: windowheight * 0.08, resizeMode: "contain", alignSelf: "center" }} />
              )
            }
          </View>
          <View style={{ width: "85%", alignSelf: "center" }} >
            <Text style={{
              fontFamily: Fonts.Medium, fontSize: RFPercentage(3), color: theme.text, marginTop: "10%"
            }}>Password Recovery</Text>

            <Text style={{
              fontFamily: Fonts.Regular, fontSize: RFPercentage(1.8), color: theme.text, marginTop: "2%"
            }}>Enter new password</Text>

            <View style={{ marginTop: "10%" }} >
              <Text style={style.title_text}>New Password*</Text>


              <View style={{
                alignItems: "center",
                borderColor: theme.phrase1, borderWidth: 1,
                borderRadius: 5, marginTop: "2.5%"
              }}>
                <View style={{ marginLeft: "4%", width: "95%", height: windowheight * 0.07, flexDirection: "row" }} >
                  <View style={{ width: "85%", justifyContent: "center" }} >
                    <TextInput
                      secureTextEntry={show1}
                      selectionColor={theme.text}
                      onChangeText={setNewPassword}
                      value={newPassword}
                      placeholder="Enter New Password"
                      placeholderTextColor={"grey"}
                      style={style.input_container}
                    />
                  </View>
                  <View style={{ width: "15%", justifyContent: "center" }} >
                    <TouchableOpacity
                      onPress={() => setShow1(!show1)}
                    >
                      {!show1 ?
                        <Eyeon style={{ alignSelf: "center", aspectRatio: 1 }} width={windowWidth * 0.05} height={windowWidth * 0.05} /> :
                        <Eyeoff style={{ alignSelf: "center", aspectRatio: 1 }} width={windowWidth * 0.05} height={windowWidth * 0.05} />}
                    </TouchableOpacity>
                  </View>
                </View>


              </View>

              {error && error?.newPasswordError && <Text style={style.error_container}>{error.newPasswordError}</Text>}
            </View>

            <View style={{ marginTop: "5%" }} >
              <Text style={style.title_text}>Confirm Password*</Text>


              <View style={{
                alignItems: "center",
                borderColor: theme.phrase1, borderWidth: 1,
                borderRadius: 5, marginTop: "2.5%"
              }}>
                <View style={{ marginLeft: "4%", width: "95%", height: windowheight * 0.07, flexDirection: "row" }} >
                  <View style={{ width: "85%", justifyContent: "center" }} >
                    <TextInput
                      secureTextEntry={show2}
                      selectionColor={theme.text}
                      onChangeText={setConfirmPassword}
                      value={confirmPassword}
                      placeholder="Enter confirm Password"
                      placeholderTextColor={"grey"}
                      style={style.input_container}
                    />
                  </View>
                  <View style={{ width: "15%", justifyContent: "center" }} >
                    <TouchableOpacity
                      onPress={() => setShow2(!show2)}
                    >
                      {!show2 ?
                        <Eyeon style={{ alignSelf: "center", aspectRatio: 1 }} width={windowWidth * 0.05} height={windowWidth * 0.05} /> :
                        <Eyeoff style={{ alignSelf: "center", aspectRatio: 1 }} width={windowWidth * 0.05} height={windowWidth * 0.05} />}
                    </TouchableOpacity>
                  </View>
                </View>


              </View>

              {error && error?.confirmPasswordError && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red" }}>{error.confirmPasswordError}</Text>}
              {error && error?.sameError && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red", marginTop: 10 }}>{error.sameError}</Text>}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity style={{
                backgroundColor: "transparent", borderColor: theme.texttheme, borderWidth: 1,
                width: "40%", height: windowheight * 0.06, justifyContent: "center", marginTop: "10%", borderRadius: borderRadius * 2
              }}
                onPress={() => submitFunction()}
              >
                <Text style={{
                  width: "100%", textAlign: "center",
                  fontFamily: Fonts.Regular, color: theme.texttheme, fontSize: RFPercentage(1.9)
                }}>Continue</Text>
              </TouchableOpacity>
            </View>

            <View style={{
              marginTop:"10%", flexDirection: "row", alignItems: "center", justifyContent: "center",
           
            }}>
              {/* <TouchableOpacity onPress={() => props.navigation.navigate("Signin")}>
                <Text style={{
                  width: "100%", textAlign: "center", borderBottomColor: theme.search,
                  borderBottomWidth: 1, color: theme.text,fontSize:RFPercentage(1.9)
                }}>Back To Login</Text>
              </TouchableOpacity> */}
            </View>
          

      </View>


    </ScrollView >


      </View >


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

             <Image source={Images.lighttick} style={{ alignSelf: "center", width: 80, height: 80 }} /> 
            <Text
              style={{
                color: theme.text,
                fontFamily: Fonts.Medium,
                fontSize: 18,
                marginTop: "6%",
                alignSelf: "center",
                textAlign:"center",
                paddingHorizontal:10
              }}
            >
             Password Updated Successfully
            </Text>
            <View>
                <TouchableOpacity style={{backgroundColor:"transparent",borderColor:"#00B0FF",
            borderWidth:1,borderRadius:30,paddingHorizontal:30,marginTop:30}}
            onPress={() => props.navigation.navigate("Signup")}>
                    <Text style={{paddingVertical:15,paddingHorizontal:20,color:"#00B0FF",fontFamily:Fonts.Regular,fontSize:13}}>Continue</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
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
      color: theme.texttheme,
      marginLeft: "5%"
    },
    box_container: {
      borderColor: theme.phrase1, borderWidth: 1,
      borderRadius: 5, marginTop: "2.5%"
    },
    input_container: {
      fontFamily: Fonts.Regular,
      color: theme.text,
      fontSize: RFPercentage(1.9),
    },
    error_container: {
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(1.6),
      color: "red",
      marginTop: "1%"
    }
  });