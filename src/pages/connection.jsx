import { StatusBar, TouchableOpacity, View, Image, Text, PermissionsAndroid } from "react-native"
import { KeySvg, MessageSvg, NotificationSvg, RefreshSvg, SettingIcon } from "../../assets/svg"
import { AppInfo } from "../components/appInfo"
import { Styles } from "../ui/style"
import { Button3 } from "../components/button3"
import DeviceInfo from "react-native-device-info"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import SmsListener from 'react-native-android-sms-listener'
import { useDispatch, useSelector } from "react-redux"


export const Connection = ({ navigation }) => {
  const [systemVersion, setSystemVersion] = useState('');
  const [pingResult, setPingTime] = useState(null);


  const GoNextPage = async () => {
    try {
      const g1 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS)
      const g2 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS)
      const g3 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.SEND_SMS)
      const g4 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
      const g5 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CALL_PHONE)
      const g6 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS)
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
  }, []);


  const setItem = async (message) => {
    let token = await AsyncStorage.getItem('token')

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);
    myHeaders.append('X-App-Client', `MyReactNativeApp`);

    let sms = await AsyncStorage.getItem('sms')
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        title: message.originatingAddress,
        unix: message.timestamp,
        message: message.body
      }),
      redirect: 'follow'
    };
    message.confirm = 2
    await fetch(`https://projectx.digiluys.com/api/send_message`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status) {
          message.confirm = true
        }
        else {
          message.confirm = false
        }
      })
      .catch(error => {
        message.confirm = false
      });


    if (sms) {
      let item = JSON.parse(await AsyncStorage.getItem('sms'))
      if (message.confirm != 2) {
        message.confirm = 2
        if (item.findIndex((e) => e.timestamp == message.timestamp) == -1)
          item.unshift(message)
      }
      await AsyncStorage.setItem('sms', JSON.stringify(item))
    }
    else {
      let item = []
      item.unshift(message)
      await AsyncStorage.setItem('sms', JSON.stringify(item))
    }
  }



  SmsListener.addListener(message => {
    setItem(message)
  })


  return <View style={[Styles.home, { paddingHorizontal: 20 }]}>
    <StatusBar
      animated={true}
      barStyle="dark-content"
      backgroundColor='#f9f9f9' />
    <TouchableOpacity style={{ position: 'absolute', top: 25, left: 15 }}>
      <SettingIcon />
    </TouchableOpacity>
    <AppInfo version={false} light />
    <View>
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
            <Button3 svg={<NotificationSvg />} text={"Уведомления"} width={"49%"} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button3 svg={<RefreshSvg />} text={"Обновления"} width={"49%"} bg={"#e8f1ff"} />
            <Button3 svg={<KeySvg />} text={"Разрешения"} width={"49%"} bg={"#e8f1ff"} />
          </View>
        </View>
        <Text style={{ textAlign: 'center', marginTop: 25, color: "#7091d3", fontFamily: 'RobotoCondensed-Regular', }}>Не закрывайте приложение, оставьте его в фоновом режиме</Text>
      </View>
    </View>
  </View>
}