import React, { useEffect, useState } from "react";
import {
  Animated,
  FlatList,
  View,
  Text,
  Image,
  Switch,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Fonts } from "../../utils/Fonts";
import { Dimensions } from "react-native";
import Header from "../../Components/Header";
import themeContext from "../../utils/themeContext";
import { getProfileFunc } from "./common/Edit_Profile";
import { useFocusEffect } from "@react-navigation/native";
import isEmpty from "../../utils/isEmpty";
import getRealm from "../../localDb/RealmConfig";
import {
  borderRadius,
  borderWidth,
  windowWidth,
  windowheight,
} from "../../utils/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import { ApiConstants } from "../../api/ApiConstants";
import ProfileLight from "../../assets/icons/lighttheme/Edit Profile Black.svg";
import ProfileDark from "../../assets/icons/darktheme/Edit Profile White.svg";
import { Images } from "../../utils/Images";
export default function EditProfile(props) {
  const theme = React.useContext(themeContext);

  const [userDetails, setUserDetails] = useState({})
  const style = styles(theme);

  useFocusEffect(
    React.useCallback(() => {
      
            getProfile()
    }, [])
  )

  const getProfile = async () => {
    getRealm()
            .then((realm) => {
      var loginStatus = realm.objects("loginStatus")
      var mail = loginStatus[0].mail
      console.log("mail", mail);
      getProfileFunc(mail)
        .then((res) => {
          console.log("res.data.data", res.data.data);
          setUserDetails(res.data.data)
        })
        .catch((err) => {
          console.log("error on getting profile", err);
        })
    })
    }
  console.log("userDetails", userDetails);

  function getMonthName(monthNumber) {
    const months = {
      1: "January",
      2: "February",
      3: "March",
      4: "April",
      5: "May",
      6: "June",
      7: "July",
      8: "August",
      9: "September",
      10: "October",
      11: "November",
      12: "December"
    };

    return months[monthNumber] || "Invalid month number";
  }


  return (
    <>
      <SafeAreaView style={style.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <View
            style={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ windowheight, justifyContent: "flex-start" }}>
              <ImageBackground
                source={theme.theme==="dark"?Images.background:Images.backgroundWhite}
                style={{
                  width: windowWidth,
                  height: windowheight,
                  paddingTop: StatusBar.windowheight,
                }}
                resizeMode="cover"
              >
                {/* <View style={{ marginHorizontal: 20 }}>
                <Header name={"Profile"} leftImage={"back"} />
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    {userDetails && !isEmpty(userDetails.profilePic)
                        ?
                        (<Image source={{
                            uri: "http://192.53.121.26:8096/images/" + userDetails.profilePic,
                        }} style={{ width: 120, height: 120, borderRadius: 400 / 2 }} />)
                        : <Image source={require("../../assets/img/profile.png")} />}
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 30 }}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("ChangePassword", params = { "userDetails": userDetails })}>
                        <Text style={{ borderBottomColor: theme.search, borderBottomWidth: 1, width: "100%", fontFamily: Fonts.Regular, color: theme.text }}>Change Password</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginHorizontal: 20 }}>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.theme == "light"?"#000":"#fff" }}>First Name</Text>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 17, color: theme.theme == "light"?"#000":"#fff" }}>{userDetails.firstName}</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.theme == "light"?"#000":"#fff" }}>Middle Name</Text>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 17, color: theme.theme == "light"?"#000":"#fff" }}>{userDetails.middleName}</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.theme == "light"?"#000":"#fff" }}>Last Name</Text>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 17, color: theme.theme == "light"?"#000":"#fff" }}>{userDetails.lastName}</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.theme == "light"?"#000":"#fff" }}>Email Address</Text>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 17, color: theme.theme == "light"?"#000":"#fff" }}>{userDetails.mailAddress}</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.theme == "light"?"#000":"#fff" }}>Phone number</Text>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 17, color: theme.theme == "light"?"#000":"#fff" }}>{userDetails.phoneNumber}</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.theme == "light"?"#000":"#fff" }}>Password</Text>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 17, color: theme.theme == "light"?"#000":"#fff" }}>******</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity style={{
                        backgroundColor: "transparent", borderColor: theme.texttheme, borderWidth: 1,
                        borderRadius: 30, paddingVertical: 15, width: 200, marginTop: 30
                    }} onPress={() => props.navigation.navigate("UpdateProfile", params = { "userDetails": userDetails })}>
                        <Text style={{
                            fontFamily: Fonts.Regular, fontSize: 16, textAlign: "center",
                            width: "100%", color:theme.texttheme
                        }}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View> */}

                <View style={{ width: "100%", height: "100%" }}>
                  <View
                    style={{
                      width: "94%",
                      height: "10%",
                      alignSelf: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <Header name={"Profile"} leftImage={"back"} />
                  </View>
                  <View
                    style={{
                      width: windowWidth * 0.3,
                      height: windowWidth * 0.3,
                      alignSelf: "center",
                      borderRadius: borderRadius * 5,
                      marginTop: "2%",
                      backgroundColor:
                        theme.theme == "dark" ? "#737475" : "#C4C4C4",
                      justifyContent: "center",
                    }}
                  >
                    {userDetails && !isEmpty(userDetails?.profilePic) ? (
                      <Image
                        source={{
                          uri:
                            `${ApiConstants.URL}images/` +
                            userDetails?.profilePic,
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          aspectRatio: 1,
                          borderRadius: borderRadius * 3,
                        }}
                      />
                    ) : // <Image style={{ width: "100%", height: "100%", aspectRatio: 1, borderRadius: borderRadius * 3 }} source={require("../../assets/img/appicon.png")} />
                    theme.theme == "light" ? (
                      // (<ProfileLight width={windowWidth  0.28} height={windowWidth  0.28} style={{ resizeMode: "contain", aspectRatio: 1, alignSelf: "center" }} />
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          aspectRatio: 1,
                          borderRadius: borderRadius * 3,
                        }}
                        source={require("../../assets/img/profile.png")}
                        resizeMode="contain"
                      />
                    ) : (
                      // <ProfileDark width={windowWidth  0.28} height={windowWidth  0.28} style={{ resizeMode: "contain", aspectRatio: 1, alignSelf: "center" }} />

                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          aspectRatio: 1,
                          borderRadius: borderRadius * 3,
                        }}
                        source={require("../../assets/img/profile.png")}
                        resizeMode="contain"
                      />
                    )}
                  </View>

                  <TouchableOpacity
                    style={{ }}
                    onPress={() =>
                      props.navigation.navigate(
                        "ChangePassword",
                        (params = { userDetails: userDetails })
                      )
                    }
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.Regular,
                        color:theme.theme==="dark"? "#fff":"#000000",
                        fontSize: RFPercentage(2.5),
                        textAlign: "center",
                       
                      }}
                    >
                      Change Password
                    </Text>
                  </TouchableOpacity>
                  <Image
                        style={{
                          width: "100%",
                          height:1.5,
                          marginVertical:"2%",
                          marginBottom:"5%"
                        }}
                        source={require("../../assets/img/devider.png")}
                        resizeMode="contain"
                      />
                  <View
                    style={{
                      height: "55%",
                      justifyContent: "space-around",
                      width: "85%",
                      alignSelf: "center",
                      borderRadius: 5,
                      borderWidth: 2,
                      borderColor: "rgba(162, 121, 250, 0.30)",
                      backgroundColor: "rgba(155, 124, 220, 0.15)",
                    }}
                  >
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      style={{ padding: 10 }}
                    >
                      <View style={{ marginTop: "7.5%" }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2),
                            color: theme.theme==="dark"? "#fff":"#200A4E",
                          }}
                        >
                          First Name
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2.3),
                            color: theme.theme==="dark"? "#fff":"#200A4E",
                          }}
                        >
                          {userDetails?.firstName}
                        </Text>
                      </View>

                      {userDetails?.middleName != "" && (
                        <View style={{ marginTop: "5%" }}>
                          <Text
                            style={{
                              fontFamily: Fonts.Regular,
                              fontSize: RFPercentage(2),
                              color: theme.theme==="dark"? "#fff":"#200A4E",
                            }}
                          >
                            Middle Name
                          </Text>
                          <Text
                            style={{
                              fontFamily: Fonts.Regular,
                              fontSize: RFPercentage(2.3),
                              color:theme.theme==="dark"? "#fff":"#200A4E",
                            }}
                          >
                            {userDetails?.middleName}
                          </Text>
                        </View>
                      )}

                      <View style={{ marginTop: "5%" }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2),
                            color: theme.theme==="dark"? "#fff":"#200A4E",
                          }}
                        >
                          Last Name
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2.3),
                            color: theme.theme==="dark"? "#fff":"#200A4E",
                          }}
                        >
                          {userDetails?.lastName}
                        </Text>
                      </View>

                      <View style={{ marginTop: "5%" }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2),
                            color: theme.theme==="dark"? "#fff":"#200A4E",
                          }}
                        >
                          Email Address
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2.3),
                            color: theme.theme==="dark"? "#fff":"#200A4E",
                          }}
                        >
                          {userDetails?.mailAddress}
                        </Text>
                      </View>

                      <View style={{ marginTop: "5%" }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2),
                            color: theme.theme==="dark"? "#fff":"#200A4E",
                          }}
                        >
                          Date of birth
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2.3),
                            color: theme.theme==="dark"? "#fff":"#200A4E",
                          }}
                        >
                          {getMonthName(
                            new Date(userDetails?.DOB).getMonth() + 1
                          )}{" "}
                          {new Date(userDetails?.DOB).getFullYear()}
                        </Text>
                      </View>

                      <View style={{ marginTop: "5%" }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2),
                            color: theme.theme==="dark"? "#fff":"#200A4E",
                          }}
                        >
                          Gender
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2.3),
                            color: theme.theme==="dark"? "#fff":"#200A4E",
                          }}
                        >
                          {userDetails?.gender}
                        </Text>
                      </View>

                      <View style={{ marginTop: "5%" }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2),
                            color: theme.theme==="dark"? "#fff":"#200A4E",
                          }}
                        >
                          Language
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2.3),
                            color: theme.theme==="dark"? "#fff":"#200A4E",
                          }}
                        >
                          {userDetails?.language}
                        </Text>
                      </View>

                      <View style={{ marginTop: "5%" }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2),
                            color: theme.theme==="dark"? "#fff":"#200A4E",
                          }}
                        >
                          Location
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2.3),
                            color: theme.theme==="dark"? "#fff":"#200A4E",
                          }}
                        >
                          {userDetails?.location}
                        </Text>
                      </View>

                      <View style={{ marginTop: "5%" }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2),
                            color: theme.theme==="dark"? "#fff":"#200A4E",
                          }}
                        >
                          Phone number
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2.3),
                            color: theme.theme == "light" ? "#200A4E" : "#fff",
                          }}
                        >
                          +{userDetails?.countryCode} {userDetails?.phoneNumber}
                        </Text>
                      </View>

                      <View style={{ marginTop: "5%", marginBottom: "5%" }}>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2),
                            color: theme.theme == "light" ? "#200A4E" : "#fff",
                          }}
                        >
                          Password
                        </Text>
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(2.4),
                            color: theme.theme == "light" ? "#200A4E" : "#fff",
                          }}
                        >
                          **************
                        </Text>
                      </View>
                    </ScrollView>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: "transparent",
                        borderColor: theme.theme==="dark"? "#fff":"#000000",
                        borderWidth: 1,
                        width: "85%",
                        height: windowheight * 0.065,
                        justifyContent: "center",
                        borderRadius: 5,
                        marginTop: "3%",
                      }}
                      onPress={() =>
                        props.navigation.navigate(
                          "UpdateProfile",
                          (params = { userDetails: userDetails })
                        )
                      }
                    >
                      <Text
                        style={{
                          fontFamily: Fonts.Regular,
                          fontSize: RFPercentage(2),
                          textAlign: "center",
                          width: "100%",
                          color: theme.theme==="dark"? "#fff":"#000000",
                        }}
                      >
                        Edit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    custsearch: {
      borderRadius: 5,
      backgroundColor: theme.background,
      borderColor: theme.phrase1,
      borderWidth: 1,
      margin: 15,
      fontFamily: Fonts.Bold,
      elevation: 0,
      fontSize: RFPercentage(2),
    },
  });
