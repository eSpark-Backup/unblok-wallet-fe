import { Dimensions, Platform, PixelRatio } from 'react-native';

export const windowWidth = Dimensions.get("window").width
export const windowheight= Dimensions.get("window").height
export const borderWidth = PixelRatio.getPixelSizeForLayoutSize(1);
export const borderRadius = Math.min(windowWidth, windowheight) * 0.5 * 0.1;

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
  const newSize = size * scale 
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}