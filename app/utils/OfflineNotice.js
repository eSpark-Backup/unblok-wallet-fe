import React, {useEffect, useContext} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {Fonts} from './Fonts';
import themeContext from './themeContext';
import {Colors} from './Colors';

const {width} = Dimensions.get('window');

const OfflineNotice = () => {
  //theme config
  const theme = useContext(themeContext);
  //
  const netInfo = useNetInfo();

  useEffect(() => {
    //console.log("net info changed, new state: ", netInfo);
  }, [netInfo]);

  return (
    <>
      {netInfo.isConnected == false && (
        <View
          style={{
            flex: 1,
            backgroundColor:
              theme.background == '#ffffff' ? Colors.WHITE : Colors.BLACK,
            height: 25,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            width,
            position: 'absolute',
          }}>
          <Text
            style={{
              color:
                theme.background == '#ffffff' ? Colors.BLACK : Colors.WHITE,
              fontFamily: Fonts.PoppinsRegular,
              fontSize: 12,
            }}>
            No Internet Connection
          </Text>
        </View>
      )}
    </>
  );
};
export default OfflineNotice;
