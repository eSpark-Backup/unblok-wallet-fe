import React, { useCallback, useEffect, useState } from "react";
import {
    Animated, FlatList, View, Text, Image, ScrollView,
    TouchableOpacity
} from "react-native";

import { Switch } from 'react-native-switch';
import { Fonts } from "../../utils/Fonts";
import { Dimensions } from 'react-native';
import Header from "../../Components/Header";
import Settings3 from "../../assets/img/settings3.svg";
import Settings3white from "../../assets/img/settings3_white.svg";
import Settings6 from "../../assets/img/settings6.svg";
import Settings6white from "../../assets/img/settings6_white.svg";

import Settings7 from "../../assets/img/settings7.svg";
import Settings7white from "../../assets/img/settings7_white.svg";

import Settings8 from "../../assets/img/settings8.svg";
import Settings8white from "../../assets/img/settings8_white.svg";

import Settings9 from "../../assets/img/settings9.svg";
import Settings10 from "../../assets/img/settings10.svg";
import Settings10white from "../../assets/img/settings10_white.svg";

import Settings11 from "../../assets/img/settings11.svg";
import Settings11white from "../../assets/img/settings11_white.svg";

import Settings12 from "../../assets/img/settings12.svg";
import Settings12white from "../../assets/img/settings12_white.svg";


import SettingsTheme from "../../assets/img/settings-theme.svg";

import Arrowdown from "../../assets/img/arrow-down.svg";
import Arrowdownwhite from "../../assets/img/arrow-down-white.svg";

