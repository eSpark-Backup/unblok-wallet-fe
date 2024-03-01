/**
 * @format
 */
import "./shim.js";
import { AppRegistry, LogBox } from "react-native";
import '@walletconnect/react-native-compat';
import App from "./App";
import { name as appName } from "./app.json";
import PushNotification from "react-native-push-notification";

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,
  requestPermissions: Platform.OS === "ios",
});

AppRegistry.registerComponent(appName, () => App);
LogBox.ignoreAllLogs(true);
