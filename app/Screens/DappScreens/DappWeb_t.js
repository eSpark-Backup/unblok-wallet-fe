import WebView from "react-native-webview";
import React, { useEffect, useRef } from "react";
import { Button } from "react-native-elements";
import { View } from "react-native";



export default function DappWeb(){
    const WebViewRefArray = useRef(null)
    // console.log("WebViewRefArray",WebViewRefArray);
    // const AddBrowser = () => WebViewRefArray.push(default_Webview)
    
    // const default_Webview=()=>{
    //     return   <WebView
    //     // ref={WebViewRefArray}
    //     javaScriptEnabled
    //     source={{uri:"https://google.com"}}
    //     />
    // }


    // useEffect(()=>{
    //     console.log("Webviewrerf",WebViewRefArray.current.map)
    //     WebViewRefArray.current.push(default_Webview)
    // },[])
    console.log("WebViewRefArray",WebViewRefArray.current)
    return(
        <>
            <View>
                <Button
                title={"Add"}
                onPress={()=>AddBrowser()}
                />
            </View>
            <>
            {/* {WebViewRefArray?.current?.map(it=>{return it})}      */}
       <WebView
        ref={WebViewRefArray}
        javaScriptEnabled
        source={{uri:"https://rarible.com/connect"}}
        onLoadProgress={(e) => {
            // const state = e.nativeEvent;
            console.log("onLoadProgress :", state)
            // setCanGoBack(state.canGoBack);
            // setUrlForSearch(state.url)
        }}
        />
        </>

        </>
    )
}