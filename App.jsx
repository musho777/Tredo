import { Navigation } from './navigation';
import { Provider } from 'react-redux';
import { store } from './src/store/configStore';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetAllDontSendSms } from './src/func/function';


const App = () => {
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



  useEffect(() => {
    const intervalId = setInterval(() => {
      GetAllDontSendSms()
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);


  return (
    <Provider store={store}>
      {initialRouteName && <Navigation initialRouteName={initialRouteName} />}
    </Provider>
  );
};

export default App;


