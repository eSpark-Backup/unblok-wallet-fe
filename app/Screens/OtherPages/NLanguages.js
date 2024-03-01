import React from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    TouchableWithoutFeedback,
    ScrollView,
    Image,
    TouchableOpacity,
    TextInput,Linking,
    Dimensions
  } from "react-native";
  import { Images } from "../../utils/Images";
  import themeContext from "../../utils/themeContext";
  import { Fonts } from "../../utils/Fonts";
  import Header from "../../Components/Header";
  import { RadioButton, Searchbar } from "react-native-paper";
export default function NLanguages(props){
    const [selected,setSelected]= React.useState("")
    const [language,setLangauges] = React.useState([
        {lang:"English"},
        {lang:"Japanese"},
        {lang:"Italian"},
        {lang:"Korean"},
        {lang:"French"},
        {lang:"Spanish"}
        ])
    return(
        <>
        <View style={{marginHorizontal:20}}>
        <Header name={"Languages"} leftImage={"back"} />
        {language.map((item,index) => {

        return(
            <>
        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",
    marginHorizontal:20,marginTop:40}}>
            <View>
                    <Text style={{fontFamily:Fonts.Regular,fontSize:16}}>{item.lang}</Text>
            </View>
            <View>
            <TouchableOpacity style={{width:20,height:20,
            borderColor:"#000",borderWidth:2,borderRadius:50}} onPress={() => setSelected(item.lang)}>
                 {selected == item.lang ?
                 (<Text style={{backgroundColor:"#00B0FF",borderRadius:50,width:12,height:12,
                position:"relative",left:2,top:2}}></Text>)
                    :(<></>)
                 }
            </TouchableOpacity>
            </View>
            
        </View>
        </>
        )
            })
        } 
        </View>
        </>
    )
}