import { Navigation } from './navigation';
import { Provider } from 'react-redux';
import { store } from './src/store/configStore';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetAllDontSendSms } from './src/func/function';
import Pusher from 'pusher-js/react-native';


const App = () => {
  const [initialRouteName, setInitialRouteName] = useState('')


  // useEffect(() => {
  //   Pusher.logToConsole = true;

  //   const pusher = new Pusher('local', {
  //     cluster: 'mt1',
  //     wsHost: 'iron-pay.com',
  //     wsPort: 6001,
  //     wssPort: 6001,
  //     forceTLS: true,
  //     encrypted: true,
  //     disableStats: true,
  //     enabledTransports: ['ws', 'wss'],
  //   });

  //   const cardBlockedChannel = pusher.subscribe('card_blocked');

  //   cardBlockedChannel.bind('card_blocked', function (data) {
  //     console.log('Card blocked event data:', data);
  //     // const sound = new Sound('new_message.mp3', Sound.MAIN_BUNDLE, (error) => {
  //     //     if (error) {
  //     //         console.log('Failed to load the sound', error);
  //     //         return;
  //     //     }
  //     //     sound.play((success) => {
  //     //         if (success) {
  //     //             console.log('Successfully played the sound');
  //     //         } else {
  //     //             console.log('Playback failed due to audio decoding errors');
  //     //         }
  //     //     });
  //     // });
  //   });

  //   return () => {
  //     pusher.unsubscribe('card_blocked');
  //   };
  // }, []);




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





  useEffect(() => {
    const intervalId = setInterval(() => {
      GetAllDontSendSms()
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);


  return (
    <Provider store={store}>
      {initialRouteName && <Navigation initialRouteName={initialRouteName} />}
    </Provider>
  );
};

export default App;


