import { PermissionsAndroid, ScrollView, StatusBar, StyleSheet, Text, View, Linking, NativeModules, Platform, Alert, NativeEventEmitter, AppState } from "react-native"
import { Styles } from "../ui/style";
import { AppInfo } from "../components/appInfo";
import { Button2 } from "../components/button2";
import { Switch } from "../components/switch";
import { useEffect, useState } from "react";
import { addSmsPermissionListener, requestDefaultSmsPermission } from "../components/SmsDefaultHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import { ModalComponent } from "../components/Modal";
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';


export const Permission = ({ navigation }) => {

  const { SmsDefaultHandler } = NativeModules;
  const [isDefaultSmsApp, setIsDefaultSmsApp] = useState(false);
  const [permitionForContact, setPermitionForContact] = useState(false)
  const [per, setPer] = useState(false)
  const [permitionforNotifcation, setPermitionForNotifcation] = useState(false)
  const [permitionSim, setPermitionSim] = useState(false)
  const [SmsPermitionAllow, setSmsPermitionAllow] = useState(false)
  const [notificatonPermition, setNotificatonPermition] = useState(false)
  const [errorText, setErrorText] = useState(false)


  async function requestBackgroundPermissions() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Background Task Permission',
        message: 'Allow the app to run background tasks after device reboots.',
        buttonPositive: 'OK',
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPer(true)
      }
    } catch (err) {
      console.warn('Error while requesting permission:', err);
    }
  }

  const SetAsincDefault = async () => {
    setIsDefaultSmsApp(true);
    await AsyncStorage.setItem("defaultapp", 'yes')
  }

  useEffect(() => {
    const listener = addSmsPermissionListener((message) => {
      if (message == 'Success requesting ROLE_SMS!') {
        SetAsincDefault()
      }
      else {
        setIsDefaultSmsApp(false);
      }
    });
    return () => {
      listener.remove();
    };
  }, []);

  const checkPermition = async () => {
    const g2 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS)
    const g4 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
    const g5 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CALL_PHONE)
    CheckAllNotificationGetPermitiopn()
    if (g5) {
      setPermitionSim(true)
    }
    else {
      setPermitionSim(false)
    }
    if (g4 && g2) {
      setSmsPermitionAllow(true)
    }
    else {
      setSmsPermitionAllow(false)
    }
  }


  useEffect(() => {
    checkPermition()
  }, [])


  const requestNotificationPermition = async () => {
    try {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      setNotificatonPermition(true)
    } catch (err) {
      setNotificatonPermition(false)
    }
  };

  const requestForContact = async () => {
    try {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
      setPermitionForContact(true)
    } catch (err) {
      setPermitionForContact(false)
    }
  };



  const requestPhonePermissions = async () => {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        {
          title: "Phone State Permission",
          message:
            "This app needs access to your phone state to make and manage phone calls.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      setPermitionSim(true)
    } catch (err) {
      setPermitionSim(false)
    }
  };

  async function requestSmsPermissions() {
    try {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_SMS,)
      setSmsPermitionAllow(true)
    } catch (err) {
      setSmsPermitionAllow(false)
    }
  }

  useEffect(() => {
    SmsDefaultHandler?.isDefaultSmsApp().then((result) => {
      if (result) {
        SetAsincDefault()
      }
      setIsDefaultSmsApp(result);
    }).catch((error) => {
      console.error(error);
    });
    requestBackgroundPermissions()
  }, [])


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


  const GoNextPage = async () => {
    try {
      const g2 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS)
      const g4 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
      const g5 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CALL_PHONE)
      const g1 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)

      if (g1 && g2 && g4 && g5 && per) {
        await AsyncStorage.setItem('permition', 'yes')
        navigation.replace("connection", {
          screen: "connectionPage"
        })
        setErrorText(false)
      }
    } catch (err) {
    }
  }

  return <View style={[Styles.home, { justifyContent: 'flex-start', gap: 30 }]}>
    <ModalComponent message={'Вам следует выбрать Приложением SMS по-умолчанию или Активировать чтение пуш-уведомлений'} modalVisible={errorText} accept={() => setErrorText(false)} />
    <StatusBar
      animated={true}
      barStyle="dark-content"
      backgroundColor='#f9f9f9' />
    <AppInfo light />
    <View >
      <Text style={styles.text}>Предоставьте приложению</Text>
      <Text style={[styles.text, { marginTop: -3 }]}>необходимые разрешения:</Text>
    </View>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ gap: 20 }}>
        {/* <Switch value={isDefaultSmsApp} onSwitch={() => requestDefaultSmsPermission()} text="Сделать приложением SMS по-умолчанию" /> */}
        <Switch value={permitionSim} onSwitch={() => requestPhonePermissions()} text="Доступ к информации о сим картах" />
        <Switch value={notificatonPermition} onSwitch={() => requestNotificationPermition()} text="Доступ к отправки пуш уведомлений" />
        <Switch value={permitionForContact} onSwitch={() => requestForContact()} text="Разрешить приложению LightPay доступ к контактам?" />
        <Switch value={SmsPermitionAllow} onSwitch={() => requestSmsPermissions()} text="Доступ к информации о состоянии телефона" />
        <Switch value={permitionforNotifcation} onSwitch={() => getNotficiactionPermition()} text="Активировать чтение пуш-уведомлений" />
      </View>
    </ScrollView>
    <View>
      <Button2 onPress={() => GoNextPage()} title={"Далее"} light />
    </View>
  </View>
}
const styles = StyleSheet.create({
  text: {
    color: '#2f508e',
    fontSize: 15,
    fontFamily: 'RobotoCondensed-SemiBold',
  }
});
