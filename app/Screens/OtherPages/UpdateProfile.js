import React, { useCallback, useEffect, useState } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    TouchableWithoutFeedback,
    ScrollView,
    Image,
    TouchableOpacity,
    TextInput, Linking,
    Dimensions,
    ToastAndroid,
    ImageBackground,
    StatusBar
} from "react-native";
import { Images } from "../../utils/Images";
import themeContext from "../../utils/themeContext";
import { Fonts } from "../../utils/Fonts";
import Header from "../../Components/Header";
import Pencil from "../../assets/img/pencil";
import { formValidation, updateProfileFunction, removeProfilefunc } from './common/Update_Profile';
import isEmpty from "../../utils/isEmpty";
import { launchImageLibrary } from 'react-native-image-picker'
import { borderRadius } from "../../utils/Dimensions";
import { RFPercentage } from "react-native-responsive-fontsize";
import PhoneInput from 'react-native-phone-number-input'
import { ApiConstants } from "../../api/ApiConstants";
import ProfileLight from '../../assets/icons/lighttheme/Edit Profile Black.svg'
import ProfileDark from '../../assets/icons/darktheme/Edit Profile White.svg'
import SelectDropdown from 'react-native-select-dropdown'
import MonthPicker from 'react-native-month-year-picker';
import { languages } from "../../utils/language";
import DatePicker from "react-native-date-picker";
import { locations } from "../../utils/locations";

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
        12: "December"
    };
    return months[monthNumber] || "Invalid month number";
}


