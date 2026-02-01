import Clipboard from "@react-native-community/clipboard";
import { ToastAndroid } from "react-native";
import Share from "react-native-share";




 export const CopyAddress = (data) => {
    ToastAndroid.showWithGravityAndOffset(
      "Address copied",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50
    );
    Clipboard.setString(data);
  };


 export const myCustomShare = async (data) => {
    const shareOptions = {
      message: data,
    };
    try {
      const ShareResponse = await Share.open(shareOptions);
      //console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      //console.log('Error => ', error);
    }
  };