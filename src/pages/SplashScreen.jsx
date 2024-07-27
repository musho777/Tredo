import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react"
import { View, Image } from "react-native"
import RNRestart from 'react-native-restart';

export const SplashScreen = ({ navigation }) => {
  const func1 = async () => {
    let a = await AsyncStorage.getItem('restart')
    if (a != 'false') {
      RNRestart.Restart()
      await AsyncStorage.setItem('restart', 'false')
      setTimeout(() => {
        navigation.navigate("connectionPage")
      }, 1000)
    }
    else {
      navigation.navigate("connectionPage")
    }
  }

  useEffect(() => {
    func1()
  }, [])
  return <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
    {/* <Image source={require('../../assets/image/ic_launcher.png')} /> */}
  </View>
}