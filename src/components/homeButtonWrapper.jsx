import { StyleSheet, View } from "react-native"
import { Button } from "./button"
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
      <Button onPress={() => HendelClikc('sms')} svg={<MessageSvg />} text={"Сообщения"} />
      <Button onPress={() => HendelClikc('notification')} svg={<NotificationSvg />} text={"Уведомления"} />
    </View>
    <View style={styles.buttonContiner}>
      <Button onPress={() => setRefresh(true)} svg={<RefreshSvg />} text={"Обновления"} bg={"#e8f1ff"} />
      <Button onPress={() => navigation.navigate('changePermitionPage')} svg={<KeySvg />} text={"Разрешения"} bg={"#e8f1ff"} />
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