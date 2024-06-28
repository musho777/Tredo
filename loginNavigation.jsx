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


// const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


export function LoginNavigation() {

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
          taskName: 'ExampleTask',
          taskTitle: 'Example Task Title',
          taskDesc: 'Example Task Description',
          taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
          },
          color: '#ff00ff',
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
    await fetch(`https://projectx.digiluys.com/api/send_message`, requestOptions)
      .then(response => response.json())
      .then(result => {
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
          dispatch(AddSms(message))
          await AsyncStorage.setItem('sms', JSON.stringify(item))
        }
      }
    }
    else {
      dispatch(AddSms(message))
      let item = []
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
    </Tab.Navigator>
  );
}