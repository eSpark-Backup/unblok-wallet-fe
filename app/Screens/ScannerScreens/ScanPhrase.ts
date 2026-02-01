import React, {useEffect, useContext, useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import themeContext from '../../utils/themeContext';
import {Button} from 'react-native-elements';
import Header from '../../Components/Header';
import {Fonts} from '../../utils/Fonts';
import {Images} from '../../utils/Images';
import ApiClient from '../../api/ApiClient';
import {ApiConstants} from '../../api/ApiConstants';
import Clipboard from '@react-native-community/clipboard';
import {Colors} from '../../utils/Colors';
import {TextInput} from 'react-native-paper';
import LinearGradient from "react-native-linear-gradient";
const ScanPhrase = props => {
  //theme config
  const theme = useContext(themeContext);
  const style = styles(theme);

  return (
    <SafeAreaView style={style.container}>
      <LinearGradient colors={theme.theme == 'light' ? ['#fff','#fff']: ['#151918','#171515']}
          useAngle={true}
          angle={170}
          style={{width:"100%",height:"100%"}}
        >
      <Header name={'Scan'} leftImage={'back'} />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ScanPhrase;

const styles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
  });
