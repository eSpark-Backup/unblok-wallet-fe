import axios from "axios";

import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  TouchableOpacity,
  Keyboard,
  TextInput, Linking, Dimensions, FlatList, BackHandler, NativeModules, ToastAndroid, KeyboardAvoidingView, Platform
} from "react-native";

import getRealm from "../../../localDb/RealmConfig";
import themeContext from "../../../utils/themeContext";
import { Fonts } from "../../../utils/Fonts";
// import Arrow from "../../../assets/img/keyboard/arrow.svg";
// import ArrowRight from "../../../assets/img/arrow_right.svg";
// import Voice from '@react-native-community/voice';
// import Compass from "../../../assets/img/keyboard/COMPASS.svg";
// import Translate from "../../../assets/img/keyboard/translate.svg";
// import Wallet from "../../../assets/img/keyboard/wallet.svg";
// import Ojtranslate from "../../../assets/img/keyboard/ojtranslate.svg";
// import ColorTheme from "../../../assets/img/keyboard/color-theme.svg";
// import AA from "../../../assets/img/keyboard/aA.svg";
// import Alphabets from "../../../assets/img/keyboard/Alphabets.svg";
// import SpecialCharacters from "../../../assets/img/keyboard/SpecialCharacters.svg"
// import Microphone from "../../../assets/img/keyboard/microphone.svg";
// import KeyboardArrow from "../../../assets/img/keyboard/keyboard-arrow.svg";
// import Backspace from "../../../assets/img/keyboard/backspace.svg";
// import One from "../../../assets/img/keyboard/123.svg";
// import Slash from "../../../assets/img/keyboard/slash.svg";
// import Simle from "../../../assets/img/keyboard/Simle.svg";

