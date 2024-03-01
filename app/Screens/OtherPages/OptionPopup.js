import React, { useCallback, useContext, useEffect, useState } from "react";
import { Modal, Pressable, StatusBar, Text, View } from "react-native";
import { borderRadius, windowWidth, windowheight } from "../../utils/Dimensions";
import { useDispatch, useSelector } from "react-redux";
import { Icon as Icn } from "react-native-elements";
import { Fonts } from "../../utils/Fonts";
import { Dappmodalupdate, Updatenetwork, Updatetripledotmodal } from "../../Redux/Actions/DapplatetsActions";
import themeContext from "../../utils/themeContext";
import Clipboard from "@react-native-community/clipboard";
import Share from "react-native-share";

import { RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect, useNavigation } from "@react-navigation/native";


const OptionPopup = ({ openPopup, setOpenPopup, value, redirectToweb, remove_favourite, setRename, setOptionValue }) => {
    const theme = useContext(themeContext)

    const dispatch = useDispatch()
    const navigation = useNavigation()

    const [findMyfav, setMyFav] = useState([]);

    const copyToClipboard = (copyVal) => {
        Clipboard.setString(copyVal);
    }

    const customShare = async (data) => {
        try {
            const shareOptions = {
                message: data,
            };
            await Share.open(shareOptions);
        } catch (error) {
            console.log("errur", error);
        }

    }

    // console.log("openPopup", openPopup, value);
    return (

        <Modal
            visible={openPopup}
            transparent={true}
            style={{
                position: "relative", zIndex: 999,
                borderRadius: 50
            }}>
            <View onStartShouldSetResponder={() => { setOpenPopup(false); setOptionValue({}) }} style={{ flex: 1, backgroundColor: 'transparent' }} >
                <View style={{ width: "50%", backgroundColor: theme.theme == "light" ? '#fff' : '#323234', position: "absolute", top: "4%", right: 0, paddingVertical: "5%", borderRadius: borderRadius * 1, borderWidth: 1, borderColor: theme.theme == "light" ? "#ccc" : "grey" }} >

                    <Pressable onPress={() => { setOpenPopup(false); redirectToweb(value) }}>
                        <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 0.7, borderBottomColor: theme.theme == "light" ? "#ccc" : "gray", paddingVertical: "5%" }}>

                            <View style={{ width: "100%", justifyContent: "center" }} >
                                <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Open in new tab</Text>

                            </View>
                        </View>
                    </Pressable>

                    <Pressable onPress={() => { setOpenPopup(false); copyToClipboard(value?.url) }} >
                        <View style={{ flexDirection: "row", alignItems: "center", borderBottomWidth: 0.7, borderBottomColor: theme.theme == "light" ? "#ccc" : "gray", paddingVertical: "5%" }}>

                            <View style={{ width: "100%", justifyContent: "center" }} >
                                <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Copy link</Text>

                            </View>
                        </View>
                    </Pressable>

                    <Pressable style={{ borderBottomWidth: 0.7, borderBottomColor: theme.theme == "light" ? "#ccc" : "gray" }} onPress={() => { setOpenPopup(false); customShare(value?.url) }}>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: "5%" }}>

                            <View style={{ width: "100%", justifyContent: "center" }} >
                                <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Share</Text>
                            </View>
                        </View>
                    </Pressable>

                    <Pressable onPress={() => { setOpenPopup(false); setRename(true) }}>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: "5%" }}>

                            <View style={{ width: "100%", justifyContent: "center" }} >
                                <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Rename</Text>

                            </View>
                        </View>
                    </Pressable>

                    <Pressable onPress={() => { setOpenPopup(false); remove_favourite(value?._id) }}>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: "5%" }}>

                            <View style={{ width: "100%", justifyContent: "center" }} >
                                <Text style={{ fontSize: RFValue(12), color: theme.theme == "light" ? "#000" : "#fff", fontFamily: Fonts.Regular, }} >Delete</Text>

                            </View>
                        </View>
                    </Pressable>

                </View>
            </View>
        </Modal>
    )
}

export default OptionPopup;