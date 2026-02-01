
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, StatusBar, Dimensions, TouchableOpacity, Linking, Alert } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Modal from "react-native-modal";
import { Fonts } from "../../utils/Fonts";
import { Icon as Icn, Button } from "react-native-elements";

const MessageModal = (props) => {



  return (

    <View style={[styles.centeredView]}>
      <View style={[styles.modalView]}>
        <Text style={{
          fontSize: 16, fontFamily: Fonts.Medium, color: "#000", textAlign: "center",
          width: "100%"
        }}>{props && props?.title}</Text>
        <View style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.4", borderRadius: 50, padding: 10, marginTop: 20 }}>
          <Text style={styles.modalText}>{props && props?.dappUrl}</Text>
        </View>
        <Text style={styles.modalDescription}>
          {props && props?.message}
        </Text>
        <View style={{
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          borderWidth: 1, borderColor: "rgba(0,0,0,0.5)", width: "100%", padding: 10, borderRadius: 20
        }}>
          <View>
            {/* <Text>Amrith Web</Text> */}
            <Text style={{color:"grey"}} >{props && props?.address}</Text>
            {/* <TouchableOpacity>
                  <Text>Imported</Text>
                </TouchableOpacity> */}
          </View>
          {/* <View>
                   <Icn name="angle-down" type="fontisto" size={13}/>
                </View> */}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <TouchableOpacity style={styles.buttonStyleGreen} onPress={() => { props && props?.confirmPress() }}>
            <Text style={styles.buttontextGreen}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyleGreen} onPress={() => { props && props?.cancelPress() }}>
            <Text style={styles.buttontextGreen}>Cancel</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}



export default MessageModal;




const styles = StyleSheet.create({


  modalText:{
    color:"grey"
  },



  welcomeSubText: {
    fontSize: RFValue(25),
    color: "#05afbb",
    textTransform: "uppercase",
    letterSpacing: 0,
    fontFamily: 'Roboto-Bold',
    marginTop: 0,
    textAlign: "center",
    // textShadowColor: 'rgba(55, 55, 55, 0.5)',
    // textShadowOffset: {width: -1, height: 2},
    // textShadowRadius: 10
  },

  buttonStyleGreen: {
    marginTop: 30,
    height: 45,
    display: "flex",
    width: 100,
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    borderRadius: 10,
    borderColor: '#fff',
    elevation: 5,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    backgroundColor: "#572970",
  },
  buttontext: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Roboto-Bold',
    fontStyle: 'italic',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  flexDivIcon: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: Dimensions.get('window').width,
    justifyContent: "space-between"
  },
  rightLinkDiv: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: (Dimensions.get('window').width) - 150,

  },
  // leftImgParent:{
  //   borderRightColor:"#000",
  //   borderRightWidth:1
  // },
  leftImgDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    marginLeft: 15,
    marginRight: 15,

  },
  leftImage: {
    width: 60,
    height: 60,
    resizeMode: "contain"
  },
  imageSplashDiv: {
    resizeMode: "contain",
    width: Dimensions.get('window').width,
    // height:Dimensions.get('window').height*0.62,
    height: (Dimensions.get('window').height * 0.65),

    //   position:"absolute",
    // bottom:0,
    // left:0,
    // right:0
  },
  linkImgDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },

  linearGradient: {
    padding: 5
  },
  modal: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    margin: 0
  },
  modalLogo:
  {
    width: 116,
    height: 121
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    width: "83%",
    marginLeft: "8.5%",
    marginRight: "8.5%",
    borderRadius: 20,
    borderColor: "#000",
    borderTopWidth: 1,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalDescription: {
    fontSize: RFValue(12),
    color: "#1d1f21",
    fontFamily: Fonts.Medium,
    marginBottom: 20,
    marginTop: 20
    // display:"inline-flex"
  },
  buttontextGreen: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Roboto-Bold',
    fontWeight: '700',
  },
  // iconSocial:{
  //   width:30,
  //   height:30
  // }

});