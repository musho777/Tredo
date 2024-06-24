import { PermissionsAndroid, ScrollView, StatusBar, StyleSheet, Text, View, Linking, NativeModules, Platform } from "react-native"
import { Styles } from "../ui/style";
import { AppInfo } from "../components/appInfo";
import { Button2 } from "../components/button2";
import { Switch } from "../components/switch";
import { useEffect, useState } from "react";

export const Permission = ({ navigation }) => {
  const [loading, setLoading] = useState(true)

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
    requestSmsPermissions()
  }, [])

  function setDefaultSmsApp() {
    if (Platform.OS === 'android') {
      const { SmsPackage } = NativeModules;
      SmsPackage.requestDefaultSmsApp();
    }
  }

  const GoNextPage = async () => {
    try {
      const g1 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS)
      const g2 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS)
      const g3 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.SEND_SMS)
      const g4 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
      const g5 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CALL_PHONE)
      const g6 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS)
      console.log(g1, g2, g3, g4, g5, g6)
      if (g2 && g4 && g5) {
        navigation.navigate("connection")
      }
      else {
        setLoading(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    GoNextPage()
  }, [])

  if (!loading)
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
          <Switch onSwitch={() => setDefaultSmsApp()} text="Сделать приложением SMS по-умолчанию" />
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
