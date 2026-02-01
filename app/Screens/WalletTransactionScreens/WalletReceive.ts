import React, { useContext } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  Image,
} from "react-native";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { Colors } from "../../utils/Colors";
import { Fonts } from "../../utils/Fonts";
import { Icon as Icn, Card } from "react-native-elements";
import { useSelector } from "react-redux";
import Share from "react-native-share";
import { Images } from "../../utils/Images";
import QRCode from "react-native-qrcode-svg";
import Clipboard from "@react-native-community/clipboard";
import LinearGradient from "react-native-linear-gradient";
const WalletReceive = (props) => {
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  const walletDetailsFromRedux = useSelector(
    (state) => state.walletDetailReducer.currencyList
  );

  const myCustomShare = async () => {
    const shareOptions = {
      message: walletDetailsFromRedux.walletaddress,
    };
    try {
      const ShareResponse = await Share.open(shareOptions);
      //console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      //console.log('Error => ', error);
    }
  };

  const CopyAddress = () => {
    ToastAndroid.showWithGravityAndOffset(
      "Address Copied!",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50
    );
    Clipboard.setString(walletDetailsFromRedux.walletaddress);
  };

  return (
    <SafeAreaView style={style.container}>
      
      <LinearGradient colors={theme.theme == 'light' ? ['#fff','#fff']: ['#151918','#171515']}
          useAngle={true}
          angle={170}
          style={{width:"100%",height:"100%"}}
        >
          <Header
        name={"Receive " + walletDetailsFromRedux.currency}
        leftImage={"back"}
      />
      <ScrollView>
        <View>
          <Image
            source={Images.chiptoss}
            style={{
              alignSelf: "center",
              marginTop: "5%",
              width:"100%",
              height:80,
              marginBottom:30,
              resizeMode:"contain"
            }}
          />
          <Card
            containerStyle={{
              borderRadius: 15,
              elevation: 5,
              width: "65%",
              alignSelf: "center",
              borderColor: "transparent",
              backgroundColor: "#ffffff",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <View style={{ alignSelf: "center" }}>
              <QRCode color={"#000"} value={walletDetailsFromRedux.walletaddress} size={200} />
            </View>
            <Text
              style={{
                color: theme.text,
                textAlign: "center",
                fontFamily: Fonts.Bold,
                marginTop: "5%",
                fontSize: 12,
              }}
            >
              {walletDetailsFromRedux.walletaddress}
            </Text>
          </Card>

          <Card
            containerStyle={{
              borderRadius: 15,
              // elevation: 2,
              backgroundColor: "#00B0FF",
              borderColor:theme.input
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: Fonts.Bold,
                  fontSize: 12,
                  color: "#fff",
                }}
              >
                Send only {walletDetailsFromRedux.currency} to this address.
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.Bold,
                  fontSize: 12,
                  color: "#fff",
                }}
              >
                Sending any other coins may result in permanent loss.
              </Text>
            </View>
          </Card>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: "6%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                CopyAddress();
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <View
                  style={{
                    height: 45,
                    minWidth: 45,
                    borderRadius: 50,
                    // backgroundColor: Colors.PRIMARYLIGHT,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* <Icn
                    name="copy1"
                    type="antdesign"
                    style={{
                      alignSelf: "center",
                    }}
                    color={Colors.WHITE}
                    size={20}
                  /> */}
                  {global.themeData == true ?
                   <Image source={{uri:Images.copy}} />:
                   <Image source={{uri:Images.copy}} />
                  }
                </View>
                <Text
                  style={{
                    fontFamily: Fonts.Bold,
                    fontSize: 12,
                    color: theme.text,
                    textAlign: "center",
                    marginTop:10
                  }}
                >
                  Copy
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                myCustomShare();
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <View
                  style={{
                    height: 45,
                    minWidth: 45,
                    borderRadius: 50,
                    backgroundColor: "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* <Icn
                    name="share"
                    type="entypo"
                    style={{
                      alignSelf: "center",
                    }}
                    color={Colors.WHITE}
                    size={25}
                  /> */}
                  <Image source={{uri:Images.share}} />
                </View>
                <Text
                  style={{
                    fontFamily: Fonts.Bold,
                    fontSize: 12,
                    color: theme.text,
                    textAlign: "center",
                    marginTop:10
                  }}
                >
                  Share
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
export default WalletReceive;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    seperatorLine: {
      height: 0.5,
      backgroundColor: "grey",
    },
  });
