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
    TextInput, Linking,
    Dimensions
} from "react-native";
import Header from "../../Components/Header";
import { Images } from "../../utils/Images";
import themeContext from "../../utils/themeContext";
import { Fonts } from "../../utils/Fonts";
import { RFPercentage } from "react-native-responsive-fontsize";
import { windowWidth } from "../../utils/Dimensions";
import MaticLogo from '../../assets/img/matic.svg'

export default function AboutUs(props) {
    const theme = React.useContext(themeContext);
    const style = styles(theme);
    const [q_one, setq_one] = React.useState(0);
    const faq = ([
        {
            id: 1,
            question: "Q: How are Users of UNBLOK compensated?",
            answer: "A: No. UNBLOK rabides by the Know Your Customer (KYC) guidelines. As a FinTech company, our Terms of Service require all our vendors to meet these strict guidelines through a verification process before your data is shared with anyone."
        },
        {
            id: 2,
            question: "Q: How are Users of UNBLOK compensated?",
            answer: "A: No. UNBLOK rabides by the Know Your Customer (KYC) guidelines. As a FinTech company, our Terms of Service require all our vendors to meet these strict guidelines through a verification process before your data is shared with anyone."
        },
        {
            id: 3,
            question: "Q: How are Users of UNBLOK compensated?",
            answer: "A: No. UNBLOK rabides by the Know Your Customer (KYC) guidelines. As a FinTech company, our Terms of Service require all our vendors to meet these strict guidelines through a verification process before your data is shared with anyone."
        }
    ])
    return (
        <>
        <SafeAreaView style={style.container}>
            <View style={{ marginHorizontal: 20 }}>
                <Header name={"Earnings"} leftImage={"back"} />
                <View style={{ alignSelf: "center", paddingTop: 60 }}>
                    {/* <Image source={require('../../assets/img/polygon.png')} style={{ width: windowWidth*0.325, height:windowWidth*0.325 }} /> */}
                    <MaticLogo width={windowWidth*0.325} height={windowWidth*0.325} />
                </View>
                <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",marginTop:"10%"}}>
                    <Text style={{ color: theme.text, fontFamily: Fonts.Bold ,fontSize:20}}>My Earnings: </Text>
                    <Text style={{ color: theme.text ,fontSize:20,textAlign:"right"}}>100000 Matic</Text>
                </View>
                <View style={{ alignSelf: "center" }}>
                    <TouchableOpacity style={{
                        backgroundColor: "transparent", borderColor:theme.texttheme, borderWidth: 1,
                        borderRadius: 30, width: 150, padding: 15, marginTop: 30, paddingVertical: 15
                    }} onPress={() => { }}>
                        <Text style={{
                            width: "100%", textAlign: "center",
                            fontFamily: Fonts.Regular, color:theme.texttheme                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                        }}>Collect</Text>
                    </TouchableOpacity>
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
        custsearch: {
            borderRadius: 5,
            backgroundColor: theme.background,
            borderColor: theme.phrase1,
            borderWidth: 1,
            margin: 15,
            fontFamily: Fonts.Bold,
            elevation: 0,
            fontSize: RFPercentage(2)
        },
    });