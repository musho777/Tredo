import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Connection } from './src/pages/connection';
import { useEffect } from 'react';
import { SmsPage } from './src/pages/SmsPage';
import { AllMsg } from './src/pages/allMsg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SmsListener from 'react-native-android-sms-listener'
import { useDispatch } from 'react-redux';
import { AddNotification, AddSms } from './src/store/action/action';
import BackgroundService from 'react-native-background-actions';
import PushNotification from 'react-native-push-notification';
import { useNavigation } from '@react-navigation/native';
import RNAndroidNotificationListener, { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import { AppRegistry } from 'react-native';
import { store } from './src/store/configStore';
import { Notification } from './src/pages/notification';
import { sendMessage } from './src/func/function';


const Tab = createBottomTabNavigator();


const handleNotification = (message) => {
  PushNotification.localNotification({
    channelId: "Navigation-channel",
    title: message.originatingAddress,
    message: message.body,
  });
};


const setNotification = async (message) => {
  let sms = await AsyncStorage.getItem('notification')
  let item = []
  if (sms) {
    item = JSON.parse(sms)
  }
  item.unshift(message)
  message.confirm = 2
  store.dispatch(AddNotification(message))
  await sendMessage(message)
  await AsyncStorage.setItem('notification', JSON.stringify(item))
}


export const headlessNotificationListener = async ({ notification }) => {


  if (notification) {
    const item = JSON.parse(notification)
    const message = {
      body: item.text,
      timestamp: item.time,
      originatingAddress: item.title,
      sortKey: item.sortKey
    };

    if (item.app != 'com.tredo') {
      handleNotification(message)
      if (item.sortKey) {
        let data = JSON.parse(await AsyncStorage.getItem('notification'))
        if (data?.findIndex((e) => e.sortKey == message.sortKey) == -1) {
          await setNotification(message)
        }
        if (!data) {
          data = []
          data.unshift(message)
          await setNotification(message)
        }
      }
      else {
        setNotification(message)
      }
    }
  }
}


export function LoginNavigation() {
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

  useEffect(() => {
    PushNotification.removeAllDeliveredNotifications();
  }, [])

  const handleButtonClick = (message) => {
    PushNotification.localNotification({
      channelId: "sms-channel",
      title: message.originatingAddress,
      message: message.body,
    });
  };

  const YourTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    try {
      SmsListener.addListener(message => {
        setItem(message)
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
          parameters: {
            delay: 1000,
          },
        });
      } catch (e) {
      }
    };

    startBackgroundTask();

    return () => {
      BackgroundService.stop();
    };
  }, []);


  const setItem = async (message) => {
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
      screenOptions={({ route }) => ({
        tabBarStyle: {
          display: 'none',
        },
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