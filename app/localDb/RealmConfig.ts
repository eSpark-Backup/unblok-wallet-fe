import Realm from "realm";
import {
  walletDatashema,
  intObject,
  userPasscodeValue,
  pushNotificationStatus,
  dappAppStatus,
  userBiometricStatus,
  defaultCurrency,
  keyboardRetrieval,
  emojiObj,
  gifObj,
  stickerObj,
  walletarr,
  tokenArr,
  subToken,
  rememberMe,
  loginStatus,
  keyboardSpecs,
  WC,
  dappTabs,
  Tabsobj,
  recentlyClosed,
  RssReadLater
} from "./Schema";

const getRealm = async () => {
  const key = new Int8Array(64);
  // MongoDB RealmConfiguration
  const configuration = {
    deleteRealmIfMigrationNeeded: true,
    schema: [
      walletDatashema,
      intObject,
      userPasscodeValue,
      pushNotificationStatus,
      dappAppStatus,
      userBiometricStatus,
      defaultCurrency,
      keyboardRetrieval,
      emojiObj,
      gifObj,
      stickerObj,
      walletarr,
      tokenArr,
      subToken,
      rememberMe,
      loginStatus,
      keyboardSpecs,
      WC,
      dappTabs,
      Tabsobj,
      recentlyClosed,
      RssReadLater
    ], // add multiple schemas, comma seperated.
    encryptionKey: key,
  };
  return Realm.open(configuration);
};

export default getRealm;
