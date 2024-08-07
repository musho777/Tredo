import { ScrollView, StatusBar, StyleSheet, Text, View, AppState } from "react-native"
import { Styles } from "../ui/style";
import { AppInfo } from "../components/appInfo";
import { Switch } from "../components/switch";
import { useEffect, useState } from "react";
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import { ModalComponent } from "../components/Modal";
import { Button2 } from "../components/button2";


export const ChangePermitionPage = ({ navigation }) => {

  const [permitionforNotifcation, setPermitionForNotifcation] = useState(false)
  const [errorText, setErrorText] = useState(false)

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
    <View></View>
    <AppInfo light />
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ gap: 20 }}>
        <Switch value={true} text="Доступ к информации о сим картах" />
        <Switch value={true} text="Доступ к отправки пуш уведомлений" />
        <Switch value={true} text="Разрешить приложению LightPay доступ к контактам?" />
        <Switch value={true} text="Доступ к информации о состоянии телефона" />
        <Switch value={permitionforNotifcation} onSwitch={() => getNotficiactionPermition()} text="Активировать чтение пуш-уведомлений" />
      </View>
    </ScrollView>
    <View>
      <Button2 onPress={() => navigation.goBack()} title={"Вернуться в меню"} light />
    </View>
  </View>
}
const styles = StyleSheet.create({
  title: {
    color: '#2f508e',
    fontSize: 35,
    fontFamily: 'RobotoCondensed-SemiBold',
  }
});
