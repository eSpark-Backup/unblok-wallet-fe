import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Fonts } from "../../utils/Fonts";
import themeContext from "../../utils/themeContext";
import Header from "../../Components/Header";
import { Searchbar } from "react-native-paper";
import { Images } from "../../utils/Images";
import ShowPhrase from "../../assets/img/show-phrase.svg";
import ArrowDown from "../../assets/img/arrow-down.svg";
import { RFPercentage } from "react-native-responsive-fontsize";
export default function ShowSecretPhrase(props) {
  const theme = React.useContext(themeContext);
  const style = styles(theme);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  return (
    <>
      <SafeAreaView>
        <View>
          <Header name={"Wallet send"} leftImage={"back"}
          //   rightImage={"add"} 
          />
          <View style={{ marginHorizontal: 20 }}>
            <Text style={{
              fontFamily: Fonts.Regular, fontSize: RFPercentage(2.5), marginBottom: 20,
              marginTop: 20,
              color: "#000"
            }}>Name</Text>
            <Searchbar
              placeholder="Search"
              style={style.custsearch}
              backgroundColor={"transparent"}
              iconColor={theme.search}
              inputStyle={{ color: theme.text, fontFamily: Fonts.Regular, fontSize: RFPercentage(2) }}
              placeholderTextColor={theme.search}
            />
          </View>
          <TouchableOpacity onPress={() => props.navigation.navigate("ShowPhrase")}>
            <View style={{
              marginHorizontal: 35, flexDirection: "row", alignItems: "center", justifyContent: "flex-start",
              marginTop: 20
            }}>
              <View>
                <ShowPhrase width={30} height={30} fill={"#000"} />
              </View>
              <View style={{ marginLeft: 20 }}>
                <Text style={{ fontFamily: Fonts.Medium, fontSize: RFPercentage(2.5), color: "#000" }}>Show Secret Phrase</Text>
                <Text style={{
                  fontFamily: Fonts.Regular, fontSize: RFPercentage(2), color: "#000",
                  width: windowWidth - 150
                }}>If you lose access to this device, your funds will be lost,
                  unless you back up! </Text>
              </View>
              <View style={{ marginLeft: 20 }}>
                <ArrowDown fill={"#000"} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    seperatorLine: {
      height: 1,
      backgroundColor: "black",
    },
    customTokenTxt: {
      fontSize: 16,
      color: "#00B0FF",
      fontFamily: Fonts.Medium,
    },
    multiTxt: {
      fontFamily: Fonts.Medium,
      fontSize: 18,
      marginHorizontal: 20,
      alignSelf: "center",
      color: theme.text,
    },
    flex: {
      flexDirection: "row",
    },
    IcnView: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: "2%",
      marginHorizontal: 5,
    },
    custsearch: {
      borderRadius: 10,
      backgroundColor: theme.background,
      borderColor: theme.phrase1,
      borderWidth: 1,
      margin: 15,
      elevation: 0,
      fontFamily: Fonts.Bold,
      color: theme.text,
      fontSize: RFPercentage(2)
    },
  });
