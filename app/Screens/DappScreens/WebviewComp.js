import React,{ forwardRef } from "react";
import { Dimensions } from "react-native";
import WebView from "react-native-webview";

const WebviewComp = forwardRef(function WebviewComp({ myUrl, connectWalletUrl, handleNavigation, switchInjectedData, setCanGoBack, setUrlForSearch, setLoad, onMessage,setwebref,selectedIndex }, ref) {
    return (
        <WebView
            ref={ref}
            source={{ uri: myUrl }}
            mixedContentMode={"compatibility"}
            setSupportMultipleWindows={connectWalletUrl}
            onShouldStartLoadWithRequest={handleNavigation}
            originWhitelist={["*"]}
            javaScriptEnabled
            domStorageEnabled={true}
            javaScriptEnabledAndroid
            automaticallyAdjustContentInsets={false}
            // injectedJavaScript={injectJavaScriptdata()} 
            injectedJavaScriptBeforeContentLoaded={switchInjectedData()}
            onLoadProgress={(e) => {
                const state = e.nativeEvent;
                console.log("onLoadProgress :", state)
                setwebref({webRef:state,current_ind:selectedIndex})
                setCanGoBack(state.canGoBack);
                setUrlForSearch(state.url)
            }}
            onLoadStart={() => {console.log("coming first or not chrcking");setLoad(true)}}
            onLoadEnd={() => setLoad(false)}
            onMessage={(event) => onMessage(event)}
            style={{
                maxHeight: Dimensions.get('window').height,
                width: Dimensions.get('window').width,
                flex: 1
            }}
            renderError={() => {
                console.log('loaded');
                return (<View></View>)
            }}
        />
    )
})

export default WebviewComp;