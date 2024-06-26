import { createStackNavigator } from '@react-navigation/stack';
import { Home } from './src/pages/home';
import { Permission } from './src/pages/permission';
import { Connection } from './src/pages/connection';
import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { SmsPage } from './src/pages/SmsPage';
import { AllMsg } from './src/pages/allMsg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SmsListener from 'react-native-android-sms-listener'
import { useDispatch } from 'react-redux';
import { AddSms, ReadSms } from './src/store/action/action';

const Stack = createStackNavigator();
const MyTheme = {
  dark: false,
  colors: {
    background: "#f9f9f9",
  },
};
export function Navigation({ initialRouteName }) {
  const [i, setI] = useState(initialRouteName);

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
        dispatch(AddSms(message))
        message.confirm = 2
        if (item.findIndex((e) => e.timestamp == message.timestamp) == -1)
          item.unshift(message)
      }
      await AsyncStorage.setItem('sms', JSON.stringify(item))
    }
    else {
      dispatch(AddSms(message))
      let item = []
      item.unshift(message)
      // dispatch(ReadSms(item))
      await AsyncStorage.setItem('sms', JSON.stringify(item))
    }
  }



  SmsListener.addListener(message => {
    setItem(message)
  })

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        initialRouteName={i}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="home" component={Home} />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="permission" component={Permission} />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="connection" component={Connection} />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="SmsPage" component={SmsPage} />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="AllMsg" component={AllMsg} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}