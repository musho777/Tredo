import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ErrorSvg, SuccessSvg } from "../../assets/svg"
import Clipboard from '@react-native-clipboard/clipboard';
import { sendMessage } from "../func/function"


export const AllMsgBody = ({ username, data, last, index }) => {
  console.log(data.sent_at)

  let date = new Date(data.sent_at)
  if (typeof data.sent_at == 'string') {

    date = new Date(JSON.parse(data.sent_at))
  }
  let minut = date.getMinutes()
  let hour = date.getHours()
  let seconds = date.getSeconds()

  const copyToClipboard = () => {
    let mount = date.getMonth()
    let day = date.getDate()
    let year = date.getFullYear()
    Clipboard.setString(`${day}.${mount}.${year}, ${hour}:${minut}:${seconds}  ${username}: ${data.body}`);
  };

  if (seconds < 10) {
    seconds = `0${seconds}`
  }
  if (minut < 10) {
    minut = `0${minut}`
  }
  if (hour < 10) {
    hour = `0${hour}`
  }

  const SendAgin = () => {
    const temp = {
      originatingAddress: username,
      timestamp: data.sent_at,
      body: data.message
    }
    sendMessage(temp, data.sms_id)
  }


  return <TouchableOpacity onPress={() => copyToClipboard()} style={[styles.shadow, last && { marginBottom: 150 }]}>
    <View style={styles.name}>
      <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
        <Text style={{ color: "#6e90d3", fontSize: 12, fontFamily: 'RobotoCondensed-SemiBold' }}>Отправлено:</Text>
        <Text style={{ color: "#59c951", fontSize: 13, fontFamily: 'RobotoCondensed-Bold' }}>#{index + 1}</Text>
        {data.status != 0 ? <View style={{ width: 20, height: 20 }}>
          <SuccessSvg />
        </View> :
          <TouchableOpacity onPress={() => SendAgin()} style={{ width: 20, height: 20 }}>
            <ErrorSvg />
          </TouchableOpacity>
        }
      </View>
      <Text style={{ color: "#6271a5", fontSize: 13, fontFamily: 'RobotoCondensed-SemiBold' }}>{hour}:{minut}:{seconds}</Text>
    </View>
    <Text style={{ color: "#2f508e", fontSize: 17, fontFamily: 'RobotoCondensed-Regular' }}>{data.message}</Text>
    <View style={styles.smsCount}>
      <Text style={{ color: "#6e90d3", fontSize: 14, fontFamily: 'RobotoCondensed-Regular' }}></Text>
    </View>
  </TouchableOpacity>
}

const styles = StyleSheet.create({
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
