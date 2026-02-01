import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';

const MultitabsFooter = ({ borderColor, textColor, backgroundColor, tabLength }) => {
    const navigation = useNavigation();
  const width = Dimensions.get('window').width;
  const handlePress = () => {
    navigation.navigate('Dapplatest', { isEnabled: false, params: "DappBottomTab" });
  };
  return (
    // <TouchableOpacity onPress={handlePress} disabled={tabLength === 0}
    <TouchableOpacity disabled={tabLength === 0}
      style={{
        borderWidth: 2,
        borderColor: borderColor,
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.06,
        height: width * 0.06,
        borderRadius: 5,
        backgroundColor: backgroundColor,
      }}
    >
      <Text
        style={{
          color: textColor,
          fontSize: RFValue(10),
        }}
      >
        {Number(tabLength) >= 100 ? 'D' : tabLength}
      </Text>
    </TouchableOpacity>
  );
};

export default MultitabsFooter;