import themeContext from "../../utils/themeContext";
import { EventRegister } from "react-native-event-listeners";
import getRealm from "../../localDb/RealmConfig";
export default function WalletSettings(props) {
    const theme = React.useContext(themeContext);
    const [keySpecs, setKeySpecs] = useState(JSON.parse(global.keyboardSettings))
    const [isEnabled, setIsEnabled] = React.useState(keySpecs?.capsLetter == "true" ? true : false);
    const toggleSwitch = () => setIsEnabled(!isEnabled);
    const [isEnabled1, setIsEnabled1] = React.useState(keySpecs?.Dapp == "true" ? true : false);
    const toggleSwitch1 = () => setIsEnabled1(previousState => !previousState);
    const [isEnabled2, setIsEnabled2] = React.useState(keySpecs?.voice == "true" ? true : false);
    const toggleSwitch2 = () => setIsEnabled2(previousState => !previousState);
    const [isEnabled3, setIsEnabled3] = React.useState(false);
    const toggleSwitch3 = () => setIsEnabled3(previousState => !previousState);
    const [isEnabled4, setIsEnabled4] = React.useState(keySpecs?.translate == "true" ? true : false);
    const toggleSwitch4 = () => setIsEnabled4(previousState => !previousState);
    const [isEnabled5, setIsEnabled5] = React.useState(keySpecs?.wallet == "true" ? true : false);
    const toggleSwitch5 = () => setIsEnabled5(previousState => !previousState);
    const [isEnabled6, setIsEnabled6] = React.useState(keySpecs?.wordPrediction == "true" ? true : false);
    const toggleSwitch6 = () => setIsEnabled6(previousState => !previousState);
    const [isEnabled7, setIsEnabled7] = React.useState(false);
    const toggleSwitch7 = () => setIsEnabled7(previousState => !previousState);
    const [mode, setMode] = useState(
        global.themeData != null &&
            (global.themeData == "true" || global.themeData == true)
            ? true
            : false
    )

    console.log("keySpecs45345634535", keySpecs);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    if (isEnabled5 == true) {
        // props.navigation.navigate("WalletHome")
    }
    else {
        props.navigation.navigate("WalletSettings")
    }
    // console.log("thehetet", JSON.stringify(theme, null, 2));

    const onChangeFunction = async (text, val) => {
        keySpecs[text] = `${val}`
        global.keyboardSettings = JSON.stringify(keySpecs)
        getRealm()
            .then((realm) => {
                var keyboardSpecs = realm.objects("keyboardSpecs")
                console.log("keyboardSpeceifrjs", keyboardSpecs);
                realm.write(() => {
                    realm.delete(keyboardSpecs[0])
                    realm.create("keyboardSpecs", { ...keySpecs })
                })
                return () => {
                    realm.close();
                };
            })
            .catch((err) => {
                console.log("errro on onchange function", err);
            })

    }

    return (
        <>
            <View style={{ marginHorizontal: 20 }}>
                <Header name={"Settings"} leftImage={"back"} />
                <ScrollView style={{ height: (windowHeight - 100), marginTop: 30 }}>
                    {/* <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 30
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                            <View>
                                {theme.theme == "light" ?
                                    (<Settings1 fill={"#000"} />) : (<Settings1 fill={"#fff"} />)}
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.text }}>AutoCorrect</Text>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 13, color: theme.text }}>Auto Correct your sentences</Text>
                            </View>
                        </View>
                        <View style={{ marginRight: 10 }}>
                           
                            <Switch
                                onValueChange={(val) => { onChangeFunction("capsLetter", val), setIsEnabled(!isEnabled) }}
                                value={isEnabled}
                                disabled={false}
                                activeText={'On'}
                                inActiveText={'Off'}
                                circleSize={22}
                                barHeight={15}
                                circleBorderWidth={0}
                                backgroundActive={theme.switchcolor}
                                backgroundInactive={'#D5D5D5'}
                                circleActiveColor={'#00b0ff'}
                                circleInActiveColor={'#00b0ff'}
                                changeValueImmediately={true}
                                innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                                outerCircleStyle={{}} // style for outer animated circle
                                renderActiveText={false}
                                renderInActiveText={false}
                                switchLeftPx={2.5}
                                switchRightPx={2.5}
                                switchWidthMultiplier={1.5}
                                switchBorderRadius={30}
                            />
                        </View>
                    </View> */}

                    {/* <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 30
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                            <View>
                                {theme.theme == "light" ?
                                    (<Settings2 fill={"#000"} />) : (<Settings2white fill={"#fff"} />)}
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.text }}>DApp Browser</Text>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 13, color: theme.text }}>Discover More Dapps</Text>
                            </View>
                        </View>
                        <View style={{ marginRight: 10 }}>
                            <Switch
                                onValueChange={(val)=>{onChangeFunction("Dapp",val), setIsEnabled1(!isEnabled1)}}
                                value={isEnabled1}
                                disabled={false}
                                activeText={'On'}
                                inActiveText={'Off'}
                                circleSize={22}
                                barHeight={15}
                                circleBorderWidth={0}
                                backgroundActive={theme.switchcolor}
                                backgroundInactive={'#D5D5D5'}
                                circleActiveColor={'#00b0ff'}
                                circleInActiveColor={'#00b0ff'}
                                changeValueImmediately={true}
                                innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                                outerCircleStyle={{}} // style for outer animated circle
                                renderActiveText={false}
                                renderInActiveText={false}
                                switchLeftPx={2.5}
                                switchRightPx={2.5}
                                switchWidthMultiplier={1.5}
                                switchBorderRadius={30}
                            />
                        </View>
                    </View> */}

                    <View style={{ flexDirection: "row", width: "100%", alignSelf: "center", alignItems: "center", height: "7.5%" }} >
                        <View style={{ width: "15%", }} >
                            {theme.theme == "light" ?
                                (<Settings6 width={windowWidth * 0.09} height={windowHeight * 0.035} fill={"#000"} />) : (<Settings6white fill={"#fff"} />)}
                        </View>
                        <View style={{ width: "70%" }} >
                            <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.text }}>Voice Typing</Text>
                        </View>
                        <View style={{ width: "15%", alignItems: "center", }} >
                            <Switch
                                onValueChange={(val) => { onChangeFunction("voice", val), setIsEnabled2(!isEnabled2) }}
                                value={isEnabled2}
                                disabled={false}
                                activeText={'On'}
                                inActiveText={'Off'}
                                circleSize={22}
                                barHeight={15}
                                circleBorderWidth={0}
                                backgroundActive={theme.switchcolor}
                                backgroundInactive={'#D5D5D5'}
                                circleActiveColor={'#00b0ff'}
                                circleInActiveColor={'#00b0ff'}
                                changeValueImmediately={true}
                                innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                                outerCircleStyle={{}} // style for outer animated circle
                                renderActiveText={false}
                                renderInActiveText={false}
                                switchLeftPx={2.5}
                                switchRightPx={2.5}
                                switchWidthMultiplier={windowWidth * 0.0045}
                                switchBorderRadius={30}
                            />
                        </View>
                    </View>

                    <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 30
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                            <View>
                                {theme.theme == "light" ?
                                    (<Settings3 fill={"#000"} />) : (<Settings3white fill={"#fff"} />)}
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.text }}>Voice Typing</Text>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 13, color: theme.text }}>Type using voice to text</Text>
                            </View>
                        </View>
                        <View style={{ marginRight: 10 }}>
                            <Switch
                                onValueChange={(val) => { onChangeFunction("voice", val), setIsEnabled2(!isEnabled2) }}
                                value={isEnabled2}
                                disabled={false}
                                activeText={'On'}
                                inActiveText={'Off'}
                                circleSize={22}
                                barHeight={15}
                                circleBorderWidth={0}
                                backgroundActive={theme.switchcolor}
                                backgroundInactive={'#D5D5D5'}
                                circleActiveColor={'#00b0ff'}
                                circleInActiveColor={'#00b0ff'}
                                changeValueImmediately={true}
                                innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                                outerCircleStyle={{}} // style for outer animated circle
                                renderActiveText={false}
                                renderInActiveText={false}
                                switchLeftPx={2.5}
                                switchRightPx={2.5}
                                switchWidthMultiplier={1.5}
                                switchBorderRadius={30}
                            />
                        </View>
                    </View>
                    {/* <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 30
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                            <View>
                                {theme.theme == "light" ?
                                    (<Settings4 fill={"#000"} />) : (<Settings4white fill={"#fff"} />)}
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.text }}>Swipe Typing</Text>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 13, color: theme.text }}>Swipe your finger to type</Text>
                            </View>
                        </View>
                        <View style={{ marginRight: 10 }}>
                            <Switch
                                onValueChange={toggleSwitch3}
                                value={isEnabled3}
                                disabled={false}
                                activeText={'On'}
                                inActiveText={'Off'}
                                circleSize={22}
                                barHeight={15}
                                circleBorderWidth={0}
                                backgroundActive={theme.switchcolor}
                                backgroundInactive={'#D5D5D5'}
                                circleActiveColor={'#00b0ff'}
                                circleInActiveColor={'#00b0ff'}
                                changeValueImmediately={true}
                                innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                                outerCircleStyle={{}} // style for outer animated circle
                                renderActiveText={false}
                                renderInActiveText={false}
                                switchLeftPx={2.5}
                                switchRightPx={2.5}
                                switchWidthMultiplier={1.5}
                                switchBorderRadius={30}
                            />
                        </View>
                    </View> */}
                    {/* <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 30
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                            <View>
                                {theme.theme == "light" ?
                                    (<Settings5 fill={"#000"} />) : (<Settings5white fill={"#fff"} />)}
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.text }}>Translation</Text>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 13, color: theme.text }}>Translate between languages</Text>
                            </View>
                        </View>
                        <View style={{ marginRight: 10 }}>
                            <Switch
                                onValueChange={(val)=>{onChangeFunction("translate",val),setIsEnabled4(!isEnabled4)}}
                                value={isEnabled4}
                                disabled={false}
                                activeText={'On'}
                                inActiveText={'Off'}
                                circleSize={22}
                                barHeight={15}
                                circleBorderWidth={0}
                                backgroundActive={theme.switchcolor}
                                backgroundInactive={'#D5D5D5'}
                                circleActiveColor={'#00b0ff'}
                                circleInActiveColor={'#00b0ff'}
                                changeValueImmediately={true}
                                innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                                outerCircleStyle={{}} // style for outer animated circle
                                renderActiveText={false}
                                renderInActiveText={false}
                                switchLeftPx={2.5}
                                switchRightPx={2.5}
                                switchWidthMultiplier={1.5}
                                switchBorderRadius={30}
                            />
                        </View>
                    </View> */}
                    <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 30
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                            <View>
                                {theme.theme == "light" ?
                                    (<Settings6 fill={"#000"} />) : (<Settings6white fill={"#fff"} />)}
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.text }}>Wallet</Text>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 13, color: theme.text }}>Access your Wallet</Text>
                            </View>
                        </View>
                        <View style={{ marginRight: 10 }}>
                            <Switch
                                onValueChange={(val) => { onChangeFunction("translate", val), setIsEnabled4(!isEnabled4) }}
                                value={isEnabled5}
                                disabled={false}
                                activeText={'On'}
                                inActiveText={'Off'}
                                circleSize={22}
                                barHeight={15}
                                circleBorderWidth={0}
                                backgroundActive={theme.switchcolor}
                                backgroundInactive={'#D5D5D5'}
                                circleActiveColor={'#00b0ff'}
                                circleInActiveColor={'#00b0ff'}
                                changeValueImmediately={true}
                                innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                                outerCircleStyle={{}} // style for outer animated circle
                                renderActiveText={false}
                                renderInActiveText={false}
                                switchLeftPx={2.5}
                                switchRightPx={2.5}
                                switchWidthMultiplier={1.5}
                                switchBorderRadius={30}
                            />
                        </View>
                    </View>
                    <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 30
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                            <View>
                                {theme.theme == "light" ?
                                    (<Settings7 fill={"#000"} />) : (<Settings7white fill={"#fff"} width={24} height={30} />)}
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.text }}>Word Prediction</Text>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 13, color: theme.text }}>Get Word Suggestion</Text>
                            </View>
                        </View>
                        <View style={{ marginRight: 10 }}>
                            <Switch
                                onValueChange={(val) => { onChangeFunction("wordPrediction", val), setIsEnabled6(!isEnabled6) }}
                                value={isEnabled6}
                                disabled={false}
                                activeText={'On'}
                                inActiveText={'Off'}
                                circleSize={22}
                                barHeight={15}
                                circleBorderWidth={0}
                                backgroundActive={theme.switchcolor}
                                backgroundInactive={'#D5D5D5'}
                                circleActiveColor={'#00b0ff'}
                                circleInActiveColor={'#00b0ff'}
                                changeValueImmediately={true}
                                innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                                outerCircleStyle={{}} // style for outer animated circle
                                renderActiveText={false}
                                renderInActiveText={false}
                                switchLeftPx={2.5}
                                switchRightPx={2.5}
                                switchWidthMultiplier={1.5}
                                switchBorderRadius={30}
                            />
                        </View>
                    </View>

                    <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 30
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                            <View>
                                {theme.theme == "light" ?
                                    (<Settings8 fill={"#000"} />) : (<Settings8white fill={"#fff"} />)}
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.text }}>Clipboard</Text>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 13, color: theme.text }}>Temporarily stores cut or copied text</Text>
                            </View>
                        </View>
                        <View style={{ marginRight: 10 }}>
                            <Switch
                                onValueChange={toggleSwitch7}
                                value={isEnabled7}
                                disabled={false}
                                activeText={'On'}
                                inActiveText={'Off'}
                                circleSize={22}
                                barHeight={15}
                                circleBorderWidth={0}
                                backgroundActive={theme.switchcolor}
                                backgroundInactive={'#D5D5D5'}
                                circleActiveColor={'#00b0ff'}
                                circleInActiveColor={'#00b0ff'}
                                changeValueImmediately={true}
                                innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                                outerCircleStyle={{}} // style for outer animated circle
                                renderActiveText={false}
                                renderInActiveText={false}
                                switchLeftPx={2.5}
                                switchRightPx={2.5}
                                switchWidthMultiplier={1.5}
                                switchBorderRadius={30}
                            />
                        </View>
                    </View>


                    <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 30
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                            {theme.theme == 'light' ?
                                (<SettingsTheme fill={"#000"} />)
                                :
                                (<SettingsTheme fill={"#fff"} />)
                            }
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.text }}>Theme Change</Text>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 13, color: theme.text }}>Dark / Light Theme</Text>
                            </View>
                        </View>
                        <View style={{ marginRight: 10 }}>

                            <Switch
                                value={mode}
                                onValueChange={(value) => {
                                    setMode(value);
                                    EventRegister.emit("changeTheme", value);
                                }}
                                disabled={false}
                                activeText={'On'}
                                inActiveText={'Off'}
                                circleSize={22}
                                barHeight={15}
                                circleBorderWidth={0}
                                backgroundActive={theme.switchcolor}
                                backgroundInactive={'#D5D5D5'}
                                circleActiveColor={'#00b0ff'}
                                circleInActiveColor={'#00b0ff'}
                                changeValueImmediately={true}
                                innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                                outerCircleStyle={{}} // style for outer animated circle
                                renderActiveText={false}
                                renderInActiveText={false}
                                switchLeftPx={2.5}
                                switchRightPx={2.5}
                                switchWidthMultiplier={1.5}
                                switchBorderRadius={30}
                            />
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => props.navigation.navigate("Rewards")}>

                        <View style={{
                            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                            marginBottom: 30
                        }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                <View>
                                    {theme.theme == "light" ?
                                        (<Settings9 fill={"#000"} />) : (<Settings9 fill={"#fff"} />)}
                                </View>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontFamily: Fonts.Regular, fontSize: 16, color: theme.text }}>Earnings</Text>
                                    {/* <Text style={{ fontFamily: Fonts.Regular, fontSize: 13, color: theme.text }}>earnings</Text> */}
                                </View>
                            </View>
                            <View style={{ marginRight: 10 }}>
                                {theme.theme == "light" ?
                                    (<Arrowdown fill={"#000"} />) : (<Arrowdownwhite fill={"#fff"} />)}
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 30
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                            <View>
                                {theme.theme == "light" ?
                                    (<Settings9 fill={"#000"} />) : (<Settings9 fill={"#fff"} />)}
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.text }}>Language</Text>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 13, color: theme.text }}>Language</Text>
                            </View>
                        </View>
                        <View style={{ marginRight: 10 }}>
                            {theme.theme == "light" ?
                                (<Arrowdown fill={"#000"} />) : (<Arrowdownwhite fill={"#fff"} />)}
                        </View>
                    </View> */}
                    <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 30
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                            <View>
                                {theme.theme == "light" ?
                                    (<Settings10 fill={"#000"} />) : (<Settings10white fill={"#fff"} />)}
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.text }}>Themes</Text>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 13, color: theme.text }}>Choose Keyboard Themes</Text>
                            </View>
                        </View>
                        <View style={{ marginRight: 10 }}>
                            {theme.theme == "light" ?
                                (<Arrowdown fill={"#000"} />) : (<Arrowdownwhite fill={"#fff"} />)}
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => props.navigation.navigate("FAQ")}>
                        <View style={{
                            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                            marginBottom: 30
                        }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                <View>
                                    {theme.theme == "light" ?
                                        (<Settings11 fill={"#000"} />) : (<Settings11white fill={"#fff"} />)}
                                </View>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.text }}>FAQ</Text>
                                    <Text style={{ fontFamily: Fonts.Regular, fontSize: 13, color: theme.text }}>Frequently Asked Questions</Text>
                                </View>
                            </View>
                            <View style={{ marginRight: 10 }}>
                                {theme.theme == "light" ?
                                    (<Arrowdown fill={"#000"} />) : (<Arrowdownwhite fill={"#fff"} />)}
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => props.navigation.navigate("AboutUs")}>
                        <View style={{
                            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                            marginBottom: 30
                        }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                <View>
                                    {theme.theme == "light" ?
                                        (<Settings12 fill={"#000"} />) : (<Settings12white fill={"#fff"} width={25} height={25} />)}
                                </View>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.text }}>About Us</Text>
                                    <Text style={{ fontFamily: Fonts.Regular, fontSize: 13, color: theme.text }}>About UNBLOK BETA</Text>
                                </View>
                            </View>
                            <View style={{ marginRight: 10 }}>
                                {theme.theme == "light" ?
                                    (<Arrowdown fill={"#000"} />) : (<Arrowdownwhite fill={"#fff"} />)}
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/* <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 30
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                            <View>
                                {theme.theme == "light" ?
                                    (<Settings13 fill={"#000"} />) : (<Settings13 fill={"#fff"} />)}
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.text }}>Preferences</Text>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 13, color: theme.text }}>About UNBLOK BETA</Text>
                            </View>
                        </View>
                        <View style={{ marginRight: 10 }}>
                            {theme.theme == "light" ?
                                (<Arrowdown fill={"#000"} />) : (<Arrowdownwhite fill={"#fff"} />)}
                        </View>
                    </View> */}
                    {/* <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 40
                    }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                            <View>
                                {theme.theme == "light" ?
                                    (<Settings14 fill={"#000"} />) : (<Settings14 fill={"#fff"} />)}
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.text }}>Advanced</Text>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: 13, color: theme.text }}>About UNBLOK BETA</Text>
                            </View>
                        </View>
                        <View style={{ marginRight: 10 }}>
                            <TouchableOpacity>
                                {theme.theme == "light" ?
                                    (<Arrowdown fill={"#000"} />) : (<Arrowdownwhite fill={"#fff"} />)}
                            </TouchableOpacity>
                        </View>
                    </View> */}
                </ScrollView>
            </View>
        </>
    )
}