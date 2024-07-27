import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ErrorSvg, SuccessSvg } from "../../assets/svg"
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Clipboard from '@react-native-clipboard/clipboard';


export const AllMsgBody = ({ data, last, index, type = 'sms' }) => {
  console.log(data)
  const [data1, setData1] = useState(data)
  useEffect(() => {
    setData1(data)
  }, [data])


  const copyToClipboard = () => {
    let date = new Date(data.sent_at)
    let day = date.getDate()
    let mount = date.getMonth()
    let year = date.getFullYear()
    let hour = date.getHours()
    let min = date.getMinutes()
    let sec = date.getSeconds()
    Clipboard.setString(`${day}.${mount}.${year}, ${hour}:${min}:${sec}  ${data.originatingAddress}: ${data.body}`);
  };

  let date = new Date(data.sent_at)
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
  const dispatch = useDispatch()

  const SetAgain = async () => {
    let temp1 = { ...data1 }
    let token = await AsyncStorage.getItem('token')
    let temp = {
      title: data.originatingAddress,
      unix: data.timestamp,
      message: data.body
    }


    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);
    myHeaders.append('X-App-Client', `MyReactNativeApp`);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(temp),
      redirect: 'follow'
    };


    await fetch(`https://iron-pay.com/api/send_message`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status) {
          temp1.confirm = true
        }
        else {
          temp1.confirm = false
        }
      })
      .catch(error => {
        temp1.confirm = false
      });

    let item
    if (type == 'sms') {
      item = JSON.parse(await AsyncStorage.getItem('sms'))
    }
    else {
      item = JSON.parse(await AsyncStorage.getItem('notification'))
    }
    let index = item.findIndex((e) => e.timestamp == data.timestamp)
    item[index].confirm = true
    setData1(temp1)
    if (type == 'sms') {
      await AsyncStorage.setItem('sms', JSON.stringify(item))
    } else {
      await AsyncStorage.setItem('notification', JSON.stringify(item))
    }
  }

  return <TouchableOpacity onPress={() => copyToClipboard()} style={[styles.shadow, last && { marginBottom: 150 }]}>
    <View style={styles.name}>
      <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
        <Text style={{ color: "#6e90d3", fontSize: 12, fontFamily: 'RobotoCondensed-SemiBold' }}>Отправлено:</Text>
        <Text style={{ color: "#59c951", fontSize: 13, fontFamily: 'RobotoCondensed-Bold' }}>#{index + 1}</Text>
        {data.status != 0 ? <View style={{ width: 20, height: 20 }}>
          <SuccessSvg />
        </View> :
          <TouchableOpacity onPress={() => SetAgain()} style={{ width: 20, height: 20 }}>
            <ErrorSvg />
          </TouchableOpacity>
        }
      </View>
      <Text style={{ color: "#6271a5", fontSize: 13, fontFamily: 'RobotoCondensed-SemiBold' }}>{hours}:{minut}:{seconds}</Text>
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
