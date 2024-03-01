import React, {
    useContext,
    useState,
    useEffect,
    useRef,
    useCallback,
} from "react";
import { Dimensions, Image, View, StyleSheet, Text } from "react-native";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import themeContext from "../../utils/themeContext";


const Skeletondapp = (props) => {
    const width = Dimensions.get("window").width
    const height = Dimensions.get("window").height
    const theme = useContext(themeContext);
    const style = styles(theme);
    const list = [1, 2, 3, 4, 5]
    return (
        <SkeletonPlaceholder
            borderRadius={4}
            highlightColor={"rgb(241,241,241)"}
            enabled={true}
        >

            <View style={{ width: 32, height: 32, alignSelf: "flex-end", borderRadius: 18, marginTop: "7%", right: "5%" }} />
            <View style={{ width: "60%", height: 40, alignSelf: "center", borderRadius: 18, marginTop: "5%", }} />
            <View style={{ width: "90%", height: 40, alignSelf: "center", borderRadius: 18, marginTop: "11%", }} />

            <View style={{ width: "90%", alignSelf: "center", height: 40, marginTop: "11%", flexDirection: "row", justifyContent: "space-around", }} >
                <View style={{ width: "40%", height: "90%", borderRadius: 60 }} />

                <View style={{ width: "40%", height: "90%", borderRadius: 60 }} />
            </View>
            <View style={{marginTop: "15%"}} >
            {list.map(e => (
                <View style={{ width: "90%", height: "10%", alignSelf: "center", flexDirection: "row",marginVertical:"3%"}} >
                    <View style={{ width: "20%", justifyContent: "center" }} >
                        <View style={{ width: 45, height: 45, borderRadius: 45, alignSelf: "center" }} />
                    </View>
                    <View style={{ width: "80%", }} >
                        <View style={{ width: "80%", height: 20, borderRadius: 10 }} />
                        <View style={{ width: "40%", height: 20, borderRadius: 10, marginTop: 10 }} />
                    </View>
                </View>
            ))}
            </View>
        </SkeletonPlaceholder>

    )

}
export default Skeletondapp;

const styles = (theme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.background,
            //   padding: 16,
        },
        deleteBox: {
            backgroundColor: theme.tabbg,
            justifyContent: "center",
            alignItems: "center",
            width: 100,
            height: 60,
        },
    });