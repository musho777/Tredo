import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import { Button } from "../components/button";
import { useState } from "react";
import { Styles } from "../ui/style";
import { AppInfo } from "../components/appInfo";
import { Button2 } from "../components/button2";
import { QrSvg, ShareSvg } from "../../assets/svg";

export const Home = ({ navigation }) => {
  const [value, setValue] = useState("")
  return <LinearGradient colors={['#3281f0', '#2f5bb2']} >
    <StatusBar
      animated={true}
      barStyle="dark-content"
      backgroundColor="white" />
    <ScrollView>
      <View style={Styles.home}>
        <AppInfo />
        <View>
          <View>
            <Text style={{ color: 'white', fontSize: 25, textAlign: 'center', fontWeight: 600, marginBottom: 5 }}>Авторизация устройства</Text>
            <Text style={[{ textAlign: 'center', fontSize: 13, color: '#98b4e9' }]}>Введите секретный ключ для подключения устройства к приложению</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <Button svg={<QrSvg />} text={"Войти по QR"} />
            <Button svg={<ShareSvg />} text={"Отправить логи"} />
          </View>
          <View style={styles.buttonView}>
            <View style={{ gap: 10 }}>
              <Text style={{ color: 'white' }}>Секретный ключ</Text>
              <TextInput placeholderTextColor="#628bdc" value={value} placeholder="#" onChange={(e) => setValue(e)} style={styles.Input} />
            </View>
            <Button2 onPress={() => navigation.navigate("permission")} />
          </View>
        </View>
      </View>
    </ScrollView>
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
    color: '#78a7ff',
    paddingHorizontal: 20
  },
  buttonView: {
    gap: 20,
    marginTop: 40
  },
});
