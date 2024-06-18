import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native"
import { Styles } from "../ui/style";
import { AppInfo } from "../components/appInfo";
import { Button2 } from "../components/button2";
import { Switch } from "../components/switch";

export const Permission = ({ navigation }) => {
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
        <Switch text="Сделать приложением SMS по-умолчанию" />
        <Switch text="Доступ к информации о сим картах" />
        <Switch text="Доступ к информации о состоянии телефона" />
        <Switch text="Активировать чтение пуш-уведомлений" />
      </View>
    </ScrollView>
    <View>
      <Button2 onPress={() => navigation.navigate("connection")} text={"Далее"} light />
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
