import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import { Button } from "../components/button";
import { useEffect, useState } from "react";
import { Styles } from "../ui/style";
import { AppInfo } from "../components/appInfo";
import { Button2 } from "../components/button2";
import { QrSvg } from "../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import { LoginAction } from "../store/action/action";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Home = ({ navigation }) => {
  const [value, setValue] = useState("")
  const login = useSelector((st) => st.login)
  const dispatch = useDispatch()
  const Login = () => {
    if (value) {
      dispatch(LoginAction(value))
    }
  }
  useEffect(() => {
    if (login.status) {
      SetUser()
    }
  }, [login.status])

  const SetUser = async () => {
    await AsyncStorage.setItem('token', login.data.token)
    navigation.navigate('permission')
  }

  const windowHeight = Dimensions.get('window').height;

  return <LinearGradient style={{ height: '100%' }} colors={['#3281f0', '#2f5bb2']} >
    <StatusBar
      animated={true}
      barStyle="dark-content"
      backgroundColor="white" />
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[Styles.home, { height: windowHeight - 140 }]}>
        <AppInfo />
        <View>
          <View>
            <Text style={{ color: 'white', fontSize: 25, textAlign: 'center', fontFamily: 'RobotoCondensed-Bold', marginBottom: 5 }}>Авторизация устройства</Text>
            <Text style={[{ textAlign: 'center', fontSize: 13, color: '#98b4e9', fontFamily: 'RobotoCondensed-Regular', paddingHorizontal: 18, }]}>Введите секретный ключ для подключения устройства к приложению</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <Button onPress={() => navigation.navigate('ScanScreen')} svg={<QrSvg />} text={"Войти по QR"} />
            {/* <Button onPress={() => sendEmail()} svg={<ShareSvg />} text={"Отправить логи"} /> */}
          </View>
          <View style={styles.buttonView}>
            <View style={{ gap: 10 }}>
              <Text style={{ color: 'white', fontFamily: 'RobotoCondensed-Regular' }}>Секретный ключ</Text>
              <TextInput
                placeholderTextColor={"#628bdc"}
                value={value}
                placeholder="#"
                onChangeText={(e) => setValue(e)}
                style={[styles.Input, login.error && { borderColor: '#ae4e7c', backgroundColor: `rgba(141, 79, 135, 0.8)`, color: '#7ea5ff' }]}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
    <View style={{ marginTop: 20, paddingHorizontal: 30, paddingBottom: 30, }}>
      <Button2 loading={login.loading} title={login.loading ? "Авторизация..." : 'Подключить устройство'} light={login.loading} onPress={() => Login()} />
    </View>
  </LinearGradient >

}

const styles = StyleSheet.create({
  buttonWrapper: {
    gap: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  Input: {
    borderWidth: 1,
    borderColor: '#628bdc',
    borderRadius: 10,
    paddingVertical: 15,
    fontSize: 20,
    backgroundColor: '#3968bf',
    color: 'white',
    paddingHorizontal: 20,
    fontFamily: 'RobotoCondensed-Regular',
  },
  buttonView: {
    gap: 20,
    marginTop: 40
  },
});
