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
  import themeContext from "../../utils/themeContext";
  import { Fonts } from "../../utils/Fonts";
  import Header from "../../Components/Header";
  import { Searchbar } from "react-native-paper";
import { Images } from "../../utils/Images";
import { Colors } from "../../utils/Colors";
import { Icon as Icn, Button } from "react-native-elements";
export default function Bizzcoin(props){
    const theme = React.useContext(themeContext);
//   const style = styles(theme);
    return(
        <>
        <SafeAreaView style={{backgroundColor:theme.background,height:"100%"}}>
        <Header name={"Ethereum Buy"} leftImage={"back"} />
        <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",
    marginTop:30}}>
            <Image source={require("../../assets/img/buyeth.png")} style={{width:70,height:70,resizeMode:"contain"}} />
         </View>
         <View style={{marginBottom:30}}>
            <Text style={{color:"#000",fontFamily:Fonts.Medium,fontSize:18,
        width:"100%",textAlign:"center",marginTop:10}}>0 ETH</Text>
        </View>
        <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",paddingBottom:40}}>
               <View style={{marginRight:25}}>
                <TouchableOpacity>
                <Image source={require("../../assets/img/eth-send.png")} style={{width:55,height:55,
                resizeMode:"contain"}} />
                <Text style={{color:"#000",fontSize:16,fontFamily:Fonts.Medium,
            width:"100%",textAlign:"center"}}>Send</Text>
                </TouchableOpacity> 
               </View>
               <View style={{marginLeft:25}}>
               <TouchableOpacity>
               {/* <Image source={require("../../assets/img/eth-receive.png")} style={{width:55,height:55,
                resizeMode:"contain"}} /> */}
                <Text style={{color:"#000",fontSize:16,fontFamily:Fonts.Medium,
            width:"100%",textAlign:"center"}}>Receive</Text> 
           </TouchableOpacity>
               </View>
        </View>
        <View>
        <View style={{backgroundColor:"#fff",borderTopLeftRadius:10,borderTopRightRadius:10,paddingVertical:30,height:"100%",
    margin:20,paddingTop:150}}>
         <Icn
            name="search"
            type="font-awesome"
            style={{
              alignSelf: "center",
              marginHorizontal: 5,
            }}
            color={theme.text}
            size={30}
          />
               
        <Text style={{color:theme.text,textAlign:"center",width:"100%",
    fontFamily:Fonts.Medium,marginTop:40}}>Transaction will appear here !</Text>
    </View>
        </View>
        {/* <View>
            <TouchableOpacity onPress={() => props.navigation.navigate("BuyETH")}>
        <Text style={{color:"rgba(0,0,0,1)",textAlign:"center",width:"100%",
    fontFamily:Fonts.Bold,fontSize:30,marginTop:50}}>Buy ETH</Text>
    </TouchableOpacity>
        </View> */}
        </SafeAreaView>
        </>
    )
}