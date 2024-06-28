import { Navigation } from './navigation';
import { Provider } from 'react-redux';
import { store } from './src/store/configStore';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

const App = () => {


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
  PushNotification.configure({
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
  });



  const [initialRouteName, setInitialRouteName] = useState('')
  const GetUser = async () => {
    let permition1 = await AsyncStorage.getItem('defaultapp')
    let permition2 = await AsyncStorage.getItem('permition')

    let item = await AsyncStorage.getItem('token')
    if (item) {
      if (permition1 == 'yes' && permition2 == 'yes') {
        setInitialRouteName('connection')
      }
      else {
        setInitialRouteName('permission')
      }
    }
    else {
      setInitialRouteName('home')
    }
  }

  useEffect(() => {
    GetUser()
  }, [])

  return (
    <Provider store={store}>
      {initialRouteName && <Navigation initialRouteName={initialRouteName} />}
    </Provider>
  );
};

export default App;


