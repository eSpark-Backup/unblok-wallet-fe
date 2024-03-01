import React, { useEffect, useRef, useState } from 'react';
// import * as React from 'react'
import {
    PanResponder,
    Dimensions,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { LineChart, XAxis, YAxis } from 'react-native-svg-charts';
import {
    Circle,
    Defs,
    G,
    Line,
    LinearGradient,
    Path,
    Rect,
    Stop,
    Text as SvgText,
} from 'react-native-svg';
import * as shape from 'd3-shape';
import axios from 'axios';

export default TestChartdata;

function TestChartdata() {

    useEffect(() => {
        // getdata()
    }, [])

    const getdata = async () => {
        const apiUrl = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart';

        const today = new Date();
        const endDate = today.toISOString().split('T')[0]; // Current date in ISO format (YYYY-MM-DD)
        today.setDate(today.getDate() - 1); // Subtract one day for the start date
        const startDate = today.toISOString().split('T')[0]; // One day ago in ISO format (YYYY-MM-DD)

        // Define the parameters for the API request
        const params = {
            vs_currency: 'usd', // Specify the currency (USD)
            from: startDate, // Start date (one day ago)
            to: endDate, // End date (today)
        };

        // Make the API request to fetch the data
        axios
            .get(apiUrl, { params })
            .then((response) => {
                // Extract the relevant data from the API response
                const data = response.data.prices; // Price data for BTC
                const volumeData = response.data.total_volumes; // Trading volume data for BTC

                // Print the data for today (you can process it as needed)
                console.log(`BTC price data for today: ${JSON.stringify(data)}`);
                console.log(`BTC trading volume data for today: ${JSON.stringify(volumeData)}`);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }
    const apx = (size = 0) => {
        let width = Dimensions.get('window').width;
        return (width / 750) * size;
    };

    const [dateList, setDateList] = useState([
        '08-31 15:09',
        '08-31 15:10',
        '08-31 15:11',
        '08-31 15:12',
        '08-31 15:13',
        '08-31 15:14',
        '08-31 15:15',
        '08-31 15:16',
        '08-31 15:17',
        '08-31 15:18',
        '08-31 15:19',
    ]);
    const [priceList, setPriceList] = useState([
        47022.9649875,
        47097.6349875,
        47132.3149875,
        47137.6449875,
        47164.9949875,
        47175.9949875,
        47180.9949875,
        47190.9949875,
        47200.9949875,
        47210.9949875,
        47225.9949875,
    ]);
    const size = useRef(dateList.length);

    const [positionX, setPositionX] = useState(-1);// The currently selected X coordinate position

    const panResponder = useRef(
        PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                updatePosition(evt.nativeEvent.locationX);
                return true;
            },
            onPanResponderMove: (evt, gestureState) => {
                updatePosition(evt.nativeEvent.locationX);
                return true;
            },
            onPanResponderRelease: () => {
                setPositionX(-1);
            },
        })
    );

    const updatePosition = (x) => {
        const YAxisWidth = apx(130);
        const x0 = apx(0);// x0 position
        const chartWidth = apx(750) - YAxisWidth - x0;
        const xN = x0 + chartWidth;//xN position
        const xDistance = chartWidth / size.current;// The width of each coordinate point
        if (x <= x0) {
            x = x0;
        }
        if (x >= xN) {
            x = xN;
        }

        // console.log((x - x0) )

        // The selected coordinate x :
        // (x - x0)/ xDistance = value
        let value = ((x - x0) / xDistance).toFixed(0);
        if (value >= size.current - 1) {
            value = size.current - 1; // Out of chart range, automatic correction
        }

        setPositionX(Number(value));
    };

    const CustomGrid = ({ x, y, ticks }) => (
        <G>
            {
                // Horizontal grid
                ticks.map((tick) => (
                    <Line
                        key={tick}
                        x1="0%"
                        x2="100%"
                        y1={y(tick)}
                        y2={y(tick)}
                        stroke="#EEF3F6"
                    />
                ))
            }
            {
                // Vertical grid
                priceList.map((_, index) => (
                    <Line
                        key={index.toString()}
                        y1="0%"
                        y2="100%"
                        x1={x(index)}
                        x2={x(index)}
                        stroke="#EEF3F6"
                    />
                ))
            }
        </G>
    );

    const CustomLine = ({ line }) => (
        <Path
            key="line"
            d={line}
            stroke="#FEBE18"
            strokeWidth={apx(6)}
            fill="none"
        />
    );

    const CustomGradient = () => (
        <Defs key="gradient">
            <LinearGradient id="gradient" x1="0" y="0%" x2="0%" y2="100%">

                <Stop offset="0%" stopColor="#FEBE18" stopOpacity={0.25} />
                <Stop offset="100%" stopColor="#FEBE18" stopOpacity={0} />
            </LinearGradient>
        </Defs>
    );

    const Tooltip = ({ x, y, ticks }) => {
        if (positionX < 0) {
            return null;
        }

        const date = dateList[positionX];

        return (
            <G x={x(positionX)} key="tooltip">
                <G
                    x={positionX > size.current / 2 ? -apx(300 + 10) : apx(10)}
                    y={y(priceList[positionX]) - apx(10)}>
                    <Rect
                        y={-apx(24 + 24 + 20) / 2}
                        rx={apx(12)} // borderRadius
                        ry={apx(12)} // borderRadius
                        width={apx(300)}
                        height={apx(96)}
                        stroke="rgba(254, 190, 24, 0.27)"
                        fill="rgba(255, 255, 255, 0.8)"
                    />

                    <SvgText x={apx(20)} fill="#617485" opacity={0.65} fontSize={apx(24)}>
                        {date}
                    </SvgText>
                    <SvgText
                        x={apx(20)}
                        y={apx(24 + 20)}
                        fontSize={apx(24)}
                        fontWeight="bold"
                        fill="rgba(224, 188, 136, 1)">
                        ${priceList[positionX]}
                    </SvgText>
                </G>

                <G x={x}>
                    <Line
                        y1={ticks[0]}
                        y2={ticks[Number(ticks.length)]}
                        stroke="#FEBE18"
                        strokeWidth={apx(4)}
                        strokeDasharray={[6, 3]}
                    />

                    <Circle
                        cy={y(priceList[positionX])}
                        r={apx(20 / 2)}
                        stroke="#fff"
                        strokeWidth={apx(2)}
                        fill="#FEBE18"
                    />
                </G>
            </G>
        );
    };

    const verticalContentInset = { top: apx(40), bottom: apx(40) };

    const xValue = [1,2,3,4,5,6,7,8,9,0]

    const yValue = [1,2,3,4,5,6,7,8,9,0]
    return (
        <View
            style={{
                backgroundColor: '#000',
                alignItems: 'stretch',
                height:"50%"
            }}>
            <View
                style={{
                    flexDirection: 'row',
                    width:"90%",
                    height: "100%",
                    alignSelf: 'center',
                }}>
                   <YAxis
                    style={{ width: apx(130) }}
                    data={yValue}
                    contentInset={verticalContentInset}
                    svg={{ fontSize: apx(20), fill: '#617485' }}
                />
                <View style={{ flex: 1 }} {...panResponder.current.panHandlers}>
                    <LineChart
                        style={{ flex: 1 }}
                        data={yValue}
                        // curve={shape.curveNatural}
                        curve={shape.curveMonotoneX}
                        contentInset={{ ...verticalContentInset }}

                    // svg={{ fill: 'url(#gradient)' }}
                    >

                        <CustomLine />
                        <Tooltip />
                    </LineChart>
                </View>

               
            </View>
            <XAxis
                style={{
                    alignSelf: 'stretch',
                    width: apx(800),
                    height: apx(60),
                }}
                numberOfTicks={7}
                data={xValue}
                // formatLabel={(value, index) => dateList[value]}
                contentInset={{
                    left: apx(36),
                    right: apx(130),
                }}
                svg={{
                    fontSize: apx(20),
                    fill: '#617485',
                    y: apx(20),
                    // originY: 30,
                }}
            />
        </View>
    );
}