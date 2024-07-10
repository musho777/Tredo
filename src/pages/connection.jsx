import { TouchableOpacity, View, Text, PermissionsAndroid, StyleSheet } from "react-native"
import { LogOut } from "../../assets/svg"
import { AppInfo } from "../components/appInfo"
import { Styles } from "../ui/style"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useDispatch } from "react-redux"
import { ClearLoginAction, LogoutAction } from "../store/action/action"
import { DefaultSmsButton } from "../components/defaultSmsButton"
import { Ping } from "../components/ping"
import { HomeButtonWrapper } from "../components/homeButtonWrapper"
import { Loading } from "../components/loading"
import { Status_Bar } from "../components/statusBar"


export const Connection = ({ navigation }) => {
  const dispatch = useDispatch()
  const [token, setToken] = useState()
  const [refresh, setRefresh] = useState(false)


  const func = async () => {
    await AsyncStorage.setItem('restart', 'true')
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setRefresh(false)
    }, 1000);
    return () => clearTimeout(timer);
  }, [refresh]);


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
        if (defaultSms) {
          navigation.navigate("permission")
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      func()
    }, 2000);
    GoNextPage()
    getToken()
    return () => clearTimeout(timer);
  }, []);


  const Logout = async () => {
    dispatch(LogoutAction(token))
    dispatch(ClearLoginAction())
    await AsyncStorage.clear()
    navigation.replace('home')
  }


  return <View style={[Styles.home, { paddingHorizontal: 20 }]}>
    <Status_Bar />
    <AppInfo version={false} light />
    <TouchableOpacity onPress={() => Logout()} style={styles.logout}>
      <LogOut />
    </TouchableOpacity>
    <Loading loading={refresh} />
    <View>
      <Ping refresh={refresh} />
      <HomeButtonWrapper setRefresh={(e) => setRefresh(e)} />
      <DefaultSmsButton />
      <Text style={styles.text4}>Не закрывайте приложение, оставьте его в фоновом режиме</Text>
    </View>
  </View>
}

const styles = StyleSheet.create({
  logout: {
    position: "absolute",
    top: 30,
    left: 15
  },
  text4: {
    textAlign: 'center',
    marginTop: 25,
    color: "#7091d3",
    fontFamily: 'RobotoCondensed-Regular',
  }
})