import { StatusBar, TouchableOpacity, View, Image, Text } from "react-native"
import { KeySvg, MessageSvg, NotificationSvg, RefreshSvg, SettingIcon } from "../../assets/svg"
import { AppInfo } from "../components/appInfo"
import { Styles } from "../ui/style"
import { Button3 } from "../components/button3"
import DeviceInfo from "react-native-device-info"
import { useEffect, useState } from "react"
import { ClearSendSms, SendSmgAction } from "../store/action/action"
import AsyncStorage from "@react-native-async-storage/async-storage"
import SmsListener from 'react-native-android-sms-listener'
import { useDispatch, useSelector } from "react-redux"


export const Connection = ({ navigation }) => {
  const [systemVersion, setSystemVersion] = useState('');
  const [pingResult, setPingTime] = useState(null);
  const [lastSms, setLastSms] = useState("")
  const dispatch = useDispatch()
  const sendSms = useSelector((st) => st.sendSms)

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
  }, []);

  const setItem = async (message) => {
    let token = await AsyncStorage.getItem('token')
    dispatch(ClearSendSms())
    dispatch(SendSmgAction(token, {
      title: message.originatingAddress,
      unix: message.timestamp,
      message: message.body
    }))
    let sms = await AsyncStorage.getItem('sms')
    if (sms) {
      let item = JSON.parse(await AsyncStorage.getItem('sms'))
      item.unshift(message)
      setLastSms(message)
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


  const confirmSms = async () => {
    let item = JSON.parse(await AsyncStorage.getItem('sms'))
    let index = item.findIndex(item => item.timestamp === lastSms.timestamp);
    item[index].confirm = true
    await AsyncStorage.setItem('sms', JSON.stringify(item))
  }


  useEffect(() => {
    if (sendSms.status) {
      confirmSms()
    }
  }, [sendSms.status])


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