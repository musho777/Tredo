import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Connection } from './src/pages/connection';
import { useEffect, useState } from 'react';
import { SmsPage } from './src/pages/SmsPage';
import { AllMsg } from './src/pages/allMsg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SmsListener from 'react-native-android-sms-listener'
import { useDispatch, useSelector } from 'react-redux';
import { AddNotification, AddSms, ClearNotification, ClearSetNotificationdata, SetNotificationData } from './src/store/action/action';
import BackgroundService from 'react-native-background-actions';
import PushNotification from 'react-native-push-notification';
import { useNavigation } from '@react-navigation/native';
import RNAndroidNotificationListener, { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import { AppRegistry } from 'react-native';
import { store } from './src/store/configStore';
import { Notification } from './src/pages/notification';


const Tab = createBottomTabNavigator();

export const headlessNotificationListener = async ({ notification }) => {
  if (notification) {
    store.dispatch(ClearSetNotificationdata())
    let item = JSON.parse(notification);
    item.icon = '';
    if (item.app != 'com.tredo') {
      const message = {
        body: item.text,
        timestamp: item.time,
        originatingAddress: item.title,
      };
      let temp = JSON.parse(await AsyncStorage.getItem('sms'))
      if (temp) {
        if (temp?.findIndex((e) => e.timestamp == message.timestamp) == -1) {
          console.log('11')
          store.dispatch(SetNotificationData(message));
        }
      }
      else {
        console.log('22')
        store.dispatch(SetNotificationData(message));
      }
    }
  }
};



export function LoginNavigation() {
  const navigation = useNavigation()

  const setNotificationData = useSelector((st) => st.setNotificationData)
  PushNotification.createChannel(
    {
      channelId: "sms-channel",
      channelName: "SmS",
      channelDescription: "A channel to categorise your notifications",
      soundName: "default",
      importance: 4,
      vibrate: true,
    },
    (created) => console.log(`createChannel returned '${created}'`)
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
        navigation.navigate("SmsPage")
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
    PushNotification.popInitialNotification((notification) => {
      if (notification) {
        navigation.navigate('SmsPage')
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

  useEffect(() => {
    if (setNotificationData.data) {
      console.log(setNotificationData.data, 'setNotificationData.data')
      setNotification(setNotificationData.data)
    }
  }, [setNotificationData])

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

  const dispatch = useDispatch()

  const setItem = async (message) => {
    let token = await AsyncStorage.getItem('token')

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);
    myHeaders.append('X-App-Client', `MyReactNativeApp`);

    let sms = await AsyncStorage.getItem('sms')
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        title: message.originatingAddress,
        unix: message.timestamp,
        message: message.body
      }),
      redirect: 'follow'
    };
    message.confirm = 2
    await fetch(`https://iron-pay.com/api/send_message`, requestOptions)
      .then(response => response.json())
      .then(result => {
        dispatch()
        if (result.status) {
          message.confirm = true
        }
        else {
          message.confirm = false
        }
      })
      .catch(error => {
        message.confirm = false
      });
    if (sms) {
      let item = JSON.parse(await AsyncStorage.getItem('sms'))
      if (message.confirm != 2) {
        message.confirm = 2
        if (item.findIndex((e) => e.timestamp == message.timestamp) == -1) {
          item.unshift(message)
          handleButtonClick(message)
          dispatch(AddSms(message))
          await AsyncStorage.setItem('sms', JSON.stringify(item))
        }
      }
    }
    else {
      dispatch(AddSms(message))
      let item = []
      handleButtonClick(message)
      item.unshift(message)
      await AsyncStorage.setItem('sms', JSON.stringify(item))
    }
  }

  const setNotification = async (message) => {
    let token = await AsyncStorage.getItem('token')

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);
    myHeaders.append('X-App-Client', `MyReactNativeApp`);

    let sms = await AsyncStorage.getItem('notification')
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        title: message.originatingAddress,
        unix: message.timestamp,
        message: message.body
      }),
      redirect: 'follow'
    };
    message.confirm = 2
    await fetch(`https://iron-pay.com/api/send_message`, requestOptions)
      .then(response => response.json())
      .then(result => {
        dispatch(ClearNotification())
        if (result.status) {
          console.log('-----1')
          message.confirm = true
        }
        else {
          message.confirm = false
        }
      })
      .catch(error => {
        message.confirm = false
      });
    if (sms) {
      let item = JSON.parse(await AsyncStorage.getItem('notification'))
      if (message.confirm != 2) {
        message.confirm = 2
        if (item.findIndex((e) => e.timestamp == message.timestamp) == -1) {
          item.unshift(message)
          handleButtonClick(message)
          dispatch(AddNotification(message))
          await AsyncStorage.setItem('notification', JSON.stringify(item))

        }
      }
    }
    else {
      dispatch(AddNotification(message))
      let item = []
      handleButtonClick(message)
      item.unshift(message)
      await AsyncStorage.setItem('notification', JSON.stringify(item))
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