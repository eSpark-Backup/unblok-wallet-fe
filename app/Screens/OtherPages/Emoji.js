import React, { useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput, Linking
} from "react-native";
import { Images } from "../../utils/Images";
import themeContext from "../../utils/themeContext";
import { Fonts } from "../../utils/Fonts";
// import EmojiBoard from 'react-native-emoji-board';
// import LLogo from "../../assets/img/llogo.svg";
// import DLogo from "../../assets/img/dlogo.svg";
//   import PasswordInputText from 'react-native-hide-show-password-input';
export default function Emoji(props) {
  const [number, onChangeNumber] = React.useState('');
  const [password, setPassword] = useState("");
  const [isSelected, setSelection] = useState(false);
  const [isSelected1, setSelection1] = useState(false);
  const theme = React.useContext(themeContext);
  const [show, setShow] = useState(true);
  const onClick = emoji => {
    console.log("hellllllllo",emoji);
  };
  return (
    <>
      <View style={{ marginHorizontal: 25, marginTop: 50 }}>
        {/* {theme.theme == "light" ?
          (<LLogo />)
          : (<DLogo />)
        } */}

        <Text style={{
          fontFamily: Fonts.Regular, fontSize: 30, color: "#000",
          marginBottom: 10
        }}>Sign In</Text>
        <Text style={{
          fontFamily: Fonts.Regular, fontSize: 15, color: "#000",
          marginBottom: 30
        }}>Enter your Email Address</Text>
        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: "#000", marginBottom: 15 }}>Email Address*</Text>
          <View style={{
            borderColor: theme.search, borderWidth: 1, paddingHorizontal: 10,
            borderRadius: 5
          }}>
            <TextInput
              selectionColor={theme.text}
              onChangeText={onChangeNumber}
              value={number}
              placeholder="Enter your Email Id"
              style={{ fontFamily: Fonts.Regular, paddingLeft: 10 }}
            />
          </View>
        </View>
        <View style={{ marginBottom: 30 }}>
          <Text style={{
            fontFamily: Fonts.Regular, fontSize: 15, color: "#000",
            marginBottom: 15
          }}>Password*</Text>
          {/* <PasswordInputText
                    value={password}
                    onChangeText={ (password) => setPassword(password) }
                /> */}
          <View style={{
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            borderColor: theme.search, borderWidth: 1, paddingHorizontal: 10,
            borderRadius: 5
          }}>
            <TextInput
              secureTextEntry
              selectionColor={theme.text}
              onChangeText={onChangeNumber}
              value={number}
              placeholder="Enter Password"
              style={{ fontFamily: Fonts.Regular, paddingLeft: 10 }}
            />
            {/* <Image source={require("../../assets/img/eye.png")} /> */}
          </View>
        </View>
        <View style={{
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          marginHorizontal: 20
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
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
            <Text style={{ color: theme.text, fontFamily: Fonts.Regular, fontSize: 13 }}>Remember Me</Text>
          </View>
          <View>
            <TouchableOpacity>
              <Text style={{
                borderBottomWidth: 1, borderBottomColor: "#000",
                width: 107
              }}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 30 }}>
          <TouchableOpacity style={{
            width: 15, height: 15, borderWidth: 1,
            borderColor: "#707070", marginRight: 5, borderRadius: 2, marginLeft: 20
          }} onPress={() => {
            if (isSelected1 == true) {
              setSelection(false);
            } else {
              setSelection(true);
            }
          }}>
            {/* {isSelected1 == true ?
              (<Image source={require("../../assets/img/tick.png")} style={
                { position: "relative", top: 3, left: 2 }} />)
              : (<></>)
            } */}
          </TouchableOpacity>
          <Text style={{ color: theme.text, fontFamily: Fonts.Regular, fontSize: 13 }}>I accept the terms and conditions</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 30 }}>
          <TouchableOpacity style={{
            borderRightWidth: 1, borderRightColor: theme.search, paddingRight: 20,
            fontFamily: Fonts.Regular
          }}><Text>Privacy Policy</Text></TouchableOpacity>
          <TouchableOpacity style={{ paddingLeft: 20 }}><Text style={{
            fontFamily: Fonts.Regular
          }}>Terms of service</Text></TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <TouchableOpacity style={{
            backgroundColor: "transparent", borderColor: "#00B0FF", borderWidth: 1,
            borderRadius: 30, width: 200, padding: 15, marginTop: 30, paddingVertical: 20
          }} onPress={() => props.navigation.navigate("PasswordRecovery1")}>
            <Text style={{
              width: "100%", textAlign: "center",
              fontFamily: Fonts.Regular
            }}>Sign In</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ width: "100%", textAlign: "center" }}>Don't have an account? <Text style={{ borderBottomWidth: 1, borderBottomColor: "#000", color: "#000", width: 100 }}
            onPress={() => Linking.openURL('#')}>Sign Up
          </Text></Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => setShow(!show)}>
        <Text>click here</Text>
      </TouchableOpacity>
      {/* <EmojiBoard showBoard={show} onClick={onClick} /> */}
    </>
  )
}