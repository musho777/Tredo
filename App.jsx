import { Navigation } from './navigation';
import { Provider } from 'react-redux';
import { store } from './src/store/configStore';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [initialRouteName, setInitialRouteName] = useState('')
  const GetUser = async () => {
    let item = await AsyncStorage.getItem('token')
    if (item) {
      setInitialRouteName('permission')
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