// import SpaceBar from "../../../assets/img/spaceNew2.svg";
// import ArrowTwo from "../../../assets/img/keyboard/arrow-2.svg";
// import Search from "../../../assets/img/keyboard/search.svg";
// import Bulb from "../../../assets/img/keyboard/bulb.svg";
// import City from "../../../assets/img/keyboard/city.svg";
// import Coffee from "../../../assets/img/keyboard/coffee.svg";
// import Flag from "../../../assets/img/keyboard/flag.svg";
// import Symbols from "../../../assets/img/keyboard/symbols.svg";
// import Hello from "../../../assets/img/keyboard/hello.svg";
// import ABC from "../../../assets/img/keyboard/ABC.svg";
// import Gif from "../../../assets/img/keyboard/GIF.svg";
// import Back from "../../../assets/img/keyboard/back.svg";
// import Heart from "../../../assets/img/keyboard/heart.svg";
import emojisByCategory from "../../../data/emojis.json";
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import isEmpty from "../../../utils/isEmpty";
const { KeyboardModule } = NativeModules;
export default function keyboard({ onKeyPress }) {

  const [number, onChangeNumber] = React.useState('');
  const [number1, onChangeNumber1] = React.useState(''); 399
  const [isSelected, setSelection] = useState(false);
  const [mailAddress, setMailaddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = useState({})
  const [rememberMe, setRememberMe] = useState(false);
  const [isSelected1, setSelection1] = useState(false);
  const [show, setShow] = useState(true);

  const [keyValues, setKeyValues] = useState(JSON.parse(global.keyboardSettings));
  const [visible, setVisible] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [Emoji, setEmoji] = useState(false);
  const [sticker, setSticker] = useState(false);
  const [gif, setGif] = useState(true);
  const [bg, setBg] = useState("");
  const [displayText, setDisplayText] = useState('');
  const [showButtons, setShowButtons] = useState(true);
  const [showTextViews, setShowTextViews] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [viewToShow, setViewToShow] = useState('ABC');
  const [textToShow, setTextToShow] = useState("qwertyuiopasdfghjklzxcvbnm");
  const [isUppercase, setIsUppercase] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [data, setData] = useState(null);
  const tabnavigatorRender = [];
  const API_KEY = 'f3b8PiHqEC58PxYkUN0KluDjNK6pTufN';
  const BASE_URL = 'https://api.giphy.com/v1/gifs/search';
  const STICKER_URL = "https://api.giphy.com/v1/stickers/search"
  const [searchText, setSearchText] = useState('');
  const [gifs, setGifs] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [recentEmoji, setrecentEmoji] = useState([]);
  const [suggestion, setSuggestion] = useState([])
  const [searchSticker, setSearchSticker] = useState("")
  const [recentGif, setRecentGif] = useState([])
  const [recentSticker, setRecentSticker] = useState([])
  const [showRecentGif, setShowRecentGif] = useState(true)
  const [showRecentSticker, setShowRecentSticker] = useState(true)
  const theme = React.useContext(themeContext);
  const [recognizedText, setRecognizedText] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  console.log("displayText", displayText);
  console.log("searchSticker", JSON.stringify(searchSticker, null, 2));
  state = {
    query: '',
    data: []
  }
  useFocusEffect(
    React.useCallback(() => {
      if (!isEmpty(displayText)) getSuggetions()
    }, [displayText])
  )

  useFocusEffect(
    React.useCallback(() => {
      getRecentEmoji()
      handleListPress("clock")
    }, [])
  )
  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (e) => {
    setRecognizedText(e.value[0]);
    setIsRecognizing(false);
  };

  const onSpeechError = (e) => {
    console.log(e);
    setIsRecognizing(false);
  };

  const startSpeechToText = async () => {
    setIsRecognizing(true);
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.log(error);
      setIsRecognizing(false);
    }
  };

  const getRecentEmoji = () => {
    getRealm()
      .then((realm) => {
        var keyboardObj = realm.objects("keyboardRetrieval")
        console.log("emojis", JSON.stringify(keyboardObj, null, 2));
        if (keyboardObj.length != 0) {

          if (keyboardObj[0].emojiArr.length != 0) setrecentEmoji(keyboardObj[0].emojiArr)
          if (keyboardObj[0].gifArr.length != 0) setRecentGif(keyboardObj[0].gifArr)
          if (keyboardObj[0].stickerArr.length != 0) setRecentSticker(keyboardObj[0].stickerArr)
        }
      })
      .catch((err) => {
        console.log("errro on getrecent emoji", err);
      })
  }

  const getSuggetions = async () => {
    try {
      const resp = await axios.get(`https://api.datamuse.com/words?sp=${displayText}*&max=3`)
      console.log("resppp", resp.data);
      setSuggestion(resp.data)
    } catch (error) {
      console.log("errro on getsug", error);
    }
  }

  console.log(isEmojiOpen);
  const handleSearch = async (data, type) => {
    setShowRecentGif(false)
    setShowRecentSticker(false)
    try {
      const response = await axios.get(type == "gif" ? BASE_URL : STICKER_URL, {
        params: {
          api_key: API_KEY,
          q: data ? data : type == "gif" ? searchText : searchSticker,
          limit: 25,
          offset: 0,
          rating: 'g',
          lang: 'en',
        },
      });
      console.log("response", JSON.stringify(response.data.data, null, 2));
      type == "gif" ? setGifs(response.data.data) : setStickers(response.data.data)
    } catch (error) {
      console.log("errro on gif", error);
    }
  };

  const handleGifSelect = (gif) => {
    console.log("Ish", JSON.stringify(gif, null, 2))
  };

  const renderGifs = (type) => {
    var arr = type == "gifs" ? gifs : stickers
    return arr.map((gif) => (
      <View style={{ margin: 10 }}>
        <TouchableOpacity key={Math.random()} onPress={() => handleSmilePress(type, gif.images.fixed_width.url)}>
          {console.log("goioieieieee", gif.images.fixed_width.url)}
          <Image source={{ uri: gif.images.fixed_width.url }} style={{ height: 80, width: 80 }} />
        </TouchableOpacity>
      </View>

    ));
  };

  const emoji = () => {
    setIsModalOpen(false);
    setIsEmojiOpen(true);
    setBg("emoji")
  }

  useEffect(() => {
    fetch(emojisByCategory)
      .then(response => { console.log("resposops", response); response.json() })
      .then(jsonData => setData(jsonData))
      .catch(error => console.error("errro on emoji", error));
  }, []);

  const handleListPress = (key, index) => {
    key == "clock" ? setSelectedList(recentEmoji) : setSelectedList(emojisByCategory[key])
  };

  const handleSmilePress = (from, content) => {
    console.log("content", content);
    onKeyPress(content);
    emojiRetrieval(from, content);
  };

  const emojiRetrieval = async (from, content) => {
    getRealm().then((realm) => {
      var keyboardRetrieval = realm.objects("keyboardRetrieval")
      console.log("emojisefrefr", JSON.stringify(keyboardRetrieval, null, 2));
      var Param = { [from]: content }

      if (keyboardRetrieval.length == 0) {
        realm.write(() => {
          realm.create("keyboardRetrieval", from == "char" ? { emojiArr: [Param] } : from == "gifs" ? { gifArr: [Param] } : { stickerArr: [Param] });
        });
      } else {
        realm.write(() => {
          from == "char" ? keyboardRetrieval[0].emojiArr.push(Param) : from == "gifs" ? keyboardRetrieval[0].gifArr.push(Param) : keyboardRetrieval[0].stickerArr.push(Param)
        })
      }
    }).catch((err) => {
      console.log(err, "error on emojiretrival")
    })
  }
  const handleViewChange = (viewNumber) => {
    setViewToShow(viewNumber);
  };

  const onMainTextInputFocus = () => {
    setBg("abc");
  }

  useFocusEffect(
    React.useCallback(() => {
      setSelection1(false)
      setBg("abc");
    }, [])
  )

  useEffect(() => {
    setError({})
  }, [mailAddress, password])
  const handlePress = (str) => {
    console.log("strrrrr", str);
    if (str === ' ') {
      // add a space character to the string when space button is clicked
      setDisplayText(`${displayText} `);
    } else if (str === 'Backspace') {
      console.log("Backspace", str);
      // remove the last character from the string
      setDisplayText(displayText.slice(0, displayText.length - 1));
    } else {
      console.log("sefrsefefe", displayText);
      // add the clicked character to the string
      setDisplayText(`${displayText}${str}`);
    }

    onKeyPress(str);
  };
  const handleABCPress = () => {
    setIsUppercase(!isUppercase);
    setTextToShow(isUppercase ? textToShow.toLowerCase() : textToShow.toUpperCase());
  };

  const handleSendString = () => {
    sendString(displayText);


  }
  const sendString = (sent) => {
    console.log(`Sending string:${sent}`);
    if (sent.trim().length === 0) {

    }
    else {
      KeyboardModule.createFun(sent);
    }
  }

  const handleButtonPress = (buttonNumber) => {
    setShowButtons(!showButtons);
    setShowTextViews(!showTextViews);
    setShowArrow(!showArrow);

  };
  onSearch = (text) => {
    const newData = this.props.data.filter(item => {
      const itemData = item.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      query: text,
      data: newData
    });
  }
  return (
    <>
      <SafeAreaView>
        {/* {(bg == "abc") ?
          <View style={{
            height: 280, backgroundColor: theme.keyboard, width: "100%", position: "absolute",
            bottom: -100,
            paddingVertical: 10, paddingHorizontal: 15
          }}>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <TouchableOpacity onPress={() => handleButtonPress(1)}>
                {showArrow ? (
                  <>
                    {theme.theme == "light" ?
                      <ArrowRight fill={"#000"} /> :
                      <ArrowRight fill={"#fff"} />
                    }
                  </>
                )
                  :
                  theme.theme == "light" ?
                    <Arrow fill={"#000"} /> :
                    <Arrow fill={"#fff"} />
                }
              </TouchableOpacity>
              {showButtons && (
                <>
                  {keyValues.Dapp == "true" ? <TouchableOpacity onPress={() => handleButtonPress(2)}>
                    {theme.theme == "light" ?
                      <Compass fill={"#000"} />
                      :
                      <Compass fill={"#fff"} />
                    }
                  </TouchableOpacity> : <></>}
                  {keyValues.translate == "true" ? <TouchableOpacity onPress={() => handleButtonPress(3)}>
                    {theme.theme == "light" ?
                      <Translate fill={"#000"} />
                      :
                      <Translate fill={"#fff"} />
                    }
                  </TouchableOpacity> : <></>}
                  {keyValues.wallet == "true" ? <TouchableOpacity onPress={() => handleButtonPress(4)}>
                    {theme.theme == "light" ?
                      <Wallet fill={"#000"} />
                      : <Wallet fill={"#fff"} />
                    }
                  </TouchableOpacity> : <></>}
                  {keyValues.wordPrediction == "true" ? <TouchableOpacity onPress={() => handleButtonPress(5)}>
                    {theme.theme == "light" ?
                      <Ojtranslate fill={"#000"} />
                      :
                      <Ojtranslate fill={"#fff"} />
                    }
                  </TouchableOpacity> : <></>}
                  <TouchableOpacity onPress={() => handleButtonPress(6)}>
                    {theme.theme == "light" ?
                      <ColorTheme fill={"#000"} />
                      :
                      <ColorTheme fill={"#fff"} />
                    }
                  </TouchableOpacity>
                  {keyValues.capsLetter == "true" ? <TouchableOpacity onPress={() => handleButtonPress(7)}>
                    {theme.theme == "light" ?
                      <AA fill={"#000"} />
                      :
                      <AA fill={"#fff"} />
                    }
                  </TouchableOpacity> : <></>}
                  {keyValues.voice == "true" ? <TouchableOpacity onPress={startSpeechToText}>
                    {theme.theme == "light" ?
                      <Microphone fill={"#000"} />
                      :
                      <Microphone fill={"#fff"} />
                    }
                  </TouchableOpacity> : <></>}
                </>
              )
              }
              {showTextViews && (
                <>
                  {suggestion?.map((val) => (
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 15, marginRight: 10 }}>{val.word}</Text>
                  ))}
                </>
              )
              }
            </View>
            {viewToShow === 'SpecialCharacter2' &&
              <View>
                <View style={{
                  height: 200, backgroundColor: theme.keyboard, width: "100%", position: "relative",
                  bottom: -30, paddingVertical: 5, paddingHorizontal: 10
                }}>
                  <View style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginBottom: 20
                  }}>
                    <TouchableOpacity onPress={() => handlePress('~')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ color: "#000", fontSize: 17, fontFamily: Fonts.Regular }}>~</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('`')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ color: "#000", fontSize: 17, fontFamily: Fonts.Regular }}>{'\u0060'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('|')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ color: "#000", fontSize: 17, fontFamily: Fonts.Regular }}>|</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('•')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ color: "#000", fontSize: 17, fontFamily: Fonts.Regular }}>•</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('√')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ color: "#000", fontSize: 17, fontFamily: Fonts.Regular }}>√</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('π')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ color: "#000", fontSize: 17, fontFamily: Fonts.Regular }}>π</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('÷')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ color: "#000", fontSize: 17, fontFamily: Fonts.Regular }}>÷</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('×')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ color: "#000", fontSize: 17, fontFamily: Fonts.Regular }}>×</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('¶')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ color: "#000", fontSize: 17, fontFamily: Fonts.Regular }}>¶</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('∆')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ color: "#000", fontSize: 17, fontFamily: Fonts.Regular }}>∆</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginTop: 5, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                    <TouchableOpacity onPress={() => handlePress('£')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>£</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('¢')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>¢</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('€')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>€</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('¥')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>¥</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('^')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>^</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('°')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>°</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('=')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>=</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('{')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>{'{'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('}')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>{'\}'}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginHorizontal: 20 }}>
                    <TouchableOpacity onPress={() => handleViewChange('SpecialCharacter1')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17, fontWeight: 'bold' }}>=\{`<`}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress("\\")} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>\</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('©')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>©</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress("®")} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>®</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('™')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>™</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('%')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>%</Text>
                    </TouchableOpacity >
                    <TouchableOpacity onPress={() => handlePress('[')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>{"["}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress(']')} style={{ height: 30, width: 60, alignItems: "center" }}>
                      <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('Backspace')} style={{ height: 30, width: 60, alignItems: "center" }}
                    >
                      {theme.theme == "light" ?
                        <Backspace fill={"#000"} /> :
                        <Backspace fill={"#fff"} />
                      }
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 50 }}>
                    <TouchableOpacity onPress={() => handleViewChange('SpecialCharacter1')}>
                      {theme.theme == "light" ?
                        <One fill={"#000"} /> :
                        <One fill={"#fff"} />
                      }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('/')}>
                      {theme.theme == "light" ?
                        <Slash fill={"#000"} /> :
                        <Slash fill={"#fff"} />
                      }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => emoji()}>
                      {theme.theme == "light" ?
                        <Simle fill={"#000"} /> :
                        <Simle fill={"#fff"} />
                      }

                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => handlePress(' ')}>
                      {theme.theme == "light" ?
                        <SpaceBar /> :
                        <SpaceBar />
                      }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePress('.')}>
                      <Text style={{ color: theme.text, fontFamily: Fonts.Regular, fontSize: 20 }}>.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSendString}>
                      {theme.theme == "light" ?
                        <ArrowTwo fill={"#000"} /> :
                        <ArrowTwo fill={"#fff"} />
                      }
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            }
            {viewToShow === 'SpecialCharacter1' &&
              <View style={{
                height: 200, backgroundColor: theme.keyboard, width: "100%", position: "relative",
                bottom: -30, paddingVertical: 5, paddingHorizontal: 10
              }}>
                <View style={{
                  flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginBottom: 20
                }}>
                  <TouchableOpacity onPress={() => handlePress('1')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ color: "#000", fontSize: 15, fontFamily: Fonts.Regular }}>1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('2')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ color: "#000", fontSize: 15, fontFamily: Fonts.Regular }}>2</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('3')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ color: "#000", fontSize: 15, fontFamily: Fonts.Regular }}>3</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('4')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ color: "#000", fontSize: 15, fontFamily: Fonts.Regular }}>4</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('5')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ color: "#000", fontSize: 15, fontFamily: Fonts.Regular }}>5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('6')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ color: "#000", fontSize: 15, fontFamily: Fonts.Regular }}>6</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('7')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ color: "#000", fontSize: 15, fontFamily: Fonts.Regular }}>7</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('8')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ color: "#000", fontSize: 15, fontFamily: Fonts.Regular }}>8</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('9')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ color: "#000", fontSize: 15, fontFamily: Fonts.Regular }}>9</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('0')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ color: "#000", fontSize: 15, fontFamily: Fonts.Regular }}>0</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 5, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                  <TouchableOpacity onPress={() => handlePress('@')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>@</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('#')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>#</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('$')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>$</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('%')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>%</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('&')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>&</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('-')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('+')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('(')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>{'\u0028'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(')')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>{'\u0029'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginHorizontal: 20 }}>
                  <TouchableOpacity onPress={() => handleViewChange('SpecialCharacter2')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    {theme.theme == "light" ?
                      <SpecialCharacters fill={"#000"} /> :
                      <SpecialCharacters fill={"#fff"} />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('*')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>*</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('"')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>"</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress("'")} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>'</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(':')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>:</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(';')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>;</Text>
                  </TouchableOpacity >
                  <TouchableOpacity onPress={() => handlePress('!')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>!</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('?')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 17 }}>?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('Backspace')} style={{ height: 30, width: 60, alignItems: "center" }}>
                    {theme.theme == "light" ?
                      <Backspace fill={"#000"} /> :
                      <Backspace fill={"#fff"} />
                    }
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 30 }}>
                  <TouchableOpacity onPress={() => handleViewChange('ABC')}>
                    {theme.theme == "light" ?
                      <Alphabets fill={"#000"} /> :
                      <Alphabets fill={"#fff"} />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('/')}>
                    {theme.theme == "light" ?
                      <Slash fill={"#000"} /> :
                      <Slash fill={"#fff"} />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => emoji()} >
                    {theme.theme == "light" ?
                      <Simle fill={"#000"} /> :
                      <Simle fill={"#fff"} />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(' ')}>
                    {theme.theme == "light" ?
                      <SpaceBar /> :
                      <SpaceBar />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('.')}>
                    <Text style={{ color: theme.text, fontFamily: Fonts.Regular, fontSize: 20 }}>.</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSendString}>
                    {theme.theme == "light" ?
                      <ArrowTwo fill={"#000"} /> :
                      <ArrowTwo fill={"#fff"} />
                    }
                  </TouchableOpacity>
                </View>

              </View>
            }
            {viewToShow === 'ABC' &&
              <View>
                <View style={{
                  marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                  marginLeft: 20
                }}>
                  <TouchableOpacity >
                    <Text style={{ color: theme.search, fontSize: 12, fontFamily: Fonts.Regular }}>1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity >
                    <Text style={{ color: theme.search, fontSize: 12, fontFamily: Fonts.Regular }}>2</Text>
                  </TouchableOpacity>
                  <TouchableOpacity >
                    <Text style={{ color: theme.search, fontSize: 12, fontFamily: Fonts.Regular }}>3</Text>
                  </TouchableOpacity>
                  <TouchableOpacity >
                    <Text style={{ color: theme.search, fontSize: 12, fontFamily: Fonts.Regular }}>4</Text>
                  </TouchableOpacity>
                  <TouchableOpacity >
                    <Text style={{ color: theme.search, fontSize: 12, fontFamily: Fonts.Regular }}>5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity >
                    <Text style={{ color: theme.search, fontSize: 12, fontFamily: Fonts.Regular }}>6</Text>
                  </TouchableOpacity>
                  <TouchableOpacity >
                    <Text style={{ color: theme.search, fontSize: 12, fontFamily: Fonts.Regular }}>7</Text>
                  </TouchableOpacity>
                  <TouchableOpacity >
                    <Text style={{ color: theme.search, fontSize: 12, fontFamily: Fonts.Regular }}>8</Text>
                  </TouchableOpacity>
                  <TouchableOpacity >
                    <Text style={{ color: theme.search, fontSize: 12, fontFamily: Fonts.Regular }}>9</Text>
                  </TouchableOpacity>
                  <TouchableOpacity >
                    <Text style={{ color: theme.search, fontSize: 12, fontFamily: Fonts.Regular }}>0</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
                  <TouchableOpacity onPress={() => handlePress(textToShow[0])} style={{ height: 30, width: 60, alignItems: "center" }} onLongPress={() => handlePress('1')}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[0]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[1])} style={{ height: 30, width: 60, alignItems: "center" }} onLongPress={() => handlePress('2')}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[1]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[2])} style={{ height: 30, width: 60, alignItems: "center" }} onLongPress={() => handlePress('3')}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[2]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[3])} style={{ height: 30, width: 60, alignItems: "center" }} onLongPress={() => handlePress('4')}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[3]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[4])} style={{ height: 30, width: 60, alignItems: "center" }} onLongPress={() => handlePress('5')}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[4]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[5])} style={{ height: 30, width: 60, alignItems: "center" }} onLongPress={() => handlePress('6')}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[5]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[6])} style={{ height: 30, width: 60, alignItems: "center" }} onLongPress={() => handlePress('7')}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[6]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[7])} style={{ height: 30, width: 60, alignItems: "center" }} onLongPress={() => handlePress('8')}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[7]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[8])} style={{ height: 30, width: 60, alignItems: "center" }} onLongPress={() => handlePress('9')}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[8]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[9])} style={{ height: 30, width: 60, alignItems: "center" }} onLongPress={() => handlePress('0')}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[9]}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginHorizontal: 20 }}>
                  <TouchableOpacity onPress={() => handlePress(textToShow[10])} style={{ height: 30, width: 50, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[10]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[11])} style={{ height: 30, width: 50, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[11]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress((textToShow[12]))} style={{ height: 30, width: 50, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[12]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[13])} style={{ height: 30, width: 50, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[13]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[14])} style={{ height: 30, width: 50, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[14]}</Text>
                  </TouchableOpacity >
                  <TouchableOpacity onPress={() => handlePress(textToShow[15])} style={{ height: 30, width: 50, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[15]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[16])} style={{ height: 30, width: 50, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[16]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[17])} style={{ height: 30, width: 50, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[17]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[18])} style={{ height: 30, width: 50, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[18]}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                  <TouchableOpacity onPress={handleABCPress} style={{ height: 20, width: 50, alignItems: "center" }}>
                    {theme.theme == "light" ?
                      <KeyboardArrow fill={"#000"} /> :
                      <KeyboardArrow fill={"#fff"} />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[19])} style={{ height: 30, width: 50, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[19]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[20])} style={{ height: 30, width: 50, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[20]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[21])} style={{ height: 30, width: 50, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[21]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[22])} style={{ height: 30, width: 50, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[22]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[23])} style={{ height: 30, width: 50, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[23]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[24])} style={{ height: 30, width: 50, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[24]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress(textToShow[25])} style={{ height: 30, width: 50, alignItems: "center" }}>
                    <Text style={{ fontFamily: Fonts.Regular, color: "#000", fontSize: 20 }}>{textToShow[25]}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('Backspace')} style={{ height: 20, width: 50, alignItems: "center" }} >
                    {theme.theme == "light" ?
                      <Backspace fill={"#000"} /> :
                      <Backspace fill={"#fff"} />
                    }
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
                  <TouchableOpacity onPress={() => handleViewChange('SpecialCharacter1')}>
                    {theme.theme == "light" ?
                      <One fill={"#000"} /> :
                      <One fill={"#fff"} />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePress('/')}>
                    {theme.theme == "light" ?
                      <Slash fill={"#000"} /> :
                      <Slash fill={"#fff"} />
                    }
                  </TouchableOpacity>
                  <View >
                    <TouchableOpacity onPress={() => emoji()}>
                      {theme.theme == "light" ?
                        <Simle fill={"#000"} /> :
                        <Simle fill={"#fff"} />
                      }
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity  onPress={() => handlePress(' ')}>
                    {theme.theme == "light" ?
                      <SpaceBar /> :
                      <SpaceBar />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity style={{width:20,}} onPress={() => handlePress('.')}>
                    <Text style={{ color: theme.text, fontFamily: Fonts.Regular, fontSize: 20 }}>.</Text>
                  </TouchableOpacity>
                  <TouchableOpacity   onPress={handleSendString}>
                    {theme.theme == "light" ?
                      <ArrowTwo fill={"#000"} /> :
                      <ArrowTwo fill={"#fff"} />
                    }
                  </TouchableOpacity>
                </View>
              </View>
            }

          </View>

          : <></>}
        {isEmojiOpen ?
          <View style={{
            height: 300, backgroundColor: theme.keyboard, width: "100%", position: "absolute",
            bottom: -100, paddingVertical: 10, paddingHorizontal: 15
          }}>
            <View>
              <View>
                {bg == "emoji" ?
                  <>

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      {
                        Object.keys(emojisByCategory).map((key, index) =>
                        (
                          key == "clock" ? <TouchableOpacity style={{ paddingBottom: 5 }} onPress={() => handleListPress("clock")}>
                            {console.log("keyyes", key)}
                            {theme.theme == "light" ?
                              <Clock fill={"#000"} />
                              :
                              <Clock fill={"#fff"} />
                            }
                          </TouchableOpacity> : <></>
                            &&
                            key == "Smileys & Emotion" ? <TouchableOpacity style={{ paddingBottom: 5 }} onPress={() => handleListPress("Smileys & Emotion")}>
                            {console.log("keyyes", key)}
                            {theme.theme == "light" ?
                              <Simle fill={"#000"} />
                              :
                              <Simle fill={"#fff"} />
                            }
                          </TouchableOpacity> : <></>

                            && key == "People & Body" ? <TouchableOpacity style={{ paddingBottom: 5 }} onPress={() => handleListPress("People & Body")}>
                            {console.log("keyyes", key, index)}
                            {theme.theme == "light" ?
                              <Bulb fill={"#000"} />
                              :
                              <Bulb fill={"#fff"} />
                            }
                          </TouchableOpacity> : <></>

                            && key == "People & Body" ? <TouchableOpacity style={{ paddingBottom: 5 }} onPress={() => handleListPress("Animals & Nature")}>
                            {console.log("keyyes", key)}
                            {theme.theme == "light" ?
                              <Bulb fill={"#000"} />
                              :
                              <Bulb fill={"#fff"} />
                            }
                          </TouchableOpacity> : <></>

                            && key == "Animals & Nature" ? <TouchableOpacity style={{ paddingBottom: 5 }} onPress={() => handleListPress("Food & Drink")}>
                            {console.log("keyyes", key)}
                            {theme.theme == "light" ?
                              <City fill={"#000"} />
                              :
                              <City fill={"#fff"} />
                            }
                          </TouchableOpacity> : <></>

                            && key == "Food & Drink" ? <TouchableOpacity style={{ paddingBottom: 5 }} onPress={() => handleListPress("Activities")}>
                            {console.log("keyyes", key)}
                            {theme.theme == "light" ?
                              <Coffee fill={"#000"} />
                              :
                              <Coffee fill={"#fff"} />
                            }
                          </TouchableOpacity> : <></>

                            && key == "Activities" ? <TouchableOpacity style={{ paddingBottom: 5 }} onPress={() => handleListPress("Objects")}>
                            {console.log("keyyes", key)}
                            {theme.theme == "light" ?
                              <Hello fill={"#000"} />
                              :
                              <Hello fill={"#fff"} />
                            }
                          </TouchableOpacity> : <></>

                            && key == "Objects" ?

                            <TouchableOpacity style={{ paddingBottom: 5 }} onPress={() => handleListPress("Symbols")}>
                              {console.log("keyyes", key)}
                              {theme.theme == "light" ?
                                <Flag fill={"#000"} />
                                :
                                <Flag fill={"#fff"} />
                              }
                            </TouchableOpacity> : <></>

                              && key == "Symbols" ? <TouchableOpacity style={{ paddingBottom: 5 }} onPress={() => handleListPress("Flags")}>
                              {console.log("keyyes", key)}
                              {theme.theme == "light" ?
                                <Symbols fill={"#000"} />
                                :
                                <Symbols fill={"#fff"} />
                              }
                            </TouchableOpacity> : <></>
                        )
                        )

                      }

                    </View>
                    {selectedList && (
                      <ScrollView style={{ height: 200 }}>
                        <View style={{
                          display: "flex", flexDirection: "row",
                          alignSelf: "center",
                          // justifyContent:"space-between",
                          //alignItems: "center", 
                          justifyContent: "flex-start",
                          flexWrap: "wrap",
                          marginHorizontal: 10, marginVertical: 15
                        }}>
                          {selectedList.map((item, index) => (
                            <TouchableOpacity
                              key={Math.random()}
                              onPress={() => handleSmilePress("char", item.char)}
                              width={"10%"}                       >
                              <Text style={{ fontSize: 30 }}>{item.char}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </ScrollView>)}
                  </> : <></>
                }

                {bg == "sticker" ?
                  <>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                      <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "flex-start", borderWidth: 1, borderColor: "#000", borderRadius: 40,
                        padding: 5
                      }}>
                        <TextInput
                          placeholder="Search Sticker"
                          placeholderTextColor={"#000"}
                          onChangeText={setSearchSticker}
                          style={{ fontFamily: Fonts.Regular, paddingLeft: 10, margin: 0, padding: 0 }} />

                        <TouchableOpacity style={{
                          flexDirection: "row", alignItems: "center",
                          justifyContent: "center", paddingBottom: 5, paddingLeft: 12, marginTop: 5
                        }} onPress={() => handleSearch(null, "sticker")}>
                          {theme.theme == "light" ?
                            <Search fill={"#000"} />
                            :
                            <Search fill={"#fff"} />
                          }
                        </TouchableOpacity>
                      </View>
                      <ScrollView horizontal>
                        <TouchableOpacity style={{ paddingBottom: 5, marginLeft: 10, marginTop: 5 }} onPress={() => { setShowRecentSticker(!showRecentSticker); console.log("sfsefef"); }} >
                          {theme.theme == "light" ?
                            <Clock fill={"#000"} />
                            :
                            <Clock fill={"#fff"} />
                          }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSearch("nervous", "sticker")} >
                          <View style={{ marginLeft: 10 }}>
                            <Text style={{
                              fontFamily: Fonts.Regular, color: theme.text, borderBottomWidth: 1,
                              borderBottomColor: "#000s"
                            }}>nervous</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSearch("cat", "sticker")}>
                          <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontFamily: Fonts.Regular, color: theme.text }}>cat</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSearch("morning", "sticker")}>
                          <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontFamily: Fonts.Regular, color: theme.text }}>morning</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSearch("lol", "sticker")}>
                          <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontFamily: Fonts.Regular, color: theme.text }}>lol</Text>
                          </View>
                        </TouchableOpacity>
                      </ScrollView>
                    </View>
                    <ScrollView style={{ height: 180 }}>
                      <View style={{
                        display: "flex", flexDirection: "row",
                        // alignSelf: "center",
                        // justifyContent:"space-evenly",
                        //alignItems: "center", 
                        //justifyContent: "flex-start",
                        flexWrap: "wrap",
                        //marginHorizontal: 5, marginVertical: 5
                      }}>
                        {showRecentSticker ?
                          recentSticker?.map((val) => (
                            <TouchableOpacity key={Math.random()} style={{ width: "20%" }} >
                              {console.log("goioieieieee", val.stickers)}
                              <Image source={{ uri: val.stickers }}
                              //style={{ height: 200, width: 2000 }} 
                              />
                            </TouchableOpacity>


                          )) : renderGifs("stickers")}
                      </View>
                    </ScrollView></> : <></>
                }
                {bg == "gif" ?

                  <>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                      <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "flex-start", borderWidth: 1, borderColor: "#000", borderRadius: 40,
                        padding: 5
                      }}>
                        <TextInput
                          placeholder="Search GIF'ss"
                          placeholderTextColor={theme.text}
                          value={searchText}
                          onChangeText={setSearchText}
                          style={{ fontFamily: Fonts.Regular, paddingLeft: 10, margin: 0, padding: 0 }} />

                        <TouchableOpacity style={{
                          flexDirection: "row", alignItems: "center",
                          justifyContent: "center", paddingBottom: 5, paddingLeft: 12, marginTop: 5
                        }} onPress={() => handleSearch(null, "gif")}>
                          {theme.theme == "light" ?
                            <Search fill={"#000"} />
                            :
                            <Search fill={"#fff"} />
                          }
                        </TouchableOpacity>
                      </View>
                      <ScrollView horizontal>
                        <TouchableOpacity style={{ paddingBottom: 5, marginLeft: 10, marginTop: 5 }} onPress={() => { setShowRecentGif(!showRecentGif) }}>
                          {theme.theme == "light" ?
                            <Clock fill={"#000"} />
                            :
                            <Clock fill={"#fff"} />
                          }
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { handleSearch("Trending", "gif") }}>
                          <View style={{ marginLeft: 10 }}>
                            <Text style={{
                              fontFamily: Fonts.Regular, fontSize: 14, color: "#000",
                            }}>Trending</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { handleSearch("Good morning", "gif") }}>
                          <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontFamily: Fonts.Regular, fontSize: 14, color: "#000" }}>good morning</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { handleSearch("HI", "gif") }} >
                          <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontFamily: Fonts.Regular, fontSize: 14, color: "#000" }}>hi</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { handleSearch("Love You", "gif") }}>
                          <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontFamily: Fonts.Regular, fontSize: 14, color: "#000" }}>love You</Text>
                          </View>
                        </TouchableOpacity >

                        <TouchableOpacity onPress={() => { handleSearch("nope", "gif") }}>
                          <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontFamily: Fonts.Regular, fontSize: 14, color: "#000" }}>nope</Text>
                          </View>
                        </TouchableOpacity>
                      </ScrollView>
                    </View>

                    <ScrollView style={{ height: 180 }}>
                      <View style={{
                        display: "flex", flexDirection: "row",
                        //alignSelf: "center",
                        // justifyContent:"space-between",
                        //alignItems: "center", 
                        //justifyContent: "flex-start",
                        flexWrap: "wrap",
                        //marginHorizontal: 10, marginVertical: 15
                      }}>
                        {showRecentGif ?
                          recentGif?.map((val) => (

                            <TouchableOpacity key={Math.random()} style={{ width: "20%" }} >
                              {console.log("goioieieieee", val.gifs)}
                              <Image source={{ uri: val.gifs }} />
                            </TouchableOpacity>

                          )) : renderGifs("gifs")}
                      </View>
                    </ScrollView></> : <></>
                }
              </View>


            </View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <TouchableOpacity onPress={() => {
                  setBg("abc")
                  setIsEmojiOpen(false)
                }}><ABC style={{ marginRight: 10 }} /></TouchableOpacity>
                <TouchableOpacity style={bg == "emoji" ? {
                  backgroundColor: "#ccc", paddingHorizontal: 5, paddingVertical: 5,
                  borderRadius: 50, marginRight: 10
                } : {
                  backgroundcolor: "transparent", paddingHorizontal: 5, paddingVertical: 5,
                  borderRadius: 50, marginRight: 10
                }} onPress={() => {
                  setBg("emoji")
                  setEmoji(!Emoji)
                }}><Simle /></TouchableOpacity>
                <TouchableOpacity style={bg == "sticker" ? {
                  backgroundColor: "#ccc", paddingHorizontal: 5, paddingVertical: 5,
                  borderRadius: 50, marginRight: 10
                } : {
                  backgroundcolor: "transparent", paddingHorizontal: 5, paddingVertical: 5,
                  borderRadius: 50, marginRight: 10
                }} onPress={() => {
                  setBg("sticker")
                  setSticker(true)
                }}><Heart /></TouchableOpacity>
                <TouchableOpacity style={bg == "gif" ? {
                  backgroundColor: "#ccc", paddingHorizontal: 5, paddingVertical: 10,
                  borderRadius: 50
                } : {
                  backgroundcolor: "transparent", paddingHorizontal: 5, paddingVertical: 10,
                  borderRadius: 50
                }} onPress={() => {
                  setBg("gif")
                  setGif(true)
                }}><Gif /></TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity><Back /></TouchableOpacity>
              </View>
            </View>
          </View> :
          <></>
        } */}

      </SafeAreaView >
    </>
  )
}