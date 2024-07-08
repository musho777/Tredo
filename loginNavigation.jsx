import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Connection } from './src/pages/connection';
import { useEffect } from 'react';
import { SmsPage } from './src/pages/SmsPage';
import { AllMsg } from './src/pages/allMsg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SmsListener from 'react-native-android-sms-listener'
import { useDispatch } from 'react-redux';
import { AddSms } from './src/store/action/action';
import BackgroundService from 'react-native-background-actions';
import PushNotification from 'react-native-push-notification';
import { useNavigation } from '@react-navigation/native';
import RNAndroidNotificationListener, { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import { AppRegistry } from 'react-native';
import { Notification } from './src/pages/notification';
import { handleButtonClick, headlessNotificationListener, sendMessage } from './src/func/function';

export function LoginNavigation() {
  const Tab = createBottomTabNavigator();

  const dispatch = useDispatch()
  const navigation = useNavigation()

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


  const YourTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    try {
      SmsListener.addListener(message => {
        setSms(message)
      });
      while (BackgroundService.isRunning()) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error('Error in background task:', error);
    }
  };


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
          parameters: { delay: 1000 },
        });
      } catch (e) {
      }
    };

    startBackgroundTask();

    return () => {
      BackgroundService.stop();
    };
  }, []);


  const setSms = async (message) => {
    let item = JSON.parse(await AsyncStorage.getItem('sms'))
    if (item) {
      if (item.findIndex((e) => e.timestamp == message.timestamp) == -1) {
        await sendMessage(message)
        item.unshift(message)
        handleButtonClick(message)
        dispatch(AddSms(message))
      }
      await AsyncStorage.setItem('sms', JSON.stringify(item))
    }
    else {
      dispatch(AddSms(message))
      let item = []
      message.confirm = 2
      await sendMessage(message)
      handleButtonClick(message)
      item.unshift(message)
      await AsyncStorage.setItem('sms', JSON.stringify(item))
    }
  }


  return (
    <Tab.Navigator
      initialRouteName={'connectionPage'}
      screenOptions={() => ({
        tabBarStyle: { display: 'none' }
      })}
    >
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="connectionPage" component={Connection} />
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="SmsPage" component={SmsPage} />
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="AllMsg" component={AllMsg} />
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="Notification" component={Notification} />

    </Tab.Navigator>
  );

}
AppRegistry.registerHeadlessTask(RNAndroidNotificationListenerHeadlessJsName, () => headlessNotificationListener);