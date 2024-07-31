import { useNavigation } from "@react-navigation/native"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { getSmsByUserId } from "../func/function"
import { ClearSinglPage, SinglSmsCount } from "../store/action/action"
import { useDispatch } from "react-redux"

export const MsgBody = ({ data, last }) => {
  const dispatch = useDispatch()
  const naviagtion = useNavigation()
  let date = new Date(data.last_message_time)
  let minut = date.getMinutes()
  let hours = date.getHours()
  let seconds = date.getSeconds()

  if (seconds < 10) {
    seconds = `0${seconds}`
  }
  if (minut < 10) {
    minut = `0${minut}`
  }
  if (hours < 10) {
    hours = `0${hours}`
  }

  const OpenAllSms = () => {
    dispatch(ClearSinglPage())
    dispatch(SinglSmsCount(data.sms_count))
    getSmsByUserId(1, 10, data.user_id)
    naviagtion.navigate('AllMsg', { username: data.username, id: data.user_id, count: data.sms_count })
  }
  return <TouchableOpacity activeOpacity={1} onPress={() => OpenAllSms()} style={[styles.shadow, last && { marginBottom: 50 }]}>
    <View style={styles.name}>
      <View style={styles.block}>
        <Text style={[styles.textSemiBold, { fontSize: 12 }]}>Отправитель:</Text>
        <Text style={styles.textRegular1}>{data.username}</Text>
      </View>
      <Text style={[styles.textSemiBold1, { fontSize: 13 }]}>{hours}:{minut}:{seconds}</Text>
    </View>
    <Text style={styles.textRegular}>{data.last_message}</Text>
    <View style={styles.smsCount}>
      <Text style={[styles.textSemiBold, { fontSize: 14 }]}>Всего сообщений:</Text>
      <Text style={styles.textRegular}>{data.sms_count}</Text>
    </View>
  </TouchableOpacity>
}

const styles = StyleSheet.create({
  block: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center'
  },
  textSemiBold: {
    color: "#6e90d3",
    fontFamily: 'RobotoCondensed-SemiBold'
  },
  textSemiBold1: {
    color: "#6271a5",
    fontFamily: 'RobotoCondensed-SemiBold'
  },
  textRegular: {
    color: "#2f508e",
    fontSize: 17,
    fontFamily: 'RobotoCondensed-Regular'
  },
  textRegular1: {
    color: "#6e90d3",
    fontSize: 13,
    fontFamily: 'RobotoCondensed-Bold'
  },

  shadow: {
    shadowColor: "#000000",
    gap: 10,
    shadowOffset: {
      width: 0,
      height: 3,

    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 1,
    backgroundColor: 'white',
    marginVertical: 10,
    padding: 13,
    borderRadius: 10,
  },
  name: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  smsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    fontFamily: 'RobotoCondensed-Regular'
  }
});
