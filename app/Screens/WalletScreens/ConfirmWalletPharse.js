import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ToastAndroid,
  Image,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  Modal,
  Alert,
} from "react-native";
import themeContext from "../../utils/themeContext";
import { Fonts } from "../../utils/Fonts";
import { Images } from "../../utils/Images";
import { Button, colors, Divider } from "react-native-elements";
import { Colors } from "../../utils/Colors";
import Header from "../../Components/Header";
import ApiClient from "../../api/ApiClient";
import { ApiConstants } from "../../api/ApiConstants";
import getRealm from "../../localDb/RealmConfig";
import { useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { AES, enc } from "react-native-crypto-js";
import { windowWidth, windowheight } from "../../utils/Dimensions";

const ConfirmWalletPharse = (props) => {
  //redux
  const seedDataFromRedux = useSelector(
    (state) => state.seedDataReducer.seedData
  );

  //theme config
  const theme = useContext(themeContext);
    const style = styles(theme);
  const [seedList, seedListArray] = useState([]);
  const [selectedKeyPhraseArray, setSelectedKeyPhraseArray] = useState("");
  const [newArrayValue, setnewArrayValue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [walletDetails, setWalletDetails] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [name, setName] = useState("");
  const [saveSelectedWalletIndexState, setSaveSelectedWalletIndex] =
    useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (seedList.length === 0) {
      seedListArray(
        JSON.parse(
          JSON.stringify(seedDataFromRedux.sort(() => 0.5 - Math.random()))
        )
      );
    }
  }, [newArrayValue]);

  const validateSeed = selectedKeyPhraseArray.toString();
  const replace = validateSeed.replace(/,/g, " ");

  /**
   * add item for dynamic interests
   */
  const Item = ({ item, onPress, textColor, backgroundColor, borderColor, borderWidth, borderRadius }) => (
    Item2({ item, onPress, textColor, backgroundColor, borderColor, borderWidth, borderRadius }),
    (
      <>
        {item.checked == false && (
          <TouchableOpacity
            onPress={onPress}
            style={{
              backgroundColor: backgroundColor,
        borderColor:
        theme.theme === "light"
            ? "rgba(97, 44, 210, 0.50)"
            : "rgba(162, 121, 250, 0.30)",
        borderWidth: 1,
        alignItems: "center",
        borderStyle: "solid",
        
        borderRadius: 5,
        margin: "1%",
        width: "31.2%",
            }}
          >
            <Text
              style={{
                padding: "8%",
                color: theme.theme === "dark" ? "white" : "black",
                fontSize: RFPercentage(1.5),
                fontFamily: Fonts.Regular,
                textTransform: "capitalize",
              }}
            >
              {item.value}
            </Text>
          </TouchableOpacity>
        )}
      </>
    )
  );

  const Item2 = ({ item, onPress, textColor, backgroundColor, borderColor, borderWidth }) => {
    return (
      <>
        {item.checked == true && (
          <TouchableOpacity
            onPress={onPress}
            style={{
              backgroundColor: "rgba(162, 121, 250, 0.15)",
              borderColor:
              theme.theme === "light"
                  ? "rgba(97, 44, 210, 0.50)"
                  : "rgba(162, 121, 250, 0.30)",
              borderWidth: 1,
              alignItems: "center",
              borderStyle: "solid",
              
              borderRadius: 5,
              margin: "1%",
              width: "31.2%",
            }}
          >
            <Text
              style={{
                padding: "8%",
                color: theme.theme === "dark" ? "white" : "black",
                fontSize: RFPercentage(1.5),
                fontFamily: Fonts.Regular,
                textTransform: "capitalize",
              }}
            >
              {item.value}
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  /**
   * map interests in the array
   */
  const mapData = () => {
    return seedList.map((item, index) => {
      const backgroundColor = "transparent";
      const color = theme.text;
      const borderWidth = 1;
      const borderColor = theme.phrase1;
      const borderRadius = 30;
      return (
        <Item
          key={index.toString()}
          item={item}
          onPress={() => {
            let newItems = [...seedList];
            newItems[index].checked = !item.checked;
            if (newItems[index].checked) {
              setSelectedKeyPhraseArray((interests) => [
                ...interests,
                item.value,
              ]);
              setnewArrayValue((interests) => [...interests, item.id]);
            } else {
              let newArray = selectedKeyPhraseArray.filter(
                (interest) => interest !== item.value
              );
              let newArray2 = selectedKeyPhraseArray.filter(
                (interest) => interest !== item.id
              );
              setSelectedKeyPhraseArray(newArray);
              setnewArrayValue(newArray2);
            }
          }}
          backgroundColor={backgroundColor}
          textColor={color}
          borderColor={borderColor}
          borderWidth={borderWidth}
        />
      );
    });
  };

  const
    mapData2 = () => {
    var valArr = [];

    newArrayValue.map((item, index) => {
      valArr.push(item);
    });
    let arrOne = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let arrTwo = valArr;
    let result = arrTwo.every(function (element, index) {
      return element === arrOne[index];
    });
    if (result == false && result != true) {
      global.fail = "Invalid order";
    } else if (JSON.stringify(arrOne) == JSON.stringify(arrTwo)) {
      global.fail = "Well Done";
    } else if (
      result == true &&
      JSON.stringify(arrOne) != JSON.stringify(arrTwo)
    ) {
      global.fail = "";
    } else if (valArr == "") {
      global.fail = "";
    }

    return seedList.map((item, index) => {
      const backgroundColor = "transparent";
      const color = theme.text;
      const borderWidth = 1;
      const borderColor = theme.phrase1;
      const borderRadius = 30;
      return (
        <>
          <Item2
            key={index.toString()}
            item={item}
            onPress={() => {
              let newItems = [...seedList];
              newItems[index].checked = !item.checked;
              if (newItems[index].checked) {
                setSelectedKeyPhraseArray((interests) => [
                  ...interests,
                  item.value,
                ]);
                setnewArrayValue((interests) => [...interests, item.id]);
              } else {
                let newArray = selectedKeyPhraseArray.filter(
                  (interest) => interest !== item.value
                );

                let newArray2 = newArrayValue.filter(
                  (interest) => interest !== item.id
                );
                setSelectedKeyPhraseArray(newArray);
                setnewArrayValue(newArray2);
              }
            }}
            backgroundColor={backgroundColor}
            textColor={color}
            borderColor={borderColor}
            borderWidth={borderWidth}
          />
          {item.checked == true && (
            <Image
              style={{
                width: 15,
                height: 15,
                position: "absolute",
                bottom: "47%",
              }}
              source={Images.remove}
            />
          )}
        </>
      );
    });
  };
  useEffect(() => {
    getWalletData();
  }, []);

  const getWalletData = () => {
    getRealm()
      .then((realm) => {
        var walletData = realm.objects("Wallet_array");

        setName("Multi-Coin Wallet " + (walletData.length + 1));
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "wallet data list err from localDb");
      });
  };

  const seedvalidateMultiCoin = async () => {
          setLoading(true);
var Mnemonic = AES.encrypt(replace, ApiConstants.secretOrKey).toString()
    let params = {
        seed: Mnemonic,
        multicoin: "multi-coin",
        walletname: name,
        deviceId: global.deviceId,
        mailAddress: global.mailAddress
      };
ApiClient.post(ApiConstants.seedvalidation, params)
      .then((res) => {
      setLoading(false);
if (res.data.status == true) {
          getRealm()
            .then((realm) => {

              var walletData = realm.objects("Wallet_array");
        console.log("walletData", JSON.stringify(walletData, null, 2));
        console.log("res.data.data", JSON.stringify(res.data.data, null, 2));

        if (walletData.length == 0) {
          realm.write(() => {
            realm.create("Wallet_array", { ...res.data.data });
          });
        } else {
          var saveWallet = walletData.filter((item) => {
                  return item.selected == "true"
          })

          realm.write(() => {
            saveWallet[0].selected = "false"
          })

          realm.write(() => {
            realm.create("Wallet_array", { ...res.data.data });
          });
        }
global.newWallet = "create"
        props.navigation.navigate("WalletHome");

            })
            .catch((err) => {
              setLoading(false);
              console.log("Wallet_array localDb err", err);
            });
      } else {
//console.log('seedvalidation multi coin res', res);
        ToastAndroid.showWithGravityAndOffset(
          "Bookmarks Empty",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
          );
                }
    })
      .catch((err) => {
      setLoading(false);
      console.log("seedvalidateMultiCoin err", err);
    });
  };

  return (
    <SafeAreaView style={style.container}>
      <ImageBackground
        source={theme.theme === "light" ? Images.backgroundWhite : Images.background}
        style={{
          width: windowWidth,
          height: windowheight,
          paddingTop: StatusBar.windowheight,
        }}
        resizeMode="cover"
      >
        <Header leftImage={"back"} />
        <ScrollView>
          <View>
            <View style={{ marginHorizontal: 20, marginTop: 20 }}>
              <Text style={style.pharseTxt}>Your Secret Phrase</Text>
              <Text
                style={{
                  fontFamily: Fonts.Regular,
                  fontSize: RFPercentage(1.9),
                  color: theme.theme === "dark" ? "white" : "black",
                  textAlign: "left",
                  marginBottom: 20,
                }}
              >
                Tap the words to put them in the correct order.
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: "90%",
                alignSelf: "center",
                // justifyContent: "space-between",
              }}
            >
              {mapData2()}
            </View>
            <Image
              style={{ width: "100%", marginTop: "10%", marginBottom: "5%" }}
              source={require("../../assets/img/devider.png")}
              resizeMode="contain"
            />

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: "90%",
                alignSelf: "center",
                // justifyContent: "space-between",
              }}
            >
              {mapData()}
            </View>
            {global.fail == "Invalid order" && (
              <Text
                style={{
                  fontFamily: Fonts.Regular,
                  fontSize: 14,
                  marginTop: 15,
                  color: "red",
                  textAlign: "center",
                }}
              >
                Invalid Order
              </Text>
            )}
            {global.fail == "Well Done" && (
              <Text
                style={{
                  color: theme.theme === "dark" ? "#FFF" : "#612CD2",
                  textAlign: "center",
                  fontSize: RFPercentage(4),
                 
                  textShadowColor: theme.theme === "light" ? "#000" : "#612CD2",
                  textShadowOffset: { width: -1.5, height: 2.5 },
                  textShadowRadius: 1,
                  // textShadowColor: theme.theme === "light" ? "#000" : "#612CD2",
                  // textShadowOffset: { width: -4, height: 2.5 },
                  // textShadowRadius: 2,
                  fontFamily: Fonts.Bold,
                  marginTop: 20,
                  fontWeight:"bold",
                }}
              >
                Well Done!
              </Text>
            )}
            {global.fail === "Well Done" && loading == true && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    fontFamily: Fonts.Regular,
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    backgroundColor:
                      theme.theme === "light" ? "#612CD2" : "#FFF600",
                    borderRadius: 2,
                    width: "75%",
                    borderColor: theme.text,
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator
                    size="small"
                    color={theme.theme === "light" ? "white" : "black"}
                  />
                </TouchableOpacity>
              </View>
            )}
            {global.fail == "Well Done" && loading == false && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setLoading(true);
                    setModalVisible(true);
                    setTimeout(() => {
                      seedvalidateMultiCoin();
                    }, 5000);
                  }}
                  style={{
                    fontFamily: Fonts.Regular,
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    backgroundColor:
                      theme.theme === "light" ? "#612CD2" : "#FFF600",
                    borderRadius: 2,
                    width: "75%",
                    borderColor: theme.text,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: RFPercentage(2),
                      fontFamily: Fonts.Bold,
                      color: theme.theme === "light" ? "white" : "black",
                    }}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {global.fail != "Well Done" && loading != false && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <Button
                  title="Confirm"
                  disabled="true"
                  buttonStyle={{
                    width: "85%",
                    alignSelf: "center",
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: "#00B0FF",
                    borderRadius: 50,
                    height: 50,
                  }}
                  titleStyle={{
                    fontFamily: Fonts.Regular,
                    color: "#00B0FF",
                    fontSize: RFPercentage(2),
                  }}
                />
              </View>
            )}
          </View>
        </ScrollView>
        {modalVisible && (
          <ImageBackground
            source={theme.theme === "light" ? Images.backgroundWhite : Images.background}
            style={{
              width: windowWidth,
              height: windowheight,
              paddingTop: StatusBar.windowheight,
              position: "absolute",
              backgroundColor:
                theme.theme === "light"
                  ? "rgba(68, 68, 68, 0.95)"
                  : "transparent",
            }}
            resizeMode="cover"
          >
            <View style={style.modelContainer}>
              <View style={style.centeredView}>
                <TouchableOpacity
                  style={style.buttonClose}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={style.createTextX}>X</Text>
                </TouchableOpacity>
                <View style={style.modalView}>
                  {theme.theme === "dark" ? (
                    <Image
                      style={{ width: "80%",height:"70%", marginLeft:"10%"}}
                      source={require("../../assets/img/model_image.png")}
                      resizeMode="contain"
                    />
                  ) : (
                    <Image
                      style={{ width: "80%",height:"70%", marginLeft:"10%"}}
                      source={require("../../assets/img/model_image_light.png")}
                      resizeMode="contain"
                    />
                  )}

                  <Text style={style.createText}>Successfully</Text>
                  <Text style={style.modelText}>Created</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};
export default ConfirmWalletPharse;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    pharseTxt: {
      fontFamily: Fonts.Bold,
      fontSize: RFPercentage(2.8),
      color: theme.theme === "dark" ? "white" : "black",
      textAlign: "left",
      marginBottom: 15,
      fontWeight:"bold"
    },
    modelContainer: {
      position: "absolute",
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    centeredView: {
      position: "relative",
      width: "75%",
      height: "50%",
      borderRadius: 5,
      borderWidth: 2,
      borderColor: "rgba(162, 121, 250, 0.30)",
      backgroundColor:
        theme.theme === "light" ? "#EDEDED" : "rgba(155, 124, 220, 0.15)",
    },
    modalView: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    createText: {
      color: theme.theme === "dark" ? "white" : "#000000",
      textAlign: "center",
      fontSize: RFPercentage(3),
      fontFamily: Fonts.Bold,
      marginBottom: 5,
      fontWeight: "bold",
    },

    modelText: {
      color: theme.theme === "dark" ? "#FFF600" : "#612CD2",
      textAlign: "center",
      fontSize: RFPercentage(3),
      fontFamily: Fonts.Bold,
      textShadowColor: theme.theme === "light" ? "#000" : "#612CD2",
      textShadowOffset: { width: -1.5, height: 2.5 },
      textShadowRadius: 1,
      // textShadowColor: theme.theme === "light" ? "black" : "#612CD2",
      // textShadowOffset: { width: -2, height: 2.5 },
      // textShadowRadius: 2,
      fontWeight: "bold",
      width:"100%"
    },
    createTextX: {
      color: theme.theme === "dark" ? "white" : "white",
      textAlign: "center",
      fontSize: RFPercentage(3),
      fontFamily: Fonts.Bold,
    },
    buttonClose: {
      position: "absolute",
      right: 5,
      top: 5,
      borderRadius: 2,
      borderWidth: 2,
      borderColor: "rgba(162, 121, 250, 0.30)",
      backgroundColor:
        theme.theme === "dark" ? "rgba(155, 124, 220, 0.15)" : "#612CD2",
      justifyContent: "center",
      textAlign: "center",
      width: 42,
      height: 42,
    },
  });
