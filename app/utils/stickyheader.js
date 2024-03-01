import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Collapsible from 'react-native-collapsible';

const StickyHeader = ({ children, isCollapsed }) => {
    const height=Dimensions.get("window").height
  return (
    <Collapsible collapsed={isCollapsed}>
      <View style={{ height:height*0.065, backgroundColor: 'red',}}>
        {/* Your header content */}
        <Text>Header Content</Text>
      </View>
    </Collapsible>
  );
};

export default StickyHeader;
