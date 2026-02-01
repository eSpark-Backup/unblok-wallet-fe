import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../../Components/Header';
import LinearGradient from "react-native-linear-gradient";
import themeContext from "../../utils/themeContext";
const WalletHistoryWebView = props => {
  const url = props.route.params.url;
  const theme = useContext(themeContext);
  return (
    <SafeAreaView style={styles.flexContainer}>
      {/* <LinearGradient colors={theme.theme == 'light' ? ['#fff', '#fff'] : ['#151918', '#171515']}
        useAngle={true}
        angle={170}
        style={{ width: "100%", height: "100%" }}
      > */}
      <Header name={'Transaction History'} leftImage={'back'} />
      <View style={{marginVertical:"7.5%",height:"82.5%"}} >
        <WebView
          source={{
            uri: url,
          }}
        />
      </View>
      {/* </LinearGradient> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
});

export default WalletHistoryWebView;
