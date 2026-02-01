import React, { useContext } from "react";
import { Platform, Pressable, Text, View } from "react-native"
import Ethlogo from '../../../assets/img/ethLogo.svg'
import Shareblocklight from '../../../assets/icons/lighttheme/Share.svg'
import Shareblockdark from '../../../assets/icons/darktheme/Share.svg'
import themeContext from "../../../utils/themeContext";
import Lockdark from '../../../assets/icons/darktheme/Lock.svg'
import Locklight from '../../../assets/icons/lighttheme/Lock.svg'
import { Fonts } from "../../../utils/Fonts";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import { customShare, findHostNameWithUrl } from "../../../utils/common";
import { CHAIN_INFO } from "../useWeb3";
import { Dappmodalupdate, setNavigateAction } from "../../../Redux/Actions/DapplatetsActions";

const Dappheadernew = ({ search }) => {
    const theme = useContext(themeContext)
    const dispatch = useDispatch()

    const modaldata = useSelector(state => ({
        selectednetwork: state.DapplatestReducer.selectednetwork,
        tablength: (state.DapplatestReducer.multitabs).length,
        multitabs: (state.DapplatestReducer.multitabs),
        tripledotmodal: state.DapplatestReducer.tripledotmodal,
        weburl: state.DapplatestReducer.weburl,
        searchUrl: state.DapplatestReducer.searchUrl,
        selectedTab: state.DapplatestReducer.selectedTab,
        currenttabId: state.DapplatestReducer.currenttabId,
    }));

    const { Session } = useSelector(
        (state) => state.wcreducer
    );

    const Modalupdate = (item) => dispatch(Dappmodalupdate(item))
    const setnavigateAction = (item) => dispatch(setNavigateAction(item));

    const {
        selectednetwork,
        tablength,
        multitabs,
        tripledotmodal,
        weburl,
        searchUrl,
        selectedTab,
        currenttabId
    } = modaldata


    const current_chain = (chainId) => CHAIN_INFO.filter(
        (it) => it.chainId == chainId
    )?.pop();

    // console.log("sfesfesd",Session,selectednetwork,(Session && Session?.chainId) ? current_chain((Session?.chainId)) ?? CHAIN_INFO[selectednetwork] : CHAIN_INFO[selectednetwork]);
    return (
        <View style={{ alignItems: "center", backgroundColor:theme.theme == "light" ? "#FFF" : "rgb(25,14,47)",}} >
            <View style={{ width: "90%", alignSelf: "center", backgroundColor:theme.theme==="dark"?"transparent":"rgba(255, 255, 255, 0.10)",borderRadius:5, flexDirection: "row",paddingHorizontal:"2%", alignItems: "center", justifyContent:"space-between",height:49, }} >

                <View style={{width:"15%"}}>
                {/* <Pressable onPress={() => Modalupdate(true)} style={{  alignItems: "center" }} >
                    <View style={{width:27, height:27, backgroundColor:'transparent', alignItems:'center', borderRadius:2}}>
                    {(Session && Session?.chainId) ? current_chain((Session?.chainId))?.img ?? CHAIN_INFO[selectednetwork].img : CHAIN_INFO[selectednetwork].img}
                    </View>
                </Pressable> */}
                
                <Pressable onPress={() => search()} style={{  flexDirection: "row", justifyContent: "center", alignItems: "center",}} >
                    {theme.theme==="dark"?(

                        <Lockdark  width={16} height={16}  /> 
                    ):(
                        <Locklight width={16} height={16} /> 
                    )}
                    </Pressable>
                </View>
                
               <Pressable onPress={() => search()} style={{ width: "70%",alignItems:"center" }} >
                    <Text numberOfLines={1} style={{ fontFamily: Fonts.Regular, fontSize: RFValue(12), color:theme.theme==="light"?"#2F2448": "white", }} >{findHostNameWithUrl(searchUrl)?.hostname?.slice(0, 4) == "www." ? findHostNameWithUrl(searchUrl)?.hostname?.slice(4) : findHostNameWithUrl(searchUrl)?.hostname}</Text>
                </Pressable>
               <View style={{width:'15%',}}>
                {/* <Pressable onPress={() => customShare(searchUrl)} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", }} >
                    {theme.theme == "dark" ?
                        <Shareblockdark width={16} height={16} /> :
                        <Shareblocklight width={16} height={16} />
                    }
                </Pressable> */}
               </View>
            </View>
        </View>
    )
}
const boxShadowStyle = Platform.select({
    ios: {
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 10,
      shadowRadius: 0,
    },
    android: {
        elevation: 15,
    },
  });
export default Dappheadernew;