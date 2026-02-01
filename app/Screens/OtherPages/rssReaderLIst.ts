import React, { useEffect, useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { parse } from 'react-native-rss-parser';
import themeContext from '../../utils/themeContext';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../../utils/Fonts';
import { customShare, parseHtmlString } from '../../utils/common';
import ShareBlack from '../../assets/icons/lighttheme/Share Black.svg'
import ShareWhite from '../../assets/icons/darktheme/Share White.svg'
import BoomMarkBlack from '../../assets/icons/lighttheme/inactive_star_light.svg'
import BoomMarkWhite from '../../assets/icons/darktheme/inactive_star_dark.svg'

import ActiveBookMarkBlack from '../../assets/icons/lighttheme/active_star_light.svg'
import ActiveBookMarkWhite from '../../assets/icons/darktheme/active_star_dark.svg'

export default function RssReaderList({ ImageUrl, RssTitle, parsedDescription, domainName, publishedAt, RssUrl, redirecttoBrowser, AddReadLater, readLater, deleteReadLater }) {

    const theme = React.useContext(themeContext);
    const style = styles(theme);
    const [tabIndex, setTabIndex] = useState("ReadLater");
    // console.log("RssUrl", RssUrl);

    const createReadLater = async () => {
        try {
            const Item = {
                ImageUrl,
                RssTitle,
                parsedDescription,
                domainName,
                publishedAt,
                RssUrl
            }
            const setItem = await AddReadLater(Item)

        } catch (error) {
            console.log("error o ", error);
        }
    }

    return (
        <>
            <Pressable style={{ backgroundColor:theme.theme==="dark" ?"rgba(48, 31, 83, 0.40)":"rgba(255, 255, 255, 0.30)", marginTop: "2%", width: "95%", alignSelf: "center", borderRadius: 5, borderColor:theme.theme==="dark"? "rgba(162, 121, 250, 0.30)":"rgba(162, 121, 250, 0.30)", borderWidth: 2 }} onPress={() => redirecttoBrowser(RssUrl)} >
                
                <View style={{ width: "97%", alignSelf: "center", marginTop: "1.5%", alignItems: "center", paddingVertical: "0.2%" }} >
                    <View style={{ width: "100%" }} >
                        <Image source={ImageUrl ? { uri: ImageUrl } : require("../../assets/img/no-image_lm.png")} style={{ width: "100%", height: 220, borderRadius: 5, resizeMode: "cover" }} />
                    </View>
                    <View style={{ width: "100%", marginTop: "1%" ,padding:10}} >
                        <Text style={{ color:theme.theme==="dark"? "#fff":"black",fontFamily:Fonts.Bold, fontSize: RFValue(13), fontWeight:"bold" }} numberOfLines={3} >{RssTitle.trim()}</Text>

                    </View>
                </View>
                <View style={{padding:10}}>
                <View style={{ width: "95%", alignSelf: "center", flexDirection: "row" }}>
                    <View style={{ width: "100%" }} >
                        <Text style={{ color:theme.theme==="dark"? "#fff":"black",fontFamily:Fonts.Medium, fontSize: RFValue(11) }} numberOfLines={3} >{parsedDescription}</Text>
                    </View>


                </View>
                <Image
              style={{
                width: "100%",
                marginBottom: 10,
                marginTop: 10,
                alignSelf: "center",
              }}
              source={require("../../assets/img/deviderPNG.png")}
              resizeMode="cover"
            />
                <View style={{ width: "100%", alignSelf: "center", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <View style={{ flexDirection: 'column', width: "100%" }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%", padding: 10, }} >
                            <View style={{width:"50%",}}>
                                <Text style={{ color:theme.theme==="dark"? "#A279FA":"#612CD2", fontSize: RFValue(12) }} >{domainName}</Text>
                            </View>
                            <View style={{width:"50%",alignItems:"flex-end"}}>
                                <Text style={{ color:theme.theme==="dark"? "#A279FA":"#612CD2", fontSize: RFValue(12) }}>{new Date(publishedAt).toLocaleDateString()} {new Date(publishedAt).toLocaleTimeString()}</Text>
                            </View>
                        </View>
                        
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >

                            {!readLater
                            ?
                            <Pressable onPress={() => {
                                setTabIndex("ReadLater");
                                createReadLater()
                            }}
                                key={Math.random()}
                                style={({ pressed }) => ({
                                    width: "48%",
                                    paddingVertical: "2.5%",
                                    justifyContent: "center",
                                    borderRadius: 5,
                                    borderColor:  readLater ? theme.theme==="dark"? '#A279FA':"#612CD2" : theme.theme==="dark"? '#fff':"#000",
                                    borderWidth: 2,
                                    margin: 5
                                })}>
                                <Text style={{
                                    color: readLater ? theme.theme==="dark"? '#A279FA':"#612CD2" : theme.theme==="dark"? '#fff':"#000",
                                    textAlign: "center",
                                    fontFamily: Fonts.Regular,
                                    fontSize: RFValue(12)
                                }}>Read Later</Text>
                            </Pressable>
                            :
                            
                            <Pressable onPress={() => deleteReadLater(RssUrl)}
                                key={Math.random()}
                                style={({ pressed }) => ({
                                    width: "48%",
                                    paddingVertical: "2.5%",
                                    justifyContent: "center",
                                    borderRadius: 5,
                                    borderColor:  tabIndex == "ReadLater" ? theme.theme==="dark"? '#A279FA':"#612CD2" : theme.theme==="dark"? '#fff':"#000",
                                    borderWidth: 2,
                                    margin: 5
                                })}>
                                <Text style={{
                                    color: tabIndex == "ReadLater" ? theme.theme==="dark"? '#A279FA':"#612CD2" : theme.theme==="dark"? '#fff':"#000",
                                    textAlign: "center",
                                    fontFamily: Fonts.Regular,
                                    fontSize: RFValue(12)
                                }}>Delete
                                </Text>
                            </Pressable>
                        }

                           
                            <Pressable onPress={() => customShare(RssUrl)}
                                key={Math.random()}
                                style={({ pressed }) => ({
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: "48%",
                                    paddingVertical: "2.5%",
                                    borderRadius: 5,
                                    borderColor: tabIndex == "Share" ? theme.theme==="dark"? '#A279FA':"#612CD2" : theme.theme==="dark"? '#fff':"#000",
                                    borderWidth: 2,
                                    margin: 5
                                })}>
                                <Image source={require("../../assets/img/share.png")} style={{ width: 16, height: 16, resizeMode: "contain", marginRight: 5, tintColor: tabIndex == "Share" ? theme.theme==="dark"? '#A279FA':"#612CD2" : theme.theme==="dark"? '#fff':"#000", }} />
                                <Text style={{
                                    color: tabIndex == "Share" ? theme.theme==="dark"? '#A279FA':"#612CD2" : theme.theme==="dark"? '#fff':"#000",
                                    textAlign: "center",
                                    fontFamily: Fonts.Regular,
                                    fontSize: RFValue(12)
                                }}>Share</Text>
                            </Pressable>

                            {/* <Pressable style={{ width: "50%", height: 30, borderRadius: 2, marginHorizontal: "2%" }} onPress={() => customShare(RssUrl)} >
                            {theme.theme == "light" ?
                                <ShareBlack width={25} height={25} style={{ resizeMode: "contain", alignSelf: "center" }} />

                                :
                                <ShareWhite width={25} height={25} style={{ resizeMode: "contain", alignSelf: "center" }} />
                            }
                        </Pressable> */}
                        </View>
                    </View>

                </View>
                </View>

            </Pressable>
        </>
    )

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
            fontSize: RFPercentage(2)
        },
    });