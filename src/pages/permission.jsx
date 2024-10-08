import { PermissionsAndroid, ScrollView, StatusBar, StyleSheet, Text, View, Linking, NativeModules, Platform, Alert, NativeEventEmitter, AppState } from "react-native"
import { Styles } from "../ui/style";
import { AppInfo } from "../components/appInfo";
import { Button2 } from "../components/button2";
import { Switch } from "../components/switch";
import { useEffect, useState } from "react";
import { addSmsPermissionListener } from "../components/SmsDefaultHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import { RequestDisableOptimization, BatteryOptEnabled } from "react-native-battery-optimization-check";

export const Permission = ({ navigation }) => {

  const { SmsDefaultHandler } = NativeModules;
  const [isDefaultSmsApp, setIsDefaultSmsApp] = useState(false);
  const [permitionForContact, setPermitionForContact] = useState(false)
  const [permitionforNotifcation, setPermitionForNotifcation] = useState(false)
  const [permitionSim, setPermitionSim] = useState(false)
  const [SmsPermitionAllow, setSmsPermitionAllow] = useState(false)
  const [notificatonPermition, setNotificatonPermition] = useState(false)
  const [errorSim, setErrorSim] = useState(false)
  const [errorContact, setErrorContact] = useState(false)
  const [errorPhone, setErrorPhone] = useState(false)
  const [errorNotfication, setErrorNotification] = useState(false)
  const [optimzationPermiton, setOptimziationPermition] = useState(false)
  const [errorOptimzation, setErrorOptimzation] = useState(false)

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

  const SetAsincDefault = async () => {
    setIsDefaultSmsApp(true);
    await AsyncStorage.setItem("defaultapp", 'yes')
  }


  useEffect(() => {
    const intervalId = setInterval(() => {
      ChackBattaryOptimzation()
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    checkPermition()
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
    const g1 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
    CheckAllNotificationGetPermitiopn()
    ChackBattaryOptimzation()
    if (g5) {
      setPermitionSim(true)
    }
    else {
      setPermitionSim(false)
    }
    if (g2) {
      setSmsPermitionAllow(true)
    }
    else {
      setSmsPermitionAllow(false)
    }
    if (g4) {
      setPermitionForContact(true)
    }
    else {
      setPermitionForContact(false)
    }
    if (g1) {
      setNotificatonPermition(true)
    }
    else {
      setNotificatonPermition(false)
    }
  }



  const requestNotificationPermition = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setNotificatonPermition(true)
        setErrorNotification(false)
      }
      else {
        setNotificatonPermition(false)
      }
      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        setNotificatonPermition(false);
        // Guide user to the app settings
        Alert.alert(
          'Permission Required',
          'Notification permission is required for this feature. Please enable it in the app settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
          { cancelable: false }
        );
      }
    } catch (err) {
      setNotificatonPermition(false)
    }
  };

  const requestForContact = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermitionForContact(true)
        setErrorContact(false)
      }
      else {
        setPermitionForContact(false)
      }
      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        setPermitionForContact(false);
        // Guide user to the app settings
        Alert.alert(
          'Permission Required',
          'Contact permission is required for this feature. Please enable it in the app settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
          { cancelable: false }
        );
      }
    } catch (err) {
      setPermitionForContact(false)
    }
  };



  const requestPhonePermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
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
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermitionSim(true);
        setErrorSim(false)
      }
      else {
        setPermitionSim(false);
      }
      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        setPermitionSim(false);
        // Guide user to the app settings
        Alert.alert(
          'Permission Required',
          'Phone state permission is required for this feature. Please enable it in the app settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
          { cancelable: false }
        );
      }
    } catch (err) {
      setPermitionSim(false)
    }
  };

  async function requestSmsPermissions() {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_SMS,)
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setSmsPermitionAllow(true)
        setErrorPhone(false)
      }
      else {
        setSmsPermitionAllow(false)
      }
      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        setSmsPermitionAllow(false);
        Alert.alert(
          'Permission Required',
          'SMS permission is required for this feature. Please enable it in the app settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
          { cancelable: false }
        );
      }
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
    // requestBackgroundPermissions()
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
    let data = []
    try {
      ChackBattaryOptimzation()
      const g2 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS)
      const g4 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
      const g5 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CALL_PHONE)
      let g1 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
      if (Platform.Version <= 33) {
        g1 = true
      }
      if (!g5) {
        setErrorSim(true)
      }
      else {
        setErrorSim(false)
      }

      if (!g4) {
        setErrorContact(true)
      }
      else {
        setErrorContact(false)
      }
      if (!g2) {
        setErrorPhone(true)
      }
      else {
        setErrorPhone(false)
      }
      if (!g1) {
        setErrorNotification(true)
      }
      else {
        setErrorNotification(false)
      }
      if (!optimzationPermiton) {
        setErrorOptimzation(true)
      }
      else {
        setErrorOptimzation(false)
      }
      if (g1 && g2 && g4 && g5 && optimzationPermiton) {
        await AsyncStorage.setItem('permition', 'yes')
        await AsyncStorage.setItem('notData', JSON.stringify(data))
        navigation.replace("connection", {
          screen: "connectionPage"
        })
        setErrorText(false)
      }
    } catch (err) {
    }
  }

  return <View style={[Styles.home, { justifyContent: 'flex-start', gap: 30 }]}>
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
        <Switch error={errorSim} value={permitionSim} onSwitch={() => requestPhonePermissions()} text="Доступ к информации о сим картах" />
        {Platform.Version >= 33 &&
          <Switch error={errorNotfication} value={notificatonPermition} onSwitch={() => requestNotificationPermition()} text="Доступ к отправки пуш уведомлений" />
        }
        <Switch error={errorContact} value={permitionForContact} onSwitch={() => requestForContact()} text="Разрешить приложению LightPay доступ к контактам?" />
        <Switch error={errorPhone} value={SmsPermitionAllow} onSwitch={() => requestSmsPermissions()} text="Доступ к информации о состоянии телефона" />
        <Switch value={permitionforNotifcation} onSwitch={() => getNotficiactionPermition()} text="Активировать чтение пуш-уведомлений" />


        <Switch error={errorOptimzation} value={optimzationPermiton} onSwitch={() => OptimizationBattary()} text="Прекратить оптимизацию расхода заряда?" />
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
