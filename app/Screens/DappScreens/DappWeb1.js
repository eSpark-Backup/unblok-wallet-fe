import React, { useContext, useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Pressable,
  Image,
} from "react-native";
import themeContext from "../../utils/themeContext";
import { Surface } from "react-native-paper";
import { Colors } from "../../utils/Colors";
import { Fonts } from "../../utils/Fonts";
import Web3Provider from "../../utils/Web3Provider";
import { useDispatch, useSelector } from "react-redux";
import { dappWeb } from "../../Redux/Actions/dappWebAction";
import { Icon as Icn } from "react-native-elements";
import { Images } from "../../utils/Images";
import { Searchbar } from "react-native-paper";
import Modal from "react-native-modal";
import { RFPercentage } from "react-native-responsive-fontsize";
import { showImage } from "../../utils/showImage";

const DappWeb = () => {
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);

  //for search bar
  const onChangeSearch = (query) => setSearchQuery(query);

  //for search function
  const [searchQuery, setSearchQuery] = useState("");
  const [state, setState] = useState({
    data: [],
    loading: false,
  }); // only one data source
  const { data, loading } = state;

  const filterdData = searchQuery // based on text, filter data and use filtered data
    ? data.filter((item) => {
      //console.log("itemitemitem", item.currency.currencyName);
      const itemData = item.currency.toUpperCase();
      // console.log(itemData);
      const textData = searchQuery.toUpperCase();
      return itemData.indexOf(textData) > -1;
    })
    : data; // on on text, u can return all data

  var ethRpc = "https://mainnet.infura.io/v3/";
  var ethChainId = 1;

  var bscRpc = "https://bsc-dataseed.binance.org";
  var bscChainId = 56;

  //redux
  const dispatch = useDispatch();
  const selectedWallet = useSelector(
    (state) => state.selectedCurrencyListReducer.selectedList
  );

  console.log("selectedWallet",selectedWallet);
  const dappStatusFromRedux = useSelector(
    (state) => state.DappWebReducer.dappWeb
  );

  const url = dappStatusFromRedux.item.url;
  const [myUrl, setUrl] = useState();
  const [isModalVisible, setModalVisible] = useState(false);

  const [imageUrl, setImageUrl] = useState("ETH");
  const [ImageLabel, setImageLabel] = useState("");

  const openModel = () => {
    setModalVisible(true);
  };
  const closeModel = () => {
    setModalVisible(false);
  };

  const setDappStatus = (item) => dispatch(dappWeb(item));

  useEffect(() => {
    var arr = [];
    setImageLabel( selectedWallet.length > 1 ? selectedWallet[1].currency : selectedWallet[0].currency);
    selectedWallet.map((item, index) => {
      if (item.currency != "TRX" && item.currency != "BTC") {
        arr.push(item);
      }
    });
    setState({ data: arr, loading: false });
    if (
      new RegExp(
        "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
      ).test(url)
    ) {
      setUrl(url);
    } else {
      setUrl("https://www.google.com/search?q=" + url);
    }
  }, []);

  useEffect(() => {
    const backAction = () => {
      setDappStatus({ status: "false", item: "item" });
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const setImage = (imageName) => {
    if (imageName == "ETH") {
      return <Images.EthLogo width={35} height={35} />;
    } else if (imageName == "BNB") {
      return <Image source={{uri:Images.BNB}} width={35} height={35} />;
    } else if (imageName == "TRX") {
      return <Images.TrxLogo width={35} height={35} />;
    }
  };

  const renderImage = (image1) => {
    return image1 ? setImage(image1) : <View />;
  };


  return (
    <SafeAreaView style={style.container}>
      <StatusBar barStyle={"light-content"} backgroundColor={Colors.PRIMARY} />
      <Surface style={style.headerStyle}>
        <View style={style.leftImgView}>
          <Pressable
            onPress={() => {
              setDappStatus({ status: "false", item: "item" });
            }}
          >
            <Icn
              name="chevron-left"
              type="evilicons"
              style={{
                alignSelf: "center",
              }}
              color={Colors.WHITE}
              size={30}
            />
          </Pressable>
          <Text style={style.largeFont}>{dappStatusFromRedux.item.url}</Text>
          <View style={style.rightImgView}>
            <Pressable onPress={() => openModel()}>
              {renderImage(ImageLabel)}
            </Pressable>
          </View>
        </View>
      </Surface>

      <Web3Provider
        style={{ flex: 1 }}
        DAPP_URL={myUrl}
        CHAIN_ID={imageUrl == "ETH" ? ethChainId : bscChainId}
        RPC_URL={imageUrl == "ETH" ? ethRpc : bscRpc}
        PRIVATE_KEY={selectedWallet.length > 1 ? selectedWallet[1].privKey : selectedWallet[0].privKey}
      />

      <Modal
        isVisible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        onBackdropPress={() => {
          setModalVisible(false);
        }}
        backdropPressToClose={true}
      >
        <ScrollView>
          <View
            style={{
              alignSelf: "center",
              padding: 20,
              borderWidth: 0.4,
              borderColor: Colors.PRIMARY,
              backgroundColor: Colors.WHITE,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          >
            <Searchbar
              placeholder="Search Network"
              style={{
                backgroundColor: "#FFFFFF",
                alignSelf: "center",
                fontSize:RFPercentage(2)
              }}
              iconColor={theme.search}
              placeholderTextColor={theme.search}
              inputStyle={{ color: theme.text }}
              onChangeText={onChangeSearch}
              value={searchQuery}
            />
            {filterdData.length != 0 ? (
              <FlatList
                data={filterdData}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setImageUrl(item.currency);
                      setImageLabel(item.currency);
                      closeModel();
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        padding: "5%",
                      }}
                    >
                      {showImage(item.tokenType)}
                      <View style={{ marginHorizontal: 20 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: Fonts.Bold,
                            color: theme.text,
                          }}
                        >
                          {item.currency}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  alignSelf: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.Bold,
                    color: theme.text,
                  }}
                >
                  No Data Found!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
};
export default DappWeb;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerStyle: {
      height: 55,
      elevation: 4,
      borderBottomWidth: 0.2,
      justifyContent: "center",
      backgroundColor: Colors.PRIMARY,
    },
    largeFont: {
      color: Colors.WHITE,
      fontFamily: Fonts.Bold,
      fontSize: 12,
      flex: 1,
      textAlign: "center",
    },
    leftImgView: {
      flexDirection: "row",
      marginHorizontal: 20,
      justifyContent: "space-between",
    },
    rightImgView: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
