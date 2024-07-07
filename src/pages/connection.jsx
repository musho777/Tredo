import { StatusBar, TouchableOpacity, View, Image, Text, PermissionsAndroid, NativeModules, ActivityIndicator } from "react-native"
import { KeySvg, LogOut, MessageSvg, NotificationSvg, RefreshSvg } from "../../assets/svg"
import { AppInfo } from "../components/appInfo"
import { Styles } from "../ui/style"
import { Button3 } from "../components/button3"
import DeviceInfo from "react-native-device-info"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { requestDefaultSmsPermission } from "../components/SmsDefaultHandler"
import { useDispatch } from "react-redux"
import { ClearLoginAction, LogoutAction } from "../store/action/action"


export const Connection = ({ navigation }) => {
  const [systemVersion, setSystemVersion] = useState('')
  const { SmsDefaultHandler } = NativeModules;
  const [pingResult, setPingTime] = useState(null);
  const [isDefaultSmsApp, setIsDefaultSmsApp] = useState(false);
  const [check, setCheck] = useState(0)
  const dispatch = useDispatch()
  const [token, setToken] = useState()
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setRefresh(false)
    }, 1000);
    return () => clearTimeout(timer);
  }, [refresh]);


  const getToken = async () => {
    let token = await AsyncStorage.getItem('token')
    setToken(token)
  }

  const handlePermissionRequest = async () => {
    requestDefaultSmsPermission();
    let time = setTimeout(() => {
      setCheck(true)
    }, 1500)
    clearTimeout(time)
  };


  const GoNextPage = async () => {
    try {
      const g2 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS)
      const g4 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
      const g5 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CALL_PHONE)
      if (!g2 || !g4 || !g5) {
        await AsyncStorage.setItem('permition', 'no')
        if (defaultSms) {
          navigation.navigate("permission")
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchPingTime = async () => {
    const startTime = Date.now();
    try {
      await fetch('https://www.google.com', { method: 'HEAD' });
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      setPingTime(timeTaken);
    } catch (error) {
      console.error('Error fetching ping:', error);
    }
  };


  useEffect(() => {
    const fetchSystemVersion = () => {
      const version = DeviceInfo.getSystemVersion();
      setSystemVersion(version);
    };
    fetchSystemVersion();
    fetchPingTime()
    GoNextPage()
    getToken()
  }, []);

  useEffect(() => {
    SmsDefaultHandler?.isDefaultSmsApp().then((result) => {
      if (result) {
        setIsDefaultSmsApp(false)
      }
      else {
        setCheck(false)
        setIsDefaultSmsApp(true)
      }
    }).catch((error) => {
      console.error(error);
    });
  }, [check])

  const Logout = async () => {
    dispatch(LogoutAction(token))
    dispatch(ClearLoginAction())
    await AsyncStorage.clear()
    navigation.replace('home')
  }


  return <View style={[Styles.home, { paddingHorizontal: 20 }]}>
    <StatusBar
      animated={true}
      barStyle="dark-content"
      backgroundColor='#f9f9f9' />
    <AppInfo version={false} light />
    <TouchableOpacity onPress={() => Logout()} style={{ position: "absolute", top: 30, left: 10 }}>
      <LogOut />
    </TouchableOpacity>
    {refresh && <View style={{ position: 'absolute', justifyContent: 'center', width: '100%', alignItems: 'center', top: 10, left: 20 }}>
      <ActivityIndicator size="large" color="#3282f1" />
    </View>}
    <View>
      <View style={{ alignItems: 'center' }}>
        <Image style={{ width: 100, height: 100 }} source={require('../../assets/image/radio.png')} />
        <View style={{ marginTop: 20, alignItems: 'center', gap: 7 }}>
          <Text style={{ color: '#2f508e', fontSize: 20, fontFamily: 'RobotoCondensed-Regular', }}>Устройство подключено</Text>
          <Text style={{ color: '#5e86cf', fontSize: 14, fontFamily: 'RobotoCondensed-Regular' }}>Пинг: {pingResult} мс</Text>
          <Text style={{ color: '#5e86cf', fontSize: 14, fontFamily: 'RobotoCondensed-Regular' }}>Версия: Release {systemVersion}</Text>
        </View>
      </View>
      <View style={{ gap: 10, marginTop: 100 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button3 onPress={() => navigation.navigate('SmsPage')} svg={<MessageSvg />} text={"Сообщения"} width={"49%"} />
          <Button3 onPress={() => navigation.navigate('Notification')} svg={<NotificationSvg />} text={"Уведомления"} width={"49%"} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button3 onPress={() => setRefresh(true)} svg={<RefreshSvg />} text={"Обновления"} width={"49%"} bg={"#e8f1ff"} />
          <Button3 svg={<KeySvg />} text={"Разрешения"} width={"49%"} bg={"#e8f1ff"} />
        </View>
      </View>
      {isDefaultSmsApp && <TouchableOpacity onPress={() => handlePermissionRequest()} style={{ backgroundColor: "#c2c2c2", justifyContent: 'center', alignItems: 'center', paddingVertical: 20, marginTop: 20, borderRadius: 10 }}>
        <Text style={{ textAlign: 'center', color: "black", fontFamily: 'RobotoCondensed-Regular', }}>СДЕЛАТЬ ДЕФОЛТНЫМ</Text>
      </TouchableOpacity>}
      <Text style={{ textAlign: 'center', marginTop: 25, color: "#7091d3", fontFamily: 'RobotoCondensed-Regular', }}>Не закрывайте приложение, оставьте его в фоновом режиме</Text>
    </View>
  </View>
}