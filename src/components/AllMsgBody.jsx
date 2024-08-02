import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ErrorSvg, SuccessSvg } from "../../assets/svg"
import Clipboard from '@react-native-clipboard/clipboard';
import { sendMessage } from "../func/function"


export const AllMsgBody = ({ username, data, last, index }) => {

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


  return <TouchableOpacity activeOpacity={1} onPress={() => copyToClipboard()} style={[styles.shadow, last && { marginBottom: 150 }]}>
    <View style={styles.name}>
      <View style={styles.block}>
        <Text style={styles.text1}>Отправлено:</Text>
        <Text style={styles.text2}>#{index}</Text>
        {data.status == 1 && <View style={styles.icon}>
          <SuccessSvg />
        </View>
        }
        {data.status == 2 && <ActivityIndicator size="small" color="#0000ff" />}
        {data.status == 0 &&
          <TouchableOpacity onPress={() => SendAgin()} style={styles.icon}>
            <ErrorSvg />
          </TouchableOpacity>
        }
      </View>
      <Text style={styles.text3}>{hour}:{minut}:{seconds}</Text>
    </View>
    <Text style={styles.text4}>{data.message}</Text>
  </TouchableOpacity>
}

const styles = StyleSheet.create({
  block: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center'
  },
  text1: {
    color: "#6e90d3",
    fontSize: 12,
    fontFamily: 'RobotoCondensed-SemiBold'
  },
  icon: {
    width: 20,
    height: 20
  },
  text2: {
    color: "#59c951",
    fontSize: 13,
    fontFamily: 'RobotoCondensed-Bold'
  },

  text3: {
    color: "#6271a5",
    fontSize: 13,
    fontFamily: 'RobotoCondensed-SemiBold'
  },

  text4: {
    color: "#2f508e",
    fontSize: 17,
    fontFamily: 'RobotoCondensed-Regular'
  },

  text5: {
    color: "#6e90d3",
    fontSize: 14,
    fontFamily: 'RobotoCondensed-Regular'
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
});
