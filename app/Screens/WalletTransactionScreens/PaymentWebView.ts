import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import getRealm from "../../localDb/RealmConfig";
import LinearGradient from "react-native-linear-gradient";
const PaymentWebView = (props) => {
  const [defaultCurrency, setDefaultCurrency] = React.useState("");
  const theme = React.useContext(themeContext);
  const currencyListFromRedux = useSelector(
    (state) => state.walletDetailReducer.currencyList
  );

  useFocusEffect(
    React.useCallback(() => {
      getDefaultCurrency();
      return () => {};
    }, [])
  );

  //get DefaultCurrency from db
  const getDefaultCurrency = () => {
    getRealm()
      .then((realm) => {
        var defaultCurrencyVal = realm.objects("defaultCurrency");
        if (defaultCurrencyVal.length == 0) {
          setDefaultCurrency("USD");
        } else {
          setDefaultCurrency(defaultCurrencyVal[0].defaultCurrency);
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "defaultCurrency err from localDb");
      });
  };

  const network =
    currencyListFromRedux.currencyName == "Smart Chain"
      ? "BSC"
      : currencyListFromRedux.tokenType == "TRC20"
      ? "Tron"
      : currencyListFromRedux.tokenType == "ERC20"
      ? "Ethereum"
      : currencyListFromRedux.tokenType == "BEP20"
      ? "BSC"
      : currencyListFromRedux.currencyName;

  const checkCurrency =
    network == "Tron" || currencyListFromRedux.tokenType == "TRC20"
      ? "USDC"
      : currencyListFromRedux.tokenType == "TRC20"
      ? "Tron"
      : currencyListFromRedux.tokenType == "ERC20"
      ? "Ethereum"
      : currencyListFromRedux.tokenType == "BEP20"
      ? "BNB"
      : currencyListFromRedux.currency;

  return (
    <SafeAreaView style={styles.flexContainer}>
      <LinearGradient colors={theme.theme == 'light' ? ['#fff','#fff']: ['#151918','#171515']}
          useAngle={true}
          angle={170}
          style={{width:"100%",height:"100%"}}
        >
      <Header name={"Buy Crypto"} leftImage={"back"} />
      <WebView
        source={{
          uri:
            "https://staging-global.transak.com/?apiKey=dc1f9813-c42f-4171-9215-5d05bcbadffa&cryptoCurrencyCode=" +
            checkCurrency +
            "&walletAddress=" +
            currencyListFromRedux.walletaddress +
            "&network=" +
            network +
            "&fiatCurrency=" +
            defaultCurrency +
            "&hideMenu=true" +
            "&exchangeScreenTitle=Buy Crypto using Amgen Wallet.",
        }}
      />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
});

export default PaymentWebView;
