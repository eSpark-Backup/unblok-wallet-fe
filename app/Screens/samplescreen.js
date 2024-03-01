// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, Animated, ScrollView, StyleSheet, TouchableOpacity, Dimensions, PanResponder } from 'react-native';
// import WebView from 'react-native-webview';

// const HEADER_HEIGHT = 60;
// const CONTAINER_HEIGHT = 50;

// const { height } = Dimensions.get('window');
// const REFRESH_HEIGHT = height * 0.2;

// const CollapsibleHeaderWithWebView = ({ navigation }) => {
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const offsetAnim = useRef(new Animated.Value(0)).current;
//   const [focused, setFocused] = useState('home');
//   const clampedScroll = Animated.diffClamp(
//     Animated.add(
//       scrollY.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, 1],
//         extrapolateLeft: 'clamp',
//       }),
//       offsetAnim,
//     ),
//     0,
//     CONTAINER_HEIGHT
//   )
//   var _clampedScrollValue = 0;
//   var _offsetValue = 0;
//   var _scrollValue = 0;
//   useEffect(() => {
//     scrollY.addListener(({ value }) => {
//       const diff = value - _scrollValue;
//       _scrollValue = value;
//       _clampedScrollValue = Math.min(
//         Math.max(_clampedScrollValue + diff, 0),
//         CONTAINER_HEIGHT,
//       )
//     });
//     offsetAnim.addListener(({ value }) => {
//       _offsetValue = value;
//     })
//   }, []);

//   var scrollEndTimer = null;
//   const onMomentumScrollBegin = () => {

//     clearTimeout(scrollEndTimer)
//   }
//   const onMomentumScrollEnd = () => {

//     const toValue = _scrollValue > CONTAINER_HEIGHT &&
//       _clampedScrollValue > (CONTAINER_HEIGHT) / 2
//       ? _offsetValue + CONTAINER_HEIGHT : _offsetValue - CONTAINER_HEIGHT;

//     Animated.timing(offsetAnim, {
//       toValue,
//       duration: 500,
//       useNativeDriver: true,
//     }).start();
//   }
//   const onScrollEndDrag = () => {
//     scrollEndTimer = setTimeout(onMomentumScrollEnd, 250);
//   }

//   const headerTranslate = clampedScroll.interpolate({
//     inputRange: [0, CONTAINER_HEIGHT],
//     outputRange: [0, -CONTAINER_HEIGHT],
//     extrapolate: 'clamp',
//   })
//   const opacity = clampedScroll.interpolate({
//     inputRange: [0, CONTAINER_HEIGHT - 20, CONTAINER_HEIGHT],
//     outputRange: [1, 0.05, 0],
//     extrapolate: 'clamp',
//   })
//   const bottomTabTranslate = clampedScroll.interpolate({
//     inputRange: [0, CONTAINER_HEIGHT],
//     outputRange: [0, CONTAINER_HEIGHT * 2],
//     extrapolate: 'clamp',
//   })

//   const handleScroll = (event) => {
//     Animated.event(
//       [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//       { useNativeDriver: false }
//     )(event);
//   };
//   const [active, setActive] = useState(true)
//   useEffect(() => {
//     setTimeout(() => {
//       setActive(false)
//     }, 1000)
//   }, [])


//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const translateY = useRef(new Animated.Value(0)).current;
//   const webviewRef = useRef(null);

//   const onPanResponderGrant = () => {
//     if (!isRefreshing) {
//       translateY.setValue(0);
//     }
//   };

//   const onPanResponderMove = (_, gestureState) => {
//     if (!isRefreshing) {
//       const { moveY } = gestureState;

//       if (moveY > 0 && moveY <= REFRESH_HEIGHT) {
//         translateY.setValue(moveY);
//       }
//     }
//   };

//   const onPanResponderRelease = (_, gestureState) => {
//     if (!isRefreshing && gestureState.moveY >= REFRESH_HEIGHT) {
//       setIsRefreshing(true);
//       translateY.setValue(REFRESH_HEIGHT);

//       // Simulate fetching data (replace this with your data fetching logic)
//       setTimeout(() => {
//         setIsRefreshing(false);
//         translateY.setValue(0);
//         webviewRef.current.reload(); // Refresh the WebView content
//       }, 2000); // Simulate a delay for data fetching
//     }
//   };

