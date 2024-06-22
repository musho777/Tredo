import { useNavigation } from "@react-navigation/native"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
export const AllMsgBody = ({ data, last, index }) => {
  console.log(last, 'last')
  const naviagtion = useNavigation()
  let date = new Date(data?.date)
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

  return <TouchableOpacity style={[styles.shadow, last && { marginBottom: 150 }]}>
    <View style={styles.name}>
      <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
        <Text style={{ color: "#6e90d3", fontSize: 12, fontFamily: 'RobotoCondensed-SemiBold' }}>Отправлено:</Text>
        <Text style={{ color: "#59c951", fontSize: 13, fontFamily: 'RobotoCondensed-Bold' }}>#{index + 1}</Text>
      </View>
      <Text style={{ color: "#6271a5", fontSize: 13, fontFamily: 'RobotoCondensed-SemiBold' }}>{hours}:{minut}:{seconds}</Text>
    </View>
    <Text style={{ color: "#2f508e", fontSize: 17, fontFamily: 'RobotoCondensed-Regular' }}>{data.body}</Text>
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
