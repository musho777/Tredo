import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Connection } from './src/pages/connection';
import { useEffect } from 'react';
import { SmsPage } from './src/pages/SmsPage';
import { AllMsg } from './src/pages/allMsg';
import SmsListener from 'react-native-android-sms-listener'
import BackgroundService from 'react-native-background-actions';
import PushNotification from 'react-native-push-notification';
import RNAndroidNotificationListener, { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import { AppRegistry } from 'react-native';
import { createTables, headlessNotificationListener, isOnline, setSms } from './src/func/function';
import { SplashScreen } from './src/pages/SplashScreen';
import BackgroundTimer from 'react-native-background-timer';


export function LoginNavigation() {

  const Tab = createBottomTabNavigator();

  useEffect(() => {
    createTables()
  }, [])

  PushNotification.createChannel(
    {
      channelId: "sms-channel",
      channelName: "SmS",
      channelDescription: "A channel to categorise your notifications",
      soundName: "default",
      importance: 4,
      vibrate: true,
    },
  );


  // const AllNotificationGetPermitiopn = async () => {
  //   const status = await RNAndroidNotificationListener.getPermissionStatus()
  //   if (status != 'authorized') {
  //     RNAndroidNotificationListener.requestPermission()
  //   }
  // }

  useEffect(() => {
    PushNotification.removeAllDeliveredNotifications();
    // AllNotificationGetPermitiopn()
    PushNotification.configure({
      onNotification: function (notification) { },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
    PushNotification.popInitialNotification((notification) => { });
    return () => {
      PushNotification.unregister();
    };
  }, [])


  useEffect(() => {
    const startBackgroundTask = async () => {
      try {
        await BackgroundService.start(YourTask, {
          taskName: 'LightPay',
          taskTitle: 'LightPay',
          taskDesc: '',
          taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
          },
          color: '#0073ff',
          parameters: { delay: 3000 },
        });
      } catch (e) {
      }
    };
    startBackgroundTask();

    return () => {
      // BackgroundService.stop();
    };
  }, [])

  const YourTask = async (taskDataArguments) => {
    let subscription;
    const { delay } = taskDataArguments;
    let intervalId;
    try {
      subscription = SmsListener.addListener(message => {
        console.log("smsssssssssss--------")
        setSms(message)
      });
      intervalId = BackgroundTimer.setInterval(() => {
        isOnline()
        console.log("---1")
      }, 30000);
      while (BackgroundService.isRunning()) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.log('Error in background task:', error);
    }
    finally {
      if (subscription) {
        subscription.remove();
      }
      BackgroundTimer.clearInterval(intervalId);
    };
  }


  return (
    <Tab.Navigator
      initialRouteName={'SplashScreen'}
      screenOptions={() => ({
        tabBarStyle: { display: 'none' },
        headerShown: false
      })}>
      <Tab.Screen name="connectionPage" component={Connection} />
      <Tab.Screen name="SplashScreen" component={SplashScreen} />
      <Tab.Screen name="SmsPage" component={SmsPage} />
      <Tab.Screen name="AllMsg" component={AllMsg} />
    </Tab.Navigator>
  );

}
AppRegistry.registerHeadlessTask(RNAndroidNotificationListenerHeadlessJsName, () => headlessNotificationListener);