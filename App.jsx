import { Navigation } from './navigation';
import { Provider } from 'react-redux';
import { store } from './src/store/configStore';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, PermissionsAndroid } from 'react-native';
const App = () => {



  // const appState = useRef(AppState.currentState)

  // useEffect(() => {
  //   AppState.addEventListener("change", _handleAppStateChnage)
  //   return () => {
  //     AppState.addEventListener("change", _handleAppStateChnage)
  //   }
  // }, [])

  // const _handleAppStateChnage = (nextAppState) => {
  //   if (appState.current.match(/inactive|backgraund/) && nextAppState === 'active') {
  //     console.log("App has come to the foregarund")
  //   }
  //   appState.current = nextAppState
  //   console.log("appState", appState.current)
  // }


  async function requestSmsPermissions() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
      ]);

      if (
        granted['android.permission.RECEIVE_SMS'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_SMS'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.SEND_SMS'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_CONTACTS'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_CONTACTS'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can use the SMS and Contacts features');
      } else {
        console.log('SMS or Contacts permissions denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }


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


