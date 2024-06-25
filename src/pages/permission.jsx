import { PermissionsAndroid, ScrollView, StatusBar, StyleSheet, Text, View, Linking, NativeModules, Platform, Alert, NativeEventEmitter } from "react-native"
import { Styles } from "../ui/style";
import { AppInfo } from "../components/appInfo";
import { Button2 } from "../components/button2";
import { Switch } from "../components/switch";
import { useEffect, useState } from "react";
import { addSmsPermissionListener, requestDefaultSmsPermission } from "../components/SmsDefaultHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Permission = ({ navigation }) => {

  const { SmsDefaultHandler } = NativeModules;
  const [isDefaultSmsApp, setIsDefaultSmsApp] = useState(false);

  const handlePermissionRequest = () => {
    requestDefaultSmsPermission();
  };

  const SetAsincDefault = async () => {
    setIsDefaultSmsApp(true);
    await AsyncStorage.setItem("defaultapp", 'yes')
  }

  useEffect(() => {
    const listener = addSmsPermissionListener((message) => {
      SetAsincDefault()
      setIsDefaultSmsApp(true)
    });
    return () => {
      listener.remove();
    };
  }, []);

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
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  };

  async function requestSmsPermissions() {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.READ_SMS,
      ]
        // PermissionsAndroid.PERMISSIONS.SEND_SMS,
      );
    } catch (err) {
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
    requestSmsPermissions()
  }, [])


  const GoNextPage = async () => {
    try {
      const g1 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS)
      const g2 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS)
      const g3 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.SEND_SMS)
      const g4 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
      const g5 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CALL_PHONE)
      const g6 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS)
      console.log(g2, g4, g5)
      if (g2 && g4 && g5) {
        await AsyncStorage.setItem('permition', 'yes')
        if (isDefaultSmsApp) {
          navigation.navigate("connection")
        }
      }
    } catch (err) {
      console.log(err)
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
        <Switch value={isDefaultSmsApp} onSwitch={() => handlePermissionRequest()} text="Сделать приложением SMS по-умолчанию" />
        <Switch onSwitch={() => requestPhonePermissions()} text="Доступ к информации о сим картах" />
        <Switch onSwitch={() => requestSmsPermissions()} text="Доступ к информации о состоянии телефона" />
        <Switch onSwitch={() => { }} text="Активировать чтение пуш-уведомлений" />
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
