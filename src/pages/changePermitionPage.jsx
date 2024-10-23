import { ScrollView, StatusBar, StyleSheet, View, AppState, Platform } from "react-native"
import { Styles } from "../ui/style";
import { AppInfo } from "../components/appInfo";
import { Switch } from "../components/switch";
import { useEffect, useState } from "react";
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import { Button2 } from "../components/button2";
import { RequestDisableOptimization, BatteryOptEnabled } from "react-native-battery-optimization-check";


export const ChangePermitionPage = ({ navigation }) => {

  const [permitionforNotifcation, setPermitionForNotifcation] = useState(false)
  const [errorOptimzation, setErrorOptimzation] = useState(false)
  const [optimzationPermiton, setOptimziationPermition] = useState(true)

  const OptimizationBattary = async () => {
    await BatteryOptEnabled().then(async (isEnabled) => {
      setOptimziationPermition(!isEnabled)
      if (isEnabled) {
        try {
          const result = await RequestDisableOptimization()
        }
        catch {

        }
        // await RequestDisableOptimization()
      }
    });
  }

  const ChackBattaryOptimzation = async () => {
    await BatteryOptEnabled().then(async (isEnabled) => {
      setOptimziationPermition(!isEnabled)
      if (!isEnabled) {
        setErrorOptimzation(false)
      }
    });
  }



  useEffect(() => {
    ChackBattaryOptimzation()
  }, []);

  const CheckAllNotificationGetPermitiopn = async () => {
    const status = await RNAndroidNotificationListener.getPermissionStatus()
    if (status != 'authorized') {
      setPermitionForNotifcation(false)
    }
    else {
      setPermitionForNotifcation(true)
    }
  }

  const getNotficiactionPermition = async () => {
    RNAndroidNotificationListener.requestPermission()
    const status = await RNAndroidNotificationListener.getPermissionStatus()
    if (status != 'authorized') {
      setPermitionForNotifcation(false)
      RNAndroidNotificationListener.requestPermission()
    }
    else {
      setPermitionForNotifcation(true)
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', CheckAllNotificationGetPermitiopn);
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    CheckAllNotificationGetPermitiopn()
  }, [])


  return <View style={[Styles.home, { justifyContent: 'flex-start', gap: 30 }]}>
    <StatusBar
      animated={true}
      barStyle="dark-content"
      backgroundColor='#f9f9f9' />
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column' }}
      showsVerticalScrollIndicator={false}>
      <View>
        <View style={{ marginVertical: 20 }}>
          <AppInfo light />
        </View>
        <View style={{ gap: 20 }}>
          <Switch value={true} text="Доступ к информации о сим картах" />
          {Platform.Version >= 33 &&
            <Switch value={true} text="Доступ к отправки пуш уведомлений" />
          }
          <Switch value={true} text="Разрешить приложению LightPay доступ к контактам?" />
          <Switch value={true} text="Доступ к информации о состоянии телефона" />
          <Switch value={permitionforNotifcation} onSwitch={() => getNotficiactionPermition()} text="Активировать чтение пуш-уведомлений" />
          <View style={{ marginBottom: 20, }}>
            <Switch error={errorOptimzation} value={optimzationPermiton} onSwitch={() => OptimizationBattary()} text="Прекратить оптимизацию расхода заряда?" />
          </View>
        </View>
      </View>
      <View>
        <Button2 onPress={() => navigation.goBack()} title={"Вернуться в меню"} light />
      </View>
    </ScrollView>
  </View>
}
const styles = StyleSheet.create({
  title: {
    color: '#2f508e',
    fontSize: 35,
    fontFamily: 'RobotoCondensed-SemiBold',
  }
});
