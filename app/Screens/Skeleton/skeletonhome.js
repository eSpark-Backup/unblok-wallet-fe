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


const Skeletonhome = (props) => {
    const width = Dimensions.get("window").width
    const height = Dimensions.get("window").height
    const theme = useContext(themeContext);
    const style = styles(theme);
    const list = [1, 2, 3, 4]
    return (
        <SkeletonPlaceholder
            borderRadius={4}
            highlightColor={"rgb(241,241,241)"}
            enabled={true}
        >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "5%", width: "90%", alignSelf: "center" }} >
                <View style={{ width: "40%", height: 30, borderRadius: 10 }} />
                <View style={{ width: 30, height: 30, borderRadius: 10 }} />
            </View>
            <View style={{ width: "40%", alignSelf: "center", height: 40, borderRadius: 10, marginTop: "10%" }} />
            <View style={{ width: "40%", alignSelf: "center", height: 20, borderRadius: 10, marginTop: "2%" }} />

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "7.5%", width: "80%", alignSelf: "center", paddingHorizontal: "5%" }} >
                {list.map(e =>
                    <View>
                        <View style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <View style={{ width: 50, height: 10, borderRadius: 50, marginTop: 5 }} />
                    </View>)}
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: "10%", width: "80%", alignSelf: "center", }} >
                <View style={{ width: "40%", height: 30, borderRadius: 50 }} />
                <View style={{ width: "40%", height: 30, borderRadius: 50 }} />
            </View>
            <View style={{ marginTop: "5%" }} >
                {list.map(e => 
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center",marginVertical:"2%" }} >
                    <View style={{ width: "20%", justifyContent: "center" }} >
                        <View style={{ width: 40, height: 40, borderRadius: 30, alignSelf: "center" }} />
                    </View>
                    <View style={{ width: "60%", justifyContent: "center" }} >
                        <View style={{ width: "70%", height: 20, borderRadius: 50, marginTop: 5 }} />
                        <View style={{ width: "35%", height: 20, borderRadius: 50, marginTop: 5 }} />
                    </View>
                    <View style={{ width: "20%", justifyContent: "center" }} >
                        <View style={{ width: "70%", height: 20, borderRadius: 50, marginTop: 5 }} />
                    </View>
                </View>)}
            </View>
        </SkeletonPlaceholder>

    )

}
export default Skeletonhome;

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