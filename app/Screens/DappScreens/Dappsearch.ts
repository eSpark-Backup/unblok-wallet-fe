
import React, { useContext, useState, useRef } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { borderRadius, windowheight } from "../../utils/Dimensions";
import themeContext from "../../utils/themeContext";
import SearchiconDark from '../../assets/icons/darktheme/Search.svg'
import BackDark from '../../assets/icons/darktheme/Back arrow.svg'
import { RFValue } from "react-native-responsive-fontsize";
import { Fonts } from "../../utils/Fonts";
import { Image } from "react-native-elements";


const Dappsearch = (props) => {
    const theme = useContext(themeContext)
    const [search, setSearch] = useState("")
    const history = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    const inputRef = useRef();
    console.log("props",props);
    return (
        <View style={{ backgroundColor: theme.background, width:"100%", height:windowheight * 0.935 }} >
            {/* <View elivation={2} style={{ width: "100%", height: windowheight * 0.075, backgroundColor: "#323234", flexDirection: "row", alignItems: "center" }} >
                <Pressable onPress={() => props.navigation.goBack()} >
                    <BackDark width={35} height={35} style={{ resizeMode: "contain" }} />
                </Pressable>
                <View style={{ width: "70%", height: "65%", borderRadius: borderRadius * 1, flexDirection: "row", alignItems: "center", borderColor: "#323234", borderWidth: 1 }} >
                    <View style={{ width: "15%", height: "100%", justifyContent: "center" }} >
                        <SearchiconDark width={20} height={20} style={{ alignSelf: "center", resizeMode: "contain" }} />
                    </View>
                    <TextInput
                        placeholder="Search or Type Url"
                        value={search}
                        ref={inputRef}
                        onLayout={() => inputRef.current.focus()}
                        onChangeText={(e) => setSearch(e)}
                        style={{ height: 40, width: "85%", fontSize: RFValue(12), color: "#fff", fontFamily: Fonts.Regular }}
                        placeholderTextColor={"#fff"}
                    />
                </View>
                <Pressable onPress={() => setSearch("")} style={{ marginLeft: "5%" }} >
                    <Text style={{ fontSize: RFValue(12), color: "#fff", fontFamily: Fonts.Regular, }} >Cancel</Text>
                </Pressable>
            </View> */}

            <View style={{ width: "100%", backgroundColor: theme.background }} >
                {/* <ScrollView>
                    <Text style={{ fontSize: RFValue(13), color: "#5e626a", fontFamily: Fonts.Regular, marginLeft: "5%", marginTop: "5%" }} >History</Text>
                    {history.map((user) => (
                        <View style={{ width: "90%", height: 80, padding:20, backgroundColor: "transparent", borderBottomWidth:1, borderBottomColor: theme.phrase1, alignSelf: "center", marginTop: "2.5%", flexDirection: "row" }} >
                            <View style={{ width: 50, height: "100%", justifyContent: "center", alignItems:"center" }} >
                                <View style={{ width: 40, height: "100%",  borderRadius: borderRadius * 3 }} >
                                    <Image source={require("../../assets/img/bizztoken.png")} style={{ width: 40, height: 40, alignSelf: "center" }} resizeMode="contain" />
                                </View>
                            </View>

                            <View style={{ width: "80%", height: "100%", justifyContent: "center" }} >
                                <Text numberOfLines={1} style={{ fontSize: RFValue(14), color: "#fff", fontFamily: Fonts.Regular, }} >Breaking news from delhi has attacked by terroist </Text>
                                <Text numberOfLines={1} style={{ fontSize: RFValue(14), color: "#5e626a", fontFamily: Fonts.Regular, }} >cnn.com</Text>
                            </View>
                        </View>
                    ))
                    }
                </ScrollView> */}

            </View>
        </View>
    )
}

export default Dappsearch;