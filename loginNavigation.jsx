import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Connection } from './src/pages/connection';
import { useEffect } from 'react';
import { SmsPage } from './src/pages/SmsPage';
import { AllMsg } from './src/pages/allMsg';
import BackgroundService from 'react-native-background-actions';
import PushNotification from 'react-native-push-notification';
import { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import { AppRegistry, DeviceEventEmitter } from 'react-native';
import { createTables, headlessNotificationListener, isOnline, setSms } from './src/func/function';
import BackgroundTimer from 'react-native-background-timer';


export function LoginNavigation() {
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

  useEffect(() => {
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

  const stopTask = async () => {
    await BackgroundService.stop();
    setTimeout(() => {
      startBackgroundTask();
    }, 1000)
  };

  useEffect(() => {
    stopTask();
    createTables()
  }, [])

  const YourTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;
    let intervalId;
    let subscriber = DeviceEventEmitter.addListener(
      'onSMSReceived',
      message => {
        const { messageBody, senderPhoneNumber, timestamp } = JSON.parse(message);
        let data = {
          body: messageBody,
          originatingAddress: senderPhoneNumber,
          timestamp: timestamp
        }
        setSms(data)
      },
    );
    try {
      intervalId = BackgroundTimer.setInterval(() => {
        isOnline()
      }, 30000);
      while (BackgroundService.isRunning()) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.log('Error in background task:', error);
    }
    finally {
      subscriber.remove();
      BackgroundTimer.clearInterval(intervalId);
    };
  }


  return (
    <Tab.Navigator
      initialRouteName={'connectionPage'}
      screenOptions={() => ({
        tabBarStyle: { display: 'none' },
        headerShown: false
      })}>
      <Tab.Screen name="connectionPage" component={Connection} />
      <Tab.Screen name="SmsPage" component={SmsPage} />
      <Tab.Screen name="AllMsg" component={AllMsg} />
    </Tab.Navigator>
  );

}
AppRegistry.registerHeadlessTask(RNAndroidNotificationListenerHeadlessJsName, () => headlessNotificationListener);