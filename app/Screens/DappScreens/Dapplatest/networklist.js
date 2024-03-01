import React, { useContext } from "react";
import { Modal, Pressable, StatusBar, Text, View } from "react-native";
import WebView from "react-native-webview";
import Dappheader from "./Dappheader";
import { windowWidth, windowheight } from "../../../utils/Dimensions";
import { CHAIN_INFO } from "../useWeb3";
import { useDispatch, useSelector } from "react-redux";
import { Icon as Icn, Image } from "react-native-elements";
import { Fonts } from "../../../utils/Fonts";
import { Dappmodalupdate, Updatenetwork } from "../../../Redux/Actions/DapplatetsActions";
import themeContext from "../../../utils/themeContext";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { showImage } from "../../../utils/showImage";



const Networklist = ({ visible, onhide }) => {
    const theme = useContext(themeContext);
    const dispatch = useDispatch()
    const Modalupdate = (item) => dispatch(Dappmodalupdate(item))
    const Networkupdate = (item) => dispatch(Updatenetwork(item))

    const modaldata = useSelector(state => ({
        modalstatus: state.DapplatestReducer.networkmodal,
        selectednetwork: state.DapplatestReducer.selectednetwork
    }));
    const {
        modalstatus,
        selectednetwork
    } = modaldata

    return (

        <Modal
            transparent={true}
            visible={modalstatus}
            animationType="slide"
            style={{
                position: "relative", zIndex: 999,
                borderRadius: 50,
              
            }}
        >
            <StatusBar backgroundColor={"rgba(9, 3, 22, 0.89)"} />
            <View onStartShouldSetResponder={() => Modalupdate(false)} style={{ flex: 1,   backgroundColor:"rgba(9, 3, 22, 0.90)", justifyContent: "center" }} >
                <View style={{ backgroundColor:theme.theme==="dark" ? "rgba(155, 124, 220, 0.411)":"#f1f1f1", borderRadius: 5,borderColor:"rgba(162, 121, 250, 0.30)",borderWidth:2, paddingVertical: 20,paddingBottom:40, width: "75%", alignSelf: "center",}}>
                
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginHorizontal: 20 }}>
                        <Pressable onPress={() => Modalupdate(false)}>
                            <Text style={{color:theme.theme==="dark"?"white":"black",fontFamily: Fonts.Bold, fontSize: RFPercentage(3),}}>X</Text>
                        </Pressable>
                    </View>
                    <View style={{position:"relative" }}>
                        <Text style={{ fontSize: RFValue(18),  fontFamily: Fonts.Bold, width: "100%",fontWeight:"bold", textAlign: "center", color:theme.theme==="dark"?"#FFF600": "#612CD2" }}>Networks</Text>
                        <Image
                      style={{ width: "90%",height:1.5,alignSelf:"center",marginVertical:"5%"  }}
                      source={require("../../../assets/img/devider.png")}
                      resizeMode="contain"
                    />
                    <Image
                      style={{ width: 30, height: 30, top: 0, left: "50%", marginLeft: -15, position: "absolute" }}
                      source={require("../../../assets/img/maskgroup.png")}
                      resizeMode="contain"
                    />
                        <View >
                            {CHAIN_INFO.map((item, index) =>
                            <>
                            {console.log("item Image Token List",item)}
                                <Pressable style={{
                                    paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "flex-start"
                                }}
                                    onPress={() => {
                                        Networkupdate(index)
                                        Modalupdate(false)
                                    }}
                                    key={Math.random()}
                                >
                                    {/* {item.img} */}
                                    {showImage(item?.currency)}
                                    <Text style={{ fontFamily: index == selectednetwork ? Fonts.Bold: Fonts.Regular, fontSize: 13, marginLeft: 20, color:theme.theme==="dark"?"white": "#000" }}>{item.name}</Text>
                                </Pressable>
                                {index !== CHAIN_INFO.length - 1 && ( 
      <Image
        style={{ width: "90%", height: 1.5, marginLeft: "5%", marginVertical: "5%" }}
        source={require("../../../assets/img/deviderPNG.png")}
        resizeMode="contain"
      />
    )}
                            </>
                                )
                            }
                        </View>
                    </View>
                </View>
            </View>
        </Modal>

    )
}

export default Networklist;