//   const panResponder = PanResponder.create({
//     onMoveShouldSetPanResponder: (_, gestureState) => {
//       return (
//         gestureState.dy > 0 && !isRefreshing && translateY._value < REFRESH_HEIGHT
//       );
//     },
//     onPanResponderGrant: onPanResponderGrant,
//     onPanResponderMove: onPanResponderMove,
//     onPanResponderRelease: onPanResponderRelease,
//   });
//   return (
//     <View style={styles.container}>
//       <Animated.View style={{ height: "94%", marginTop: "10%" }} >
//         <WebView
//           ref={webviewRef}
//           useWebKit
//           javaScriptEnabled
//           {...(isRefreshing ? {} : { panResponder: panResponder.panHandlers })}
//           contentContainerStyle={styles.contentContainerStyle}
//           onScroll={handleScroll}
//           source={{ uri: 'https://www.google.com/' }}
//           onMomentumScrollBegin={onMomentumScrollBegin}
//           onMomentumScrollEnd={onMomentumScrollEnd}
//           onScrollEndDrag={onScrollEndDrag}
//           scrollEventThrottle={1}
//           renderLoading={() => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>Loading...</View>}
//         />
//       </Animated.View>


//       <Animated.View style={[styles.view, { top: 0, transform: [{ translateY: headerTranslate }] }]}>
//         <TouchableOpacity style={{ backgroundColor: "red", height: 50, justifyContent: "center" }} onPress={() => navigation.goBack()} >
//           <Text style={{ color: "#000", textAlign: "center" }} >Back</Text>
//         </TouchableOpacity>
//       </Animated.View>
//       {/* {!active &&
//       <WebView
//         source={{ uri:'https://reactnative.dev/' }}
//         style={{ flex: 1 }} />} */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   view: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     height: CONTAINER_HEIGHT,
//     backgroundColor: "red"
//   },
//   header: {
//     borderBottomRightRadius: 16,
//     borderBottomLeftRadius: 16,
//     marginHorizontal: 4,
//   },
//   bottomBar: {
//     borderTopRightRadius: 16,
//     borderTopLeftRadius: 16,
//     marginHorizontal: 4,
//   },
//   contentContainerStyle: {
//     paddingTop: CONTAINER_HEIGHT,
//     marginTop: 8,
//   },
//   rowContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-around',
//   },
//   item: {
//     marginHorizontal: 10,
//     marginBottom: 12,
//     elevation: 6,
//     borderRadius: 16,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '700',
//   },

//   image: {
//     height: 300,
//     width: null,
//     marginBottom: 1,
//     marginHorizontal: 16,
//     borderRadius: 16,
//   },
//   bottomView: {
//     alignItems: 'center',
//     flexDirection: 'row',
//     padding: 16
//   },
//   content: {
//     alignItems: 'center',
//     flexDirection: 'row',
//     marginHorizontal: 16,
//     paddingVertical: 8,
//   },
//   textContainer: {
//     marginHorizontal: 16,
//   },
//   avatar: {
//     height: 35,
//     width: 35,
//     borderRadius: 20,

//   },
//   rowView: {
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   icon: {
//     marginHorizontal: 10,
//   },
// });

// export default CollapsibleHeaderWithWebView;


import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const BinanceAPIExample = () => {
  const [percentageChange, setPercentageChange] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const symbol = 'BNBUSDT';
        const interval = '1h';
        const limit = 24; // Number of hourly candlesticks for the last 24 hours

        // Make the API request to Binance
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
        );

        const candlestickData = await response.json();

        // Calculate percentage change
        const firstCandlestick = candlestickData[0];
        const lastCandlestick = candlestickData[candlestickData.length - 1];
        const openingPrice = parseFloat(firstCandlestick[1]);
        const closingPrice = parseFloat(lastCandlestick[4]);

        const change = ((closingPrice - openingPrice) / openingPrice) * 100;
        setPercentageChange(change.toFixed(2));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    fetchData();
    // Update every 5 minutes (adjust as needed)
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={{backgroundColor:"yellow"}} >
      {percentageChange !== null ? (
        <Text style={{color:"#000"}} >{`Percentage Change in the last hour: ${percentageChange}%`}</Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default BinanceAPIExample;
