import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ErrorSvg, SuccessSvg } from "../../assets/svg"
import { useDispatch } from "react-redux"
import { SendSmgAction } from "../store/action/action"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Clipboard from '@react-native-clipboard/clipboard';


export const AllMsgBody = ({ data, last, index }) => {

  const copyToClipboard = () => {
    let date = new Date(data.timestamp)
    let day = date.getDate()
    let mount = date.getMonth()
    let year = date.getFullYear()
    // console.log(day mount year)
    console.log(data)
    Clipboard.setString(`${day}.${mount}.${year}   ${data.originatingAddress}: ${data.body}`);
    // Clipboard.setString(text);
  };


  const [setData, setNewData] = useState()

  useEffect(() => {
    setNewData(data)
  }, [])

  let date = new Date(data?.timestamp)
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
  const dispaatch = useDispatch()

  const SetAgain = async () => {

    let token = await AsyncStorage.getItem('token')
    let temp = {
      title: data.originatingAddress,
      unix: data.timestamp,
      message: data.body
    }

    dispaatch(SendSmgAction(token, temp))


    let item = JSON.parse(await AsyncStorage.getItem('sms'))
    let index = item.findIndex((e) => e.timestamp == data.timestamp)
    item[index].confirm = true
    setNewData(item[index])
    await AsyncStorage.setItem('sms', JSON.stringify(item))
  }

  return <TouchableOpacity onPress={() => copyToClipboard()} style={[styles.shadow, last && { marginBottom: 150 }]}>
    <View style={styles.name}>
      <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
        <Text style={{ color: "#6e90d3", fontSize: 12, fontFamily: 'RobotoCondensed-SemiBold' }}>Отправлено:</Text>
        <Text style={{ color: "#59c951", fontSize: 13, fontFamily: 'RobotoCondensed-Bold' }}>#{index + 1}</Text>
        {setData?.confirm ? <View style={{ width: 20, height: 20 }}>
          <SuccessSvg />
        </View> :
          <TouchableOpacity onPress={() => SetAgain()}>
            <ErrorSvg />
          </TouchableOpacity>
        }
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
