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
    TextInput, Linking, ToastAndroid,
    Dimensions,
    ImageBackground,
    StatusBar
} from "react-native";
import { Images } from "../../utils/Images";
import themeContext from "../../utils/themeContext";
import { Fonts } from "../../utils/Fonts";
//   import PasswordInputText from 'react-native-hide-show-password-input';
// import LLogo from "../../assets/img/llogo.svg";
// import DLogo from "../../assets/img/dlogo.svg";
import Header from "../../Components/Header";


import LLogo from "../../assets/img/applogo2d.png";
import DLogo from "../../assets/img/applogo2l.png";

const windowHeight = Dimensions.get('window').height;

import isEmpty from "../../utils/isEmpty";
import { borderRadius, borderWidth, windowWidth, windowheight } from "../../utils/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
export default function VerificationCode(props) {
    const [number, onChangeNumber] = React.useState('');
    const [verErr, setverErr] = useState("");
    const [isSelected, setSelection] = useState(false);
    const [isSelected1, setSelection1] = useState(false);
    const [error, setError] = useState("")
    const theme = React.useContext(themeContext);
    const style = styles(theme);

    useEffect(() => {
        setError("")
    }, [number])


    const validateCode = async () => {
        if (isEmpty(number)) {
            setError("Code Required")
        } else {
            if (number == global.verificationCode) {
                global.verificationCode = ""
                props.navigation.navigate("ConfirmPassword")
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

                     <View style={{textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center"}}>
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
                <Text style={{
                    fontFamily: Fonts.Regular, fontSize: 13, color: "#000",
                    marginBottom: 30
                }}>Enter your Email Address to get you a verification code</Text>
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
                            placeholder="Verification Code"
                            placeholderTextColor={"grey"}
                            style={{ fontFamily: Fonts.Regular,color:theme.text }}
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
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <View style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <View style={{ windowheight, justifyContent: 'flex-start' }}>
                            <ImageBackground source={Images.background} style={{ width: windowWidth, height: windowheight, paddingTop: StatusBar.windowheight, }} resizeMode="cover">

                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: "100%" }}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Image style={{ width: 74, height: 79 }} source={require("../../assets/img/appicon.png")} resizeMode="contain" />
                                    </View>
                                    <View style={{ alignItems: 'center', height: '50%', justifyContent: 'center', paddingLeft: 10 }}>
                                        <Image style={{ width: 129, height: 21 }} source={require("../../assets/img/keyboard3.0.png")} resizeMode="contain" />
                                    </View>
                                </View>
                                <View style={{ padding: 20 }}>
                                    <Text style={{ fontFamily: Fonts.Medium, fontSize: RFPercentage(3.8), color: "#fff" }}>We've Send You a Code</Text>
                                    <Text style={{ fontFamily: Fonts.Medium, fontSize: RFPercentage(1.9), color: "#fff" }}>Enter it below to verify your email address</Text>

                                    {/* <Text style={{                      
              fontFamily: Fonts.Regular, fontSize: RFPercentage(2), color: theme.texttheme, marginTop: "1%"
            }}>Enter your email address to login</Text> */}

                                    <View style={{ marginTop: "5%" }}>


                                        <Text style={style.title_text}>Verification Code*</Text>

                                        <View style={style.box_container}>
                                            <View style={{ marginLeft: "4%", width: "90%", height: windowHeight * 0.07, justifyContent: "center" }} >
                                                <TextInput
                                                    selectionColor={"#A279FA"}
                                                    onChangeText={(val) => { onChangeNumber(val); setverErr("") }}
                                                    value={number}
                                                    placeholder="Enter Code"
                                                    placeholderTextColor={"#A279FA"}
                                                    style={style.input_container}
                                                    keyboardType="number-pad"
                                                />

                                            </View>


                                        </View>
                                        {!isEmpty(error) && <Text style={style.error_container}>{error}</Text>}
                        {verErr != "" ? <Text style={style.error_container}>{verErr}</Text> : <></>}
                                    </View>
                                    <TouchableOpacity style={{
                                        alignSelf: "center", marginTop: "20%", width: 315, height: 49, backgroundColor: 'yellow', alignContent: 'center', alignItems: 'center', justifyContent: 'center', border: 1, borderRadius: 1.76
                                    }} onPress={() => { submitFunc() }}  >

                                        <Text style={{
                                            width: "100%", textAlign: "center",
                                            fontFamily: Fonts.Regular, color: "#000", fontSize: RFPercentage(2)
                                        }}>Continue</Text>
                                    </TouchableOpacity>
                                </View>
                            </ImageBackground>
                        </View>
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
            color: "#FFF",
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
        }
    });