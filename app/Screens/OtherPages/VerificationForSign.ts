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
    TextInput, Linking, ToastAndroid
} from "react-native";
import { Images } from "../../utils/Images";
import themeContext from "../../utils/themeContext";
import { Fonts } from "../../utils/Fonts";
//   import PasswordInputText from 'react-native-hide-show-password-input';
// import LLogo from "../../assets/img/llogo.svg";
// import DLogo from "../../assets/img/dlogo.svg";

import LLogo from "../../assets/img/applogo2d.png";
import DLogo from "../../assets/img/applogo2l.png";



import isEmpty from "../../utils/isEmpty";
import { ApiConstants } from "../../api/ApiConstants";
import ApiClient from "../../api/ApiClient";
import { borderRadius, borderWidth, windowWidth, windowheight } from "../../utils/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
export default function VerificationForSign(props) {
    const [number, onChangeNumber] = React.useState('');
    const [password, setPassword] = useState("");
    const [verErr, setverErr] = useState("");
    const [isSelected, setSelection] = useState(false);
    const [isSelected1, setSelection1] = useState(false);
    const [error, setError] = useState("")
    const theme = React.useContext(themeContext);
    const style = styles(theme);
    useEffect(() => {
        setError("")
        setverErr("")
    }, [number])

    console.log("VerificationForSignpropspsps", props.route.params);

    const validateCode = async () => {
        if (isEmpty(number)) {
            setError("Code Required")
        } else {
            if (number == global.verificationCode) {
                var resp = await ApiClient.post(ApiConstants.userRegister, props.route.params)
                if (resp.data.success) {
                    props.navigation.navigate("Signin")
                } else {
                    ToastAndroid.showWithGravityAndOffset(
                        resp.data.msg,
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                }

                // props.navigation.navigate("Signin")
            } else {
                setverErr("Enter Valid Code")
            }
        }
    }

    return (
        <>
        <SafeAreaView style={style.container}>
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
                }}>Email Verification</Text>
                <Text style={{
                    fontFamily: Fonts.Regular, fontSize: 13, color: "#000",
                    marginBottom: 30
                }}> Enter The Verification Code Received Through The Entered Email Address</Text>
                <View style={{ marginBottom: 30, marginTop: 30 }}>
                    <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: "#000", marginBottom: 15 }}>Verification Code*</Text>
                    <View style={{
                        borderColor: theme.phrase1, borderWidth: 1, paddingHorizontal: 10, paddingLeft: 10,
                        borderRadius: 5
                    }}>
                        <TextInput
                            onChangeText={onChangeNumber}
                            value={number}
                            selectionColor={theme.text}
                            placeholder="Verififcation Code"
                            placeholderTextColor={"grey"}
                            style={{ fontFamily: Fonts.Regular, color: theme.text }}
                        />
                    </View>
                    {!isEmpty(error) && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red" }}>{error}</Text>}
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity style={{
                        backgroundColor: "transparent", borderColor: "#00B0FF", borderWidth: 1,
                        borderRadius: 30, width: 150, padding: 15, marginTop: 30
                    }} onPress={() => { validateCode() }}>
                        
                        <Text style={{
                            width: "100%", textAlign: "center",
                            fontFamily: Fonts.Regular, color: "#00B0FF"
                        }}>Continue</Text>
                    </TouchableOpacity>
                </View>
              
            </View> */}

            <View style={{ width: "100%", height: "100%", }} >

                <View style={{ width: "87.5%", alignSelf: "center", }} >

                    <View style={{ height: windowheight * 0.15, marginTop: "20%" }} >
                        {theme.theme == "light" ?
                            (
                                <Image source={LLogo} style={{ width: windowWidth * 0.45, height: windowheight * 0.08, resizeMode: "contain", alignSelf: "center" }} />

                            )
                            : (
                                <Image source={DLogo} style={{ width: windowWidth * 0.45, height: windowheight * 0.08, resizeMode: "contain", alignSelf: "center" }} />
                            )
                        }
                    </View>

                    <Text style={{ fontFamily: Fonts.Medium, fontSize: RFPercentage(3.2), color: theme.texttheme }}>Verification For Sign Up</Text>
                    <Text style={{
                        fontFamily: Fonts.Regular, fontSize: RFPercentage(1.9), color: theme.texttheme, marginTop: "1%", width: "80%"
                    }}>We sent you a verification code.</Text>

                    <View style={{ marginTop: "12.5%" }}>


                        <Text style={style.title_text}>Verification Code*</Text>

                        <View style={style.box_container}>
                            <View style={{ marginLeft: "4%", width: "90%", height: windowheight * 0.07, justifyContent: "center" }} >
                                <TextInput
                                    selectionColor={"#9370DB"}
                                    onChangeText={onChangeNumber}
                                    value={number}
                                    placeholder="Enter Code"
                                    placeholderTextColor={"grey"}
                                    style={style.input_container}
                                />

                            </View>


                        </View>
                        {!isEmpty(error) && <Text style={style.error_container}>{error}</Text>}
                        {verErr != "" ? <Text style={style.error_container}>{verErr}</Text> : <></>}
                    </View>

                    <TouchableOpacity style={{
                        backgroundColor: "transparent", borderColor: theme.theme == "light" ? "black" : "white", borderWidth: borderWidth * 0.3,
                        width: "60%", padding: "5%", marginTop: "20%", borderRadius: borderRadius * 2, alignSelf: "center"
                    }} onPress={() => { validateCode() }}  >

                        <Text style={{
                            width: "100%", textAlign: "center",
                            fontFamily: Fonts.Regular, color: theme.theme == "light" ? "black" : "white", fontSize: RFPercentage(2)
                        }}>Continue</Text>
                    </TouchableOpacity>

                    {/* <View style={{ marginTop: "12.5%", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity onPress={() => props.navigation.navigate("Signin")}>
            <Text style={{
                width: "100%", textAlign: "center", borderBottomColor: theme.text,
                borderBottomWidth: 1, fontSize: RFPercentage(2), color: theme.text
            }}>Back To Login</Text>
        </TouchableOpacity>
    </View> */}

                </View>

            </View>
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