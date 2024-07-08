import { StyleSheet, View } from "react-native"
import { Button3 } from "./button3"
import { useNavigation } from "@react-navigation/native"
import { KeySvg, MessageSvg, NotificationSvg, RefreshSvg } from "../../assets/svg"

export const HomeButtonWrapper = ({ setRefresh }) => {
  const navigation = useNavigation()
  return <View style={styles.buttonWrapper}>
    <View style={styles.buttonContiner}>
      <Button3 onPress={() => navigation.navigate('SmsPage')} svg={<MessageSvg />} text={"Сообщения"} />
      <Button3 onPress={() => navigation.navigate('Notification')} svg={<NotificationSvg />} text={"Уведомления"} />
    </View>
    <View style={styles.buttonContiner}>
      <Button3 onPress={() => setRefresh(true)} svg={<RefreshSvg />} text={"Обновления"} bg={"#e8f1ff"} />
      <Button3 svg={<KeySvg />} text={"Разрешения"} bg={"#e8f1ff"} />
    </View>
  </View>
}

const styles = StyleSheet.create({
  buttonWrapper: {
    gap: 10,
    marginTop: 100
  },
  buttonContiner: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
})