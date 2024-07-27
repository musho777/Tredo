import { StyleSheet, View } from "react-native"
import { Button3 } from "./button3"
import { useNavigation } from "@react-navigation/native"
import { KeySvg, MessageSvg, NotificationSvg, RefreshSvg } from "../../assets/svg"
import { useDispatch } from "react-redux"
import { ClearAllSms } from "../store/action/action"
import { getPaginatedUsers, getTotalSmsUserCount } from "../func/function"

export const HomeButtonWrapper = ({ setRefresh }) => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const HendelClikc = (type) => {
    dispatch(ClearAllSms())
    navigation.navigate('SmsPage', { type: type })
    getPaginatedUsers(type)
    getTotalSmsUserCount(type)
  }

  return <View style={styles.buttonWrapper}>
    <View style={styles.buttonContiner}>
      <Button3 onPress={() => HendelClikc('sms')} svg={<MessageSvg />} text={"Сообщения"} />
      <Button3 onPress={() => HendelClikc('notification')} svg={<NotificationSvg />} text={"Уведомления"} />
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