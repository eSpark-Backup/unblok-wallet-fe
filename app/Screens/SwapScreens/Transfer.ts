import React from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,

  } from "react-native";
  import { Fonts } from "../../utils/Fonts";
  import themeContext from "../../utils/themeContext";
  import Header from "../../Components/Header";
  import { Searchbar } from "react-native-paper";
import { Images } from "../../utils/Images";
import { Colors } from "../../utils/Colors";
// import Receive from "../../assets/img/receive.svg"
export default function Transfer(props){
    return(
        <>
        <SafeAreaView style={{backgroundColor:"#fff",height:"100%"}}>
        <Header name={"ETH - WETH"} leftImage={"back"} />
        <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",
    marginTop:30}}>
            <ETH width={70} height={70} />
         </View>
         <View style={{marginBottom:30}}>
            <Text style={{color:"#000",fontFamily:Fonts.Medium,fontSize:18,
        width:"100%",textAlign:"center",marginTop:10}}>100.0000 ETH</Text>
        </View>
        <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",paddingBottom:40}}>
               <View style={{marginRight:25}}>
                <TouchableOpacity>
               {/* <Send width={45} height={45} /> */}
                <Text style={{color:"#000",fontSize:16,fontFamily:Fonts.Regular,
            width:"100%",textAlign:"center",marginTop:10}}>Send</Text>
                </TouchableOpacity> 
               </View>
               <View style={{marginLeft:25}}>
               <TouchableOpacity>
               {/* <Receive width={45} height={45} /> */}
                <Text style={{color:"#000",fontSize:16,fontFamily:Fonts.Regular,
            width:"100%",textAlign:"center",marginTop:10}}>Receive</Text> 
           </TouchableOpacity>
               </View>
        </View>
        <View style={{borderTopColor:"#ccc",borderTopWidth:1}}>
        <View style={{margin:10}}>
            <Text style={{color:"#000",fontFamily:Fonts.Regular}}>Dec 21, 2023</Text>
        </View>
        </View>
        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",
    marginHorizontal:20}}>
        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"flex-start"}}>
            <View>
            {/* <Receive width={45} height={45} /> */}
            </View>
            <View style={{marginLeft:15}}>
                <Text style={{color:"#000",fontSize:16,fontFamily:Fonts.Medium}}>Transfer</Text>
                <Text style={{color:"#989898",fontSize:12,fontFamily:Fonts.Medium}}>From : 0x0000356356sfdg....</Text>
            </View>
        </View>
        <View>
            <Text style={{color:"#069927",fontSize:16,fontFamily:Fonts.Regular}}>+4552 WETH</Text>
        </View>
        </View>
        <View style={{borderTopColor:"#ccc",borderTopWidth:1,marginTop:20}}></View>
        </SafeAreaView>
        </>
    )
}