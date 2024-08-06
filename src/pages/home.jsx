import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useState } from "react";
import { Styles } from "../ui/style";
import { AppInfo } from "../components/appInfo";
import { Button2 } from "../components/button2";
import { QrSvg } from "../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import { LoginAction } from "../store/action/action";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ModalComponent } from "../components/Modal";

export const Home = ({ navigation }) => {
  const [value, setValue] = useState("")
  const login = useSelector((st) => st.login)
  const dispatch = useDispatch()
  const { version } = useSelector((st) => st.appVersion)
  const curentVersion = 1.4


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
    await AsyncStorage.setItem('id', JSON.stringify(login.data.user.id))
    navigation.replace('permission')
  }

  const windowHeight = Dimensions.get('window').height;

  return <LinearGradient style={{ height: '100%' }} colors={['#3281f0', '#2f5bb2']} >
    <StatusBar
      animated={true}
      barStyle="dark-content"
      backgroundColor="white" />
    <ScrollView showsVerticalScrollIndicator={false}>
      <ModalComponent modalVisible={version && version != curentVersion} message={"Обновите приложение скачивая её из админки"} showButton={false} />
      <View style={[Styles.home, { height: windowHeight - 140 }]}>
        <AppInfo />
        <View>
          <View>
            <Text style={styles.text1}>Авторизация устройства</Text>
            <Text style={styles.text2}>Введите секретный ключ для подключения устройства к приложению</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={() => navigation.navigate('ScanScreen')} style={[styles.button]}>
              <QrSvg />
              <Text style={styles.text}>Войти по QR</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonView}>
            <Text style={styles.text3}>Секретный ключ</Text>
            <TextInput
              placeholderTextColor={"#628bdc"}
              value={value}
              placeholder="#"
              onChangeText={(e) => setValue(e)}
              style={[styles.Input, login.error && styles.errorBorder]}
            />
          </View>
        </View>
      </View>
    </ScrollView>
    <View style={styles.buttonWrapper2}>
      <Button2
        loading={login.loading}
        title={login.loading ? "Авторизация..." : 'Подключить устройство'}
        light={login.loading}
        onPress={() => Login()}
      />
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
    gap: 10,
    marginTop: 40
  },
  buttonWrapper2: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  errorBorder: {
    borderColor: '#ae4e7c',
    backgroundColor: `rgba(141, 79, 135, 0.8)`,
    color: '#7ea5ff'
  },
  text1: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    marginBottom: 5
  },
  text2: {
    textAlign: 'center',
    fontSize: 13,
    color: '#98b4e9',
    fontFamily: 'RobotoCondensed-Regular',
    paddingHorizontal: 18,
  },
  text3: {
    color: 'white',
    fontFamily: 'RobotoCondensed-Regular'
  },
  button: {
    backgroundColor: "#3282f1",
    paddingVertical: 8,
    paddingHorizontal: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: "center",
    flexDirection: 'row',
    gap: 10,
  },
  text: {
    fontSize: 15,
    fontFamily: 'RobotoCondensed-SemiBold',
    color: 'white'
  }
});
