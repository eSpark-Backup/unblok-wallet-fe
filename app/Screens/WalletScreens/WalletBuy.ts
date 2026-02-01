import React from "react";
import {
    View, Image, TouchableOpacity, Text, SafeAreaView,
    StyleSheet
} from "react-native";
import themeContext from "../../utils/themeContext";
import { Fonts } from "../../utils/Fonts";
import Header from "../../Components/Header";
export default function WalletBuy() {
    const theme = React.useContext(themeContext);
    const style = styles(theme);
    return (
        <>
            <SafeAreaView style={style.container}>
                <Header name={"Wallet buy"} leftImage={"back"} />
                <View>
                    <View style={{ width: "100%", textAlign: "center" }}>
                        <Text style={{
                            color: theme.text, fontFamily: Fonts.Medium, fontSize: 60,
                            width: "100%", textAlign: "center"
                        }}>$ 150</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 30 }}>
                        <Image source={require("../../assets/img/moon-pay.png")} style={{ width: 157, height: 53 }} />
                    </View>
                    <View>
                        <View style={{
                            flexDirection: "row", alignItems: "center", justifyContent: "space-around",
                            marginBottom: 20, marginTop: 20
                        }}>
                            <TouchableOpacity>
                                <Text style={{
                                    borderWidth: 1, borderColor: "#00B0FF", borderRadius: 50,
                                    paddingHorizontal: 22, paddingVertical: 15, fontSize: 20, color: "#00b0ff"
                                }}>1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={{
                                    borderWidth: 1, borderColor: "#00B0FF", borderRadius: 50,
                                    paddingHorizontal: 22, paddingVertical: 15, fontSize: 20, color: "#00b0ff"
                                }}>2</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={{
                                    borderWidth: 1, borderColor: "#00B0FF", borderRadius: 50,
                                    paddingHorizontal: 22, paddingVertical: 15, fontSize: 20, color: "#00b0ff"
                                }}>3</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginBottom: 20 }}>
                            <TouchableOpacity>
                                <Text style={{
                                    borderWidth: 1, borderColor: "#00B0FF", borderRadius: 50,
                                    paddingHorizontal: 22, paddingVertical: 15, fontSize: 20, color: "#00b0ff"
                                }}>4</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={{
                                    borderWidth: 1, borderColor: "#00B0FF", borderRadius: 50,
                                    paddingHorizontal: 22, paddingVertical: 15, fontSize: 20, color: "#00b0ff"
                                }}>5</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={{
                                    borderWidth: 1, borderColor: "#00B0FF", borderRadius: 50,
                                    paddingHorizontal: 22, paddingVertical: 15, fontSize: 20, color: "#00b0ff"
                                }}>6</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginBottom: 20 }}>
                            <TouchableOpacity>
                                <Text style={{
                                    borderWidth: 1, borderColor: "#00B0FF", borderRadius: 50,
                                    paddingHorizontal: 22, paddingVertical: 15, fontSize: 20, color: "#00b0ff"
                                }}>7</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={{
                                    borderWidth: 1, borderColor: "#00B0FF", borderRadius: 50,
                                    paddingHorizontal: 22, paddingVertical: 15, fontSize: 20, color: "#00b0ff"
                                }}>8</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={{
                                    borderWidth: 1, borderColor: "#00B0FF", borderRadius: 50,
                                    paddingHorizontal: 22, paddingVertical: 15, fontSize: 20, color: "#00b0ff"
                                }}>9</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            flexDirection: "row", alignItems: "center", justifyContent: "space-around",
                            marginBottom: 20
                        }}>
                            <TouchableOpacity>
                                <View style={{
                                    borderWidth: 1, borderColor: "#00B0FF", borderRadius: 50,
                                    padding: 13, marginLeft: 8
                                }}>
                                    <Image source={require("../../assets/img/biometric.png")} style={{ width: 33, height: 33 }} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={{
                                    borderWidth: 1, borderColor: "#00B0FF", borderRadius: 50,
                                    paddingHorizontal: 22, paddingVertical: 15, fontSize: 20, color: "#00b0ff",
                                    marginLeft: 8
                                }}>0</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={{
                                    padding: 20
                                }}>
                                    <Image source={require("../../assets/img/close-password.png")} style={{ width: 35, height: 27 }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                            <TouchableOpacity style={{
                                borderWidth: 1, borderColor: "#00B0FF", borderRadius: 50,
                                width: 250, height: 55
                            }}>
                                <Text style={{
                                    fontFamily: Fonts.Regular, color: "#00B0FF",
                                    fontSize: 16, width: "100%", textAlign: "center", lineHeight: 50
                                }}>Next</Text>
                            </TouchableOpacity>
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

    });