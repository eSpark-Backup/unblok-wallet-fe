import React from "react";
import { Text, View, SafeAreaView, StyleSheet, FlatList ,Image,TouchableOpacity} from "react-native";
import { Fonts } from "../../utils/Fonts";
import Header from "../../Components/Header";
export default function Currency(){
    return(
        <>
        <SafeAreaView>
        <Header name={""} leftImage={"back"} />
         <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",
        marginHorizontal:20,marginTop:-50,color:"#000"}}>
            <View>
                <Text style={{fontFamily:Fonts.Regular,fontSize:20}}>Currency</Text>
            </View>
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                <Text style={{marginRight:25,fontFamily:Fonts.Regular,fontSize:15}}>ETH- Ethereum</Text>
                {/* <Image source={require("../../assets/img/arrow-down.png")} /> */}

            </View>
         </View>
         </SafeAreaView>
        </>
    )
}