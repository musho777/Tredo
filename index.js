/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import { headlessNotificationListener, SetDeviceInfo } from './src/func/function';
import messaging from '@react-native-firebase/messaging';


const HeadlessTask = async (message) => {
  SetDeviceInfo()
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  SetDeviceInfo()
});

AppRegistry.registerHeadlessTask(RNAndroidNotificationListenerHeadlessJsName, () => headlessNotificationListener);
AppRegistry.registerHeadlessTask('ReactNativeFirebaseMessagingHeadlessTask', () => HeadlessTask);


AppRegistry.registerComponent(appName, () => App);