//   import PasswordInputText from 'react-native-hide-show-password-input';
export default function UpdateProfile(props) {
    const [userDetails, setUserDetails] = useState("");
    const [error, setError] = useState({})
    const [filePath, setFilePath] = useState('')
    const [imageFile, setImageFile] = useState({})
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [countrycode, setCountryCode] = useState("")
    const theme = React.useContext(themeContext);
    const style = styles(theme);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [category, setCategory] = useState(["Male", "Female"])
    const [defaultGender, setdefaultGender] = useState("")
    const [gender, setGender] = useState("")
    const [location, setLocation] = useState("")
    const [language, setLanguage] = useState("")
    useEffect(() => {
        setError({})
    }, [userDetails])

    useEffect(() => {
        if (props?.route?.params?.userDetails) {
            let UserDetails = props?.route?.params?.userDetails
            setUserDetails(UserDetails)
            setDate(new Date(UserDetails?.DOB))
            setLanguage(UserDetails.language)
            setdefaultGender(UserDetails.gender)
            setLocation(UserDetails.location)
        }

    }, [props?.route?.params?.userDetails])

    console.log("userDetails", userDetails, userDetails?.DOB);

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const showPicker = useCallback((value) => setShow(value), []);

    const onValueChange = useCallback(
        (event, newDate) => {
            const selectedDate = newDate || date;

            showPicker(false);
            setDate(selectedDate);
            setUserDetails({ ...userDetails, ...{ DOB: selectedDate } })
        },
        [date, showPicker],
    );
    console.log("date", date);


    const submitFun = async () => {

        userDetails.DOB = date
        userDetails.language = language
        userDetails.location = location

        var validate = await formValidation(userDetails)
        console.log("validaatat", validate,userDetails);
        if (!isEmpty(validate)) { return setError(validate) }
        else {
            // userDetails.phoneNumber = countrycode + phoneNumber
            console.log("userDetailsuserDetails", userDetails);
            var res = await updateProfileFunction(userDetails, imageFile)
            if (res) {
                if (res.data.success) {
                    // ToastAndroid.showWithGravityAndOffset(
                    //     res.data.msg,
                    //     ToastAndroid.LONG,
                    //     ToastAndroid.BOTTOM,
                    //     25,
                    //     50
                    // );
                    props.navigation.goBack();
                } else {
                    ToastAndroid.showWithGravityAndOffset(
                        res.data.msg,
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                }
            }

        }
    }
    console.log("userDetails?.phoneNumber", userDetails?.phoneNumber);
    const chooseFile = async (type) => {
        console.log("tttyy", type);
        try {
            let options = {
                mediaType: type,
                maxWidth: 300,
                maxHeight: 550,
                quality: 1,
            };
            await launchImageLibrary(options, (response) => {
                console.log('Response = ', response);

                if (response.didCancel) {
                    // alert('User cancelled camera picker');
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    alert('Camera not available on this device');
                    return;
                } else if (response.errorCode == 'permission') {
                    alert('Permission not granted');
                    return;
                } else if (response.errorCode == 'others') {
                    alert(response.errorMessage);
                    return;
                }
                setFilePath(response.assets[0].uri);
                setImageFile(response.assets[0])
            });
        } catch (error) {
            console.log("errrror", error);
        }

    };

    const onclickRemove = async () => {
        console.log("heheheheheh");
        var params = {
            mailAddress: userDetails?.mailAddress,
            from: "RemoveProfile"
        }
        var respp = await removeProfilefunc(params)
        console.log("respp", respp);
        if (respp.data.success) {
            props.navigation.goBack();
        } else {
            return ToastAndroid.showWithGravityAndOffset(
                respp.data.msg,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        }
    }

    return (
        <>
            <SafeAreaView style={style.container}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <View style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <View style={{ windowHeight, justifyContent: 'flex-start' }}>
                            <ImageBackground source={theme.theme==="dark"? Images.background:Images.backgroundWhite} style={{ width: windowWidth, height: windowHeight, paddingTop: StatusBar.windowHeight, }} resizeMode="cover">
                               

                                {/* <View style={{ marginHorizontal: 20 }}>
                <Header name={"Edit Profile"} leftImage={"back"} />
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "center", position: "relative",
                        width: 100
                    }}>
                        {isEmpty(filePath) ?
                            (<>
                                {!isEmpty(userDetails.profilePic)
                                    ?
                                    (<Image source={{
                                        uri: "http://192.53.121.26:8096/images/" + userDetails.profilePic,
                                    }} style={{ width: 120, height: 120, borderRadius: 400 / 2 }} />)
                                    : <Image source={require("../../assets/img/profile.png")} />}
                            </>)
                            : (<>
                                <Image source={{ uri: filePath }} style={{ width: 120, height: 120, borderRadius: 400 / 2 }} />
                            </>)}

                        <TouchableOpacity onPress={() => { chooseFile("photo") }} >
                            <Pencil width={40} height={40} style={{ position: "absolute", bottom: -50, right: -10 }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={{ height: windowHeight - 300, marginHorizontal: 25 }} >
                    <View style={{ marginBottom: 30, marginTop: 30 }}>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.theme == "light"?"#000":"#fff", marginBottom: 15 }}>First Name*</Text>
                        <View style={{
                            borderColor: theme.phrase1, borderWidth: 1, paddingHorizontal: 10, paddingLeft: 10,
                            borderRadius: 5
                        }}>
                            <TextInput
                                onChangeText={(e) => { setUserDetails({ ...userDetails, ...{ firstName: e } }) }}
                                value={userDetails.firstName}
                                selectionColor={theme.text}
                                placeholder="Enter First name"
                                placeholderTextColor={theme.theme == "light"?"#000":"#fff"}
                                style={{ fontFamily: Fonts.Regular, color: theme.theme == "light"?"#000":"#fff"}}
                                maxLength={35}
                            />
                        </View>
                        {error && error?.firstNameError && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red" }}>{error.firstNameError}</Text>}
                    </View>
                    <View style={{ marginBottom: 30 }}>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.theme == "light"?"#000":"#fff", marginBottom: 15 }}>Middle Name*</Text>
                        <View style={{
                            borderColor: theme.phrase1, borderWidth: 1, paddingHorizontal: 10, paddingLeft: 10,
                            borderRadius: 5
                        }}>
                            <TextInput
                                onChangeText={(e) => { setUserDetails({ ...userDetails, ...{ middleName: e } }) }}
                                value={userDetails.middleName}
                                selectionColor={theme.text}
                                placeholder="Enter Middle name"
                                placeholderTextColor={theme.theme == "light"?"#000":"#fff"}
                                style={{ fontFamily: Fonts.Regular, color: theme.theme == "light"?"#000":"#fff" }}
                                maxLength={35}
                            />
                        </View>
                        {error && error?.middleNameError && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red" }}>{error.middleNameError}</Text>}
                    </View>
                    <View style={{ marginBottom: 30 }}>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.theme == "light"?"#000":"#fff", marginBottom: 15 }}>Last Name*</Text>
                        <View style={{
                            borderColor: theme.phrase1, borderWidth: 1, paddingHorizontal: 10, paddingLeft: 10,
                            borderRadius: 5
                        }}>
                            <TextInput
                                onChangeText={(e) => { setUserDetails({ ...userDetails, ...{ lastName: e } }) }}
                                value={userDetails.lastName}
                                selectionColor={theme.text}
                                placeholder="Enter Last name"
                                placeholderTextColor={theme.theme == "light"?"#000":"#fff"}
                                maxLength={35}
                                style={{ fontFamily: Fonts.Regular, color: theme.theme == "light"?"#000":"#fff" }}
                            />
                        </View>
                        {error && error?.lastNameError && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red" }}>{error.lastNameError}</Text>}
                    </View>
                    <View style={{ marginBottom: 30 }}>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.theme == "light"?"#000":"#fff", marginBottom: 15 }}>Phone number*</Text>
                        <View style={{
                            borderColor: theme.phrase1, borderWidth: 1, paddingHorizontal: 10, paddingLeft: 10,
                            borderRadius: 5
                        }}>
                            <TextInput
                                onChangeText={(e) => { setUserDetails({ ...userDetails, ...{ phoneNumber: e } }) }}
                                value={userDetails.phoneNumber}
                                selectionColor={theme.text}
                                placeholder="Enter Phone number"
                                placeholderTextColor={theme.theme == "light"?"#000":"#fff"}
                                style={{ fontFamily: Fonts.Regular, color: theme.theme == "light"?"#000":"#fff" }}
                            />
                        </View>
                        {error && error?.phoneNumberError && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red" }}>{error.phoneNumberError}</Text>}
                        {error && error?.phTestErr && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red" }}>{error.phTestErr}</Text>}
                    </View>
                    <View style={{ marginBottom: 30 }}>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 15, color: theme.theme == "light"?"#000":"#fff", marginBottom: 15 }}>Email Address*</Text>
                        <Text style={{ fontFamily: Fonts.Regular, fontSize: 17, color: theme.theme == "light"?"#000":"#fff" }}>{userDetails.mailAddress}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <TouchableOpacity style={{
                            backgroundColor: "transparent", borderColor: theme.texttheme, borderWidth: 1,
                            borderRadius: 30, paddingVertical: 15, width: 200, marginTop: 30
                        }} onPress={() => { submitFun() }}>
                            <Text style={{
                                fontFamily: Fonts.Regular, fontSize: 14, textAlign: "center",
                                width: "100%", color: theme.texttheme
                            }}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View> */}

                <View style={{ width: "100%", height: "100%" }} >
                    <View style={{ width: "94%", height: "15%", alignSelf: "center", justifyContent: "space-around" }} >
                        <Header name={"Edit Profile"} leftImage={"back"} />
                    </View>

                    <View style={{ width: windowWidth * 0.275, height: windowWidth * 0.275, alignSelf: "center", borderRadius: borderRadius * 3, marginTop: "2%", backgroundColor: theme.theme == "dark" ? "#737475" : "#C4C4C4", justifyContent: "center" }} >
                        {isEmpty(filePath) ?
                            (<>
                                {!isEmpty(userDetails.profilePic)
                                    ?
                                    (<Image source={{
                                        uri: `${ApiConstants.URL}images/` + userDetails.profilePic,
                                    }} style={{ width: "100%", height: "100%", aspectRatio: 1, borderRadius: borderRadius * 3 }} />)
                                    :
                                    // <Image source={require("../../assets/img/profile.png")} style={{ width: "100%", height: "100%", aspectRatio: 1, borderRadius: borderRadius * 3 }} />

                                    theme.theme == 'light' ?
                                        (<Image
                                            style={{
                                              width: "100%",
                                              height: "100%",
                                              aspectRatio: 1,
                                              borderRadius: borderRadius * 3,
                                            }}
                                            source={require("../../assets/img/profile.png")}
                                            resizeMode="contain"
                                          />)
                                        :
                                        (<Image
                                            style={{
                                              width: "100%",
                                              height: "100%",
                                              aspectRatio: 1,
                                              borderRadius: borderRadius * 3,
                                            }}
                                            source={require("../../assets/img/profile.png")}
                                            resizeMode="contain"
                                          />)

                                }
                            </>)
                            : (<>
                                <Image source={{ uri: filePath }} style={{ width: "100%", height: "100%", aspectRatio: 1, borderRadius: borderRadius * 3, }} />
                            </>)}
                        <TouchableOpacity onPress={() => { chooseFile("photo") }} style={{ width: windowWidth * 0.075, height: windowWidth * 0.075, position: "absolute", bottom: "5%", right: 0, borderRadius: borderRadius * 1, }} >
                            <Pencil style={{ resizeMode: "contain", aspectRatio: 1, }} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity disabled={isEmpty(userDetails.profilePic)} onPress={() => onclickRemove()}>
                        <View style={{ marginTop: 5, padding: 5 }}  >
                            <Text style={{ color: theme.theme==="dark"? "#fff":"#000000", fontFamily: Fonts.Medium, fontSize: RFPercentage(2), textAlign: "center" }}>Update photo</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ height: "50%", justifyContent: "space-around", width: "85%", alignSelf: "center", marginTop: "5%" }} >
                        <ScrollView showsVerticalScrollIndicator={false} >
                            <View style={{ marginTop: "5%" }}>
                                <Text style={style.title_text}>First Name*</Text>
                                <View style={style.box_container}>
                                    <View style={{ marginLeft: "4%", width: "90%", height: windowHeight * 0.07, justifyContent: "center" }} >
                                        <TextInput
                                            selectionColor={"#A279FA"}
                                            onChangeText={(e) => { setUserDetails({ ...userDetails, ...{ firstName: e } }) }}
                                            value={userDetails.firstName}
                                            placeholder="Enter First name"
                                            placeholderTextColor={"#A279FA"}
                                            style={style.input_container}
                                            maxLength={35}
                                        />
                                    </View>
                                </View>
                                {error && error?.firstNameError && <Text style={style.error_container}>{error.firstNameError}</Text>}
                            </View>

                            <View style={{ marginTop: "5%" }}>
                                <Text style={style.title_text}>Middle Name</Text>
                                <View style={style.box_container}>
                                    <View style={{ marginLeft: "4%", width: "90%", height: windowHeight * 0.07, justifyContent: "center" }} >
                                        <TextInput
                                            onChangeText={(e) => { setUserDetails({ ...userDetails, ...{ middleName: e } }) }}
                                            value={userDetails.middleName}
                                            selectionColor={"#A279FA"}
                                            placeholder="Enter Middle name"
                                            placeholderTextColor={"#A279FA"}
                                            style={style.input_container}
                                            maxLength={35}
                                        />
                                    </View>
                                </View>
                                {error && error?.middleNameError && <Text style={style.error_container}>{error.middleNameError}</Text>}
                            </View>

                            <View style={{ marginTop: "5%" }}>
                                <Text style={style.title_text}>Last Name*</Text>
                                <View style={style.box_container}>
                                    <View style={{ marginLeft: "4%", width: "90%", height: windowHeight * 0.07, justifyContent: "center" }} >
                                        <TextInput
                                            onChangeText={(e) => { setUserDetails({ ...userDetails, ...{ lastName: e } }) }}
                                            value={userDetails.lastName}
                                            selectionColor={"#A279FA"}
                                            placeholder="Enter Last name"
                                            placeholderTextColor={"#A279FA"}
                                            style={style.input_container}
                                            maxLength={35}
                                        />
                                    </View>
                                </View>
                                {error && error?.lastNameError && <Text style={{ fontFamily: Fonts.Regular, fontSize: 12, color: "red" }}>{error.lastNameError}</Text>}
                            </View>
                            

                            <View style={{ marginTop: "5%" }} >
                                <Text style={style.title_text}>Date Of Birth*</Text>
                                <View style={style.box_container}>
                                    <TouchableOpacity onPress={() => { showPicker(true) }} >
                                        <View style={{ marginLeft: "4%", width: "90%", height: windowHeight * 0.07, justifyContent: "space-evenly", flexDirection: "row", alignItems: "center" }} >

                                            <Text style={{ color: "#A279FA" }}>{getMonthName(new Date(date).getMonth() + 1)}</Text>
                                            <View style={{ flex: 0.005, flexDirection: 'column' }}>
                                                <View style={{ height: "100%", backgroundColor: theme.phrase1 }} />
                                            </View>
                                            <Text style={{ color: "#A279FA"}}>{new Date(date).getDate()}</Text>
                                            <View style={{ flex: 0.005, flexDirection: 'column' }}>
                                                <View style={{ height: "100%", backgroundColor: theme.phrase1 }} />
                                            </View>
                                            <Text style={{ color:"#A279FA" }}>{new Date(date).getFullYear()}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {error && error?.DOB && <Text style={style.error_container}>{error.DOB}</Text>}
                            </View>
                            {/* {show && (
                                <MonthPicker
                                    onChange={onValueChange}
                                    value={date}
                                    autoTheme={true}
                                    // minimumDate={new Date()}
                                    maximumDate={new Date()}
                              
                                />
                            )} */}
                            {show && (
                                <DatePicker
                                    modal
                                    mode="date"
                                    open={show}
                                    date={date}
                                    maximumDate={new Date()}
                                    onConfirm={(date) => {
                                        setShow(false)
                                        setDate(date)
                                        // console.log("For praveen",date);
                                    }}
                                    onCancel={() => {
                                        setShow(false)
                                    }}
                                />
                            )}
                            <View style={{ marginTop: "5%" }} >
                                <Text style={style.title_text}>Gender*</Text>
                                <View style={style.box_container}>
                                    <View style={{
                                        // width: "100%", 
                                        height: windowHeight * 0.07, justifyContent: "center"
                                    }} >
                                        <SelectDropdown
                                            data={category}
                                            onSelect={(selectedItem, index) => {
                                                console.log(selectedItem, index)
                                                // setGender(selectedItem)
                                                setUserDetails({ ...userDetails, ...{ gender: selectedItem } })
                                            }}
                                            buttonTextAfterSelection={(selectedItem, index) => {
                                                // text represented after item is selected
                                                // if data array is an array of objects then return selectedItem.property to render after item is selected
                                                console.log("selectedItem", selectedItem);
                                                return selectedItem
                                            }}
                                            defaultButtonText={'Select Gender'}
                                            rowTextForSelection={(item, index) => {
                                                // text represented for each item in dropdown
                                                // if data array is an array of objects then return item.property to represent item in dropdown
                                                return item
                                            }}
                                            defaultValue={defaultGender}
                                            buttonStyle={style.dropdown1BtnStyle}
                                            buttonTextStyle={style.dropdown1BtnTxtStyle}
                                            dropdownIconPosition={'right'}
                                            dropdownStyle={style.dropdown1DropdownStyle}
                                            rowStyle={style.dropdown1RowStyle}
                                            rowTextStyle={style.dropdown1RowTxtStyle}
                                        />
                                    </View>
                                </View>
                                {error && error?.gender && <Text style={style.error_container}>{error.gender}</Text>}


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

                            {/* <View style={{ marginTop: "5%" }} >
                                <Text style={style.title_text}>Language*</Text>
                                <View style={style.box_container}>
                                    <View style={{ marginLeft: "4%", width: "90%", height: windowHeight * 0.07, justifyContent: "center" }} >
                                        <TextInput
                                            onChangeText={(txt) => { setUserDetails({ ...userDetails, ...{ language: txt } }) }}
                                            value={userDetails?.language}
                                            selectionColor={"#9370DB"}
                                            placeholder="Native language"
                                            placeholderTextColor={"grey"}
                                            style={style.input_container}
                                        />
                                    </View>
                                </View>
                                {error && error?.language && <Text style={style.error_container}>{error.language}</Text>}

                            </View> */}

                            <View style={{ marginTop: "5%" }} >
                                <Text style={style.title_text}>Language*</Text>
                                <View style={style.box_container}>
                                    <View style={{
                                        // width: "100%", 
                                        height: windowHeight * 0.07, justifyContent: "center"
                                    }} >
                                        <SelectDropdown
                                            data={languages}
                                            onSelect={(selectedItem, index) => {
                                                console.log(selectedItem, index)
                                                setLanguage(selectedItem)
                                            }}
                                            buttonTextAfterSelection={(selectedItem, index) => {
                                                // text represented after item is selected
                                                // if data array is an array of objects then return selectedItem.property to render after item is selected
                                                console.log("selectedItem", selectedItem);
                                                return selectedItem
                                            }}
                                            defaultButtonText={'Select Language'}
                                            rowTextForSelection={(item, index) => {
                                                // text represented for each item in dropdown
                                                // if data array is an array of objects then return item.property to represent item in dropdown
                                                return item
                                            }}
                                            defaultValue={language}
                                            buttonStyle={style.dropdown1BtnStyle}
                                            buttonTextStyle={style.dropdown1BtnTxtStyle}
                                            dropdownIconPosition={'right'}
                                            dropdownStyle={style.dropdown1DropdownStyle}
                                            rowStyle={style.dropdown1RowStyle}
                                            rowTextStyle={style.dropdown1RowTxtStyle}
                                        />
                                    </View>
                                </View>
                                {error && error?.gender && <Text style={style.error_container}>{error.gender}</Text>}


                            </View>


                            <View style={{ marginTop: "5%" }} >
                                <Text style={style.title_text}>Native Location*</Text>
                                <View style={style.box_container}>
                                    <View style={{
                                        // width: "100%", 
                                        height: windowHeight * 0.07, justifyContent: "center"
                                    }} >
                                        <SelectDropdown
                                            data={locations}
                                            onSelect={(selectedItem, index) => {
                                                console.log(selectedItem, index)
                                                setLocation(selectedItem)
                                                // setLanguage(selectedItem)
                                            }}
                                            buttonTextAfterSelection={(selectedItem, index) => {
                                                // text represented after item is selected
                                                // if data array is an array of objects then return selectedItem.property to render after item is selected
                                                console.log("selectedItem", selectedItem);
                                                return selectedItem
                                            }}
                                            defaultButtonText={'Select Location'}
                                            rowTextForSelection={(item, index) => {
                                                // text represented for each item in dropdown
                                                // if data array is an array of objects then return item.property to represent item in dropdown
                                                return item
                                            }}
                                            defaultValue={location}
                                            buttonStyle={style.dropdown1BtnStyle}
                                            buttonTextStyle={style.dropdown1BtnTxtStyle}
                                            dropdownIconPosition={'right'}
                                            dropdownStyle={style.dropdown1DropdownStyle}
                                            rowStyle={style.dropdown1RowStyle}
                                            rowTextStyle={style.dropdown1RowTxtStyle}
                                        />
                                    </View>
                                </View>
                                {error && error?.gender && <Text style={style.error_container}>{error.gender}</Text>}


                            </View>

                            {(userDetails?.phoneNumber || userDetails?.phoneNumber == "") && <View style={{ marginTop: "5%" }}>
                                <Text style={style.title_text}>Phone number*</Text>
                                {/* <View style={style.box_container}> */}
                                {/* <View style={{ marginLeft: "4%", width: "90%", height: windowHeight * 0.07, justifyContent: "center" }} > */}
                                <PhoneInput
                                    defaultCode={userDetails?.country ? userDetails?.country : "AM"}
                                    maxLength="15"
                                    layout="first"
                                    value={userDetails?.phoneNumber}
                                    onChangeCountry={(cn) => { console.log("jufhusefh", cn); setUserDetails({ ...userDetails, ...{ countryCode: cn?.callingCode?.pop(), country: cn?.cca2 } }) }}
                                    onChangeText={(txt) => { setUserDetails({ ...userDetails, ...{ phoneNumber: txt } }) }}
                                    textContainerStyle={{ width: "90%", height: windowHeight * 0.07, justifyContent: "center", backgroundColor: "transparent", }}
                                    textInputStyle={{ height: windowHeight * 0.07, color: theme.theme == "light" ? "#000" : "#fff" }}
                                    textInputProps={{
                                        selectionColor:"#A279FA",
                                        placeholderTextColor: "#A279FA",

                                    }}
                                    codeTextStyle={{ color: theme.theme == "light" ? "#000" : "#fff" }}
                                    withDarkTheme={theme.theme == "light" ? false : true}
                                    containerStyle={{
                                        borderColor: theme.phrase1, borderWidth: 1,
                                        borderRadius: 5, marginTop: "2%", width: "100%", backgroundColor: "transparent"
                                    }}
                                />

                                {/* </View> */}
                                {/* </View> */}
                                {error && error?.phoneNumberError && <Text style={style.error_container}>{error.phoneNumberError}</Text>}
                                {error && error?.phTestErr && <Text style={style.error_container}>{error.phTestErr}</Text>}
                            </View>}
                            <View style={{ marginTop: "5%", marginBottom: "5%" }}>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: RFPercentage(2), color: theme.theme == "light" ? "#000" : "#fff", }}>Email Address*</Text>
                                <Text style={{ fontFamily: Fonts.Regular, fontSize: RFPercentage(2.2), color: theme.theme == "light" ? "#000" : "#fff", marginTop: "2.5%", }}>{userDetails.mailAddress}</Text>
                            </View>
                            


                        </ScrollView>

                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: "5%" }}>
                        <TouchableOpacity style={{ width: "85%", height: 49, backgroundColor:theme.theme==="dark"? 'yellow':"#612CD2", alignContent: 'center', alignItems: 'center', justifyContent: 'center', border: 1, borderRadius: 2
                  }} onPress={() => { submitFun() }}>
                            <Text style={{
                                fontFamily: Fonts.Bold, fontSize: RFPercentage(2), textAlign: "center",
                                width: "100%", color: theme.theme == "dark" ? "#000" : "#fff", fontWeight:'400'
                            }}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                            </ImageBackground>
                        </View>
                    </View>

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
        title_text: {
            fontFamily: Fonts.Medium,
            fontSize: RFPercentage(1.9),
            color: theme.theme==="dark"? "#fff":"#000000",
            marginLeft: "5%"
        },
        box_container: {
            borderColor: 'rgba(162, 121, 250, 0.30)', borderWidth: 1,
            backgroundColor: 'rgba(155, 124, 220, 0.15)',
            borderRadius: 5, marginTop: "2.5%"
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
            marginTop: "1%"
        },
        dropdown1BtnStyle: {
            backgroundColor: '',
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
            left: 14
        },
        dropdown1DropdownStyle: {
            borderWidth: 1,
            borderColor: 'rgba(162, 121, 250, 0.30)',
            // marginTop:2,
            backgroundColor: 'rgba(155, 124, 220, 0.15)',
            // borderBottomLeftRadius:10,
            // borderBottomRightRadius:10
            borderRadius: 10

            // backgroundColor:"green",
            // width:"80%"
        },
        dropdown1RowStyle: {
            display: "flex",
            width: "100%",
            backgroundColor: '#A279FA',
            // backgroundColor:"red",
            borderBottomColor: '#fff'
        },
        dropdown1RowTxtStyle: { color:"#fff", textAlign: 'left', fontSize: RFPercentage(1.9), },
        divider: { width: 12, },

    });