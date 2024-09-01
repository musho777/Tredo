import { TouchableOpacity, View, Text, PermissionsAndroid, StyleSheet } from "react-native"
import { LogOut } from "../../assets/svg"
import { AppInfo } from "../components/appInfo"
import { Styles } from "../ui/style"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useDispatch } from "react-redux"
import { AppVersion, ClearLoginAction, LogoutAction } from "../store/action/action"
import { Ping } from "../components/ping"
import { HomeButtonWrapper } from "../components/homeButtonWrapper"
import { Status_Bar } from "../components/statusBar"
import { handleSirenaNotification } from "../func/function"
import Pusher from 'pusher-js/react-native';
import { ModalComponent } from "../components/Modal"


export const Connection = ({ navigation }) => {
  const [text, setText] = useState("")
  const dispatch = useDispatch()
  const [token, setToken] = useState()
  const [popUp, setPopUp] = useState(false)

  const getToken = async () => {
    setToken(await AsyncStorage.getItem('token'))
  }

  const GoNextPage = async () => {
    try {
      const g2 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS)
      const g4 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
      const g5 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CALL_PHONE)
      if (!g2 || !g4 || !g5) {
        await AsyncStorage.setItem('permition', 'no')
        navigation.navigate("permission")
      }
    } catch (err) {
    }
  }

  useEffect(() => {
    GoNextPage()
    getToken()
    const interval = setInterval(() => {
      dispatch(AppVersion(token))
    }, 120000);

    return () => clearInterval(interval);
  }, []);



  const Logout = async () => {
    dispatch(LogoutAction(token))
    dispatch(ClearLoginAction())
    await AsyncStorage.clear()
    navigation.replace('home')
  }

  useEffect(() => {
    if (token) {
      dispatch(AppVersion(token))
    }
  }, [token])


  useEffect(() => {
    ShowPopUp()
    Pusher.logToConsole = false;
    const pusher = new Pusher('local', {
      cluster: 'mt1',
      wsHost: 'iron-pay.com',
      wsPort: 6001,
      wssPort: 6001,
      forceTLS: true,
      encrypted: true,
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
    });

    const cardBlockedChannel = pusher.subscribe('card_blocked');

    cardBlockedChannel.bind('card_blocked', async function (data) {
      let id = await AsyncStorage.getItem('id')
      if (id == data.message.user_id) {
        setText(data.message.app_message)
        await AsyncStorage.setItem('showPopUp', "1")
        setPopUp(true)
        handleSirenaNotification(data.message.app_message)
        await AsyncStorage.setItem('text1', JSON.stringify(data.message.app_message))
      }
    });
  }, []);

  const ShowPopUp = async () => {
    let show = await AsyncStorage.getItem('showPopUp')
    let t = await AsyncStorage.getItem("text1")
    if (t) {
      setText(t)
    }
    if (show == 1) {
      setPopUp(true)
    }
    else {
      setPopUp(false)
    }
  }

  const ModalAssept = async () => {
    await AsyncStorage.setItem('showPopUp', "0")
    setPopUp(false)
  }


  return <View style={[Styles.home, { paddingHorizontal: 20 }]}>
    <ModalComponent modalVisible={popUp} accept={() => ModalAssept()} message={text} />
    <Status_Bar />
    <AppInfo version={false} light />
    <TouchableOpacity onPress={() => Logout()} style={styles.logout}>
      <LogOut />
    </TouchableOpacity>
    <View>
      <Ping />
      <HomeButtonWrapper />
      <Text style={styles.text}>Не закрывайте приложение, оставьте его в фоновом режиме</Text>
    </View>
  </View>
}

const styles = StyleSheet.create({
  logout: {
    position: "absolute",
    top: 30,
    left: 15
  },
  text: {
    textAlign: 'center',
    marginTop: 25,
    color: "#7091d3",
    fontFamily: 'RobotoCondensed-Regular',
  }
})