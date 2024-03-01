import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";


const height = Dimensions.get("window").height
const HEADER_HEIGHT = 60;
const CONTAINER_HEIGHT = height * 0.06;

const INJECTED_JS = `
  window.onscroll = function() {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        scrollTop: document.documentElement.scrollTop || document.body.scrollTop
      }),     
    )
  }
`;

const Dapplatest = (props) => {

    const scrollY = useRef(new Animated.Value(0)).current;
    const offsetAnim = useRef(new Animated.Value(0)).current;
    const clampedScroll = Animated.diffClamp(
        Animated.add(
            scrollY.interpolate({
                inputRange: [0, 3],
                outputRange: [0, 1],
                extrapolateLeft: 'clamp',
            }),
            offsetAnim,
        ),
        0,
        CONTAINER_HEIGHT
    )


    const headerTranslate = clampedScroll.interpolate({
        inputRange: [0, CONTAINER_HEIGHT],
        outputRange: [0, -CONTAINER_HEIGHT],
        extrapolate: 'clamp',
    })

    const handleScroll = (event) => {
        Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
        )(event);
    };

    const bottomTabTranslate = clampedScroll.interpolate({
        inputRange: [0, CONTAINER_HEIGHT],
        outputRange: [0, CONTAINER_HEIGHT * 2],
        extrapolate: 'clamp',
    })

    const [isPullToRefreshEnabled, setPullToRefreshEnabled] = useState(false);
    const [scrollViewHeight, setScrollViewHeight] = useState(0);

    const webViewRef = useRef(null);

    const onRefresh = () => webViewRef.current.reload();

    const onWebViewMessage = (event) => {
        const { data } = event.nativeEvent;

        try {
            const { scrollTop } = JSON.parse(data);
            setPullToRefreshEnabled(scrollTop === 0);
        } catch (error) { }
    };

    const setWebViewRef = (ref) => {
        webViewRef.current = ref;
    };
    console.log("test")
    return (
        <View style={{ flex: 1, overflow: 'hidden', }} >

            <Animated.View style={{ height: "100%", transform: [{ translateY: headerTranslate }] }} >
                <Animated.View style={{ height: height * 0.06, backgroundColor: "red" }} >
                </Animated.View>
                <View style={{ height: "100%" }} >
                    <ScrollView
                        onLayout={(event) => setScrollViewHeight(event.nativeEvent.layout.height)}
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                enabled={isPullToRefreshEnabled}
                                onRefresh={onRefresh}
                                tintColor="transparent"
                                colors={["transparent"]}
                                style={{ backgroundColor: "transparent" }}
                            />
                        }>
                        <WebView
                            ref={setWebViewRef}
                            source={{ uri: "https://maticz.com/" }}
                            onScroll={handleScroll}
                            style={{ width: "100%", height: scrollViewHeight }}
                            onMessage={onWebViewMessage}
                            injectedJavaScript={INJECTED_JS}
                        />

                    </ScrollView>
                </View>


            </Animated.View>


            <Animated.View style={{ height: height * 0.06, backgroundColor: "green", position: "absolute", bottom: 0, left: 0, right: 0, transform: [{ translateY: bottomTabTranslate }] }} >
            </Animated.View>

        </View >
    )
}

export default Dapplatest;

const styles = StyleSheet.create({
    view: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
    },
})