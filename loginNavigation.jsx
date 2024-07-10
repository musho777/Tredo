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
import { Notification } from './src/pages/notification';
import { headlessNotificationListener, setSms } from './src/func/function';
import { SplashScreen } from './src/pages/SplashScreen';
import { useDispatch } from 'react-redux';
import { CheckOnline } from './src/store/action/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundTimer from 'react-native-background-timer';

export function LoginNavigation({ navigation }) {
  const Tab = createBottomTabNavigator();

  PushNotification.createChannel(
    {
      channelId: "sms-channel",
      channelName: "SmS",
      channelDescription: "A channel to categorise your notifications",
      soundName: "default",
      importance: 4,
      vibrate: true,
    },
    (created) => { }
  );


  PushNotification.createChannel(
    {
      channelId: "Navigation-channel",
      channelName: "Navigation",
      channelDescription: "A channel to categorise your notifications",
      soundName: "default",
      importance: 4,
      vibrate: true,
    },
    (created) => { }
  );

  const AllNotificationGetPermitiopn = async () => {
    const status = await RNAndroidNotificationListener.getPermissionStatus()
    if (status != 'authorized') {
      RNAndroidNotificationListener.requestPermission()
    }
  }

  useEffect(() => {
    PushNotification.removeAllDeliveredNotifications();
    AllNotificationGetPermitiopn()
    PushNotification.configure({
      onNotification: function (notification) {
        if (notification.channelId == 'sms-channel') {
          navigation.navigate("SmsPage")
        }
        else {
          navigation.navigate('Notification')
        }
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
    PushNotification.popInitialNotification((notification) => {
      if (notification) {
        if (notification.channelId == 'sms-channel') {
          navigation.navigate("SmsPage")
        }
        else {
          navigation.navigate('Notification')
        }
      }
    });
    return () => {
      PushNotification.unregister();
    };
  }, [])
  const dispatch = useDispatch()

  const isOnline = async () => {
    let token = await AsyncStorage.getItem('token')
    dispatch(CheckOnline(token))
  }


  const YourTask = async (taskDataArguments) => {
    let subscription;
    const { delay } = taskDataArguments;
    try {
      const intervalId = BackgroundTimer.setInterval(() => {
        isOnline()
      }, 30000);
      subscription = SmsListener.addListener(message => {
        setSms(message)
      });
      while (BackgroundService.isRunning()) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error('Error in background task:', error);
    }
    finally {
      if (subscription) {
        subscription.remove();
      }
    };
  }

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
      BackgroundService.stop();
    };
  }, []);



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
      <Tab.Screen name="Notification" component={Notification} />
    </Tab.Navigator>
  );

}
AppRegistry.registerHeadlessTask(RNAndroidNotificationListenerHeadlessJsName, () => headlessNotificationListener);