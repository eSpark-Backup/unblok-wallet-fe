import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  BackHandler,
  TouchableOpacity,
  AppState,
  RefreshControl,
  Image,
  ImageBackground,
  StatusBar
} from "react-native";
import { Switch } from 'react-native-switch';
import themeContext from "../../utils/themeContext";
import getRealm from "../../localDb/RealmConfig";
import Header from "../../Components/Header";
import { Fonts } from "../../utils/Fonts";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AllowPushlight from '../../assets/icons/lighttheme/Allow Push Notification.svg'
import AllowPushDark from '../../assets/icons/darktheme/Allow Push Notificaton.svg'
import { windowWidth, windowheight } from "../../utils/Dimensions";
import { Images } from "../../utils/Images";

const Notification = (props) => {
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);
  const [pushcheck, setPushCheck] = useState(false);


  useEffect(() => {
    getNotificationStatus();
  }, []);

  //get Notification status from db
  const getNotificationStatus = (value) => {
    getRealm()
      .then((realm) => {
        var pushNotificationVal = realm.objects("pushNotificationStatus");
        console.log("pushNotificationVal", pushNotificationVal);
        if (pushNotificationVal.length != 0) {
          if (pushNotificationVal[0].notificationStatus == "false") {
            setPushCheck(false);
          } else if (pushNotificationVal[0].notificationStatus == "true") {
            setPushCheck(true);
          }
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "pushNotificationStatus err from localDb");
      });
  };

  //local db to save notification enable disable status
  const saveNotificationStatus = (value) => {
    getRealm()
      .then((realm) => {
        var pushNotificationVal = realm.objects("pushNotificationStatus");

        if (pushNotificationVal.length == 0) {
          //for create notification status first time
          let initialVal;
          realm.write(() => {
            initialVal = realm.create("pushNotificationStatus", {
              notificationStatus: value.toString(),
            });
          });
        } else {
          //for update passcode value
          realm.write(() => {
            pushNotificationVal[0].notificationStatus = value.toString();
          });
        }
        return () => {
          realm.close();
        };
      })
      .catch((err) => {
        console.log(err, "pushNotificationStatus err from localDb");
      });
  };


  return (
    <SafeAreaView style={style.container}>
      <ImageBackground
                source={theme.theme === "dark" ? Images.background : Images.backgroundWhite}
                style={{
                  width: windowWidth,
                  height: windowheight,
                  paddingTop: StatusBar.windowheight,
                }}
                resizeMode="cover"
              >
      <Header name={"Notification"} leftImage={"back"} />
      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          {theme.theme == "light"
            ?
            (<AllowPushlight width={windowWidth * 0.085} height={windowWidth * 0.085} style={{ resizeMode: "contain" }} />)
            : (<AllowPushDark width={windowWidth * 0.085} height={windowWidth * 0.085} style={{ resizeMode: "contain" }} />)
          }

          <Text
            style={{
              fontFamily: Fonts.Regular,
              fontSize: RFPercentage(2.25),
              textAlign: "left",
              color: theme.text,
              marginLeft: 20
            }}
          >
            Allow Push Notification
          </Text>
        </View>
       
         <Switch
              value={pushcheck}
              onValueChange={(value) => {
                setPushCheck(value);
                saveNotificationStatus(value);
              }}
              disabled={false}
              activeText={'On'}
              inActiveText={'Off'}
              circleSize={22}
              barHeight={15}
              circleBorderWidth={0}
              backgroundActive={theme.theme == "light" ? "#cdd0d1" : '#000'}
              backgroundInactive={theme.theme == "light" ? "#000" : '#fff'}
              circleActiveColor={theme.theme == "light" ? "#000" : '#cdd0d1'}
              circleInActiveColor={theme.theme == "light" ? "#cdd0d1" : '#000'}
              changeValueImmediately={true} 
              innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
              outerCircleStyle={{}} // style for outer animated circle
              renderActiveText={false}
              renderInActiveText={false}
              switchLeftPx={2.5} 
              switchRightPx={2.5} 
              switchWidthMultiplier={1.5}
              switchBorderRadius={30} 
            />
      </View> */}

      <View style={{ flexDirection: "row", width: "85%", alignSelf: "center", alignItems: "center", height: windowheight * 0.075, marginTop: "5%" }} >
        <View style={{ width: "13%", height: "60%", justifyContent: "center" }} >
          {theme.theme == "light"
            ?
            (<AllowPushlight width={windowWidth * 0.07} height={windowWidth * 0.07} style={{ resizeMode: "contain" }} />)
            : (<AllowPushDark width={windowWidth * 0.07} height={windowWidth * 0.07} style={{ resizeMode: "contain" }} />)
          }
        </View>
        <View style={{ width: "72%" }} >
          <Text style={{ fontFamily: Fonts.Regular, fontSize: RFPercentage(1.95), color:  theme.theme === "dark" ? "#fff" : "black",}}>Allow Push Notification</Text>
        </View>
        <View style={{ width: "15%", alignItems: "center", }} >
          <Switch
           value={pushcheck}
           onValueChange={(value) => {
             setPushCheck(value);
             saveNotificationStatus(value);
           }}
           disabled={false}
            activeText={'On'}
            inActiveText={'Off'}
            circleSize={20}
            barHeight={15}
            circleBorderWidth={0}
            backgroundActive={
              theme.theme === "dark" ? "#612CD2" : "#612CD2"
            }
            backgroundInactive={
              theme.theme === "dark" ? "#612CD2" : "#612CD2"
            }
            circleActiveColor={theme.theme==="dark"?"#FFFFFF":"#c3acf3"}
            circleInActiveColor={theme.theme==="dark"?"#FFFFFF":"#c3acf3"}
            changeValueImmediately={true}
            innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
            outerCircleStyle={{}} 
            renderActiveText={false}
            renderInActiveText={false}
            switchLeftPx={2.5}
            switchRightPx={2.5}
            switchWidthMultiplier={1.5}
            switchBorderRadius={30}
          />
        </View>
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default Notification;

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
