import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Linking,
  Dimensions,
  ToastAndroid,
  Pressable,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Images } from "../../utils/Images";
import themeContext from "../../utils/themeContext";
import { Fonts } from "../../utils/Fonts";
// import LLogo from "../../assets/img/llogo.svg";
// import DLogo from "../../assets/img/dlogo.svg";
import Dropdown from "../../assets/img/dropdown.svg";
import DropdownLight from "../../assets/img/dropdownLight.svg";
import Eyeoff from "../../assets/img/eye.svg";
import Eyeon from "../../assets/img/eyeon.svg";
import LLogo from "../../assets/img/applogo2d.png";
import DLogo from "../../assets/img/applogo2l.png";
import PhoneInput from "react-native-phone-number-input";
import Eye from "../../assets/img/eye.svg";
import { Calendar } from "react-native-calendars";
import MonthPicker from "react-native-month-year-picker";
import { formValidation } from "./common/Sign_up";
import isEmpty from "../../utils/isEmpty";
import { registerFunction } from "./common/Sign_up";
import { RFPercentage } from "react-native-responsive-fontsize";
import { borderRadius, borderWidth } from "../../utils/Dimensions";
import SelectDropdown from "react-native-select-dropdown";
import { languages } from "../../utils/language";
import DatePicker from "react-native-date-picker";
import { locations } from "../../utils/locations";

import TickGreen from "../../assets/img/tick.svg";
import { CheckBox } from "react-native-elements";

