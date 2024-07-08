import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../store/configStore";
import { AddNotification } from "../store/action/action";
import PushNotification from 'react-native-push-notification';


export const sendMessage = async (message) => {
  let confirm = false
  let token = await AsyncStorage.getItem('token')
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('X-App-Client', `MyReactNativeApp`);

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

  await fetch(`https://iron-pay.com/api/send_message`, requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result.status) {
        confirm = true
      }
      else {
        confirm = false
      }
    })
    .catch(error => {
      confirm = false
    });
  return confirm
}



export const setNotification = async (message) => {
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


const handleNotification = (message) => {
  PushNotification.localNotification({
    channelId: "Navigation-channel",
    title: message.originatingAddress,
    message: message.body,
  });
};



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

export const handleButtonClick = (message) => {
  PushNotification.localNotification({
    channelId: "sms-channel",
    title: message.originatingAddress,
    message: message.body,
  });
};