export const getMonthName = (monthNumber) => {
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
    12: "December",
  };
  return months[monthNumber] || "Invalid month number";
};
//   import PasswordInputText from 'react-native-hide-show-password-input';
export default function Signup(props) {
  const [firstName, setFirstName] = React.useState("");
  const [middleName, setMiddleName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [countrycode, setCountryCode] = useState("");
  const [mailAddress, setMailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [show1, setShow1] = useState(true);
  const [show2, setShow2] = useState(true);
  const [mailAlready, setmailAlready] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("");
  // const [password, setPassword] = useState("");
  // const [allLanguage,setAllLanguage]=useState(languages)
  const [category, setCategory] = useState(["Male", "Female"])
  const [load, setLoad] = useState(false);
  const [isSelected1, setSelection1] = useState(false);
  const [error, setError] = useState({})
  const theme = React.useContext(themeContext);
  const style = styles(theme);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  console.log("countrycode", countrycode);
  console.log("zselfgjzhff", countrycode + phoneNumber);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const showPicker = useCallback((value) => setShow(value), []);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;

      showPicker(false);
      setDate(selectedDate);
    },
    [date, showPicker],
  );
  console.log("date", date);

  useEffect(() => {
    setError({})
    setmailAlready("")
  }, [firstName,
    middleName,
    lastName,
    phoneNumber,
    confirmPassword,
    mailAddress,
    password, date,
    gender,
    language,
    location, phoneNumber])

  const submitFunction = async () => {
    setLoad(true)
    console.log("uaheuiwehhuifrh");
    var formData = {
      firstName,
      middleName,
      lastName,
      phoneNumber,
      mailAddress: mailAddress.toLowerCase().trim(),
      password,
      confirmPassword,
      countryCode: countrycode,
      country,
      DOB: date,
      gender,
      language,
      location
    }
    var validate = await formValidation(formData)
    console.log("validate", validate);
    if (!isEmpty(validate)) {
      setError(validate)
    } else {
      console.log("seygyegewgg");
      formData.deviceId = global.deviceId
      registerFunction(formData, props)
        .then((resp) => {
          console.log("reoepppe", resp);
          if (resp) {
            setmailAlready(resp?.msg)
            setLoad(false)
          }

        })
        .catch((err) => {
          setLoad(false)
          console.log("errr on submit function", err);
        })
    }
  }

  console.log("zsrgtzsderg", theme.theme);

  const phoneInput = useRef(null);



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
            <View style={{ windowHeight, justifyContent: "flex-start" }}>
              <ImageBackground
                source={theme.theme === "dark" ? Images.background : Images.backgroundWhite}
                style={{
                  width: windowWidth,
                  height: windowHeight,
                  paddingTop: StatusBar.windowHeight,
                }}
                resizeMode="cover"
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "20%",
                  }}
                >
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Image
                      style={{ width: 74, height: 79 }}
                      source={require("../../assets/img/appicon.png")}
                      resizeMode="contain"
                    />
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      height: "50%",
                      justifyContent: "center",
                      paddingLeft: 10,
                    }}
                  >
                    <Image
                      style={{ width: 129, height: 21 }}
                      source={require("../../assets/img/keyboard3.0.png")}
                      resizeMode="contain"
                    />
                  </View>
                </View>
                <View
                  style={{ width: "87.5%", alignSelf: "center", height: "80%" }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.Bold,
                      fontSize: RFPercentage(3),
                      color: theme.theme === "dark" ? "#fff" : "black",
                      fontWeight:"bold"
                    }}
                  >
                    Sign Up
                  </Text>
                  {/* <Text style={{
              fontFamily: Fonts.Regular, fontSize: RFPercentage(2), color: theme.texttheme, marginTop: "2%"
            }}>Enter Your Details to Sign Up</Text> */}
                  <View style={{ marginTop: "5%", height: "88%" }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <View>
                        <Text style={style.title_text}>First Name*</Text>
                        <View style={style.box_container}>
                          <View
                            style={{
                              marginLeft: "4%",
                              width: "90%",
                              height: windowHeight * 0.07,
                              justifyContent: "center",
                            }}
                          >
                            <TextInput
                              selectionColor={"#A279FA"}
                              onChangeText={setFirstName}
                              value={firstName}
                              placeholder="Enter First Name"
                              maxLength={35}
                              placeholderTextColor={"#A279FA"}
                              style={style.input_container}
                            />
                          </View>
                        </View>
                        {error && error?.firstNameError && (
                          <Text style={style.error_container}>
                            {error.firstNameError}
                          </Text>
                        )}
                      </View>

                      <View style={{ marginTop: "5%" }}>
                        <Text style={style.title_text}>Middle Name</Text>
                        <View style={style.box_container}>
                          <View
                            style={{
                              marginLeft: "4%",
                              width: "90%",
                              height: windowHeight * 0.07,
                              justifyContent: "center",
                            }}
                          >
                            <TextInput
                              selectionColor={"#A279FA"}
                              maxLength={35}
                              onChangeText={setMiddleName}
                              value={middleName}
                              placeholder="Enter Middle Name"
                              placeholderTextColor={"#A279FA"}
                              style={style.input_container}
                            />
                          </View>
                        </View>
                        {error && error?.middleNameError && (
                          <Text
                            style={{
                              fontFamily: Fonts.Regular,
                              fontSize: 12,
                              color: "red",
                            }}
                          >
                            {error.middleNameError}
                          </Text>
                        )}
                      </View>

                      <View style={{ marginTop: "5%" }}>
                        <Text style={style.title_text}>Last Name*</Text>
                        <View style={style.box_container}>
                          <View
                            style={{
                              marginLeft: "4%",
                              width: "90%",
                              height: windowHeight * 0.07,
                              justifyContent: "center",
                            }}
                          >
                            <TextInput
                              selectionColor={"#A279FA"}
                              maxLength={35}
                              onChangeText={setLastName}
                              value={lastName}
                              placeholder="Enter Last Name"
                              placeholderTextColor={"#A279FA"}
                              style={style.input_container}
                            />
                          </View>
                        </View>
                        {error && error?.lastNameError && (
                          <Text style={style.error_container}>
                            {error.lastNameError}
                          </Text>
                        )}
                      </View>

                      <View style={{ marginTop: "5%" }}>
                        <Text style={style.title_text}>Birthday*</Text>
                        <TouchableOpacity
                          onPress={() => {
                            showPicker(true);
                          }}
                          style={[
                            style.box_container,
                            {
                              flexDirection: "row",
                              justifyContent: "space-between",
                            },
                          ]}
                        >
                          <View>
                            <View
                              style={{
                                marginRight: "4%",
                                width: "100%",
                                height: windowHeight * 0.07,
                                justifyContent: "center",
                                alignItems: "flex-end",
                              }}
                            >
                              <Text style={{ color: "#A279FA" }}>{`${
                                new Date(date).getMonth() + 1
                              }/${new Date(date).getDate()}/${new Date(
                                date
                              ).getFullYear()}`}</Text>
                            </View>
                          </View>

                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={Images.calender}
                              style={{ width: 18, height: 18, marginRight: 20 }}
                            />
                          </View>
                        </TouchableOpacity>
                        {error && error?.DOB && (
                          <Text style={style.error_container}>{error.DOB}</Text>
                        )}
                      </View>
                      {show && (
                        <DatePicker
                          modal
                          mode="date"
                          open={show}
                          date={date}
                          title={" "}
                          maximumDate={new Date()}
                          onConfirm={(date) => {
                            setShow(false);
                            setDate(date);
                            // console.log("For praveen",date);
                          }}
                          onCancel={() => {
                            setShow(false);
                          }}
                        />
                      )}

                      <View style={{ marginTop: "5%" }}>
                        <Text style={style.title_text}>Gender*</Text>
                        <View style={style.box_container}>
                          <View
                            style={{
                              // width: "100%",
                              padding: 10,
                              height: windowHeight * 0.07,
                              justifyContent: "center",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <SelectDropdown
                              data={category}
                              onSelect={(selectedItem, index) => {
                                console.log(selectedItem, index);
                                setGender(selectedItem);
                              }}
                              buttonTextAfterSelection={(
                                selectedItem,
                                index
                              ) => {
                                // text represented after item is selected
                                // if data array is an array of objects then return selectedItem.property to render after item is selected
                                console.log("selectedItem", selectedItem);
                                return selectedItem;
                              }}
                              defaultButtonText={"Select Gender"}
                              rowTextForSelection={(item, index) => {
                                // text represented for each item in dropdown
                                // if data array is an array of objects then return item.property to represent item in dropdown
                                return item;
                              }}
                              buttonStyle={style.dropdown1BtnStyle}
                              buttonTextStyle={style.dropdown1BtnTxtStyle}
                              dropdownIconPosition={"right"}
                              dropdownStyle={style.dropdown1DropdownStyle}
                              rowStyle={style.dropdown1RowStyle}
                              rowTextStyle={style.dropdown1RowTxtStyle}
                            />
                            <View
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {theme.theme === "dark" ? (
                                <Dropdown
                                  style={{
                                    alignSelf: "center",
                                    aspectRatio: 1,
                                    marginRight: 20,
                                  }}
                                  width={windowWidth * 0.03}
                                  height={windowWidth * 0.03}
                                />
                              ) : (
                                <DropdownLight
                                  style={{
                                    alignSelf: "center",
                                    aspectRatio: 1,
                                    marginRight: 20,
                                  }}
                                  width={windowWidth * 0.03}
                                  height={windowWidth * 0.03}
                                />
                              )}
                            </View>
                          </View>
                        </View>
                        {error && error?.gender && (
                          <Text style={style.error_container}>
                            {error.gender}
                          </Text>
                        )}
                      </View>

                      {/* <View style={{ marginTop: "5%" }} >
                  <Text style={style.title_text}>Location*</Text>
                  <View style={style.box_container}>
                    <View style={{ marginLeft: "4%", width: "90%", height: windowHeight * 0.07, justifyContent: "center" }} >
                      <TextInput
                        onChangeText={setLocation}
                        value={location}
                        selectionColor={"#9370DB"}
                        placeholder="Country"
                        placeholderTextColor={"grey"}
                        style={style.input_container}
                      />
                    </View>
                  </View>
                  {error && error?.mailValidateErr && <Text style={style.error_container}>{error.mailValidateErr}</Text>}
                  {error && error?.mailAddressError && <Text style={style.error_container}>{error.mailAddressError}</Text>}
                  {mailAlready != "" ? <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red" }}>{mailAlready}</Text> : <></>}

                </View> */}

                      <View style={{ marginTop: "5%" }}>
                        <Text style={style.title_text}>Language*</Text>
                        <View style={style.box_container}>
                          <View
                            style={{
                              // width: "100%",
                              height: windowHeight * 0.07,
                              justifyContent: "center",
                              flexDirection: "row",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <SelectDropdown
                              data={languages}
                              onSelect={(selectedItem, index) => {
                                console.log(selectedItem, index);
                                setLanguage(selectedItem);
                              }}
                              buttonTextAfterSelection={(
                                selectedItem,
                                index
                              ) => {
                                // text represented after item is selected
                                // if data array is an array of objects then return selectedItem.property to render after item is selected
                                console.log("selectedItem", selectedItem);
                                return selectedItem;
                              }}
                              defaultButtonText={"Select Language"}
                              rowTextForSelection={(item, index) => {
                                // text represented for each item in dropdown
                                // if data array is an array of objects then return item.property to represent item in dropdown
                                return item;
                              }}
                              buttonStyle={style.dropdown1BtnStyle}
                              buttonTextStyle={style.dropdown1BtnTxtStyle}
                              dropdownIconPosition={"right"}
                              dropdownStyle={style.dropdown1DropdownStyle}
                              rowStyle={style.dropdown1RowStyle}
                              rowTextStyle={style.dropdown1RowTxtStyle}
                            />
                            <View
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {theme.theme === "dark" ? (
                                <Dropdown
                                  style={{
                                    alignSelf: "center",
                                    aspectRatio: 1,
                                    marginRight: 20,
                                  }}
                                  width={windowWidth * 0.03}
                                  height={windowWidth * 0.03}
                                />
                              ) : (
                                <DropdownLight
                                  style={{
                                    alignSelf: "center",
                                    aspectRatio: 1,
                                    marginRight: 20,
                                  }}
                                  width={windowWidth * 0.03}
                                  height={windowWidth * 0.03}
                                />
                              )}
                            </View>
                          </View>
                        </View>
                        {error && error?.language && (
                          <Text style={style.error_container}>
                            {error.language}
                          </Text>
                        )}
                      </View>

                      <View style={{ marginTop: "5%" }}>
                        <Text style={style.title_text}>Native Location*</Text>
                        <View style={style.box_container}>
                          <View
                            style={{
                              // width: "100%",
                              height: windowHeight * 0.07,
                              justifyContent: "center",
                              flexDirection: "row",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <SelectDropdown
                              data={locations}
                              onSelect={(selectedItem, index) => {
                                console.log(selectedItem, index);
                                setLocation(selectedItem);
                                // setLanguage(selectedItem)
                              }}
                              buttonTextAfterSelection={(
                                selectedItem,
                                index
                              ) => {
                                // text represented after item is selected
                                // if data array is an array of objects then return selectedItem.property to render after item is selected
                                console.log("selectedItem", selectedItem);
                                return selectedItem;
                              }}
                              defaultButtonText={"Select Location"}
                              rowTextForSelection={(item, index) => {
                                // text represented for each item in dropdown
                                // if data array is an array of objects then return item.property to represent item in dropdown
                                return item;
                              }}
                              buttonStyle={style.dropdown1BtnStyle}
                              buttonTextStyle={style.dropdown1BtnTxtStyle}
                              dropdownIconPosition={"right"}
                              dropdownStyle={style.dropdown1DropdownStyle}
                              rowStyle={style.dropdown1RowStyle}
                              rowTextStyle={style.dropdown1RowTxtStyle}
                            />
                            <View
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {theme.theme === "dark" ? (
                                <Dropdown
                                  style={{
                                    alignSelf: "center",
                                    aspectRatio: 1,
                                    marginRight: 20,
                                  }}
                                  width={windowWidth * 0.03}
                                  height={windowWidth * 0.03}
                                />
                              ) : (
                                <DropdownLight
                                  style={{
                                    alignSelf: "center",
                                    aspectRatio: 1,
                                    marginRight: 20,
                                  }}
                                  width={windowWidth * 0.03}
                                  height={windowWidth * 0.03}
                                />
                              )}
                            </View>
                          </View>
                        </View>
                        {error && error?.location && (
                          <Text style={style.error_container}>
                            {error.location}
                          </Text>
                        )}
                      </View>

                      {/* <View style={{ marginTop: "5%" }} >
                  <Text style={style.title_text}>Language*</Text>
                  <View style={style.box_container}>
                    <View style={{ marginLeft: "4%", width: "90%", height: windowHeight * 0.07, justifyContent: "center" }} >
                      <TextInput
                        onChangeText={setLanguage}
                        value={language}
                        selectionColor={"#9370DB"}
                        placeholder="Native language"
                        placeholderTextColor={"grey"}
                        style={style.input_container}
                      />
                    </View>
                  </View>
                  {error && error?.language && <Text style={style.error_container}>{error.language}</Text>}

                </View> */}

                      <View style={{ marginTop: "5%" }}>
                        <Text style={style.title_text}>Phone Number*</Text>
                        {/* <View style={style.box_container}> */}
                        {/* <View style={{ marginLeft: "4%", width: "90%", height: windowHeight * 0.07, justifyContent: "center" }} > */}

                        <PhoneInput
                          defaultCode="US"
                          maxLength="15"
                          layout="first"
                          onChangeCountry={(cn) => {
                            console.log("cncncn", cn);
                            setCountryCode(cn?.callingCode?.pop());
                            setCountry(cn?.cca2);
                          }}
                          onChangeText={(txt) => {
                            setPhoneNumber(txt);
                          }}
                          textContainerStyle={{
                            width: "90%",
                            height: windowHeight * 0.07,
                            justifyContent: "center",
                            backgroundColor: "transparent",
                            
                          }}
                          textInputStyle={{
                            height: windowHeight * 0.07,
                            color: "#A279FA",
                          }}
                          codeTextStyle={{ color: "#A279FA" ,marginLeft: -12, }}
                          flagButtonStyle={{ color: "#A279FA",marginRight: -12, }}
                          disableArrowIcon={true}
                          // value={phoneNumber}
                          withDarkTheme={theme.theme == "light" ? false : true}
                          textInputProps={{
                            color: "#A279FA",
                            placeholderTextColor: "#A279FA",
                            selectionColor: "#A279FA",
                          }}
                          containerStyle={{
                            borderColor: "rgba(162, 121, 250, 0.30)",
                            borderWidth: 1,
                            backgroundColor: "rgba(155, 124, 220, 0.15)",
                            borderRadius: 5,
                            marginTop: "2%",
                            width: "100%",
                          }}
                        />

                        {error && error?.phoneNumberError && (
                          <Text style={style.error_container}>
                            {error.phoneNumberError}
                          </Text>
                        )}
                        {error && error?.phTestErr && (
                          <Text style={style.error_container}>
                            {error.phTestErr}
                          </Text>
                        )}
                      </View>

                      <View style={{ marginTop: "5%" }}>
                        <Text style={style.title_text}>Email Address*</Text>
                        <View style={style.box_container}>
                          <View
                            style={{
                              marginLeft: "4%",
                              width: "90%",
                              height: windowHeight * 0.07,
                              justifyContent: "center",
                            }}
                          >
                            <TextInput
                              onChangeText={setMailAddress}
                              value={mailAddress}
                              selectionColor={"#A279FA"}
                              placeholder="Enter Email Address"
                              placeholderTextColor={"#A279FA"}
                              style={style.input_container}
                            />
                          </View>
                        </View>
                        {error && error?.mailValidateErr && (
                          <Text style={style.error_container}>
                            {error.mailValidateErr}
                          </Text>
                        )}
                        {error && error?.mailAddressError && (
                          <Text style={style.error_container}>
                            {error.mailAddressError}
                          </Text>
                        )}
                        {mailAlready != "" ? (
                          <Text
                            style={{
                              fontFamily: Fonts.Regular,
                              fontSize: 12,
                              color: "red",
                            }}
                          >
                            {mailAlready}
                          </Text>
                        ) : (
                          <></>
                        )}
                      </View>

                      <View style={{ marginTop: "5%" }}>
                        <Text style={style.title_text}>Password*</Text>
                        <View
                          style={{
                            alignItems: "center",
                            borderColor: "rgba(162, 121, 250, 0.30)",
                            borderWidth: 1,
                            backgroundColor: "rgba(155, 124, 220, 0.15)",
                            borderRadius: 5,
                            marginTop: "2.5%",
                          }}
                        >
                          <View
                            style={{
                              marginLeft: "4%",
                              width: "95%",
                              height: windowHeight * 0.07,
                              flexDirection: "row",
                            }}
                          >
                            <View
                              style={{ width: "85%", justifyContent: "center" }}
                            >
                              <TextInput
                                secureTextEntry={show1}
                                onChangeText={setPassword}
                                value={password}
                                selectionColor={"#A279FA"}
                                placeholder="Enter Password"
                                placeholderTextColor={"#A279FA"}
                                style={style.input_container}
                              />
                            </View>
                            <View
                              style={{ width: "15%", justifyContent: "center" }}
                            >
                              <TouchableOpacity
                                onPress={() => setShow1(!show1)}
                              >
                                {!show1 ? (
                                  <Eyeon
                                    style={{
                                      alignSelf: "center",
                                      aspectRatio: 1,
                                    }}
                                    width={windowWidth * 0.05}
                                    height={windowWidth * 0.05}
                                  />
                                ) : (
                                  <Eyeoff
                                    style={{
                                      alignSelf: "center",
                                      aspectRatio: 1,
                                    }}
                                    width={windowWidth * 0.05}
                                    height={windowWidth * 0.05}
                                  />
                                )}
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                        {error && error?.passwordError && (
                          <Text style={style.error_container}>
                            {error.passwordError}
                          </Text>
                        )}
                      </View>

                      {/* <View style={{ marginTop: "5%" }}>
                <Text style={style.title_text}>Password*</Text>

                <View style={{
                  flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                  borderColor: theme.phrase1, borderWidth: 1, paddingHorizontal: "3%", paddingLeft: "0.5%",
                  borderRadius: 5, marginTop: "2%"
                }}>
                  <TextInput
                    secureTextEntry={show1}
                    onChangeText={setPassword}
                    value={password}
                    selectionColor={theme.text}
                    placeholder="Enter Password"
                    placeholderTextColor={"grey"}
                    style={style.input_container}
                  />
                  <TouchableOpacity onPress={() => setShow1(!show1)}>
                    {theme.theme == "light" ?
                      <Eye fill={"#000"} />
                      : <Eye fill={"#fff"} />
                    }
                  </TouchableOpacity>
                </View>
                {error && error?.passwordError && <Text style={style.error_container}>{error.passwordError}</Text>}
              </View> */}

                      <View style={{ marginTop: "5%" }}>
                        <Text style={style.title_text}>Confirm Password*</Text>

                        {/* <View style={{
                  flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                  borderColor: theme.phrase1, borderWidth: 1, paddingHorizontal: "3%", paddingLeft: "0.5%",
                  borderRadius: 5, marginTop: "2%"
                }}>
                  <TextInput

                    secureTextEntry={show2}
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                    selectionColor={theme.text}
                    placeholder="Confirm Password"
                    placeholderTextColor={"grey"}
                    style={style.input_container}
                  />
                  <TouchableOpacity onPress={() => setShow2(!show2)}>
                    {theme.theme == "light" ?
                      <Eye fill={"#000"} />
                      : <Eye fill={"#fff"} />
                    }
                  </TouchableOpacity>
                </View> */}
                        <View
                          style={{
                            alignItems: "center",
                            borderColor: "rgba(162, 121, 250, 0.30)",
                            borderWidth: 1,
                            backgroundColor: "rgba(155, 124, 220, 0.15)",
                            borderRadius: 5,
                            marginTop: "2.5%",
                          }}
                        >
                          <View
                            style={{
                              marginLeft: "4%",
                              width: "95%",
                              height: windowHeight * 0.07,
                              flexDirection: "row",
                            }}
                          >
                            <View
                              style={{ width: "85%", justifyContent: "center" }}
                            >
                              <TextInput
                                secureTextEntry={show2}
                                onChangeText={setConfirmPassword}
                                value={confirmPassword}
                                selectionColor={"#A279FA"}
                                placeholder="Confirm Password"
                                placeholderTextColor={"#A279FA"}
                                style={style.input_container}
                              />
                            </View>
                            <View
                              style={{ width: "15%", justifyContent: "center" }}
                            >
                              <TouchableOpacity
                                onPress={() => setShow2(!show2)}
                              >
                                {!show2 ? (
                                  <Eyeon
                                    style={{
                                      alignSelf: "center",
                                      aspectRatio: 1,
                                    }}
                                    width={windowWidth * 0.05}
                                    height={windowWidth * 0.05}
                                  />
                                ) : (
                                  <Eyeoff
                                    style={{
                                      alignSelf: "center",
                                      aspectRatio: 1,
                                    }}
                                    width={windowWidth * 0.05}
                                    height={windowWidth * 0.05}
                                  />
                                )}
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>

                        {error && error?.confirmPasswordError && (
                          <Text style={style.error_container}>
                            {error.confirmPasswordError}
                          </Text>
                        )}
                        {error && error?.sameError && (
                          <Text style={style.error_container}>
                            {error.sameError}
                          </Text>
                        )}
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "5%",
                        }}
                      >
                        <CheckBox
                          checkedColor={style.checkedColor}
                          uncheckedColor={theme.text}
                          containerStyle={style.checkContainer}
                          textStyle={{
                            fontSize: 14,
                            color: theme.theme === "dark" ? "white" : "black",
                          }}
                          fontFamily="Orbitron-Bold"
                          checked={isSelected1}
                          onPress={() => {
                            setSelection1(!isSelected1);
                          }}
                        />

                        <Text
                          style={{
                            color: theme.theme === "dark" ? "#fff" : "black",
                            fontFamily: Fonts.Regular,
                            fontSize: RFPercentage(1.8),
                            marginLeft: "1%",
                          }}
                        >
                          I accept the Terms of Service
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: 30,
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            borderRightWidth: 1,
                            borderRightColor: "#A279FA",
                            paddingRight: 20,
                            fontFamily: Fonts.Regular,
                          }}
                          onPress={() => {
                            props.navigation.navigate("PrivacyPolicy");
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: Fonts.Regular,
                              color: "#A279FA",
                              fontSize: RFPercentage(2),
                            }}
                          >
                            Privacy Policy
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ paddingLeft: 20 }}
                          onPress={() => {
                            props.navigation.navigate("TermsOfService");
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: Fonts.Regular,
                              color: "#A279FA",
                              fontSize: RFPercentage(2),
                            }}
                          >
                            Terms of Service
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {console.log("isSelected1", isSelected1)}
                        {isSelected1 ? (
                          <>
                            <TouchableOpacity
                              style={{
                                marginTop: "5%",
                                width: "82%",
                                height: 49,
                                backgroundColor:
                                  theme.theme === "dark"
                                    ? "#FFF600"
                                    : "#612CD2",
                                alignContent: "center",
                                alignItems: "center",
                                justifyContent: "center",
                                border: 1,
                                borderRadius: 1.76,
                              }}
                              onPress={() => submitFunction()}
                            >
                              <Text
                                style={{
                                  width: "100%",
                                  textAlign: "center",
                                  fontFamily: Fonts.Regular,
                                  color:
                                    theme.theme === "light"
                                      ? "#ffffff"
                                      : "black",
                                  fontSize: RFPercentage(2),
                                }}
                              >
                                Sign Up
                              </Text>
                            </TouchableOpacity>
                          </>
                        ) : (
                          <>
                            <TouchableOpacity
                              style={{
                                marginTop: "5%",
                                width: "82%",
                                height: 49,
                                backgroundColor:
                                  theme.theme === "black"
                                    ? "#707070"
                                    : "#707070",
                                alignContent: "center",
                                alignItems: "center",
                                justifyContent: "center",
                                border: 1,
                                borderRadius: 1.76,
                              }}
                            >
                              <Text
                                style={{
                                  width: "100%",
                                  textAlign: "center",
                                  fontFamily: Fonts.Regular,
                                  color: "#9e9e9e",
                                  fontSize: RFPercentage(2),
                                }}
                              >
                                Sign Up
                              </Text>
                            </TouchableOpacity>
                          </>
                        )}
                      </View>

                      {/* <View style={{
                marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: "5%"
              }}>
                <Text style={{ fontFamily: Fonts.Regular, color: theme.text, fontSize: RFPercentage(1.9) }}>Have An Account Already? </Text>
                <TouchableOpacity onPress={() => props.navigation.navigate("Signin")}>
                  <Text style={{
                    borderBottomWidth: 1, borderBottomColor: "#000", color: theme.text, width: 100,
                    width: "100%", bottomBorderWidth: 1, borderBottomColor: theme.search, fontSize: RFPercentage(1.9)
                  }}>Sign in
                  </Text>
                </TouchableOpacity>
              </View> */}
                      <View
                        style={{
                          marginTop: "5%",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "5%",
                          width: "90%",
                          alignSelf: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Fonts.Regular,
                            color: theme.theme === "dark" ? "#fff" : "black",
                            fontSize: RFPercentage(1.9),
                          }}
                        >
                          Have An Account Already?{" "}
                        </Text>
                        {/* <TouchableOpacity onPress={() => props.navigation.navigate("Signin")} >
                    <Text textBreakStrategy="simple" style={{ textDecorationLine: "underline", color: theme.text, fontSize: RFPercentage(1.9) }}>Sign in</Text>
                  </TouchableOpacity> */}

                        <Pressable
                          onPress={() => props.navigation.navigate("Signin")}
                        >
                          <View style={{ marginLeft: "1.5%" }}>
                            <Text
                              style={{
                                fontFamily: Fonts.Regular,
                                color: "#A279FA",
                                fontSize: RFPercentage(1.9),
                                fontWeight:"bold"
                              }}
                            >
                              Sign in
                            </Text>
                            <View
                              style={{
                                width: "100%",
                                height: 1,
                                // backgroundColor: theme.text,
                              }}
                            />
                          </View>
                        </Pressable>
                      </View>
                    </ScrollView>
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
    title_text: {
      fontFamily: Fonts.Medium,
      fontSize: RFPercentage(1.9),
      color: theme.theme === "dark" ? "#fff" : "black",
      marginLeft: "5%",
    },
    box_container: {
      borderColor: "rgba(162, 121, 250, 0.30)",
      borderWidth: 1,
      backgroundColor: "rgba(155, 124, 220, 0.15)",
      borderRadius: 5,
      marginTop: "2%",
    },
    input_container: {
      fontFamily: Fonts.Regular,
      color: "#A279FA",
      fontSize: RFPercentage(1.9),
    },
    error_container: {
      fontFamily: Fonts.Regular,
      fontSize: RFPercentage(1.6),
      color: "red",
      marginTop: "1%",
    },

    dropdown1BtnStyle: {
      backgroundColor: "transparent",
      // backgroundColor:"red",
      // flex: 1,
      // height: 50,
      // width: "100%",
      // backgroundColor: 'transparent',
      // borderRadius: 8,
      // borderWidth: 1,
      // borderColor: '#444',
      width: "100%",
    },
    dropdown1BtnTxtStyle: {
      fontFamily: Fonts.Regular,
      color: "#A279FA",
      paddingLeft: 20,
      fontSize: RFPercentage(1.9),
      // backgroundColor:"red",
      textAlign: "left",
      left: 14,
    },
    dropdown1DropdownStyle: {
      borderColor: "rgba(162, 121, 250, 0.30)",
      borderWidth: 1,
      backgroundColor: "rgb(155, 124, 220)",
      // borderBottomLeftRadius:10,
      // borderBottomRightRadius:10
      borderRadius: 10,

      // backgroundColor:"green",
      // width:"80%"
    },
    dropdown1RowStyle: {
      display: "flex",
      width: "100%",
      borderColor: "rgba(162, 121, 250, 0.30)",
      borderWidth: 1,
      backgroundColor: "rgba(155, 124, 220, 0.15)",
    },
    dropdown1RowTxtStyle: {
      color: "#fff",
      textAlign: "left",
      fontSize: RFPercentage(1.9),
    },
    divider: { width: 12 },
    checkedColor: theme.theme === "dark" ? "#FFF600" : "#612CD2",
    checkContainer: {
      borderColor: "transparent",
      backgroundColor: "transparent",
      margin: "0%",
      padding: "0%",
    },
  });
